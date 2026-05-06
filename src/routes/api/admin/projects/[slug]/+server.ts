import { json, error } from '@sveltejs/kit';
import { checkAuth } from '$lib/server/auth';
import { getProject, upsertProject, deleteProject } from '$lib/server/db';
import { validateProject, ValidationError } from '$lib/server/validators';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, cookies, platform }) => {
	if (!checkAuth(cookies, platform?.env?.WRITE_KEY)) {
		throw error(401, 'Unauthorized');
	}
	if (!platform?.env?.DB) throw error(503, 'DB not available');
	const project = await getProject(platform.env.DB, params.slug);
	if (!project) throw error(404, 'Not found');
	return json(project);
};

export const PUT: RequestHandler = async ({ request, params, cookies, platform }) => {
	if (!checkAuth(cookies, platform?.env?.WRITE_KEY)) {
		throw error(401, 'Unauthorized');
	}
	if (!platform?.env?.DB) throw error(503, 'DB not available');
	try {
		const body = await request.json();
		const project = validateProject(body);
		await upsertProject(platform.env.DB, project, params.slug);
		return json({ ok: true, slug: project.slug });
	} catch (e) {
		if (e instanceof ValidationError) throw error(400, e.message);
		throw e;
	}
};

export const DELETE: RequestHandler = async ({ params, cookies, platform }) => {
	if (!checkAuth(cookies, platform?.env?.WRITE_KEY)) {
		throw error(401, 'Unauthorized');
	}
	if (!platform?.env?.DB) throw error(503, 'DB not available');
	await deleteProject(platform.env.DB, params.slug);
	return json({ ok: true });
};
