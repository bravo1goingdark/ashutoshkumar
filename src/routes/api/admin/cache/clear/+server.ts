import { json, error } from '@sveltejs/kit';
import { checkAuth } from '$lib/server/auth';
import { listPosts } from '$lib/server/db';
import type { RequestHandler } from './$types';

// POST /api/admin/cache/clear — purge the local CF edge cache for the public
// pages whose responses are cached via Cache-Control s-maxage. Cloudflare's
// caches.default is a per-data-center cache, so this clears the region the
// admin is connected to. Other regions revalidate naturally as their s-maxage
// (60s home / 5min writing index / 1h post + rss) expires.
export const POST: RequestHandler = async ({ cookies, platform, url }) => {
	if (!checkAuth(cookies, platform?.env?.WRITE_KEY)) {
		throw error(401, 'Unauthorized');
	}

	const cache = platform?.caches?.default;
	if (!cache) {
		// Local dev / no platform: nothing to clear, but report success so the UI doesn't error.
		return json({ ok: true, cleared: 0, total: 0, dev: true });
	}

	const paths = new Set<string>(['/', '/writing', '/rss.xml']);

	if (platform?.env?.DB) {
		const posts = await listPosts(platform.env.DB, true);
		for (const p of posts) paths.add(`/writing/${p.slug}`);
	}

	const origin = url.origin;
	const results = await Promise.all(
		Array.from(paths).map(async (path) => {
			const wasCached = await cache.delete(new Request(origin + path));
			return { path, cleared: wasCached };
		})
	);

	const cleared = results.filter((r) => r.cleared).length;
	return json({ ok: true, cleared, total: results.length, details: results });
};
