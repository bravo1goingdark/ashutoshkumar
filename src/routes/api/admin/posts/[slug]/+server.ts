import { json, error } from '@sveltejs/kit';
import { checkAuth } from '$lib/server/auth';
import { getPost, upsertPost, deletePost } from '$lib/server/db';
import type { RequestHandler } from './$types';

// GET /api/admin/posts/[slug]  — full post for editor
export const GET: RequestHandler = async ({ params, cookies, platform }) => {
	if (!checkAuth(cookies, platform?.env?.WRITE_KEY)) {
		throw error(401, 'Unauthorized');
	}
	if (!platform?.env?.DB) {
		throw error(503, 'DB not available');
	}
	const post = await getPost(platform.env.DB, params.slug);
	if (!post) throw error(404, 'Not found');
	return json(post);
};

// PUT /api/admin/posts/[slug]  — update
export const PUT: RequestHandler = async ({ request, params, cookies, platform }) => {
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

	// allow slug rename: delete old, insert new
	if (body.slug !== params.slug) {
		await deletePost(platform.env.DB, params.slug);
	}

	await upsertPost(platform.env.DB, body);
	return json({ ok: true, slug: body.slug });
};

// DELETE /api/admin/posts/[slug]
export const DELETE: RequestHandler = async ({ params, cookies, platform }) => {
	if (!checkAuth(cookies, platform?.env?.WRITE_KEY)) {
		throw error(401, 'Unauthorized');
	}
	if (!platform?.env?.DB) {
		throw error(503, 'DB not available');
	}

	await deletePost(platform.env.DB, params.slug);
	return json({ ok: true });
};
