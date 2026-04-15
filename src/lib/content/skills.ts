import type { SkillTier } from '$lib/types';

export const skillTiers: SkillTier[] = [
	{
		label: 'Production',
		note: 'shipped real work, can interview on it',
		items: [
			'Rust',
			'Go',
			'TypeScript',
			'Java',
			'PostgreSQL',
			'Redis',
			'Docker',
			'Kafka',
			'Linux',
			'Git'
		]
	},
	{
		label: 'Comfortable',
		note: 'built things, still sharpening',
		items: [
			'Python',
			'Node.js',
			'Express',
			'React',
			'Tailwind',
			'AWS (S3 · ECS · Lambda · EC2 · ECR)',
			'gRPC',
			'Prisma',
			'MongoDB',
			'Prometheus',
			'Grafana',
			'OpenTelemetry'
		]
	},
	{
		label: 'Exploring',
		note: 'currently reading / building toy projects',
		items: ['Vector databases', 'RAG pipelines', 'Kubernetes (in depth)', 'WebAssembly', 'eBPF']
	}
];

export const achievements = [
	'Solved 500+ DSA problems on LeetCode (Java)',
	"Dean's List — 6th semester, highest GPA",
	'Founded @themankindproject — Rust OSS org building systems primitives; imgfprint (159 downloads, 9 versions) and fastarena (135 downloads, 4 versions) published on crates.io',
	'4th / 128 — individual hackathon, MUJ ACM',
	'Advanced to finals — Bit to Byte Hackathon, IEEE MUJ'
];
