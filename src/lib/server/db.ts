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

interface ListRow {
	slug: string;
	title: string;
	description: string;
	date: string;
	tags: string;
	published: number;
	created_at: string;
	updated_at: string;
}

function parseTags(json: string): string[] {
	try {
		const parsed = JSON.parse(json);
		return Array.isArray(parsed) ? parsed.filter((t): t is string => typeof t === 'string') : [];
	} catch {
		return [];
	}
}

function normalize(row: DBRow): Post & { content: string; published: boolean; updatedAt: string } {
	const words = row.content.trim().split(/\s+/).length;
	const mins = Math.max(1, Math.ceil(words / 200));
	return {
		slug: row.slug,
		title: row.title,
		description: row.description,
		date: row.date,
		tags: parseTags(row.tags),
		readTime: `${mins} min read`,
		content: row.content,
		published: row.published === 1,
		updatedAt: row.updated_at
	};
}

function normalizeList(row: ListRow): Post & { content: string; published: boolean; updatedAt: string } {
	return {
		slug: row.slug,
		title: row.title,
		description: row.description,
		date: row.date,
		tags: parseTags(row.tags),
		readTime: '',
		content: '',
		published: row.published === 1,
		updatedAt: row.updated_at
	};
}

function validateSlug(slug: string): string {
	return slug
		.toLowerCase()
		.replace(/[^a-z0-9-]/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 200);
}

export async function listPosts(db: D1Database, publishedOnly = true, limit?: number) {
	const cols = 'SELECT slug, title, description, date, tags, published, created_at, updated_at';
	const baseQ = publishedOnly
		? `${cols} FROM posts WHERE published = 1 ORDER BY date DESC`
		: `${cols} FROM posts ORDER BY date DESC`;
	const q = limit ? `${baseQ} LIMIT ?` : baseQ;
	
	const stmt = limit 
		? db.prepare(q).bind(limit)
		: db.prepare(q);
	
	const { results } = await stmt.all<ListRow>();
	return results.map(normalizeList);
}

export async function getPost(db: D1Database, slug: string) {
	const row = await db.prepare('SELECT * FROM posts WHERE slug = ?').bind(slug).first<DBRow>();
	return row ? normalize(row) : null;
}

const MAX_SLUG_LENGTH = 200;
const MAX_TITLE_LENGTH = 500;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_CONTENT_LENGTH = 500_000;

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
	const slug = validateSlug(data.slug).slice(0, MAX_SLUG_LENGTH);
	const title = (data.title || '').slice(0, MAX_TITLE_LENGTH);
	const description = (data.description || '').slice(0, MAX_DESCRIPTION_LENGTH);
	const content = (data.content || '').slice(0, MAX_CONTENT_LENGTH);
	const tags = data.tags?.filter((t): t is string => typeof t === 'string' && t.length > 0).slice(0, 20) ?? [];

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
			slug,
			title,
			description,
			data.date,
			JSON.stringify(tags),
			content,
			data.published ? 1 : 0
		)
		.run();
	
	return slug;
}

export async function deletePost(db: D1Database, slug: string) {
	await db.prepare('DELETE FROM posts WHERE slug = ?').bind(slug).run();
}
