-- ============================================================================
-- BE INDEPENDENT GAL (BIG) - PRODUCTION SUPABASE SCHEMA
-- ============================================================================
-- Complete database schema for women's community platform
-- Covers: Profiles, Messaging, Directory, Mentorship, Events, Gamification,
-- Blog, Notifications, Analytics, and Admin functions
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================================================
-- 1. USER PROFILE MANAGEMENT
-- ============================================================================

-- Extended user profiles with skills and interests
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  headline TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  mentoring_areas TEXT[] DEFAULT '{}',
  is_mentor BOOLEAN DEFAULT FALSE,
  location TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_user_profiles_is_mentor ON public.user_profiles(is_mentor);
CREATE INDEX idx_user_profiles_total_points ON public.user_profiles(total_points DESC);

-- Extended profile details for mentorship and interests
CREATE TABLE IF NOT EXISTS public.user_profile_extended (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  mentoring_areas TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_user_profile_extended_mentoring_areas ON public.user_profile_extended USING GIN(mentoring_areas);
CREATE INDEX idx_user_profile_extended_skills ON public.user_profile_extended USING GIN(skills);

ALTER TABLE public.user_profile_extended ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can read extended profiles" ON public.user_profile_extended;
CREATE POLICY "Service role can read extended profiles" ON public.user_profile_extended FOR SELECT
  USING (auth.role() = 'service_role');

-- Activity log for gamification
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  points_earned INTEGER DEFAULT 0,
  circle_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_user_activity_user_id ON public.user_activity(user_id, created_at DESC);
CREATE INDEX idx_user_activity_type ON public.user_activity(activity_type);

-- ============================================================================
-- 2. PRIVATE MESSAGING SYSTEM
-- ============================================================================

-- Conversations between users
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT different_users CHECK (user1_id != user2_id)
);

-- Unique index to prevent duplicate conversations
CREATE UNIQUE INDEX idx_conversations_unique_pair 
  ON public.conversations (LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id));

CREATE INDEX idx_conversations_user1 ON public.conversations(user1_id);
CREATE INDEX idx_conversations_user2 ON public.conversations(user2_id);

-- Individual messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);

-- Circle dashboard data for community feeds
CREATE TABLE IF NOT EXISTS public.circle_dashboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID REFERENCES public.circles(id) ON DELETE SET NULL,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_circle_dashboard_circle_id ON public.circle_dashboard(circle_id);

ALTER TABLE public.circle_dashboard ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage circle dashboards" ON public.circle_dashboard;
CREATE POLICY "Service role can manage circle dashboards" ON public.circle_dashboard FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- 3. MEMBER DIRECTORY & SEARCH
-- ============================================================================

-- Full-text search index for members
CREATE TABLE IF NOT EXISTS public.user_directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  headline TEXT,
  bio TEXT,
  skills TEXT[],
  interests TEXT[],
  is_mentor BOOLEAN,
  search_vector tsvector,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id)
);

CREATE INDEX idx_user_directory_search ON public.user_directory USING GIN(search_vector);
CREATE INDEX idx_user_directory_is_mentor ON public.user_directory(is_mentor);

-- ============================================================================
-- 4. MENTORSHIP SYSTEM
-- ============================================================================

-- Mentor-mentee relationships
CREATE TABLE IF NOT EXISTS public.mentorship (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT different_users CHECK (mentor_id != mentee_id)
);

CREATE INDEX idx_mentorship_mentor ON public.mentorship(mentor_id);
CREATE INDEX idx_mentorship_mentee ON public.mentorship(mentee_id);

-- Mentorship requests
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  responded_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT different_users CHECK (mentor_id != requester_id)
);

CREATE INDEX idx_mentorship_requests_mentor ON public.mentorship_requests(mentor_id, status);
CREATE INDEX idx_mentorship_requests_requester ON public.mentorship_requests(requester_id);

-- Mentorship sessions
CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentorship_id UUID NOT NULL REFERENCES public.mentorship(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_mentorship_sessions_mentorship ON public.mentorship_sessions(mentorship_id);

-- ============================================================================
-- 5. EVENTS & REGISTRATION
-- ============================================================================

-- Events
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
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_events_organizer ON public.events(organizer_id);
CREATE INDEX idx_events_start_time ON public.events(start_time DESC);
CREATE INDEX idx_events_status ON public.events(status);

-- Event registrations
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  attended_at TIMESTAMP WITH TIME ZONE,
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  UNIQUE(event_id, user_id)
);

CREATE INDEX idx_event_registrations_event ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_user ON public.event_registrations(user_id);

-- Event reminders
CREATE TABLE IF NOT EXISTS public.event_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES public.event_registrations(id) ON DELETE CASCADE,
  reminder_type TEXT CHECK (reminder_type IN ('email', 'in_app')),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 6. GAMIFICATION SYSTEM
-- ============================================================================

-- Badge definitions
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  points_required INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- User badges earned
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON public.user_badges(user_id);

-- Challenges
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  circle_name TEXT,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  points_reward INTEGER DEFAULT 50,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_challenges_active ON public.challenges(status, end_date);

-- Challenge participants
CREATE TABLE IF NOT EXISTS public.challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(challenge_id, user_id)
);

CREATE INDEX idx_challenge_participants_user ON public.challenge_participants(user_id);

-- Leaderboards (cached for performance)
CREATE TABLE IF NOT EXISTS public.leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_name TEXT,
  period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly', 'alltime')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL,
  rank INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(circle_name, period, user_id)
);

CREATE INDEX idx_leaderboards_period_rank ON public.leaderboards(period, rank);

-- ============================================================================
-- 7. BLOG & KNOWLEDGE BASE
-- ============================================================================

-- Articles
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

CREATE INDEX idx_articles_author ON public.articles(author_id);
CREATE INDEX idx_articles_status ON public.articles(status);
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_search ON public.articles USING GIN(search_vector);

-- Article tags
CREATE TABLE IF NOT EXISTS public.article_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_article_tags_article ON public.article_tags(article_id);
CREATE INDEX idx_article_tags_tag ON public.article_tags(tag);

-- Article comments
CREATE TABLE IF NOT EXISTS public.article_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.article_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_article_comments_article ON public.article_comments(article_id);
CREATE INDEX idx_article_comments_parent ON public.article_comments(parent_comment_id);

-- Resources (guides, templates, downloads)
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  circle_name TEXT,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_resources_creator ON public.resources(creator_id);

-- ============================================================================
-- 8. NOTIFICATIONS & PREFERENCES
-- ============================================================================

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  related_resource_id UUID,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, read_at, created_at DESC);

-- Notification preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email_digest BOOLEAN DEFAULT TRUE,
  email_frequency TEXT DEFAULT 'weekly' CHECK (email_frequency IN ('daily', 'weekly', 'monthly', 'never')),
  in_app_notifications BOOLEAN DEFAULT TRUE,
  message_notifications BOOLEAN DEFAULT TRUE,
  event_reminders BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 9. ANALYTICS
-- ============================================================================

-- User daily analytics
CREATE TABLE IF NOT EXISTS public.user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  messages_sent INTEGER DEFAULT 0,
  articles_viewed INTEGER DEFAULT 0,
  events_attended INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_user_analytics_date ON public.user_analytics(date DESC);

-- Platform daily analytics
CREATE TABLE IF NOT EXISTS public.platform_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  active_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  events_created INTEGER DEFAULT 0,
  articles_published INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(date)
);

-- Circle daily analytics
CREATE TABLE IF NOT EXISTS public.circle_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_name TEXT NOT NULL,
  date DATE NOT NULL,
  active_members INTEGER DEFAULT 0,
  new_members INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(circle_name, date)
);

-- ============================================================================
-- 10. ADMIN & MODERATION
-- ============================================================================

-- Admin roles
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('moderator', 'admin', 'superadmin')),
  permissions TEXT[] DEFAULT '{}',
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Audit logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_audit_logs_admin ON public.audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- Moderation flags
CREATE TABLE IF NOT EXISTS public.moderation_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_id UUID,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_taken TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_moderation_flags_status ON public.moderation_flags(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_flags ENABLE ROW LEVEL SECURITY;

-- User profiles - authenticated users can view all, edit their own
DROP POLICY IF EXISTS "user_profiles_select" ON public.user_profiles;
CREATE POLICY "user_profiles_select" ON public.user_profiles
  FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS "user_profiles_update" ON public.user_profiles;
CREATE POLICY "user_profiles_update" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- User activity - authenticated users can insert, view own
DROP POLICY IF EXISTS "user_activity_insert" ON public.user_activity;
CREATE POLICY "user_activity_insert" ON public.user_activity
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_activity_select" ON public.user_activity;
CREATE POLICY "user_activity_select" ON public.user_activity
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Conversations - users can view/manage their own
DROP POLICY IF EXISTS "conversations_select" ON public.conversations;
CREATE POLICY "conversations_select" ON public.conversations
  FOR SELECT TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "conversations_insert" ON public.conversations;
CREATE POLICY "conversations_insert" ON public.conversations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages - participants can view, sender can insert
DROP POLICY IF EXISTS "messages_select" ON public.messages;
CREATE POLICY "messages_select" ON public.messages
  FOR SELECT TO authenticated
  USING (
    sender_id = auth.uid() OR
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "messages_insert" ON public.messages;
CREATE POLICY "messages_insert" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- User directory - public read
DROP POLICY IF EXISTS "user_directory_select" ON public.user_directory;
CREATE POLICY "user_directory_select" ON public.user_directory
  FOR SELECT TO authenticated USING (TRUE);

-- Mentorship - authenticated can view related records
DROP POLICY IF EXISTS "mentorship_select" ON public.mentorship;
CREATE POLICY "mentorship_select" ON public.mentorship
  FOR SELECT TO authenticated
  USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

DROP POLICY IF EXISTS "mentorship_requests_select" ON public.mentorship_requests;
CREATE POLICY "mentorship_requests_select" ON public.mentorship_requests
  FOR SELECT TO authenticated
  USING (auth.uid() = mentor_id OR auth.uid() = requester_id);

DROP POLICY IF EXISTS "mentorship_requests_insert" ON public.mentorship_requests;
CREATE POLICY "mentorship_requests_insert" ON public.mentorship_requests
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = requester_id);

-- Events - public read, authenticated can register
DROP POLICY IF EXISTS "events_select" ON public.events;
CREATE POLICY "events_select" ON public.events
  FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS "event_registrations_insert" ON public.event_registrations;
CREATE POLICY "event_registrations_insert" ON public.event_registrations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "event_registrations_select" ON public.event_registrations;
CREATE POLICY "event_registrations_select" ON public.event_registrations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR event_id IN (SELECT id FROM public.events WHERE organizer_id = auth.uid()));

-- Articles - public read published, authenticated can create
DROP POLICY IF EXISTS "articles_select" ON public.articles;
CREATE POLICY "articles_select" ON public.articles
  FOR SELECT USING (status = 'published' OR auth.uid() = author_id);

DROP POLICY IF EXISTS "articles_insert" ON public.articles;
CREATE POLICY "articles_insert" ON public.articles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Notifications - users see their own
DROP POLICY IF EXISTS "notifications_select" ON public.notifications;
CREATE POLICY "notifications_select" ON public.notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Notification preferences - users manage their own
DROP POLICY IF EXISTS "notification_preferences_select" ON public.notification_preferences;
CREATE POLICY "notification_preferences_select" ON public.notification_preferences
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notification_preferences_upsert" ON public.notification_preferences;
CREATE POLICY "notification_preferences_upsert" ON public.notification_preferences
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- INSERT DEFAULT DATA
-- ============================================================================

-- Default badges
INSERT INTO public.badges (name, description, icon_url, points_required) VALUES
  ('Newcomer', 'Welcome to Be Independent Gal!', '/badges/newcomer.png', 0),
  ('Active Member', 'Earned 100+ points', '/badges/active.png', 100),
  ('Mentor', 'Helped other members grow', '/badges/mentor.png', 250)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
