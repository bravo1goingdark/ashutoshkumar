import { json } from '@sveltejs/kit';
import { checkAuth, setAuthCookie, clearAuthCookie } from '$lib/server/auth';
import type { RequestHandler } from './$types';

// Simple in-memory rate limiter for login attempts
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getRateLimitKey(request: Request): string {
	// Use IP address if available, fallback to a generic key
	const forwarded = request.headers.get('x-forwarded-for');
	const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';
	return ip;
}

function checkRateLimit(key: string): { allowed: boolean; retryAfter?: number } {
	const now = Date.now();
	const attempt = loginAttempts.get(key);

	if (!attempt || now > attempt.resetAt) {
		loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
		return { allowed: true };
	}

	attempt.count++;
	if (attempt.count > MAX_ATTEMPTS) {
		const retryAfter = Math.ceil((attempt.resetAt - now) / 1000);
		return { allowed: false, retryAfter };
	}

	return { allowed: true };
}

// POST /api/admin/auth  { key: string }
export const POST: RequestHandler = async ({ request, cookies, platform }) => {
	const rateLimitKey = getRateLimitKey(request);
	const rateLimit = checkRateLimit(rateLimitKey);

	if (!rateLimit.allowed) {
		return json(
			{ error: `Too many login attempts. Try again in ${rateLimit.retryAfter} seconds.` },
			{ status: 429 }
		);
	}

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
