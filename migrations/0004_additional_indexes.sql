-- Additional indexes for better query performance

-- Index for faster slug lookups in admin (already covered by PRIMARY KEY, but explicit for clarity)
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);

-- Index for filtering by published status alone (used in listPosts)
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts (published);

-- Index for date-based sorting (used in listPosts with ORDER BY date DESC)
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts (date DESC);

-- Index for project slug lookups (already covered by UNIQUE constraint)
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects (slug);

-- Index for sorting projects by sort_order
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects (sort_order ASC);

-- Composite index for admin post listing (published + date + slug for covering index)
CREATE INDEX IF NOT EXISTS idx_posts_admin_list ON posts (published, date DESC, slug, title);
