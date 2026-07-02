-- Migration: create opportunity_categories and migrate existing category values
CREATE TABLE IF NOT EXISTS public.opportunity_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Add category_id to opportunities and migrate existing text categories
ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.opportunity_categories(id) ON DELETE SET NULL;

-- Insert distinct existing categories into opportunity_categories
INSERT INTO public.opportunity_categories (name, slug)
SELECT DISTINCT category, lower(replace(category, ' ', '-'))
FROM public.opportunities
WHERE category IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Link opportunities to newly created categories
UPDATE public.opportunities o
SET category_id = c.id
FROM public.opportunity_categories c
WHERE o.category IS NOT NULL AND c.name = o.category;

-- Optional: keep `category` text for backward-compatibility; consider dropping later

CREATE INDEX IF NOT EXISTS idx_opportunity_categories_name ON public.opportunity_categories (name);
