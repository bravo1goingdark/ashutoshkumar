<script lang="ts">
	import type { Project } from '$lib/types';

	let { project, index }: { project: Project; index: string } = $props();
</script>

<article class="border-t py-10 sm:py-12" style="border-color: var(--border);">
	<!-- Header -->
	<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
		<span
			class="mono tabular-nums shrink-0 text-[11px]"
			style="color: var(--ink-faint);"
			aria-hidden="true"
		>
			{index}
		</span>
		<h3
			class="serif text-[28px] leading-tight sm:text-[44px]"
			style="color: var(--ink);"
		>
			{project.name}
		</h3>
		<span class="mono tabular-nums shrink-0 text-[11px]" style="color: var(--ink-faint);">
			{project.year}
		</span>
		{#if project.stars}
			<span class="mono tabular-nums shrink-0 text-[11px]" style="color: var(--ink-faint);">
				★ {project.stars}
			</span>
		{/if}
	</div>

	<!-- Tagline -->
	<p
		class="mono mt-3 text-[12px] uppercase leading-snug tracking-[0.12em] sm:mt-4 sm:text-[13px] sm:tracking-[0.15em]"
		style="color: var(--ink-muted);"
	>
		{project.tagline}
	</p>

	<!-- Description -->
	{#if project.description}
		<p
			class="mt-5 max-w-2xl text-[15px] leading-[1.75] sm:mt-6 sm:text-[16px]"
			style="color: var(--ink);"
		>
			{project.description}
		</p>
	{/if}

	<!-- Image -->
	{#if project.image}
		<div
			class="mt-6 overflow-hidden rounded-sm border"
			style="border-color: var(--border);"
		>
			<img
				src={project.image}
				alt="{project.name} screenshot"
				class="aspect-video w-full max-w-2xl object-cover"
				loading="lazy"
			/>
		</div>
	{/if}

	<!-- Metrics -->
	{#if project.metrics && project.metrics.length > 0}
		<ul class="mt-6 max-w-2xl space-y-2.5">
			{#each project.metrics as metric}
				<li
					class="flex gap-3 text-[14px] leading-[1.7] sm:text-[15px]"
					style="color: var(--ink-muted);"
				>
					<span
						class="mono shrink-0 pt-[2px]"
						style="color: var(--ink-faint);"
						aria-hidden="true"
					>
						→
					</span>
					<span>{metric}</span>
				</li>
			{/each}
		</ul>
	{/if}

	<!-- Stack -->
	<div class="mt-6 flex flex-wrap items-center gap-2 sm:mt-7">
		{#each project.stack as tech}
			<span
				class="mono border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em]"
				style="border-color: var(--border); color: var(--ink-muted);"
			>
				{tech}
			</span>
		{/each}
	</div>

	<!-- CTAs -->
	<div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mt-7">
		{#if project.github}
			<a
				href={project.github}
				target="_blank"
				rel="noopener noreferrer"
				class="link-reveal text-[13px]"
				style="color: var(--ink);"
			>
				source ↗
			</a>
		{/if}
		{#if project.url}
			{#if project.github}<span style="color: var(--ink-faint);" aria-hidden="true">·</span>{/if}
			<a
				href={project.url}
				target="_blank"
				rel="noopener noreferrer"
				class="link-reveal text-[13px]"
				style="color: var(--ink);"
			>
				live ↗
			</a>
		{/if}
		{#if project.caseStudy}
			<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
			<a href={project.caseStudy} class="link-reveal text-[13px]" style="color: var(--ink);">
				case study →
			</a>
		{/if}
	</div>
</article>
