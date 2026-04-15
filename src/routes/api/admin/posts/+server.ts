import { json, error } from '@sveltejs/kit';
import { checkAuth } from '$lib/server/auth';
import { listPosts, upsertPost } from '$lib/server/db';
import type { RequestHandler } from './$types';

// GET /api/admin/posts  — list (including drafts)
export const GET: RequestHandler = async ({ cookies, platform }) => {
	if (!checkAuth(cookies, platform?.env?.WRITE_KEY)) {
		throw error(401, 'Unauthorized');
	}
	if (!platform?.env?.DB) {
		return json([]);
	}
	const posts = await listPosts(platform.env.DB, false);
	return json(
		posts.map((p) => ({ slug: p.slug, title: p.title, date: p.date, published: p.published }))
	);
};

// POST /api/admin/posts  — create
export const POST: RequestHandler = async ({ request, cookies, platform }) => {
	if (!checkAuth(cookies, platform?.env?.WRITE_KEY)) {
		throw error(401, 'Unauthorized');
	}
	if (!platform?.env?.DB) {
		throw error(503, 'DB not available');
	}

	const body = (await request.json()) as {
		slug: string;
		title: string;
		description: string;
		date: string;
		tags: string[];
		content: string;
		published: boolean;
	};

	if (!body.slug || !body.title || !body.date) {
		throw error(400, 'slug, title and date are required');
	}

	await upsertPost(platform.env.DB, body);
	return json({ ok: true });
};
