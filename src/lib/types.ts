export interface PostMeta {
	title: string;
	date: string;
	description: string;
	tags: string[];
	readTime?: string;
}

export interface Post extends PostMeta {
	slug: string;
}

export interface Project {
	number: string;
	name: string;
	tagline: string;
	year: string;
	stack: string[];
	github?: string;
	url?: string;
	stars?: number;
	featured?: boolean;
	description?: string;
	metrics?: string[];
	caseStudy?: string;
}

export interface Experience {
	company: string;
	role: string;
	period: string;
	location: string;
	bullets: string[];
}

export interface SkillTier {
	label: string;
	note: string;
	items: string[];
}

export interface Stat {
	value: string;
	label: string;
	detail: string;
}

export interface AIProject {
	name: string;
	description: string;
	stack: string;
	github: string;
}
