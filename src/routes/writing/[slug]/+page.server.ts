import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import { getPost } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params, platform }) => {
	if (!platform?.env?.DB) {
		throw error(404, 'Not found');
	}

	const post = await getPost(platform.env.DB, params.slug);
	if (!post || !post.published) {
		throw error(404, 'Post not found');
	}

	const contentHtml = String(marked.parse(post.content));

	return {
		post: {
			slug: post.slug,
			title: post.title,
			description: post.description,
			date: post.date,
			tags: post.tags,
			readTime: post.readTime
		},
		contentHtml
	};
};
