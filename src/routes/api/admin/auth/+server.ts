import { json } from '@sveltejs/kit';
import { checkAuth, setAuthCookie, clearAuthCookie } from '$lib/server/auth';
import type { RequestHandler } from './$types';

// POST /api/admin/auth  { key: string }
export const POST: RequestHandler = async ({ request, cookies, platform }) => {
	const { key } = (await request.json()) as { key: string };
	const writeKey = platform?.env?.WRITE_KEY;

	if (!writeKey) {
		return json({ error: 'WRITE_KEY not configured' }, { status: 503 });
	}
	if (!key || key !== writeKey) {
		// Constant-time-ish: always do the comparison regardless
		return json({ error: 'Invalid key' }, { status: 401 });
	}

	setAuthCookie(cookies, writeKey);
	return json({ ok: true });
};

// DELETE /api/admin/auth  — sign out
export const DELETE: RequestHandler = async ({ cookies }) => {
	clearAuthCookie(cookies);
	return json({ ok: true });
};
