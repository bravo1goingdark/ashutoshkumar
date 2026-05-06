import { listPosts } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
	if (!platform?.env?.DB) {
		return { recentPosts: [] };
	}
	const posts = await listPosts(platform.env.DB, true, 3);
	setHeaders({
		'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=600'
	});
	return { recentPosts: posts };
};
