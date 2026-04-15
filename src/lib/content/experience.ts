import type { Experience } from '$lib/types';

export const experience: Experience[] = [
	{
		company: 'Bindisa Agritech',
		role: 'Backend Engineer & Team Lead',
		period: 'May 2025 – Jul 2025',
		location: 'Gaya, India',
		bullets: [
			'Led a team of 5 engineers to design and ship backend APIs, contributing directly to core business logic and system architecture.',
			'Reviewed and merged 20+ pull requests, enforcing modular design, performance standards, and maintainable code practices.',
			'Optimised API endpoints and database queries, reducing average response latency by 35%.',
			'Planned and executed 2-week agile sprints, delivering all milestones on schedule across the internship period.'
		]
	}
];

export const education = {
	institution: 'Manipal University Jaipur',
	degree: 'B.Tech Computer Science & Engineering',
	specialisation: 'IoT and Intelligent Systems',
	cgpa: '8.61 / 10.00',
	period: 'Expected Jul 2026',
	location: 'Jaipur, Rajasthan',
	awards: ["Dean's List — 6th semester (highest GPA)"]
} as const;
