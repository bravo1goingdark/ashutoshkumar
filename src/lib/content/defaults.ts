import type { SiteConfig } from '$lib/types';
import {
	defaultProfile,
	defaultStats,
	defaultHiring,
	defaultAi,
	defaultAiProjects,
	defaultHowIBuild,
	defaultSections
} from './profile';
import { defaultExperience, defaultEducation } from './experience';
import { defaultSkillTiers, defaultAchievements } from './skills';
import { defaultProjects } from './projects';

export const defaultSiteConfig: SiteConfig = {
	profile: defaultProfile,
	stats: defaultStats,
	hiring: defaultHiring,
	ai: defaultAi,
	aiProjects: defaultAiProjects,
	howIBuild: defaultHowIBuild,
	experience: defaultExperience,
	education: defaultEducation,
	skillTiers: defaultSkillTiers,
	achievements: defaultAchievements,
	sections: defaultSections
};

export { defaultProjects };

export const SITE_CONFIG_KEYS = [
	'profile',
	'stats',
	'hiring',
	'ai',
	'aiProjects',
	'howIBuild',
	'experience',
	'education',
	'skillTiers',
	'achievements',
	'sections'
] as const;

export type SiteConfigKey = (typeof SITE_CONFIG_KEYS)[number];
