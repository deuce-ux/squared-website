-- Run this in the Supabase SQL editor
-- Creates the settings table for site-wide config flags

CREATE TABLE IF NOT EXISTS public.settings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text UNIQUE NOT NULL,
  value       text NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (needed by public pages)
CREATE POLICY "settings_select_public"
  ON public.settings FOR SELECT
  USING (true);

-- Allow authenticated users (admin) to update settings
CREATE POLICY "settings_update_authenticated"
  ON public.settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed the forge_applications_open flag
INSERT INTO public.settings (key, value)
VALUES ('forge_applications_open', 'true')
ON CONFLICT (key) DO NOTHING;
