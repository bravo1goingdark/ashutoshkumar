-- Singleton configuration sections stored as JSON blobs.
-- One row per section (profile, stats, hiring, ai, aiProjects, howIBuild,
-- experience, education, skillTiers, achievements).
CREATE TABLE IF NOT EXISTS site_config (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,                       -- JSON
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Projects are normalised so image, featured, and ordering are first-class columns.
CREATE TABLE IF NOT EXISTS projects (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT UNIQUE NOT NULL,
  number       TEXT NOT NULL DEFAULT '',
  name         TEXT NOT NULL,
  year         TEXT NOT NULL DEFAULT '',
  tagline      TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',
  stack        TEXT NOT NULL DEFAULT '[]',         -- JSON array of strings
  metrics      TEXT NOT NULL DEFAULT '[]',         -- JSON array of strings
  image        TEXT NOT NULL DEFAULT '',           -- /images/<key> from R2 upload, or empty
  github       TEXT NOT NULL DEFAULT '',
  url          TEXT NOT NULL DEFAULT '',
  case_study   TEXT NOT NULL DEFAULT '',
  stars        INTEGER NOT NULL DEFAULT 0,
  featured     INTEGER NOT NULL DEFAULT 0,         -- 0 = also-built, 1 = flagship
  sort_order   INTEGER NOT NULL DEFAULT 0,
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_projects_featured_order
  ON projects (featured DESC, sort_order ASC);
