import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import { getPost, getSeriesPosts } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ params, platform, setHeaders }) => {
	if (!platform?.env?.DB) {
		throw error(404, 'Not found');
	}

	const post = await getPost(platform.env.DB, params.slug);
	if (!post || !post.published) {
		throw error(404, 'Post not found');
	}

	const contentHtml = String(await marked.parse(post.content));

	let seriesPosts: { slug: string; title: string; seriesOrder: number }[] = [];
	if (post.series) {
		const siblings = await getSeriesPosts(platform.env.DB, post.series, true);
		seriesPosts = siblings.map((p) => ({ slug: p.slug, title: p.title, seriesOrder: p.seriesOrder }));
	}

	setHeaders({
		'Cache-Control': 'public, max-age=3600, s-maxage=3600'
	});

	return {
		post: {
			slug: post.slug,
			title: post.title,
			description: post.description,
			date: post.date,
			tags: post.tags,
			readTime: post.readTime,
			series: post.series,
			seriesOrder: post.seriesOrder
		},
		contentHtml,
		seriesPosts
	};
};
