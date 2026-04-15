import { listPosts } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ platform }) => {
	// DB not available in `npm run dev` (Vite-only). Falls back to empty list.
	if (!platform?.env?.DB) {
		return { recentPosts: [] };
	}
	const posts = await listPosts(platform.env.DB, true);
	return { recentPosts: posts.slice(0, 3) };
};
