import { checkAuth } from '$lib/server/auth';
import { listPosts, listSeries, listProjects, getAllConfig } from '$lib/server/db';
import { defaultSiteConfig, defaultProjects } from '$lib/content/defaults';
import type { PageServerLoad } from './$types';
import type {
	SiteConfig,
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

export const load: PageServerLoad = async ({ cookies, platform }) => {
	const authenticated = checkAuth(cookies, platform?.env?.WRITE_KEY);

	if (!authenticated) {
		return {
			authenticated: false,
			posts: [],
			series: [],
			site: defaultSiteConfig,
			projects: defaultProjects
		};
	}

	if (!platform?.env?.DB) {
		return {
			authenticated: true,
			posts: [],
			series: [],
			devMode: true,
			site: defaultSiteConfig,
			projects: defaultProjects
		};
	}

	const [posts, series, rawConfig, projects] = await Promise.all([
		listPosts(platform.env.DB, false),
		listSeries(platform.env.DB, false),
		getAllConfig(platform.env.DB),
		listProjects(platform.env.DB)
	]);

	const site: SiteConfig = {
		profile: (rawConfig.profile as Profile) ?? defaultSiteConfig.profile,
		stats: (rawConfig.stats as Stat[]) ?? defaultSiteConfig.stats,
		hiring: (rawConfig.hiring as Hiring) ?? defaultSiteConfig.hiring,
		ai: (rawConfig.ai as AiSection) ?? defaultSiteConfig.ai,
		aiProjects: (rawConfig.aiProjects as AIProject[]) ?? defaultSiteConfig.aiProjects,
		howIBuild: (rawConfig.howIBuild as HowIBuild) ?? defaultSiteConfig.howIBuild,
		experience: (rawConfig.experience as Experience[]) ?? defaultSiteConfig.experience,
		education: (rawConfig.education as Education) ?? defaultSiteConfig.education,
		skillTiers: (rawConfig.skillTiers as SkillTier[]) ?? defaultSiteConfig.skillTiers,
		achievements: (rawConfig.achievements as string[]) ?? defaultSiteConfig.achievements,
		sections: (rawConfig.sections as SiteSections) ?? defaultSiteConfig.sections
	};

	return {
		authenticated: true,
		posts: posts.map((p) => ({
			slug: p.slug,
			title: p.title,
			date: p.date,
			published: p.published
		})),
		series,
		devMode: false,
		site,
		projects: projects.length > 0 ? projects : defaultProjects
	};
};
