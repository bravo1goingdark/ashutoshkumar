CREATE TABLE IF NOT EXISTS posts (
  slug        TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  date        TEXT NOT NULL,
  tags        TEXT NOT NULL DEFAULT '[]',  -- JSON array string
  content     TEXT NOT NULL DEFAULT '',
  published   INTEGER NOT NULL DEFAULT 0,  -- 0 = draft, 1 = published
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_posts_published_date ON posts (published, date DESC);
