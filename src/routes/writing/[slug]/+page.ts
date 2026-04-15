import { error } from '@sveltejs/kit';
import type { Post } from '$lib/types';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = async () => {
	const modules = import.meta.glob('/src/posts/*.svx', { eager: true });
	return Object.keys(modules).map((path) => ({
		slug: path.split('/').pop()!.replace('.svx', '')
	}));
};

export async function load({ params }) {
	try {
		const post = await import(`../../../posts/${params.slug}.svx`);
		return {
			content: post.default,
			metadata: post.metadata as Post
		};
	} catch {
		throw error(404, `Post "${params.slug}" not found`);
	}
}
