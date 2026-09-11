CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'Pembaca Izanami',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  series_slug TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  cover TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, series_slug)
);

CREATE TABLE IF NOT EXISTS history (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  series_slug TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  page INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, series_slug)
);

CREATE INDEX IF NOT EXISTS idx_history_user_updated
  ON history (user_id, updated_at DESC);
