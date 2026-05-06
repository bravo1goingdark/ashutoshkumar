import { listPosts, listSeries } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
	if (!platform?.env?.DB) {
		return { posts: [], series: [] };
	}
	const [posts, series] = await Promise.all([
		listPosts(platform.env.DB, true),
		listSeries(platform.env.DB, true)
	]);
	setHeaders({
		'Cache-Control': 'public, max-age=300, s-maxage=300'
	});
	return { posts, series };
};
