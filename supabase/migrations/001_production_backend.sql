-- Production-Ready Backend Migration for Be Independent Gal
-- Complete idempotent database schema for all 10 features
-- Compatible with PostgreSQL 16 and Supabase
-- Safe to run multiple times

-- ============================================================
-- SECTION 1: EXTENSIONS & UTILITY FUNCTIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Auto-update updated_at timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SECTION 2: USER PROFILES & ACTIVITY TRACKING
-- ============================================================

-- Main user profile table extended with additional fields
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  location TEXT,
  website TEXT,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  mentoring_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_mentor BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  circles TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.user_profile_extended (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  bio TEXT,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  mentoring_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_user_profile_extended_mentoring_areas ON public.user_profile_extended USING GIN(mentoring_areas);
CREATE INDEX IF NOT EXISTS idx_user_profile_extended_skills ON public.user_profile_extended USING GIN(skills);

ALTER TABLE public.user_profile_extended ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can read extended profiles" ON public.user_profile_extended;
CREATE POLICY "Service role can read extended profiles" ON public.user_profile_extended FOR SELECT
  USING (auth.role() = 'service_role');

-- Create updated_at trigger for user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for user_profiles
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.user_profiles;
CREATE POLICY "Public profiles are viewable" ON public.user_profiles 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile" ON public.user_profiles 
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- User activity log for gamification
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  action_description TEXT,
  points_earned INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for user_activity
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity(created_at DESC);

-- Enable RLS on user_activity
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for user_activity
DROP POLICY IF EXISTS "Users can view own activity" ON public.user_activity;
CREATE POLICY "Users can view own activity" ON public.user_activity 
  FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- ============================================================
-- SECTION 3: MESSAGING SYSTEM
-- ============================================================

-- Conversations between users
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT different_users CHECK (user1_id != user2_id)
);

-- Unique index to ensure only one conversation per pair of users
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_pair ON public.conversations
  (LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id));

-- Enable RLS on conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for conversations
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
CREATE POLICY "Users can view their conversations" ON public.conversations 
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Users can create conversations" ON public.conversations 
  FOR INSERT WITH CHECK (auth.uid() IN (user1_id, user2_id));

-- Individual messages within conversations
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Circle dashboard content for community circle pages
CREATE TABLE IF NOT EXISTS public.circle_dashboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID REFERENCES public.circles(id) ON DELETE SET NULL,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_circle_dashboard_circle_id ON public.circle_dashboard(circle_id);

ALTER TABLE public.circle_dashboard ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage circle dashboards" ON public.circle_dashboard;
CREATE POLICY "Service role can manage circle dashboards" ON public.circle_dashboard FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for messages
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;
CREATE POLICY "Users can view their messages" ON public.messages 
  FOR SELECT USING (
    auth.uid() IN (
      SELECT COALESCE(user1_id, user2_id) FROM public.conversations WHERE id = conversation_id
      UNION
      SELECT COALESCE(user2_id, user1_id) FROM public.conversations WHERE id = conversation_id
    )
  );

DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages" ON public.messages 
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ============================================================
-- SECTION 4: MEMBER DIRECTORY & SEARCH
-- ============================================================

-- Searchable member directory with full-text search support
CREATE TABLE IF NOT EXISTS public.user_directory (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  skills TEXT[],
  interests TEXT[],
  mentoring_areas TEXT[],
  is_mentor BOOLEAN,
  circles TEXT[],
  search_vector tsvector,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for user_directory
CREATE INDEX IF NOT EXISTS idx_user_directory_search ON public.user_directory USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_user_directory_is_mentor ON public.user_directory(is_mentor);
CREATE INDEX IF NOT EXISTS idx_user_directory_skills ON public.user_directory USING GIN(skills);

-- Enable RLS on user_directory
ALTER TABLE public.user_directory ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for user_directory
DROP POLICY IF EXISTS "Directory is publicly searchable" ON public.user_directory;
CREATE POLICY "Directory is publicly searchable" ON public.user_directory 
  FOR SELECT USING (true);

-- ============================================================
-- SECTION 5: MENTORSHIP SYSTEM
-- ============================================================

-- Active mentorship relationships
CREATE TABLE IF NOT EXISTS public.mentorship (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ended_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
  UNIQUE(mentor_id, mentee_id),
  CONSTRAINT different_users_mentorship CHECK (mentor_id != mentee_id)
);

-- Indexes for mentorship
CREATE INDEX IF NOT EXISTS idx_mentorship_mentor_id ON public.mentorship(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_mentee_id ON public.mentorship(mentee_id);

-- Enable RLS on mentorship
ALTER TABLE public.mentorship ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for mentorship
DROP POLICY IF EXISTS "Users can view their mentorships" ON public.mentorship;
CREATE POLICY "Users can view their mentorships" ON public.mentorship 
  FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Mentorship requests and matching
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  responded_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT different_users_request CHECK (mentor_id != requester_id)
);

-- Indexes for mentorship_requests
CREATE INDEX IF NOT EXISTS idx_mentorship_requests_mentor_id ON public.mentorship_requests(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_requests_requester_id ON public.mentorship_requests(requester_id);

-- Enable RLS on mentorship_requests
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for mentorship_requests
DROP POLICY IF EXISTS "Users can view mentorship requests" ON public.mentorship_requests;
CREATE POLICY "Users can view mentorship requests" ON public.mentorship_requests 
  FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = requester_id);

DROP POLICY IF EXISTS "Users can create requests" ON public.mentorship_requests;
CREATE POLICY "Users can create requests" ON public.mentorship_requests 
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- ============================================================
-- SECTION 6: EVENTS & REGISTRATION
-- ============================================================

-- Events table with complete fields
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  event_type TEXT NOT NULL,
  circle_name TEXT,
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  capacity INTEGER,
  registration_url TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create updated_at trigger for events
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Indexes for events
CREATE INDEX IF NOT EXISTS idx_events_organizer ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.events(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_events_circle_name ON public.events(circle_name);

-- Enable RLS on events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for events
DROP POLICY IF EXISTS "Events are publicly viewable" ON public.events;
CREATE POLICY "Events are publicly viewable" ON public.events 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Organizers can manage events" ON public.events;
CREATE POLICY "Organizers can manage events" ON public.events 
  FOR UPDATE USING (auth.uid() = organizer_id) WITH CHECK (auth.uid() = organizer_id);

-- Event registrations
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  UNIQUE(event_id, user_id)
);

-- Indexes for event_registrations
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);

-- Enable RLS on event_registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for event_registrations
DROP POLICY IF EXISTS "Users can view their registrations" ON public.event_registrations;
CREATE POLICY "Users can view their registrations" ON public.event_registrations 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can register for events" ON public.event_registrations;
CREATE POLICY "Users can register for events" ON public.event_registrations 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SECTION 7: GAMIFICATION SYSTEM
-- ============================================================

-- Badge definitions
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  points_required INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert default badges (idempotent)
INSERT INTO public.badges (id, name, description, icon_url, points_required) 
SELECT 
  gen_random_uuid(), 
  'Rising Star',
  'Earned 50 points',
  '/badges/rising-star.png',
  50
WHERE NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'Rising Star');

INSERT INTO public.badges (id, name, description, icon_url, points_required)
SELECT
  gen_random_uuid(),
  'Community Builder',
  'Earned 500 points',
  '/badges/community-builder.png',
  500
WHERE NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'Community Builder');

INSERT INTO public.badges (id, name, description, icon_url, points_required)
SELECT
  gen_random_uuid(),
  'Mentor',
  'Completed 5 mentorship sessions',
  '/badges/mentor.png',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'Mentor');

-- User badges earned
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, badge_id)
);

-- Indexes for user_badges
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);

-- Enable RLS on user_badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for user_badges
DROP POLICY IF EXISTS "Users can view badges" ON public.user_badges;
CREATE POLICY "Users can view badges" ON public.user_badges 
  FOR SELECT USING (true);

-- Community challenges
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  circle_name TEXT,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  points_reward INTEGER DEFAULT 50,
  difficulty TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for challenges
CREATE INDEX IF NOT EXISTS idx_challenges_creator_id ON public.challenges(creator_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON public.challenges(status);

-- Enable RLS on challenges
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for challenges
DROP POLICY IF EXISTS "Challenges are viewable" ON public.challenges;
CREATE POLICY "Challenges are viewable" ON public.challenges 
  FOR SELECT USING (true);

-- Challenge participant tracking
CREATE TABLE IF NOT EXISTS public.challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(challenge_id, user_id)
);

-- Indexes for challenge_participants
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge_id ON public.challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user_id ON public.challenge_participants(user_id);

-- Enable RLS on challenge_participants
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for challenge_participants
DROP POLICY IF EXISTS "Users can view their participation" ON public.challenge_participants;
CREATE POLICY "Users can view their participation" ON public.challenge_participants 
  FOR SELECT USING (auth.uid() = user_id);

-- Cached leaderboards
CREATE TABLE IF NOT EXISTS public.leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_name TEXT,
  period TEXT NOT NULL DEFAULT 'all_time',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(circle_name, period, user_id)
);

-- Indexes for leaderboards
CREATE INDEX IF NOT EXISTS idx_leaderboards_circle_period ON public.leaderboards(circle_name, period, rank);
CREATE INDEX IF NOT EXISTS idx_leaderboards_user_id ON public.leaderboards(user_id);

-- Enable RLS on leaderboards
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for leaderboards
DROP POLICY IF EXISTS "Leaderboards are public" ON public.leaderboards;
CREATE POLICY "Leaderboards are public" ON public.leaderboards 
  FOR SELECT USING (true);

-- ============================================================
-- SECTION 8: BLOG & KNOWLEDGE BASE
-- ============================================================

-- Blog articles
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  circle_name TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  view_count INTEGER DEFAULT 0,
  search_vector tsvector
);

-- Create updated_at trigger for articles
DROP TRIGGER IF EXISTS update_articles_updated_at ON public.articles;
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Indexes for articles
CREATE INDEX IF NOT EXISTS idx_articles_author ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_search ON public.articles USING GIN(search_vector);

-- Enable RLS on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for articles
DROP POLICY IF EXISTS "Published articles are viewable" ON public.articles;
CREATE POLICY "Published articles are viewable" ON public.articles 
  FOR SELECT USING (status = 'published' OR auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can manage articles" ON public.articles;
CREATE POLICY "Authors can manage articles" ON public.articles 
  FOR UPDATE USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

-- Article comments (nested)
CREATE TABLE IF NOT EXISTS public.article_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.article_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for article_comments
CREATE INDEX IF NOT EXISTS idx_article_comments_article_id ON public.article_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_article_comments_author_id ON public.article_comments(author_id);

-- Enable RLS on article_comments
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for article_comments
DROP POLICY IF EXISTS "Comments are viewable" ON public.article_comments;
CREATE POLICY "Comments are viewable" ON public.article_comments 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can add comments" ON public.article_comments;
CREATE POLICY "Users can add comments" ON public.article_comments 
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- ============================================================
-- SECTION 9: NOTIFICATIONS & PREFERENCES
-- ============================================================

-- In-app and email notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  related_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  related_entity_type TEXT,
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for notifications
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
CREATE POLICY "Users can view their notifications" ON public.notifications 
  FOR SELECT USING (auth.uid() = user_id);

-- User notification preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_digest_frequency TEXT DEFAULT 'weekly',
  in_app_notifications BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  message_notifications BOOLEAN DEFAULT TRUE,
  event_reminders BOOLEAN DEFAULT TRUE,
  newsletter_opt_in BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on notification_preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for notification_preferences
DROP POLICY IF EXISTS "Users can view their preferences" ON public.notification_preferences;
CREATE POLICY "Users can view their preferences" ON public.notification_preferences 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their preferences" ON public.notification_preferences;
CREATE POLICY "Users can update their preferences" ON public.notification_preferences 
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SECTION 10: ANALYTICS & ADMIN
-- ============================================================

-- Per-user daily analytics
CREATE TABLE IF NOT EXISTS public.user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  messages_sent INTEGER DEFAULT 0,
  articles_read INTEGER DEFAULT 0,
  events_attended INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, date)
);

-- Indexes for user_analytics
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON public.user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_date ON public.user_analytics(date DESC);

-- Enable RLS on user_analytics
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for user_analytics
DROP POLICY IF EXISTS "Users can view their analytics" ON public.user_analytics;
CREATE POLICY "Users can view their analytics" ON public.user_analytics 
  FOR SELECT USING (auth.uid() = user_id);

-- Platform-wide daily analytics
CREATE TABLE IF NOT EXISTS public.platform_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  total_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  total_articles INTEGER DEFAULT 0,
  total_events INTEGER DEFAULT 0,
  total_points_distributed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for platform_analytics
CREATE INDEX IF NOT EXISTS idx_platform_analytics_date ON public.platform_analytics(date DESC);

-- Enable RLS on platform_analytics
ALTER TABLE public.platform_analytics ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for platform_analytics
DROP POLICY IF EXISTS "Analytics are admin viewable" ON public.platform_analytics;
CREATE POLICY "Analytics are admin viewable" ON public.platform_analytics 
  FOR SELECT USING (auth.role() = 'service_role');

-- Admin roles and permissions
CREATE TABLE IF NOT EXISTS public.admin_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'moderator',
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on admin_roles
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for admin_roles
DROP POLICY IF EXISTS "Admins can view roles" ON public.admin_roles;
CREATE POLICY "Admins can view roles" ON public.admin_roles 
  FOR SELECT USING (auth.role() = 'service_role');

-- Audit logs for all admin operations
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS policies for audit_logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs 
  FOR SELECT USING (auth.role() = 'service_role');

-- ============================================================
-- SECTION 11: PERMISSIONS & GRANTS
-- ============================================================

-- Grant schema usage to public roles
GRANT USAGE ON SCHEMA public TO authenticated, anon;

-- Grant appropriate permissions on all tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant permissions on sequences for all tables
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;

-- Grant function execution permissions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, anon;
