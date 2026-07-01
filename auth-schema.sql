-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT DEFAULT '',
  last_name TEXT DEFAULT '',
  full_name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  city TEXT DEFAULT '',
  profession TEXT DEFAULT '',
  business TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  experience TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  why_joining TEXT DEFAULT '',
  points INTEGER DEFAULT 0,
  level TEXT DEFAULT 'New Member',
  circle TEXT DEFAULT 'learn',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT true,
  email_digest BOOLEAN DEFAULT true,
  selected_circles TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own profile" ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own preferences" ON public.user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Grant permissions to service role
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.user_preferences TO service_role;

-- Profiles table (canonical for app use)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  city TEXT,
  profession TEXT,
  business TEXT,
  bio TEXT,
  avatar_url TEXT,
  primary_circle TEXT,
  join_reason TEXT,
  member_level TEXT DEFAULT 'New Member',
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Circles table
CREATE TABLE IF NOT EXISTS public.circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Circle members
CREATE TABLE IF NOT EXISTS public.circle_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  role TEXT DEFAULT 'member'
);

-- Enable RLS on new tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Profiles: users can select their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Profiles: users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Circle members: users can insert their own membership" ON public.circle_members
  FOR INSERT USING (auth.uid() = user_id);

CREATE POLICY "Circle members: users can view memberships" ON public.circle_members
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Circles: public read" ON public.circles
  FOR SELECT USING (true);

-- Grants
GRANT SELECT, INSERT, UPDATE ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.circles TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.circle_members TO service_role;

-- Seed default circles if not present
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
