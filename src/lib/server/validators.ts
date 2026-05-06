import type {
	Profile,
	Stat,
	Hiring,
	AiSection,
	AIProject,
	HowIBuild,
	Experience,
	Education,
	SkillTier,
	Project,
	Socials,
	BuildPrinciple,
	SiteSections,
	SiteSection
} from '$lib/types';

const isObj = (v: unknown): v is Record<string, unknown> =>
	typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);
const isBool = (v: unknown): v is boolean => typeof v === 'boolean';
const s = (v: unknown, fallback = ''): string => (isStr(v) ? v : fallback);
const sa = (v: unknown): string[] => (isStrArr(v) ? v : []);
const num = (v: unknown, fallback = 0): number =>
	typeof v === 'number' && Number.isFinite(v) ? v : fallback;
const b = (v: unknown, fallback = false): boolean => (isBool(v) ? v : fallback);

export const MAX_BLOB_BYTES = 50_000;

export class ValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ValidationError';
	}
}

export function ensureBlobSize(value: unknown): string {
	const json = JSON.stringify(value);
	if (json.length > MAX_BLOB_BYTES) {
		throw new ValidationError(`payload exceeds ${MAX_BLOB_BYTES} bytes`);
	}
	return json;
}

export function validateProfile(input: unknown): Profile {
	if (!isObj(input)) throw new ValidationError('profile must be an object');
	const socials = isObj(input.socials) ? input.socials : {};
	const seo = isObj(input.seo) ? input.seo : {};
	const out: Profile = {
		name: s(input.name),
		handle: s(input.handle),
		role: s(input.role),
		tagline: s(input.tagline),
		bio: s(input.bio),
		education: s(input.education),
		location: s(input.location),
		available: b(input.available, false),
		availableDate: s(input.availableDate),
		email: s(input.email),
		photo: s(input.photo),
		resumeUrl: s(input.resumeUrl),
		socials: validateSocials(socials),
		seo: { title: s(seo.title), description: s(seo.description) }
	};
	return out;
}

function validateSocials(input: Record<string, unknown>): Socials {
	const out: Socials = {
		github: s(input.github),
		linkedin: s(input.linkedin),
		x: s(input.x),
		leetcode: s(input.leetcode),
		clairo: s(input.clairo),
		mankind: s(input.mankind)
	};
	for (const [k, v] of Object.entries(input)) {
		if (k in out) continue;
		if (isStr(v)) out[k] = v;
	}
	return out;
}

export function validateStats(input: unknown): Stat[] {
	if (!Array.isArray(input)) throw new ValidationError('stats must be an array');
	return input.map((row) => {
		if (!isObj(row)) throw new ValidationError('stat row must be an object');
		return { value: s(row.value), label: s(row.label), detail: s(row.detail) };
	});
}

export function validateHiring(input: unknown): Hiring {
	if (!isObj(input)) throw new ValidationError('hiring must be an object');
	return {
		status: s(input.status),
		roles: sa(input.roles),
		domains: sa(input.domains),
		openTo: sa(input.openTo),
		notLookingFor: s(input.notLookingFor)
	};
}

export function validateAi(input: unknown): AiSection {
	if (!isObj(input)) throw new ValidationError('ai must be an object');
	return { heading: s(input.heading), paragraphs: sa(input.paragraphs) };
}

export function validateAiProjects(input: unknown): AIProject[] {
	if (!Array.isArray(input)) throw new ValidationError('aiProjects must be an array');
	return input.map((row) => {
		if (!isObj(row)) throw new ValidationError('aiProject row must be an object');
		return {
			name: s(row.name),
			description: s(row.description),
			stack: s(row.stack),
			github: s(row.github)
		};
	});
}

export function validateHowIBuild(input: unknown): HowIBuild {
	if (!isObj(input)) throw new ValidationError('howIBuild must be an object');
	const principles = Array.isArray(input.principles) ? input.principles : [];
	const validated: BuildPrinciple[] = principles.map((p) => {
		if (!isObj(p)) throw new ValidationError('principle row must be an object');
		return { label: s(p.label), detail: s(p.detail) };
	});
	return { heading: s(input.heading), principles: validated };
}

export function validateExperience(input: unknown): Experience[] {
	if (!Array.isArray(input)) throw new ValidationError('experience must be an array');
	return input.map((row) => {
		if (!isObj(row)) throw new ValidationError('experience row must be an object');
		return {
			company: s(row.company),
			role: s(row.role),
			period: s(row.period),
			location: s(row.location),
			bullets: sa(row.bullets)
		};
	});
}

export function validateEducation(input: unknown): Education {
	if (!isObj(input)) throw new ValidationError('education must be an object');
	return {
		institution: s(input.institution),
		degree: s(input.degree),
		specialisation: s(input.specialisation),
		cgpa: s(input.cgpa),
		period: s(input.period),
		location: s(input.location),
		awards: sa(input.awards)
	};
}

export function validateSkillTiers(input: unknown): SkillTier[] {
	if (!Array.isArray(input)) throw new ValidationError('skillTiers must be an array');
	return input.map((row) => {
		if (!isObj(row)) throw new ValidationError('skillTier row must be an object');
		return { label: s(row.label), note: s(row.note), items: sa(row.items) };
	});
}

export function validateAchievements(input: unknown): string[] {
	return sa(input);
}

const SECTION_KEYS: (keyof SiteSections)[] = [
	'work',
	'experience',
	'stack',
	'howIBuild',
	'ai',
	'writing',
	'hiring'
];

function validateSection(input: unknown, fallback: SiteSection): SiteSection {
	if (!isObj(input)) return fallback;
	return {
		label: s(input.label, fallback.label),
		id: s(input.id, fallback.id).replace(/[^a-z0-9-]/gi, '-').toLowerCase(),
		visible: b(input.visible, fallback.visible)
	};
}

export function validateSections(input: unknown): SiteSections {
	if (!isObj(input)) throw new ValidationError('sections must be an object');
	const fallback: SiteSections = {
		work: { label: 'FLAGSHIP WORK', id: 'work', visible: true },
		experience: { label: 'EXPERIENCE & EDUCATION', id: 'experience', visible: true },
		stack: { label: 'BUILT WITH', id: 'stack', visible: true },
		howIBuild: { label: 'HOW I BUILD', id: 'how-i-build', visible: true },
		ai: { label: 'ON AI, 2026', id: 'ai', visible: true },
		writing: { label: 'RECENT WRITING', id: 'writing', visible: true },
		hiring: { label: 'FOR HIRING TEAMS', id: 'hiring', visible: true }
	};
	const out = {} as SiteSections;
	for (const key of SECTION_KEYS) {
		out[key] = validateSection(input[key], fallback[key]);
	}
	return out;
}

export const sectionValidators = {
	profile: validateProfile,
	stats: validateStats,
	hiring: validateHiring,
	ai: validateAi,
	aiProjects: validateAiProjects,
	howIBuild: validateHowIBuild,
	experience: validateExperience,
	education: validateEducation,
	skillTiers: validateSkillTiers,
	achievements: validateAchievements,
	sections: validateSections
} as const;

export type SectionKey = keyof typeof sectionValidators;

export function isSectionKey(k: string): k is SectionKey {
	return k in sectionValidators;
}

const slugRe = /^[a-z0-9](?:[a-z0-9-]{0,80}[a-z0-9])?$/;

export function validateProjectSlug(slug: unknown): string {
	if (!isStr(slug)) throw new ValidationError('slug must be a string');
	const trimmed = slug.trim().toLowerCase();
	if (!slugRe.test(trimmed)) throw new ValidationError('slug must be 1-82 chars, [a-z0-9-]');
	return trimmed;
}

export function validateProject(input: unknown): Project {
	if (!isObj(input)) throw new ValidationError('project must be an object');
	const name = s(input.name).trim();
	if (!name) throw new ValidationError('project name is required');
	return {
		slug: validateProjectSlug(input.slug),
		number: s(input.number),
		name,
		year: s(input.year),
		tagline: s(input.tagline),
		description: s(input.description),
		stack: sa(input.stack),
		metrics: sa(input.metrics),
		image: s(input.image),
		github: s(input.github),
		url: s(input.url),
		caseStudy: s(input.caseStudy),
		stars: num(input.stars, 0),
		featured: b(input.featured, false),
		sortOrder: num(input.sortOrder, 0)
	};
}
