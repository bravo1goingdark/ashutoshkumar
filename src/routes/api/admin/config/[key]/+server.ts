import { json, error } from '@sveltejs/kit';
import { checkAuth } from '$lib/server/auth';
import { setConfig } from '$lib/server/db';
import {
	sectionValidators,
	isSectionKey,
	ValidationError
} from '$lib/server/validators';
import type { RequestHandler } from './$types';

// PUT /api/admin/config/[key] — replace one section's JSON value.
export const PUT: RequestHandler = async ({ request, params, cookies, platform }) => {
	if (!checkAuth(cookies, platform?.env?.WRITE_KEY)) {
		throw error(401, 'Unauthorized');
	}
	if (!platform?.env?.DB) {
		throw error(503, 'DB not available');
	}
	const key = params.key;
	if (!isSectionKey(key)) {
		throw error(400, `Unknown section: ${key}`);
	}

	const body = await request.json();
	try {
		const validator = sectionValidators[key];
		const value = (validator as (i: unknown) => unknown)(body);
		await setConfig(platform.env.DB, key, value);
		return json({ ok: true, key, value });
	} catch (e) {
		if (e instanceof ValidationError) throw error(400, e.message);
		throw e;
	}
};
