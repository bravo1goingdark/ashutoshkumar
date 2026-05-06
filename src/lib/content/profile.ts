import type {
	Stat,
	AIProject,
	Profile,
	Hiring,
	AiSection,
	HowIBuild,
	SiteSections
} from '$lib/types';

export const defaultProfile: Profile = {
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
	photo: 'https://avatars.githubusercontent.com/u/70029422?v=4',
	resumeUrl: '/ashutosh-kumar.pdf',
	socials: {
		github: 'https://github.com/bravo1goingdark',
		linkedin: 'https://linkedin.com/in/bravo1goingdark',
		x: 'https://x.com/bravo1goingdark',
		clairo: 'https://github.com/bravo1goingdark/clairo',
		leetcode: 'https://leetcode.com/u/bravo1goingdark/',
		mankind: 'https://github.com/themankindproject/'
	},
	seo: {
		title: "Ashutosh Kumar — Backend Engineer · Available Immediately",
		description:
			"Backend & systems engineer building high-performance infrastructure in Rust and Go. MUJ CS '26, open to SDE-1 / Backend / Infrastructure roles."
	}
};

export const defaultStats: Stat[] = [
	{ value: '8.61', label: 'GPA', detail: "MUJ CS '26 · Dean's List" },
	{ value: '80★', label: 'OSS STARS', detail: 'across all public repos' },
	{ value: '500+', label: 'LEETCODE', detail: 'Java · DSA' },
	{ value: '35% ↓', label: 'API LATENCY', detail: 'Bindisa internship' }
];

export const defaultHiring: Hiring = {
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

export const defaultAi: AiSection = {
	heading: "I'm a systems engineer in an AI era — not an AI engineer. That distinction matters.",
	paragraphs: [
		"I use AI daily. Claude Code and Copilot have compressed my feedback loop — they handle the boilerplate so I stay focused on system design and tradeoffs. What I don't trust AI for: architecture decisions, correctness guarantees, or anything where the failure mode is silent.",
		'For shipping AI features in production: retries, rate limits, fallbacks, observability — the hard problems still live in the backend. Embeddings are the new indexes. Vector databases are the new Redis. RAG pipelines are the new REST APIs. The AI era needs more systems engineers, not fewer.',
		'My conviction is simple: AI raises the floor, not the ceiling. Correctness, observability, and cost still live at the systems layer. Count me in.'
	]
};

export const defaultAiProjects: AIProject[] = [
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

export const defaultSections: SiteSections = {
	work: { label: 'FLAGSHIP WORK', id: 'work', visible: true },
	experience: { label: 'EXPERIENCE & EDUCATION', id: 'experience', visible: true },
	stack: { label: 'BUILT WITH', id: 'stack', visible: true },
	howIBuild: { label: 'HOW I BUILD', id: 'how-i-build', visible: true },
	ai: { label: 'ON AI, 2026', id: 'ai', visible: true },
	writing: { label: 'RECENT WRITING', id: 'writing', visible: true },
	hiring: { label: 'FOR HIRING TEAMS', id: 'hiring', visible: true }
};

export const defaultHowIBuild: HowIBuild = {
	heading: 'How I build',
	principles: [
		{
			label: 'Benchmark first',
			detail:
				"I don't guess about performance — I measure. cargo bench, go test -bench, custom harnesses. If I can't reproduce it, I can't fix it."
		},
		{
			label: 'Test at the boundary',
			detail:
				'Unit tests for pure logic, integration tests for IO boundaries (DB, network, filesystem). I test what would actually break in production.'
		},
		{
			label: 'Profile before optimising',
			detail:
				"flamegraph, pprof, perf — I find the actual bottleneck before touching code. Most \"slow\" code is fast enough; the 3% that isn't is usually IO or allocation."
		},
		{
			label: 'Design for failure',
			detail:
				'Everything fails eventually. I design retries with backoff, circuit breakers, graceful degradation, and explicit error types. Happy paths are easy — edge cases define quality.'
		},
		{
			label: 'Ship small, iterate fast',
			detail:
				'I prefer small, reviewable PRs over monolithic feature branches. Fast feedback loops catch design mistakes early. If it takes a week to review, the PR is too big.'
		}
	]
};
