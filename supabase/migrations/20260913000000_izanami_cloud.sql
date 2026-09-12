-- Izanami cloud schema (Supabase Postgres). Users.id = auth.users.id.
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT NOT NULL DEFAULT 'Pembaca Izanami',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.favorites (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  series_slug TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  cover TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, series_slug)
);

CREATE TABLE IF NOT EXISTS public.history (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  series_slug TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  page INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, series_slug)
);

CREATE INDEX IF NOT EXISTS idx_history_user_updated
  ON public.history (user_id, updated_at DESC);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own row" ON public.users;
CREATE POLICY "own row" ON public.users FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "own favorites" ON public.favorites;
CREATE POLICY "own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own history" ON public.history;
CREATE POLICY "own history" ON public.history FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
