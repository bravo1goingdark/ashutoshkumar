import { listPosts } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
	if (!platform?.env?.DB) {
		return { recentPosts: [] };
	}
	const posts = await listPosts(platform.env.DB, true, 3);
	setHeaders({
		'Cache-Control': 'public, max-age=300, s-maxage=300'
	});
	return { recentPosts: posts };
};
