import { json, error } from '@sveltejs/kit';
import { checkAuth } from '$lib/server/auth';
import type { RequestHandler } from './$types';

// POST /api/admin/posts/preview — render markdown to HTML for preview
export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!checkAuth(cookies, undefined)) {
		throw error(401, 'Unauthorized');
	}

	const { content } = (await request.json()) as { content?: string };
	
	if (!content) {
		return json({ html: '' });
	}

	// Return the content as-is, the client will render it with marked
	return json({ content });
};
