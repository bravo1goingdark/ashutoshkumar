import type { Cookies } from '@sveltejs/kit';

const COOKIE = 'wk';

export function checkAuth(cookies: Cookies, writeKey: string | undefined): boolean {
	if (!writeKey) return false;
	return cookies.get(COOKIE) === writeKey;
}

export function setAuthCookie(cookies: Cookies, writeKey: string) {
	cookies.set(COOKIE, writeKey, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/',
		maxAge: 60 * 60 * 24 * 30 // 30 days
	});
}

export function clearAuthCookie(cookies: Cookies) {
	cookies.delete(COOKIE, { path: '/' });
}
