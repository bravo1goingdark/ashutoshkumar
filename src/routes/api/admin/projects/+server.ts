import { json, error } from '@sveltejs/kit';
import { checkAuth } from '$lib/server/auth';
import { listProjects, upsertProject } from '$lib/server/db';
import { ensureProjectsSeeded } from '$lib/server/seed';
import { validateProject, ValidationError } from '$lib/server/validators';
import type { RequestHandler } from './$types';

// GET /api/admin/projects — full ordered list.
export const GET: RequestHandler = async ({ cookies, platform }) => {
	if (!checkAuth(cookies, platform?.env?.WRITE_KEY)) {
		throw error(401, 'Unauthorized');
	}
	if (!platform?.env?.DB) return json([]);
	const projects = await listProjects(platform.env.DB);
	return json(projects);
};

// POST /api/admin/projects — create.
export const POST: RequestHandler = async ({ request, cookies, platform }) => {
	if (!checkAuth(cookies, platform?.env?.WRITE_KEY)) {
		throw error(401, 'Unauthorized');
	}
	if (!platform?.env?.DB) throw error(503, 'DB not available');
	try {
		const body = await request.json();
		const project = validateProject(body);
		await ensureProjectsSeeded(platform.env.DB, project.slug);
		await upsertProject(platform.env.DB, project);
		return json({ ok: true, slug: project.slug });
	} catch (e) {
		if (e instanceof ValidationError) throw error(400, e.message);
		throw e;
	}
};
