import type { Experience, Education } from '$lib/types';

export const defaultExperience: Experience[] = [
	{
		company: 'Bindisa Agritech',
		role: 'Backend Engineer & Team Lead',
		period: 'May 2025 – Jul 2025',
		location: 'Gaya, India',
		bullets: [
			'Led a team of 5 engineers designing and shipping backend APIs for an agritech platform — owned core business logic, database schema design, and system architecture.',
			'Reviewed and merged 20+ pull requests across the codebase, enforcing modular design patterns, query optimisation standards, and maintainable code practices.',
			'Profiled and optimised slow API endpoints — identified N+1 query patterns and missing indexes, reducing p50 response latency from ~320ms to ~210ms (35% cut).',
			'Planned and executed 2-week agile sprints with daily standups and sprint retrospectives, delivering all 3 milestones on schedule across the 10-week internship.'
		]
	}
];

export const defaultEducation: Education = {
	institution: 'Manipal University Jaipur',
	degree: 'B.Tech Computer Science & Engineering',
	specialisation: 'IoT and Intelligent Systems',
	cgpa: '8.61 / 10.00',
	period: 'Expected Jul 2026',
	location: 'Jaipur, Rajasthan',
	awards: ["Dean's List — 6th semester (highest GPA)"]
};
