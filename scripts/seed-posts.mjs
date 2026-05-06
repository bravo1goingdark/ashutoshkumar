/**
 * Seeds existing .svx posts into D1.
 * Run once after applying the migration:
 *   npm run db:migrate
 *   npm run db:seed
 */

import { readFileSync, readdirSync, writeFileSync, unlinkSync } from 'fs';
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
		const colonIdx = line.indexOf(':');
		if (colonIdx === -1) continue;
		const key = line.slice(0, colonIdx).trim();
		let val = line.slice(colonIdx + 1).trim();
		val = val.replace(/^["']|["']$/g, '');
		if (val.startsWith('[')) {
			fm[key] = JSON.parse(val.replace(/'/g, '"'));
		} else {
			fm[key] = val;
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

	// Use parameterized query via wrangler's --command flag
	const cmd = `npx wrangler@latest d1 execute ashutosh-blog --remote --command="INSERT OR IGNORE INTO posts (slug, title, description, date, tags, content, published) VALUES ('${slug.replace(/'/g, "''")}', '${(meta.title || '').replace(/'/g, "''")}', '${(meta.description || '').replace(/'/g, "''")}', '${(meta.date || '').replace(/'/g, "''")}', '${tags.replace(/'/g, "''")}', '${content.replace(/'/g, "''")}', 1);"`;

	try {
		execSync(cmd, { stdio: 'inherit', cwd: root });
		console.log(`✓ seeded: ${slug}`);
	} catch (err) {
		console.error(`✗ failed: ${slug}`);
	}
}
