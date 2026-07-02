-- Migration: add extended fields to opportunities
ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS application_url text,
  ADD COLUMN IF NOT EXISTS deadline timestamptz,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS eligibility text,
  ADD COLUMN IF NOT EXISTS featured_order integer,
  ADD COLUMN IF NOT EXISTS views integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS saved_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS cover_image text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[];

-- Indexes for new fields
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON public.opportunities (deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_featured_order ON public.opportunities (featured_order);
CREATE INDEX IF NOT EXISTS idx_opportunities_views ON public.opportunities (views DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_tags_gin ON public.opportunities USING GIN (tags);

-- Ensure updated_at trigger remains in place (safe to recreate)
DROP TRIGGER IF EXISTS update_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER update_opportunities_updated_at
BEFORE UPDATE ON public.opportunities
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
