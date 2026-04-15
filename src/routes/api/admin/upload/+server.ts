import { json, error } from '@sveltejs/kit';
import { checkAuth } from '$lib/server/auth';
import type { RequestHandler } from './$types';

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml']);

export const POST: RequestHandler = async ({ request, cookies, platform }) => {
	if (!checkAuth(cookies, platform?.env?.WRITE_KEY)) {
		throw error(401, 'Unauthorized');
	}
	if (!platform?.env?.IMAGES) {
		throw error(503, 'Image storage not configured');
	}

	const form = await request.formData();
	const file = form.get('file') as File | null;
	if (!file || !file.name) throw error(400, 'No file');
	if (file.size > MAX_BYTES) throw error(413, 'Max file size is 10 MB');
	if (!ALLOWED.has(file.type)) throw error(415, 'Unsupported image type');

	const safe = file.name
		.toLowerCase()
		.replace(/[^a-z0-9._-]/g, '-')
		.replace(/-+/g, '-');
	const key = `${Date.now()}-${safe}`;

	await platform.env.IMAGES.put(key, await file.arrayBuffer(), {
		httpMetadata: { contentType: file.type }
	});

	return json({ url: `/images/${key}` });
};
