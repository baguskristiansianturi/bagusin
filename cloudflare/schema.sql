-- Bagusin inquiry storage (Cloudflare D1 / SQLite)
-- Apply this schema once to the production D1 database.
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL DEFAULT '',
  mode TEXT NOT NULL DEFAULT 'project',
  brief TEXT NOT NULL,
  source_page TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'reviewing', 'replied', 'closed', 'spam')),
  created_at TEXT NOT NULL,
  updated_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at
  ON inquiries (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_inquiries_status_created_at
  ON inquiries (status, created_at DESC);
