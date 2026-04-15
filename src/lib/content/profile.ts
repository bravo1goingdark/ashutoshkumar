import type { Stat, AIProject } from '$lib/types';

export const profile = {
	name: 'Ashutosh Kumar',
	handle: 'bravo1goingdark',
	role: 'Backend & Systems Engineer',
	tagline: 'Rust · Go · TypeScript',
	bio: "I build backend systems that run in production — SaaS platforms with auth and billing, bulk email dispatch engines, video transcoding pipelines. I care about throughput, latency, and correctness; the language is a tool, not the point.",
	education:
		"Final-year CS at Manipal University Jaipur. GPA 8.61/10, Dean's List. Graduating July 2026.",
	location: 'India',
	available: true,
	availableDate: 'Immediately',
	email: 'kumarashutosh34169@gmail.com',
	socials: {
		github: 'https://github.com/bravo1goingdark',
		linkedin: 'https://linkedin.com/in/bravo1goingdark',
		x: 'https://x.com/bravo1goingdark',
		clairo: 'https://github.com/bravo1goingdark/clairo',
		leetcode: 'https://leetcode.com/u/bravo1goingdark/',
		mankind: 'https://github.com/themankindproject/'
	}
} as const;

// ── Stats band for the hero ───────────────────────────────
export const stats: Stat[] = [
	{
		value: '8.61',
		label: 'GPA',
		detail: "MUJ CS '26 · Dean's List"
	},
	{
		value: '80★',
		label: 'OSS STARS',
		detail: 'across all public repos'
	},
	{
		value: '500+',
		label: 'LEETCODE',
		detail: 'Java · DSA'
	},
	{
		value: '35% ↓',
		label: 'API LATENCY',
		detail: 'Bindisa internship'
	}
];

// ── What I'm looking for ──────────────────────────────────
export const hiring = {
	status: 'Open to full-time roles. Available immediately.',
	roles: [
		'SDE-1 / Junior Backend Engineer',
		'Infrastructure / Platform Engineer',
		'Systems / Distributed Systems Engineer',
		'Developer Tools / DX Engineer'
	],
	domains: [
		'Distributed systems, databases, message queues',
		'Developer tools, CLIs, compilers, runtimes',
		'Infrastructure, observability, performance',
		'LLM inference, RAG, vector search, AI infra'
	],
	openTo: ['Full-time', 'Internship', 'Remote', 'India', 'Relocatable'],
	notLookingFor:
		'Pure frontend roles, AI research positions, or "full-stack" roles that are 80% UI.'
};

// ── AI stance ─────────────────────────────────────────────
export const ai = {
	heading: "I'm a systems engineer in an AI era — not an AI engineer. That distinction matters.",
	paragraphs: [
		"I use AI daily. Claude Code and Copilot have compressed my feedback loop — they handle the boilerplate so I stay focused on system design and tradeoffs. What I don't trust AI for: architecture decisions, correctness guarantees, or anything where the failure mode is silent.",
		'For shipping AI features in production: retries, rate limits, fallbacks, observability — the hard problems still live in the backend. Embeddings are the new indexes. Vector databases are the new Redis. RAG pipelines are the new REST APIs. The AI era needs more systems engineers, not fewer.',
		'My conviction is simple: AI raises the floor, not the ceiling. Correctness, observability, and cost still live at the systems layer. Count me in.'
	]
};

export const aiProjects: AIProject[] = [
	{
		name: 'DesignSight',
		description:
			'MERN app with Google Vision analysis for coordinate-anchored UI feedback. Role-based views, threaded comments, PDF/JSON exports.',
		stack: 'Google Vision · MERN · Docker',
		github: 'https://github.com/bravo1goingdark/designsight-mvp'
	},
	{
		name: 'Music Genre Classifier',
		description:
			'Hybrid CNN+LSTM on MFCC features, trained on the GTZAN dataset. Predicts genre from raw audio.',
		stack: 'TensorFlow · Keras · Librosa',
		github: 'https://github.com/bravo1goingdark/Music-Genre-Classification-Using-CNN-LSTM'
	},
	{
		name: 'FRQI Quantum Watermarking',
		description:
			'Experimental digital watermarking via Flexible Representation of Quantum Images on NISQ-era hardware (IBM Brisbane, 127 qubits).',
		stack: 'Qiskit · Python · NISQ',
		github: 'https://github.com/bravo1goingdark/FRQI-Quantum-Watermarking-On-NISQ-Hardware'
	}
];
