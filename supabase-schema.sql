-- Be Independent Gal - single canonical Supabase migration
-- This is the only migration needed for the current app routes and feature set.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Ensure core helpers exist
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================
-- 1. PROFILE TABLES & USER PREFERENCES
-- =========================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  profession TEXT,
  industry TEXT,
  business TEXT,
  city TEXT,
  phone TEXT,
  experience TEXT,
  why_joining TEXT,
  skills TEXT[] DEFAULT '{}'::TEXT[],
  interests TEXT[] DEFAULT '{}'::TEXT[],
  mentoring_areas TEXT[] DEFAULT '{}'::TEXT[],
  looking_for_mentor BOOLEAN DEFAULT false,
  available_to_mentor BOOLEAN DEFAULT false,
  location TEXT,
  website TEXT,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges_count INTEGER DEFAULT 0,
  search_vector TSVECTOR,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS profession TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS business TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS experience TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS why_joining TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}'::TEXT[];
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}'::TEXT[];
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS mentoring_areas TEXT[] DEFAULT '{}'::TEXT[];
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS looking_for_mentor BOOLEAN DEFAULT false;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS available_to_mentor BOOLEAN DEFAULT false;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS badges_count INTEGER DEFAULT 0;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

UPDATE public.user_profiles
SET user_id = id
WHERE user_id IS NULL AND id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_user_id_unique ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_total_points ON public.user_profiles(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_available_to_mentor ON public.user_profiles(available_to_mentor);
CREATE INDEX IF NOT EXISTS idx_user_profiles_search ON public.user_profiles USING GIN(search_vector);

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TABLE IF NOT EXISTS public.user_profile_extended (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  bio TEXT,
  skills TEXT[] DEFAULT '{}'::TEXT[],
  interests TEXT[] DEFAULT '{}'::TEXT[],
  mentoring_areas TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT true,
  email_digest BOOLEAN DEFAULT true,
  selected_circles TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT true;
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS email_digest BOOLEAN DEFAULT true;
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS selected_circles TEXT[] DEFAULT '{}'::TEXT[];
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  city TEXT,
  profession TEXT,
  business TEXT,
  bio TEXT,
  avatar_url TEXT,
  primary_circle TEXT DEFAULT 'learn',
  join_reason TEXT,
  member_level TEXT DEFAULT 'New Member',
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profession TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS primary_circle TEXT DEFAULT 'learn';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS join_reason TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS member_level TEXT DEFAULT 'New Member';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

CREATE TABLE IF NOT EXISTS public.circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  action TEXT,
  points_earned INTEGER DEFAULT 0,
  circle_id UUID REFERENCES public.circles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_activity ADD COLUMN IF NOT EXISTS action TEXT;
ALTER TABLE public.user_activity ADD COLUMN IF NOT EXISTS circle_id UUID REFERENCES public.circles(id) ON DELETE SET NULL;
ALTER TABLE public.user_activity ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON public.user_activity(activity_type);

-- RLS for profiles and preferences
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profile_extended ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable" ON public.user_profiles;
CREATE POLICY "Public profiles are viewable" ON public.user_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can view their own profile extended" ON public.user_profile_extended;
CREATE POLICY "Users can view their own profile extended" ON public.user_profile_extended FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_preferences;
CREATE POLICY "Users can update their own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can read their own profile record" ON public.profiles;
CREATE POLICY "Users can read their own profile record" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update their own profile record" ON public.profiles;
CREATE POLICY "Users can update their own profile record" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can view their own activity" ON public.user_activity;
CREATE POLICY "Users can view their own activity" ON public.user_activity FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role can insert activity" ON public.user_activity;
CREATE POLICY "Service role can insert activity" ON public.user_activity FOR INSERT WITH CHECK (true);

-- =========================
-- 2. CIRCLES & DIRECTORY
-- =========================

CREATE TABLE IF NOT EXISTS public.circle_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  role TEXT DEFAULT 'member',
  UNIQUE(user_id, circle_id)
);

CREATE TABLE IF NOT EXISTS public.user_directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  skills TEXT[] DEFAULT '{}'::TEXT[],
  interests TEXT[] DEFAULT '{}'::TEXT[],
  circles TEXT[] DEFAULT '{}'::TEXT[],
  is_mentor BOOLEAN DEFAULT false,
  points INTEGER DEFAULT 0,
  search_vector TSVECTOR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_directory ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.user_directory ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.user_directory ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.user_directory ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.user_directory ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.user_directory ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}'::TEXT[];
ALTER TABLE public.user_directory ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}'::TEXT[];
ALTER TABLE public.user_directory ADD COLUMN IF NOT EXISTS circles TEXT[] DEFAULT '{}'::TEXT[];
ALTER TABLE public.user_directory ADD COLUMN IF NOT EXISTS is_mentor BOOLEAN DEFAULT false;
ALTER TABLE public.user_directory ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE public.user_directory ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;
ALTER TABLE public.user_directory ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.user_directory ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

CREATE INDEX IF NOT EXISTS idx_circle_members_user ON public.circle_members(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_members_circle ON public.circle_members(circle_id);
CREATE INDEX IF NOT EXISTS idx_user_directory_search ON public.user_directory USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_user_directory_is_mentor ON public.user_directory(is_mentor);

CREATE OR REPLACE FUNCTION public.update_user_directory_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector(
    'english',
    coalesce(NEW.full_name, '') || ' ' ||
    coalesce(NEW.bio, '') || ' ' ||
    coalesce(array_to_string(NEW.skills, ' '), '') || ' ' ||
    coalesce(array_to_string(NEW.interests, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_user_directory_search ON public.user_directory;
CREATE TRIGGER update_user_directory_search
BEFORE INSERT OR UPDATE ON public.user_directory
FOR EACH ROW EXECUTE FUNCTION public.update_user_directory_search_vector();

ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_directory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Circles are publicly readable" ON public.circles;
CREATE POLICY "Circles are publicly readable" ON public.circles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can view memberships" ON public.circle_members;
CREATE POLICY "Users can view memberships" ON public.circle_members FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Users can insert their own membership" ON public.circle_members;
CREATE POLICY "Users can insert their own membership" ON public.circle_members FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Everyone can search directory" ON public.user_directory;
CREATE POLICY "Everyone can search directory" ON public.user_directory FOR SELECT USING (true);

INSERT INTO public.circles (name, description, icon)
SELECT 'Learn', 'Develop knowledge, skills and confidence.', 'book'
WHERE NOT EXISTS (SELECT 1 FROM public.circles WHERE name = 'Learn');

INSERT INTO public.circles (name, description, icon)
SELECT 'Connect', 'Build meaningful relationships and networks.', 'users'
WHERE NOT EXISTS (SELECT 1 FROM public.circles WHERE name = 'Connect');

INSERT INTO public.circles (name, description, icon)
SELECT 'Earn', 'Discover opportunities and financial growth.', 'wallet'
WHERE NOT EXISTS (SELECT 1 FROM public.circles WHERE name = 'Earn');

INSERT INTO public.circles (name, description, icon)
SELECT 'Thrive', 'Achieve holistic well-being and purpose.', 'heart'
WHERE NOT EXISTS (SELECT 1 FROM public.circles WHERE name = 'Thrive');

-- =========================
-- 3. MENTORSHIP, EVENTS & GAMIFICATION
-- =========================

CREATE TABLE IF NOT EXISTS public.mentorship_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT mentorship_pairs_different_users CHECK (mentor_id != mentee_id),
  CONSTRAINT mentorship_pairs_unique_pair UNIQUE(mentor_id, mentee_id)
);

CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  responded_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT mentorship_requests_different_users CHECK (mentor_id != requester_id)
);

CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id UUID NOT NULL REFERENCES public.mentorship_pairs(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  feedback_rating INTEGER CHECK (feedback_rating IS NULL OR (feedback_rating >= 1 AND feedback_rating <= 5)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'workshop';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS circle_name TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS circle_id UUID REFERENCES public.circles(id) ON DELETE SET NULL;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS start_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS end_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_url TEXT;

UPDATE public.events
SET start_time = COALESCE(start_time, start_date),
    end_time = COALESCE(end_time, end_date)
WHERE start_time IS NULL OR end_time IS NULL;

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  attended BOOLEAN DEFAULT false,
  feedback_rating INTEGER CHECK (feedback_rating IS NULL OR (feedback_rating >= 1 AND feedback_rating <= 5)),
  feedback_text TEXT,
  UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.event_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES public.event_registrations(id) ON DELETE CASCADE,
  reminder_type TEXT CHECK (reminder_type IN ('email', 'in_app')),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled'));
ALTER TABLE public.event_reminders ADD COLUMN IF NOT EXISTS event_registration_id UUID REFERENCES public.event_registrations(id) ON DELETE CASCADE;
ALTER TABLE public.event_reminders ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMP WITH TIME ZONE;

CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  points_required INTEGER DEFAULT 0,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(challenge_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rank INTEGER,
  total_points INTEGER DEFAULT 0,
  period TEXT DEFAULT 'all_time' CHECK (period IN ('weekly', 'monthly', 'all_time')),
  circle_name TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, period)
);

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registered_count INTEGER DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS attended BOOLEAN DEFAULT false;
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS feedback_rating INTEGER CHECK (feedback_rating IS NULL OR (feedback_rating >= 1 AND feedback_rating <= 5));
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS feedback_text TEXT;
ALTER TABLE public.leaderboards ADD COLUMN IF NOT EXISTS circle_name TEXT;
ALTER TABLE public.leaderboards ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

CREATE INDEX IF NOT EXISTS idx_mentorship_pairs_mentor ON public.mentorship_pairs(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_pairs_mentee ON public.mentorship_pairs(mentee_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_requests_mentor ON public.mentorship_requests(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_pair ON public.mentorship_sessions(pair_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge ON public.challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user ON public.challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_rank ON public.leaderboards(rank, period);
CREATE INDEX IF NOT EXISTS idx_leaderboards_points ON public.leaderboards(total_points DESC);

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS for mentorship/events/gamification
ALTER TABLE public.mentorship_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view events" ON public.events;
CREATE POLICY "Everyone can view events" ON public.events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Organizers can update their events" ON public.events;
CREATE POLICY "Organizers can update their events" ON public.events FOR UPDATE USING (auth.uid() = organizer_id) WITH CHECK (auth.uid() = organizer_id);
DROP POLICY IF EXISTS "Users can register for events" ON public.event_registrations;
CREATE POLICY "Users can register for events" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Everyone can view badges" ON public.badges;
CREATE POLICY "Everyone can view badges" ON public.badges FOR SELECT USING (true);
DROP POLICY IF EXISTS "Everyone can view leaderboards" ON public.leaderboards;
CREATE POLICY "Everyone can view leaderboards" ON public.leaderboards FOR SELECT USING (true);
DROP POLICY IF EXISTS "Everyone can view challenges" ON public.challenges;
CREATE POLICY "Everyone can view challenges" ON public.challenges FOR SELECT USING (true);

INSERT INTO public.badges (name, description, icon_url, color)
SELECT 'First Step', 'Complete your profile', 'https://api.dicebear.com/7.x/bottts/svg?seed=first', '#FF6B6B'
WHERE NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'First Step');

INSERT INTO public.badges (name, description, icon_url, color)
SELECT 'Community Builder', 'Make 10 connections', 'https://api.dicebear.com/7.x/bottts/svg?seed=builder', '#4ECDC4'
WHERE NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'Community Builder');

INSERT INTO public.badges (name, description, icon_url, color)
SELECT 'Knowledge Sharer', 'Publish an article', 'https://api.dicebear.com/7.x/bottts/svg?seed=sharer', '#FFE66D'
WHERE NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'Knowledge Sharer');

-- =========================
-- 4. ARTICLES, NOTIFICATIONS & ANALYTICS
-- =========================

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
  view_count INTEGER DEFAULT 0,
  search_vector TSVECTOR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.article_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.article_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

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

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  related_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  related_item_id UUID,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_on_message BOOLEAN DEFAULT true,
  email_on_event BOOLEAN DEFAULT true,
  email_on_mention BOOLEAN DEFAULT true,
  digest_frequency TEXT DEFAULT 'daily' CHECK (digest_frequency IN ('daily', 'weekly', 'never')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.platform_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  active_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  events_created INTEGER DEFAULT 0,
  articles_published INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.circle_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  active_members INTEGER DEFAULT 0,
  new_members INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(circle_id, date)
);

CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'super_admin', 'moderator', 'content_manager')),
  permissions TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  changes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.moderation_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_name TEXT NOT NULL,
  submission JSONB DEFAULT '{}'::jsonb,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_articles_author ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_search ON public.articles USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_article_comments_article ON public.article_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_analytics_date ON public.platform_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_circle_analytics_circle ON public.circle_analytics(circle_id, date);
CREATE INDEX IF NOT EXISTS idx_moderation_flags_status ON public.moderation_flags(status);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view published articles" ON public.articles;
CREATE POLICY "Everyone can view published articles" ON public.articles FOR SELECT USING (status = 'published' OR auth.uid() = author_id);
DROP POLICY IF EXISTS "Authors can create articles" ON public.articles;
CREATE POLICY "Authors can create articles" ON public.articles FOR INSERT WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "Authors can update their articles" ON public.articles;
CREATE POLICY "Authors can update their articles" ON public.articles FOR UPDATE USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can manage their preferences" ON public.notification_preferences;
CREATE POLICY "Users can manage their preferences" ON public.notification_preferences FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Service role can insert analytics" ON public.analytics_events;
CREATE POLICY "Service role can insert analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Everyone can view public analytics" ON public.platform_analytics;
CREATE POLICY "Everyone can view public analytics" ON public.platform_analytics FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role can manage circle analytics" ON public.circle_analytics;
CREATE POLICY "Service role can manage circle analytics" ON public.circle_analytics FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Service role can manage admin roles" ON public.admin_roles;
CREATE POLICY "Service role can manage admin roles" ON public.admin_roles FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Service role can manage audit logs" ON public.audit_logs;
CREATE POLICY "Service role can manage audit logs" ON public.audit_logs FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Service role can manage moderation flags" ON public.moderation_flags;
CREATE POLICY "Service role can manage moderation flags" ON public.moderation_flags FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Authenticated users can submit forms" ON public.form_submissions;
CREATE POLICY "Authenticated users can submit forms" ON public.form_submissions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =========================
-- 5. GRANTS
-- =========================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, anon, service_role;
