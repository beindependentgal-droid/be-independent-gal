-- Be Independent Gal (BIG) Production Schema
-- Complete backend for women's community platform with 10 features

-- ============================================================================
-- SECTION 1: UTILITY FUNCTIONS & HELPERS
-- ============================================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Full-text search trigger for profiles
CREATE OR REPLACE FUNCTION public.update_profiles_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := TO_TSVECTOR('english', COALESCE(NEW.first_name, '') || ' ' || COALESCE(NEW.last_name, '') || ' ' || COALESCE(NEW.bio, '') || ' ' || COALESCE(NEW.skills, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Full-text search trigger for articles
CREATE OR REPLACE FUNCTION public.update_articles_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := TO_TSVECTOR('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.excerpt, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SECTION 2: USER PROFILES & ACTIVITY TRACKING (Feature 1)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  mentoring_areas TEXT[] DEFAULT '{}',
  looking_for_mentor BOOLEAN DEFAULT false,
  available_to_mentor BOOLEAN DEFAULT false,
  location TEXT,
  website TEXT,
  points_earned INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges_count INTEGER DEFAULT 0,
  search_vector TSVECTOR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_profile_extended (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  bio TEXT,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  mentoring_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  action TEXT NOT NULL,
  points_earned INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_search ON public.user_profiles USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_user_profiles_mentoring ON public.user_profiles(available_to_mentor);

-- Triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_profiles_search ON public.user_profiles;
CREATE TRIGGER update_profiles_search BEFORE INSERT OR UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_profiles_search_vector();

-- RLS Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable" ON public.user_profiles;
CREATE POLICY "Public profiles are viewable" ON public.user_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view their own activity" ON public.user_activity;
CREATE POLICY "Users can view their own activity" ON public.user_activity FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can insert activity" ON public.user_activity;
CREATE POLICY "Service role can insert activity" ON public.user_activity FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- SECTION 3: PRIVATE MESSAGING (Feature 2)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT different_users CHECK (user1_id != user2_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_users ON public.conversations(user1_id, user2_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_unique_pair ON public.conversations(LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id));
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- RLS Policies
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
CREATE POLICY "Users can view their conversations" ON public.conversations FOR SELECT
  USING (auth.uid() IN (user1_id, user2_id));

DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() IN (user1_id, user2_id));

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT
  USING (conversation_id IN (SELECT id FROM public.conversations WHERE auth.uid() IN (user1_id, user2_id)));

DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND conversation_id IN (SELECT id FROM public.conversations WHERE auth.uid() IN (user1_id, user2_id)));

-- ============================================================================
-- SECTION 4: MEMBER DIRECTORY & SEARCH (Feature 3)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.member_directory (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  skills TEXT,
  interests TEXT,
  location TEXT,
  is_mentor BOOLEAN DEFAULT false,
  search_vector TSVECTOR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for full-text search
CREATE INDEX IF NOT EXISTS idx_member_directory_search ON public.member_directory USING GIN(search_vector);

CREATE TABLE IF NOT EXISTS public.circle_dashboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID REFERENCES public.circles(id) ON DELETE SET NULL,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_circle_dashboard_circle_id ON public.circle_dashboard(circle_id);

-- RLS Policies
ALTER TABLE public.member_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_dashboard ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can search directory" ON public.member_directory;
CREATE POLICY "Everyone can search directory" ON public.member_directory FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role can manage circle dashboards" ON public.circle_dashboard;
CREATE POLICY "Service role can manage circle dashboards" ON public.circle_dashboard FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- SECTION 5: MENTORSHIP SYSTEM (Feature 4)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.mentorship_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT different_users CHECK (mentor_id != mentee_id),
  CONSTRAINT unique_pair UNIQUE(mentor_id, mentee_id)
);

CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT different_users CHECK (mentor_id != requester_id)
);

CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id UUID NOT NULL REFERENCES public.mentorship_pairs(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mentorship_pairs_mentor ON public.mentorship_pairs(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_pairs_mentee ON public.mentorship_pairs(mentee_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_requests_mentor ON public.mentorship_requests(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_pair ON public.mentorship_sessions(pair_id);

-- RLS Policies
ALTER TABLE public.mentorship_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their mentorship pairs" ON public.mentorship_pairs;
CREATE POLICY "Users can view their mentorship pairs" ON public.mentorship_pairs FOR SELECT
  USING (auth.uid() IN (mentor_id, mentee_id));

DROP POLICY IF EXISTS "Service role can manage pairs" ON public.mentorship_pairs;
CREATE POLICY "Service role can manage pairs" ON public.mentorship_pairs FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Mentors can view requests" ON public.mentorship_requests;
CREATE POLICY "Mentors can view requests" ON public.mentorship_requests FOR SELECT
  USING (auth.uid() IN (mentor_id, requester_id));

-- ============================================================================
-- SECTION 6: EVENT MANAGEMENT & REGISTRATION (Feature 5)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  location TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  capacity INTEGER,
  registered_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attended BOOLEAN DEFAULT false,
  feedback_rating INTEGER CHECK (feedback_rating IS NULL OR (feedback_rating >= 1 AND feedback_rating <= 5)),
  feedback_text TEXT,
  UNIQUE(event_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_organizer ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON public.event_registrations(user_id);

-- Triggers
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view events" ON public.events;
CREATE POLICY "Everyone can view events" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Organizers can update their events" ON public.events;
CREATE POLICY "Organizers can update their events" ON public.events FOR UPDATE
  USING (auth.uid() = organizer_id) WITH CHECK (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Users can register for events" ON public.event_registrations;
CREATE POLICY "Users can register for events" ON public.event_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- SECTION 7: GAMIFICATION SYSTEM (Feature 6)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  points_required INTEGER,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points_reward INTEGER DEFAULT 50,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rank INTEGER,
  total_points INTEGER DEFAULT 0,
  period TEXT DEFAULT 'all_time' CHECK (period IN ('weekly', 'monthly', 'all_time')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, period)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge ON public.challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user ON public.challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_rank ON public.leaderboards(rank, period);
CREATE INDEX IF NOT EXISTS idx_leaderboards_points ON public.leaderboards(total_points DESC);

-- RLS Policies
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view badges" ON public.badges;
CREATE POLICY "Everyone can view badges" ON public.badges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Everyone can view leaderboards" ON public.leaderboards;
CREATE POLICY "Everyone can view leaderboards" ON public.leaderboards FOR SELECT USING (true);

DROP POLICY IF EXISTS "Everyone can view challenges" ON public.challenges;
CREATE POLICY "Everyone can view challenges" ON public.challenges FOR SELECT USING (true);

-- Insert default badges
INSERT INTO public.badges (name, description, icon_url, color) VALUES
  ('First Step', 'Complete your profile', 'https://api.dicebear.com/7.x/bottts/svg?seed=first', '#FF6B6B')
  ON CONFLICT (name) DO NOTHING;

INSERT INTO public.badges (name, description, icon_url, color) VALUES
  ('Community Builder', 'Make 10 connections', 'https://api.dicebear.com/7.x/bottts/svg?seed=builder', '#4ECDC4')
  ON CONFLICT (name) DO NOTHING;

INSERT INTO public.badges (name, description, icon_url, color) VALUES
  ('Knowledge Sharer', 'Publish an article', 'https://api.dicebear.com/7.x/bottts/svg?seed=sharer', '#FFE66D')
  ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SECTION 8: BLOG & KNOWLEDGE BASE (Feature 7)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  search_vector TSVECTOR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.article_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_articles_author ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_search ON public.articles USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_article_comments_article ON public.article_comments(article_id);

-- Triggers
DROP TRIGGER IF EXISTS update_articles_updated_at ON public.articles;
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_articles_search ON public.articles;
CREATE TRIGGER update_articles_search BEFORE INSERT OR UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.update_articles_search_vector();

-- RLS Policies
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view published articles" ON public.articles;
CREATE POLICY "Everyone can view published articles" ON public.articles FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can create articles" ON public.articles;
CREATE POLICY "Authors can create articles" ON public.articles FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can update their articles" ON public.articles;
CREATE POLICY "Authors can update their articles" ON public.articles FOR UPDATE
  USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);

-- ============================================================================
-- SECTION 9: NOTIFICATIONS (Feature 8)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  related_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  related_item_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_on_message BOOLEAN DEFAULT true,
  email_on_event BOOLEAN DEFAULT true,
  email_on_mention BOOLEAN DEFAULT true,
  digest_frequency TEXT DEFAULT 'daily' CHECK (digest_frequency IN ('daily', 'weekly', 'never')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- RLS Policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their preferences" ON public.notification_preferences;
CREATE POLICY "Users can manage their preferences" ON public.notification_preferences FOR ALL
  USING (auth.uid() = id);

-- ============================================================================
-- SECTION 10: ANALYTICS (Feature 9)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.platform_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  active_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  events_created INTEGER DEFAULT 0,
  articles_published INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_analytics_date ON public.platform_analytics(date DESC);

-- RLS Policies
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can insert analytics" ON public.analytics_events;
CREATE POLICY "Service role can insert analytics" ON public.analytics_events FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Everyone can view public analytics" ON public.platform_analytics;
CREATE POLICY "Everyone can view public analytics" ON public.platform_analytics FOR SELECT USING (true);

-- ============================================================================
-- SECTION 11: PERMISSIONS & GRANTS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, anon;
