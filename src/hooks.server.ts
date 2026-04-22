import type { Handle } from '@sveltejs/kit';

const SECURITY_HEADERS = {
	'X-Frame-Options': 'DENY',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
	'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
};

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
		response.headers.set(key, value);
	}

	return response;
};
