<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import FeaturedProject from '$lib/components/FeaturedProject.svelte';
	import ProjectRow from '$lib/components/ProjectRow.svelte';
	import ExperienceBlock from '$lib/components/ExperienceBlock.svelte';
	import SkillGrid from '$lib/components/SkillGrid.svelte';
	import { animateOnScroll } from '$lib/actions/animateOnScroll';

	let { data } = $props();

	const site = $derived(data.site);
	const sections = $derived(site.sections);
	const projects = $derived(data.projects);
	const featuredProjects = $derived(projects.filter((p) => p.featured));
	const otherProjects = $derived(projects.filter((p) => !p.featured));
	const resumeHref = $derived(site.profile.resumeUrl || '/ashutosh-kumar.pdf');
</script>

<svelte:head>
	<title>{site.profile.seo.title}</title>
	<meta name="description" content={site.profile.seo.description} />
</svelte:head>

<Hero profile={site.profile} stats={site.stats} />

<!-- ── Flagship work ───────────────────────────────── -->
{#if sections.work.visible}
<section
	id={sections.work.id}
	class="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-28"
	use:animateOnScroll
>
	<SectionHeader label={sections.work.label} />
	<div>
		{#each featuredProjects as project, i (project.slug)}
			<FeaturedProject {project} index={String(i + 1).padStart(2, '0')} />
		{/each}
		<div class="border-t" style="border-color: var(--border);"></div>
	</div>

	<!-- Other projects -->
	{#if otherProjects.length > 0}
		<div class="mt-12 sm:mt-16">
			<div class="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:mb-8">
				<span
					class="mono text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em]"
					style="color: var(--ink);"
				>
					Also built
				</span>
				<span class="mono text-[10px]" style="color: var(--ink-faint);">
					— shorter, same energy
				</span>
			</div>
			<div>
				{#each otherProjects as project (project.slug)}
					<ProjectRow {project} />
				{/each}
				<div class="border-t" style="border-color: var(--border);"></div>
			</div>
			<div class="mt-6">
				<a
					href={site.profile.socials.github}
					target="_blank"
					rel="noopener noreferrer"
					class="link-reveal mono text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em]"
					style="color: var(--ink-muted);"
				>
					more on github ↗
				</a>
			</div>
		</div>
	{/if}
</section>
{/if}

<!-- ── Experience ──────────────────────────────────── -->
{#if sections.experience.visible}
<section
	id={sections.experience.id}
	class="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-28"
	use:animateOnScroll={{ delay: 100 }}
>
	<SectionHeader label={sections.experience.label} />
	<ExperienceBlock experience={site.experience} education={site.education} />
</section>
{/if}

<!-- ── Stack ───────────────────────────────────────── -->
{#if sections.stack.visible}
<section
	id={sections.stack.id}
	class="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-28"
	use:animateOnScroll={{ delay: 100 }}
>
	<SectionHeader label={sections.stack.label} />
	<SkillGrid skillTiers={site.skillTiers} achievements={site.achievements} />
</section>
{/if}

<!-- ── How I Build ─────────────────────────────────── -->
{#if sections.howIBuild.visible}
<section
	id={sections.howIBuild.id}
	class="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-28"
	use:animateOnScroll={{ delay: 100 }}
>
	<SectionHeader label={sections.howIBuild.label} />

	<h3
		class="serif max-w-2xl text-[24px] leading-[1.3] sm:text-[32px]"
		style="color: var(--ink);"
	>
		{site.howIBuild.heading}
	</h3>

	<div class="mt-8 space-y-5 sm:mt-10">
		{#each site.howIBuild.principles as principle}
			<div class="border-t pt-5" style="border-color: var(--border);">
				<span
					class="mono text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em]"
					style="color: var(--ink);"
				>
					{principle.label}
				</span>
				<p
					class="mt-2 max-w-xl text-[14px] leading-[1.7] sm:text-[15px]"
					style="color: var(--ink-muted);"
				>
					{principle.detail}
				</p>
			</div>
		{/each}
	</div>
</section>
{/if}

<!-- ── AI era ──────────────────────────────────────── -->
{#if sections.ai.visible}
<section
	id={sections.ai.id}
	class="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-28"
	use:animateOnScroll={{ delay: 100 }}
>
	<SectionHeader label={sections.ai.label} />

	<h3
		class="serif max-w-2xl text-[24px] leading-[1.3] sm:text-[32px]"
		style="color: var(--ink);"
	>
		{site.ai.heading}
	</h3>

	<div class="mt-8 max-w-2xl space-y-5">
		{#each site.ai.paragraphs as para}
			<p class="text-[15px] leading-[1.8] sm:text-[16px]" style="color: var(--ink-muted);">
				{para}
			</p>
		{/each}
	</div>

	<!-- AI projects -->
	{#if site.aiProjects.length > 0}
		<div class="mt-10 sm:mt-12">
			<span
				class="mono text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em]"
				style="color: var(--ink);"
			>
				What I've actually shipped with AI
			</span>
			<div class="mt-5 space-y-5 sm:mt-6">
				{#each site.aiProjects as p}
					<a
						href={p.github}
						target="_blank"
						rel="noopener noreferrer"
						class="row-hover group block border-t -mx-4 px-4 py-5 hover:no-underline"
						style="border-color: var(--border);"
					>
						<div class="flex items-baseline justify-between gap-3 sm:gap-4">
							<div class="min-w-0 flex-1">
								<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
									<h4
										class="serif text-[20px] leading-tight transition-transform group-hover:-translate-y-0.5 sm:text-[22px]"
										style="color: var(--ink);"
									>
										{p.name}
									</h4>
								</div>
								<p
									class="mt-2 max-w-xl text-[14px] leading-[1.65] sm:text-[15px]"
									style="color: var(--ink-muted);"
								>
									{p.description}
								</p>
								<p
									class="mono mt-2 text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.15em]"
									style="color: var(--ink-faint);"
								>
									{p.stack}
								</p>
							</div>
							<span
								class="mono text-[11px] transition-transform group-hover:translate-x-0.5"
								style="color: var(--ink-muted);"
								aria-hidden="true"
							>
								↗
							</span>
						</div>
					</a>
				{/each}
				<div class="border-t" style="border-color: var(--border);"></div>
			</div>
		</div>
	{/if}
</section>
{/if}

<!-- ── Writing ─────────────────────────────────────── -->
{#if sections.writing.visible && data.recentPosts.length > 0}
	<section
		id={sections.writing.id}
		class="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-28"
		use:animateOnScroll={{ delay: 100 }}
	>
		<SectionHeader label={sections.writing.label} />
		<div>
			{#each data.recentPosts as post}
				<a
					href="/writing/{post.slug}"
					class="row-hover group flex items-baseline justify-between gap-3 border-t -mx-3 px-3 py-5 hover:no-underline sm:-mx-4 sm:gap-4 sm:px-4"
					style="border-color: var(--border);"
				>
					<span
						class="serif flex-1 text-[16px] leading-tight transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-[20px]"
						style="color: var(--ink);"
					>
						{post.title}
					</span>
					<time
						datetime={post.date}
						class="mono tabular-nums shrink-0 text-[9px] uppercase tracking-[0.1em] sm:text-[10px]"
						style="color: var(--ink-faint);"
					>
						{new Date(post.date).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short'
						})}
					</time>
				</a>
			{/each}
			<div class="border-t" style="border-color: var(--border);"></div>
			<div class="mt-8">
				<a
					href="/writing"
					class="link-reveal mono text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em]"
					style="color: var(--ink-muted);"
				>
					view all writing →
				</a>
			</div>
		</div>
	</section>
{/if}

<!-- ── For hiring teams ─────────────────────────────── -->
{#if sections.hiring.visible}
<section
	id={sections.hiring.id}
	class="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-28"
	use:animateOnScroll={{ delay: 100 }}
>
	<SectionHeader label={sections.hiring.label} />

	<h3
		class="serif max-w-2xl text-[28px] leading-[1.2] sm:text-[40px]"
		style="color: var(--ink);"
	>
		{site.hiring.status}
	</h3>

	<!-- Roles + domains grid -->
	<div class="mt-10 grid gap-8 sm:mt-12 sm:grid-cols-2 sm:gap-12">
		<div>
			<span
				class="mono text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em]"
				style="color: var(--ink);"
			>
				Roles I'm targeting
			</span>
			<ul class="mt-4 space-y-2">
				{#each site.hiring.roles as role}
					<li
						class="flex gap-3 text-[14px] leading-[1.65] sm:text-[15px]"
						style="color: var(--ink-muted);"
					>
						<span style="color: var(--ink-faint);" aria-hidden="true">—</span>
						<span>{role}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div>
			<span
				class="mono text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em]"
				style="color: var(--ink);"
			>
				Strong fit if you work on
			</span>
			<ul class="mt-4 space-y-2">
				{#each site.hiring.domains as domain}
					<li
						class="flex gap-3 text-[14px] leading-[1.65] sm:text-[15px]"
						style="color: var(--ink-muted);"
					>
						<span style="color: var(--ink-faint);" aria-hidden="true">—</span>
						<span>{domain}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<!-- Open to -->
	<div class="mt-10 border-t pt-8" style="border-color: var(--border);">
		<span
			class="mono text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em]"
			style="color: var(--ink);"
		>
			Open to
		</span>
		<div class="mt-4 flex flex-wrap gap-2">
			{#each site.hiring.openTo as mode}
				<span
					class="mono border px-2 py-1 text-[9px] uppercase tracking-[0.1em] sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.12em]"
					style="border-color: var(--border-strong); color: var(--ink);"
				>
					{mode}
				</span>
			{/each}
		</div>
		{#if site.hiring.notLookingFor}
			<p class="mt-6 max-w-xl text-[13px] leading-[1.65] sm:text-[14px]" style="color: var(--ink-faint);">
				<em class="serif italic">Not looking for:</em>
				{site.hiring.notLookingFor}
			</p>
		{/if}
	</div>

	<!-- CTA -->
	<div class="mt-10 border-t pt-8 sm:mt-12 sm:pt-10" style="border-color: var(--border);">
		<p
			class="serif max-w-xl text-[20px] leading-[1.4] sm:text-[26px]"
			style="color: var(--ink);"
		>
			Hiring for backend, infrastructure, or systems engineering? I'm immediately available and
			ready to ship.
		</p>
		<div class="mt-8 flex flex-wrap items-center gap-3">
			<a href="mailto:{site.profile.email}" class="btn btn-primary">
				Email me
				<span aria-hidden="true">→</span>
			</a>
			<a href={resumeHref} download class="btn btn-secondary">
				<span aria-hidden="true">↓</span>
				Résumé
			</a>
		</div>
	</div>
</section>
{/if}
