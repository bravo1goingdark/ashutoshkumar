import { checkAuth } from '$lib/server/auth';
import { listPosts } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ cookies, platform }) => {
	const authenticated = checkAuth(cookies, platform?.env?.WRITE_KEY);

	if (!authenticated) {
		return { authenticated: false, posts: [] };
	}

	// DB not available in `npm run dev` (Vite only mode)
	if (!platform?.env?.DB) {
		return { authenticated: true, posts: [], devMode: true };
	}

	const posts = await listPosts(platform.env.DB, false); // include drafts
	return {
		authenticated: true,
		posts: posts.map((p) => ({
			slug: p.slug,
			title: p.title,
			date: p.date,
			published: p.published
		})),
		devMode: false
	};
};
