import { json, error } from '@sveltejs/kit';
import { checkAuth } from '$lib/server/auth';
import { reorderProjects } from '$lib/server/db';
import type { RequestHandler } from './$types';

// PUT /api/admin/projects/order  body: { slugs: string[] }
export const PUT: RequestHandler = async ({ request, cookies, platform }) => {
	if (!checkAuth(cookies, platform?.env?.WRITE_KEY)) {
		throw error(401, 'Unauthorized');
	}
	if (!platform?.env?.DB) throw error(503, 'DB not available');
	const body = (await request.json()) as { slugs?: unknown };
	if (!Array.isArray(body.slugs) || !body.slugs.every((s) => typeof s === 'string')) {
		throw error(400, 'slugs must be string[]');
	}
	await reorderProjects(platform.env.DB, body.slugs);
	return json({ ok: true });
};
