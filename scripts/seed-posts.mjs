/**
 * Seeds existing .svx posts into D1.
 * Run once after applying the migration:
 *   npm run db:migrate
 *   npm run db:seed
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const postsDir = join(root, 'src', 'posts');

function parseFrontmatter(src) {
	const match = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) return null;
	const fm = {};
	for (const line of match[1].split('\n')) {
		const [key, ...rest] = line.split(':');
		if (!key) continue;
		let val = rest.join(':').trim();
		// strip quotes
		val = val.replace(/^["']|["']$/g, '');
		// handle arrays like ["a", "b"]
		if (val.startsWith('[')) {
			fm[key.trim()] = JSON.parse(val.replace(/'/g, '"'));
		} else {
			fm[key.trim()] = val;
		}
	}
	return { meta: fm, content: match[2].trim() };
}

const files = readdirSync(postsDir).filter((f) => f.endsWith('.svx'));

for (const file of files) {
	const slug = file.replace('.svx', '');
	const src = readFileSync(join(postsDir, file), 'utf8');
	const parsed = parseFrontmatter(src);
	if (!parsed) {
		console.warn(`Skipping ${file}: could not parse frontmatter`);
		continue;
	}
	const { meta, content } = parsed;
	const tags = JSON.stringify(Array.isArray(meta.tags) ? meta.tags : []);
	// Escape single quotes for SQL
	const esc = (s) => String(s ?? '').replace(/'/g, "''");

	const sql = `INSERT OR IGNORE INTO posts (slug, title, description, date, tags, content, published)
VALUES ('${esc(slug)}', '${esc(meta.title)}', '${esc(meta.description)}', '${esc(meta.date)}', '${esc(tags)}', '${esc(content)}', 1);`;

	const tmpFile = join(root, '.seed-tmp.sql');
	import('fs').then(({ writeFileSync, unlinkSync }) => {
		writeFileSync(tmpFile, sql, 'utf8');
		try {
			execSync(`npx wrangler@latest d1 execute ashutosh-blog --remote --file="${tmpFile}"`, {
				stdio: 'inherit',
				cwd: root
			});
			console.log(`✓ seeded: ${slug}`);
		} finally {
			unlinkSync(tmpFile);
		}
	});
}
