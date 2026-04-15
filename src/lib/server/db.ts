import type { D1Database } from '@cloudflare/workers-types';
import type { Post } from '$lib/types';

interface DBRow {
	slug: string;
	title: string;
	description: string;
	date: string;
	tags: string;
	content: string;
	published: number;
	created_at: string;
	updated_at: string;
}

function normalize(row: DBRow): Post & { content: string; published: boolean; updatedAt: string } {
	const words = row.content.trim().split(/\s+/).length;
	const mins = Math.max(1, Math.ceil(words / 200));
	return {
		slug: row.slug,
		title: row.title,
		description: row.description,
		date: row.date,
		tags: JSON.parse(row.tags) as string[],
		readTime: `${mins} min read`,
		content: row.content,
		published: row.published === 1,
		updatedAt: row.updated_at
	};
}

export async function listPosts(db: D1Database, publishedOnly = true) {
	const q = publishedOnly
		? 'SELECT * FROM posts WHERE published = 1 ORDER BY date DESC'
		: 'SELECT * FROM posts ORDER BY date DESC';
	const { results } = await db.prepare(q).all<DBRow>();
	return results.map(normalize);
}

export async function getPost(db: D1Database, slug: string) {
	const row = await db.prepare('SELECT * FROM posts WHERE slug = ?').bind(slug).first<DBRow>();
	return row ? normalize(row) : null;
}

export async function upsertPost(
	db: D1Database,
	data: {
		slug: string;
		title: string;
		description: string;
		date: string;
		tags: string[];
		content: string;
		published: boolean;
	}
) {
	await db
		.prepare(
			`INSERT INTO posts (slug, title, description, date, tags, content, published, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(slug) DO UPDATE SET
         title       = excluded.title,
         description = excluded.description,
         date        = excluded.date,
         tags        = excluded.tags,
         content     = excluded.content,
         published   = excluded.published,
         updated_at  = excluded.updated_at`
		)
		.bind(
			data.slug,
			data.title,
			data.description,
			data.date,
			JSON.stringify(data.tags),
			data.content,
			data.published ? 1 : 0
		)
		.run();
}

export async function deletePost(db: D1Database, slug: string) {
	await db.prepare('DELETE FROM posts WHERE slug = ?').bind(slug).run();
}
