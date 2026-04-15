import type { RequestHandler } from '@sveltejs/kit';
import { listPosts } from '$lib/server/db';

const SITE_URL = 'https://ashutoshk.pages.dev';
const SITE_TITLE = 'Ashutosh Kumar';
const SITE_DESCRIPTION = 'Notes on systems engineering, Rust, Go, and distributed infrastructure.';

function escape(str: string) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export const GET: RequestHandler = async ({ platform }) => {
	const posts = platform?.env?.DB ? await listPosts(platform.env.DB, true) : [];

	const items = posts
		.map(
			(post) => `
    <item>
      <title>${escape(post.title)}</title>
      <description>${escape(post.description)}</description>
      <link>${SITE_URL}/writing/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/writing/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.tags.map((tag) => `<category>${escape(tag)}</category>`).join('\n      ')}
    </item>`
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(SITE_TITLE)}</title>
    <description>${escape(SITE_DESCRIPTION)}</description>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

	return new Response(xml.trim(), {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'max-age=3600'
		}
	});
};
