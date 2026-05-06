import { getAllConfig, listProjects } from '$lib/server/db';
import { defaultSiteConfig, defaultProjects } from '$lib/content/defaults';
import type { LayoutServerLoad } from './$types';
import type {
	SiteConfig,
	Project,
	Profile,
	Stat,
	Hiring,
	AiSection,
	AIProject,
	HowIBuild,
	Experience,
	Education,
	SkillTier,
	SiteSections
} from '$lib/types';

export const prerender = false;

export const load: LayoutServerLoad = async ({ platform }) => {
	if (!platform?.env?.DB) {
		return {
			site: defaultSiteConfig satisfies SiteConfig,
			projects: defaultProjects satisfies Project[]
		};
	}

	const [raw, dbProjects] = await Promise.all([
		getAllConfig(platform.env.DB),
		listProjects(platform.env.DB)
	]);

	const site: SiteConfig = {
		profile: (raw.profile as Profile) ?? defaultSiteConfig.profile,
		stats: (raw.stats as Stat[]) ?? defaultSiteConfig.stats,
		hiring: (raw.hiring as Hiring) ?? defaultSiteConfig.hiring,
		ai: (raw.ai as AiSection) ?? defaultSiteConfig.ai,
		aiProjects: (raw.aiProjects as AIProject[]) ?? defaultSiteConfig.aiProjects,
		howIBuild: (raw.howIBuild as HowIBuild) ?? defaultSiteConfig.howIBuild,
		experience: (raw.experience as Experience[]) ?? defaultSiteConfig.experience,
		education: (raw.education as Education) ?? defaultSiteConfig.education,
		skillTiers: (raw.skillTiers as SkillTier[]) ?? defaultSiteConfig.skillTiers,
		achievements: (raw.achievements as string[]) ?? defaultSiteConfig.achievements,
		sections: (raw.sections as SiteSections) ?? defaultSiteConfig.sections
	};

	const projects = dbProjects.length > 0 ? dbProjects : defaultProjects;

	return { site, projects };
};
