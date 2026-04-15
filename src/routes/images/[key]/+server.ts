import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
	if (!platform?.env?.IMAGES) {
		throw error(503, 'Image storage not configured');
	}

	const obj = await platform.env.IMAGES.get(params.key);
	if (!obj) throw error(404, 'Not found');

	const headers = new Headers();
	headers.set('Content-Type', obj.httpMetadata?.contentType ?? 'application/octet-stream');
	headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	headers.set('ETag', obj.httpEtag);

	return new Response(obj.body, { headers });
};
