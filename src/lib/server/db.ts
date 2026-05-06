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
	series: string;
	series_order: number;
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
	series: string;
	series_order: number;
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

function normalize(row: DBRow | ListRow, includeContent = false): Post & { content: string; published: boolean; updatedAt: string; series: string; seriesOrder: number } {
	const dbRow = row as DBRow;
	const words = includeContent && dbRow.content ? dbRow.content.trim().split(/\s+/).length : 0;
	const mins = includeContent ? Math.max(1, Math.ceil(words / 200)) : 0;
	return {
		slug: row.slug,
		title: row.title,
		description: row.description,
		date: row.date,
		tags: parseTags(row.tags),
		readTime: includeContent ? `${mins} min read` : '',
		content: includeContent ? dbRow.content : '',
		published: row.published === 1,
		updatedAt: row.updated_at,
		series: row.series || '',
		seriesOrder: row.series_order || 0
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
	const cols = 'SELECT slug, title, description, date, tags, published, series, series_order, created_at, updated_at';
	const baseQ = publishedOnly
		? `${cols} FROM posts WHERE published = 1 ORDER BY date DESC`
		: `${cols} FROM posts ORDER BY date DESC`;
	const q = limit ? `${baseQ} LIMIT ?` : baseQ;

	const stmt = limit
		? db.prepare(q).bind(limit)
		: db.prepare(q);

	const { results } = await stmt.all<ListRow>();
	return results.map((r) => normalize(r, false));
}

export async function getPost(db: D1Database, slug: string) {
	const row = await db.prepare('SELECT * FROM posts WHERE slug = ?').bind(slug).first<DBRow>();
	return row ? normalize(row, true) : null;
}

export async function getSeriesPosts(db: D1Database, series: string, publishedOnly = true) {
	const cols = 'SELECT slug, title, description, date, tags, published, series, series_order, created_at, updated_at';
	const q = publishedOnly
		? `${cols} FROM posts WHERE series = ? AND published = 1 ORDER BY series_order ASC, date ASC`
		: `${cols} FROM posts WHERE series = ? ORDER BY series_order ASC, date ASC`;
	const { results } = await db.prepare(q).bind(series).all<ListRow>();
	return results.map((r) => normalize(r, false));
}

export async function listSeries(db: D1Database, publishedOnly = true) {
	const q = publishedOnly
		? `SELECT DISTINCT series FROM posts WHERE series != '' AND published = 1 ORDER BY series`
		: `SELECT DISTINCT series FROM posts WHERE series != '' ORDER BY series`;
	const { results } = await db.prepare(q).all<{ series: string }>();
	return results.map((r) => r.series);
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
		series?: string;
		seriesOrder?: number;
	},
	oldSlug?: string
) {
	const slug = validateSlug(data.slug).slice(0, MAX_SLUG_LENGTH);
	const title = (data.title || '').slice(0, MAX_TITLE_LENGTH);
	const description = (data.description || '').slice(0, MAX_DESCRIPTION_LENGTH);
	const content = (data.content || '').slice(0, MAX_CONTENT_LENGTH);
	const tags = data.tags?.filter((t): t is string => typeof t === 'string' && t.length > 0).slice(0, 20) ?? [];
	const series = (data.series || '').trim().slice(0, 200);
	const seriesOrder = data.seriesOrder ?? 0;

	if (oldSlug && oldSlug !== slug) {
		await db.prepare('DELETE FROM posts WHERE slug = ?').bind(oldSlug).run();
	}

	await db
		.prepare(
			`INSERT INTO posts (slug, title, description, date, tags, content, published, series, series_order, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(slug) DO UPDATE SET
         title       = excluded.title,
         description = excluded.description,
         date        = excluded.date,
         tags        = excluded.tags,
         content     = excluded.content,
         published   = excluded.published,
         series      = excluded.series,
         series_order = excluded.series_order,
         updated_at  = excluded.updated_at`
		)
		.bind(
			slug,
			title,
			description,
			data.date,
			JSON.stringify(tags),
			content,
			data.published ? 1 : 0,
			series,
			seriesOrder
		)
		.run();

	return slug;
}

export async function deletePost(db: D1Database, slug: string) {
	await db.prepare('DELETE FROM posts WHERE slug = ?').bind(slug).run();
}
