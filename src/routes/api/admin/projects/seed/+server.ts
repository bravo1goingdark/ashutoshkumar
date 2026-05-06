import { json, error } from '@sveltejs/kit';
import { checkAuth } from '$lib/server/auth';
import { seedProjectsIfMissing } from '$lib/server/db';
import { defaultProjects } from '$lib/content/defaults';
import type { RequestHandler } from './$types';

// POST /api/admin/projects/seed — bulk-insert default projects, skipping any
// slugs that already exist. Idempotent.
export const POST: RequestHandler = async ({ cookies, platform }) => {
	if (!checkAuth(cookies, platform?.env?.WRITE_KEY)) {
		throw error(401, 'Unauthorized');
	}
	if (!platform?.env?.DB) throw error(503, 'DB not available');
	const result = await seedProjectsIfMissing(platform.env.DB, defaultProjects);
	return json({ ok: true, ...result });
};
