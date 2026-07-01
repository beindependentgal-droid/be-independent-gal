CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  experience TEXT NOT NULL,
  goals TEXT NOT NULL,
  interests JSONB DEFAULT '[]'::jsonb,
  contact_method TEXT NOT NULL DEFAULT 'email',
  updates BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert for form submissions"
  ON public.form_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow admin read for form submissions"
  ON public.form_submissions
  FOR SELECT
  TO authenticated
  USING (true);
