ALTER TABLE posts ADD COLUMN series TEXT DEFAULT '';
ALTER TABLE posts ADD COLUMN series_order INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_posts_series ON posts (series, series_order);
