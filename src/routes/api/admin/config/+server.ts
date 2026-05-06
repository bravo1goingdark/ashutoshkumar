import { json, error } from '@sveltejs/kit';
import { checkAuth } from '$lib/server/auth';
import { getAllConfig } from '$lib/server/db';
import { defaultSiteConfig } from '$lib/content/defaults';
import type { RequestHandler } from './$types';
import type { SiteConfig } from '$lib/types';

// GET /api/admin/config — return every section, falling back to defaults for missing keys.
export const GET: RequestHandler = async ({ cookies, platform }) => {
	if (!checkAuth(cookies, platform?.env?.WRITE_KEY)) {
		throw error(401, 'Unauthorized');
	}
	if (!platform?.env?.DB) {
		return json(defaultSiteConfig);
	}
	const raw = await getAllConfig(platform.env.DB);
	const merged = { ...defaultSiteConfig } as SiteConfig & Record<string, unknown>;
	for (const [k, v] of Object.entries(raw)) {
		if (k in merged) {
			(merged as Record<string, unknown>)[k] = v;
		}
	}
	return json(merged);
};
