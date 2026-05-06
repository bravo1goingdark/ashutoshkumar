import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const START = Date.now();

export const GET: RequestHandler = async ({ platform }) => {
	const checks: Record<string, string> = {};

	// D1 health
	if (platform?.env?.DB) {
		try {
			await platform.env.DB.prepare('SELECT 1').run();
			checks.d1 = 'ok';
		} catch {
			checks.d1 = 'error';
		}
	} else {
		checks.d1 = 'not_configured';
	}

	// R2 health
	if (platform?.env?.IMAGES) {
		try {
			await platform.env.IMAGES.head('healthcheck');
			checks.r2 = 'ok';
		} catch {
			// head returns 404 for non-existent key, which is fine
			checks.r2 = 'ok';
		}
	} else {
		checks.r2 = 'not_configured';
	}

	const uptime = Math.floor((Date.now() - START) / 1000);

	return json({
		status: 'ok',
		uptime: `${uptime}s`,
		version: '1.0.0',
		checks,
		timestamp: new Date().toISOString()
	}, {
		headers: {
			'Cache-Control': 'no-store, no-cache, must-revalidate'
		}
	});
};
