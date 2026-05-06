import type { D1Database } from '@cloudflare/workers-types';
import { defaultProjects } from '$lib/content/defaults';
import { seedProjectsIfMissing } from './db';

// Bulk-seed the projects table from TS defaults the first time it would
// otherwise stay empty. Called from POST/PUT so the user's first edit doesn't
// leave the public site with a single project (the all-or-nothing fallback in
// +layout.server.ts switches to D1-only as soon as one row exists).
//
// excludeSlug skips the slug being saved by the caller — they'll insert it
// themselves with the user's edits, so we shouldn't seed the default version
// over their changes.
export async function ensureProjectsSeeded(
	db: D1Database,
	excludeSlug?: string
): Promise<void> {
	const row = await db
		.prepare('SELECT COUNT(*) AS c FROM projects')
		.first<{ c: number }>();
	if ((row?.c ?? 0) > 0) return;
	const others = defaultProjects.filter((d) => d.slug !== excludeSlug);
	await seedProjectsIfMissing(db, others);
}
