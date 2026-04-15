import type { Project } from '$lib/types';

export const projects: Project[] = [
	{
		number: '01',
		name: 'Obol',
		year: '2026',
		tagline: 'AI API cost tracker — unified spend dashboard for OpenAI, Anthropic, Google, OpenRouter.',
		description:
			"Full-stack SaaS on Cloudflare's edge: SvelteKit on Pages, D1 (SQLite) for storage, a standalone cron worker for hourly usage syncs, budget alerts with email + Slack, and AES-256-GCM encryption for every API key at rest.",
		stack: ['TypeScript', 'SvelteKit', 'Cloudflare D1', 'Cloudflare KV', 'Lemon Squeezy', 'Resend'],
		url: 'https://useobol.pages.dev',
		featured: true,
		metrics: [
			'Hourly KV-locked cron worker syncs usage incrementally across 4 providers — idempotent upserts prevent double-counting on concurrent deploys',
			'daily_rollups pre-aggregation: overview renders from 30 rows, not thousands of usage_records',
			'Budget alerts with timezone-aware period math, email + Slack, deduped via last_triggered_at — no double-fire within the same window',
			'AES-256-GCM encryption for all API keys and Slack webhooks before insert — ciphertext columns excluded from every list query',
			'Magic-link auth (SHA-256 hashed token, 15-min TTL) + KV sessions — zero passwords in the database',
			'Constant-time HMAC-SHA256 Lemon Squeezy webhook verification + test-mode guard to prevent silent $0 Pro upgrades'
		]
	},
	{
		number: '02',
		name: 'Clairo',
		year: '2025',
		tagline: 'Kafka-driven async video transcoding pipeline — S3 → FFmpeg → ECS → multi-res.',
		description:
			'A TypeScript pipeline that ingests video upload events via Kafka, fans them out to ECS workers running FFmpeg, and stores 360p / 720p / 1080p outputs back in S3 — a YouTube-style async processing architecture without the SaaS tax.',
		stack: ['TypeScript', 'AWS ECS', 'Kafka', 'FFmpeg', 'S3'],
		github: 'https://github.com/bravo1goingdark/clairo',
		featured: true,
		metrics: [
			'Kafka topic partitioning for parallel multi-resolution transcoding — 360p, 720p, 1080p in one pass',
			'ECS task auto-scaling tied to consumer lag — spins up workers on demand, idles at zero cost',
			'S3 pre-signed URL workflow for secure upload ingestion and output delivery (no public buckets)',
			'Fully async end-to-end: producer acknowledges immediately, consumers commit offsets — zero polling loops'
		]
	},
	{
		number: '03',
		name: 'Mailgrid',
		year: '2025',
		tagline: 'Offline-first bulk email CLI — CSV, Sheets, SMTP, 10k+ recipients.',
		description:
			'A Go CLI for sending personalised HTML email campaigns without SaaS. CSV and Google Sheets input, Go templates, any SMTP server, worker-pool dispatch. Ships as a single static binary for Windows, macOS, and Linux.',
		stack: ['Go', 'SMTP', 'Worker pool', 'Token bucket'],
		github: 'https://github.com/bravo1goingdark/mailgrid',
		url: 'https://blipmq.dev/mailgrid',
		stars: 26,
		featured: true,
		caseStudy: '/writing/mailgrid-architecture',
		metrics: [
			'Worker-pool SMTP dispatch with connection reuse — 40% throughput gain over per-send dialing',
			'Token-bucket rate limiting (configurable msg/sec + burst) to stay under provider limits',
			'Exponential backoff retry that distinguishes transient 4xx from permanent 5xx failures',
			'AND/OR/NOT rule engine over CSV columns — cut bounce rate by 10% on real campaigns',
			'~450 emails/sec on commodity hardware · 18 MB resident for 100k-row CSV (streaming)'
		]
	},
	{
		number: '04',
		name: 'UCFP',
		year: '2025',
		tagline: 'Universal content fingerprinting — near-duplicate text and video detection in Rust.',
		stack: ['Rust', 'MinHash + LSH', 'SimHash', 'pHash + DTW', 'redb'],
		github: 'https://github.com/bravo1goingdark/ucfp',
		url: 'https://bravo1goingdark.github.io/ucfp/',
		stars: 6
	},
	{
		number: '05',
		name: 'imgfprint',
		year: '2026',
		tagline: 'High-performance image fingerprinting library — 159 downloads · 9 versions on crates.io.',
		stack: ['Rust', 'crates.io', 'pHash', 'Rayon'],
		github: 'https://github.com/themankindproject/imgfprint-rs',
		stars: 12
	},
	{
		number: '06',
		name: 'fastarena',
		year: '2026',
		tagline: 'Zero-dependency bump-pointer arena allocator — RAII transactions, savepoints · 135 downloads on crates.io.',
		stack: ['Rust', 'crates.io'],
		github: 'https://github.com/themankindproject/fastarena-rs',
		stars: 3
	},
	{
		number: '07',
		name: 'BlipMQ',
		year: '2026',
		tagline: 'Lightweight pub/sub message broker — Rust, zero-alloc SPSC, custom TCP framing.',
		stack: ['Rust', 'Tokio', 'Custom TCP framing'],
		github: 'https://github.com/bravo1goingdark/blipmq',
		url: 'https://blipmq.dev',
		stars: 22
	}
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
