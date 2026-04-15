import type { Post } from '$lib/types';

export async function load() {
	const modules = import.meta.glob('/src/posts/*.svx', { eager: true });

	const posts: Post[] = Object.entries(modules)
		.map(([path, module]) => {
			const slug = path.split('/').pop()?.replace('.svx', '') ?? '';
			const { metadata } = module as { metadata: Post };
			return { slug, ...metadata };
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return { posts };
}
