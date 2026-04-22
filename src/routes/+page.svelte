<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import FeaturedProject from '$lib/components/FeaturedProject.svelte';
	import ProjectRow from '$lib/components/ProjectRow.svelte';
	import ExperienceBlock from '$lib/components/ExperienceBlock.svelte';
	import SkillGrid from '$lib/components/SkillGrid.svelte';
	import { animateOnScroll } from '$lib/actions/animateOnScroll';
	import { featuredProjects, otherProjects } from '$lib/content/projects';
	import { hiring, ai, aiProjects, profile } from '$lib/content/profile';

	let { data } = $props();
</script>

<svelte:head>
	<title>Ashutosh Kumar — Backend Engineer · Available Immediately</title>
	<meta
		name="description"
		content="Backend & systems engineer building high-performance infrastructure in Rust and Go. MUJ CS '26, open to SDE-1 / Backend / Infrastructure roles."
	/>
</svelte:head>

<Hero />

<!-- ── Flagship work ───────────────────────────────── -->
<section id="work" class="mx-auto max-w-3xl px-6 py-20 sm:py-28" use:animateOnScroll>
	<SectionHeader label="FLAGSHIP WORK" />
	<div>
		{#each featuredProjects as project, i}
			<FeaturedProject {project} index={String(i + 1).padStart(2, '0')} />
		{/each}
		<div class="border-t" style="border-color: var(--border);"></div>
	</div>

	<!-- Other projects -->
	<div class="mt-16">
		<div class="mb-8 flex items-baseline gap-3">
			<span
				class="mono text-[10px] uppercase tracking-[0.22em]"
				style="color: var(--ink);"
			>
				Also built
			</span>
			<span class="mono text-[10px]" style="color: var(--ink-faint);">
				— shorter, same energy
			</span>
		</div>
		<div>
			{#each otherProjects as project}
				<ProjectRow {project} />
			{/each}
			<div class="border-t" style="border-color: var(--border);"></div>
		</div>
		<div class="mt-6">
			<a
				href={profile.socials.github}
				target="_blank"
				rel="noopener noreferrer"
				class="link-reveal mono text-[11px] uppercase tracking-[0.2em]"
				style="color: var(--ink-muted);"
			>
				more on github ↗
			</a>
		</div>
	</div>
</section>

<!-- ── Experience ──────────────────────────────────── -->
<section id="experience" class="mx-auto max-w-3xl px-6 py-20 sm:py-28" use:animateOnScroll={{ delay: 100 }}>
	<SectionHeader label="EXPERIENCE & EDUCATION" />
	<ExperienceBlock />
</section>

<!-- ── Stack ───────────────────────────────────────── -->
<section id="stack" class="mx-auto max-w-3xl px-6 py-20 sm:py-28" use:animateOnScroll={{ delay: 100 }}>
	<SectionHeader label="BUILT WITH" />
	<SkillGrid />
</section>

<!-- ── AI era ──────────────────────────────────────── -->
<section id="ai" class="mx-auto max-w-3xl px-6 py-20 sm:py-28" use:animateOnScroll={{ delay: 100 }}>
	<SectionHeader label="ON AI, 2026" />

	<h3
		class="serif max-w-2xl text-[26px] leading-[1.3] sm:text-[32px]"
		style="color: var(--ink);"
	>
		{ai.heading}
	</h3>

	<div class="mt-8 max-w-2xl space-y-5">
		{#each ai.paragraphs as para}
			<p class="text-[16px] leading-[1.8]" style="color: var(--ink-muted);">
				{para}
			</p>
		{/each}
	</div>

	<!-- AI projects -->
	<div class="mt-12">
		<span
			class="mono text-[10px] uppercase tracking-[0.22em]"
			style="color: var(--ink);"
		>
			What I've actually shipped with AI
		</span>
		<div class="mt-6 space-y-5">
			{#each aiProjects as p}
				<a
					href={p.github}
					target="_blank"
					rel="noopener noreferrer"
					class="row-hover group block border-t px-4 py-5 -mx-4 hover:no-underline"
					style="border-color: var(--border);"
				>
					<div class="flex items-baseline justify-between gap-4">
						<div class="min-w-0 flex-1">
							<div class="flex items-baseline gap-3">
								<h4
									class="serif text-[22px] leading-tight transition-transform group-hover:-translate-y-0.5"
									style="color: var(--ink);"
								>
									{p.name}
								</h4>
							</div>
							<p
								class="mt-2 max-w-xl text-[15px] leading-[1.65]"
								style="color: var(--ink-muted);"
							>
								{p.description}
							</p>
							<p
								class="mono mt-2 text-[10px] uppercase tracking-[0.15em]"
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
</section>

<!-- ── Writing ─────────────────────────────────────── -->
{#if data.recentPosts.length > 0}
	<section id="writing" class="mx-auto max-w-3xl px-6 py-20 sm:py-28" use:animateOnScroll={{ delay: 100 }}>
		<SectionHeader label="RECENT WRITING" />
		<div>
			{#each data.recentPosts as post}
				<a
					href="/writing/{post.slug}"
					class="row-hover group flex items-baseline justify-between gap-4 border-t -mx-4 px-4 py-5 hover:no-underline"
					style="border-color: var(--border);"
				>
					<span
						class="serif flex-1 text-[18px] leading-tight transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-[20px]"
						style="color: var(--ink);"
					>
						{post.title}
					</span>
					<time
						datetime={post.date}
						class="mono tabular-nums shrink-0 text-[10px] uppercase tracking-[0.1em]"
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
					class="link-reveal mono text-[11px] uppercase tracking-[0.2em]"
					style="color: var(--ink-muted);"
				>
					view all writing →
				</a>
			</div>
		</div>
	</section>
{/if}

<!-- ── For hiring teams ─────────────────────────────── -->
<section id="hiring" class="mx-auto max-w-3xl px-6 py-20 sm:py-28" use:animateOnScroll={{ delay: 100 }}>
	<SectionHeader label="FOR HIRING TEAMS" />

	<h3
		class="serif max-w-2xl text-[32px] leading-[1.2] sm:text-[40px]"
		style="color: var(--ink);"
	>
		{hiring.status}
	</h3>

	<!-- Roles + domains grid -->
	<div class="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-12">
		<div>
			<span
				class="mono text-[10px] uppercase tracking-[0.22em]"
				style="color: var(--ink);"
			>
				Roles I'm targeting
			</span>
			<ul class="mt-4 space-y-2">
				{#each hiring.roles as role}
					<li
						class="flex gap-3 text-[15px] leading-[1.65]"
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
				class="mono text-[10px] uppercase tracking-[0.22em]"
				style="color: var(--ink);"
			>
				Strong fit if you work on
			</span>
			<ul class="mt-4 space-y-2">
				{#each hiring.domains as domain}
					<li
						class="flex gap-3 text-[15px] leading-[1.65]"
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
			class="mono text-[10px] uppercase tracking-[0.22em]"
			style="color: var(--ink);"
		>
			Open to
		</span>
		<div class="mt-4 flex flex-wrap gap-2">
			{#each hiring.openTo as mode}
				<span
					class="mono border px-3 py-1.5 text-[10px] uppercase tracking-[0.12em]"
					style="border-color: var(--border-strong); color: var(--ink);"
				>
					{mode}
				</span>
			{/each}
		</div>
		<p class="mt-6 max-w-xl text-[14px] leading-[1.65]" style="color: var(--ink-faint);">
			<em class="serif italic">Not looking for:</em>
			{hiring.notLookingFor}
		</p>
	</div>

	<!-- CTA -->
	<div class="mt-12 border-t pt-10" style="border-color: var(--border);">
		<p class="serif max-w-xl text-[22px] leading-[1.4] sm:text-[26px]" style="color: var(--ink);">
			Hiring for backend, infrastructure, or systems engineering? I'm immediately available and
			ready to ship.
		</p>
		<div class="mt-8 flex flex-wrap items-center gap-3">
			<a href="mailto:{profile.email}" class="btn btn-primary">
				Email me
				<span aria-hidden="true">→</span>
			</a>
			<a href="/ashutosh-kumar.pdf" download class="btn btn-secondary">
				<span aria-hidden="true">↓</span>
				Résumé
			</a>
		</div>
	</div>
</section>
