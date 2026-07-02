-- Migration: create opportunities table
CREATE TABLE IF NOT EXISTS public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  organization text,
  organization_logo text,
  location text,
  country text,
  category text,
  description text,
  process text,
  requirements jsonb,
  benefits jsonb,
  faqs jsonb,
  funding text,
  duration text,
  remote boolean DEFAULT false,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- optional index for text search
CREATE INDEX IF NOT EXISTS opportunities_title_idx ON public.opportunities USING gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));
