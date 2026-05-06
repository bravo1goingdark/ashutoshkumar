export interface PostMeta {
	title: string;
	date: string;
	description: string;
	tags: string[];
	readTime?: string;
	series?: string;
	seriesOrder?: number;
}

export interface Post extends PostMeta {
	slug: string;
}

export interface Project {
	slug: string;
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
	image?: string;
	sortOrder?: number;
}

export interface Experience {
	company: string;
	role: string;
	period: string;
	location: string;
	bullets: string[];
}

export interface Education {
	institution: string;
	degree: string;
	specialisation: string;
	cgpa: string;
	period: string;
	location: string;
	awards: string[];
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

export interface BuildPrinciple {
	label: string;
	detail: string;
}

export interface Socials {
	github: string;
	linkedin: string;
	x: string;
	leetcode: string;
	clairo: string;
	mankind: string;
	[key: string]: string;
}

export interface SeoMeta {
	title: string;
	description: string;
}

export interface Profile {
	name: string;
	handle: string;
	role: string;
	tagline: string;
	bio: string;
	education: string;
	location: string;
	available: boolean;
	availableDate: string;
	email: string;
	photo: string;
	resumeUrl: string;
	socials: Socials;
	seo: SeoMeta;
}

export interface SiteSection {
	label: string;
	id: string;
	visible: boolean;
}

export interface SiteSections {
	work: SiteSection;
	experience: SiteSection;
	stack: SiteSection;
	howIBuild: SiteSection;
	ai: SiteSection;
	writing: SiteSection;
	hiring: SiteSection;
}

export interface Hiring {
	status: string;
	roles: string[];
	domains: string[];
	openTo: string[];
	notLookingFor: string;
}

export interface AiSection {
	heading: string;
	paragraphs: string[];
}

export interface HowIBuild {
	heading: string;
	principles: BuildPrinciple[];
}

export interface SiteConfig {
	profile: Profile;
	stats: Stat[];
	hiring: Hiring;
	ai: AiSection;
	aiProjects: AIProject[];
	howIBuild: HowIBuild;
	experience: Experience[];
	education: Education;
	skillTiers: SkillTier[];
	achievements: string[];
	sections: SiteSections;
}
