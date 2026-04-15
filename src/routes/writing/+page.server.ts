import { listPosts } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ platform }) => {
	if (!platform?.env?.DB) {
		return { posts: [] };
	}
	const posts = await listPosts(platform.env.DB, true);
	return { posts };
};
