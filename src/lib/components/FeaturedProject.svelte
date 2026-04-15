<script lang="ts">
	import type { Project } from '$lib/types';

	let { project, index }: { project: Project; index: string } = $props();
</script>

<article class="border-t py-12" style="border-color: var(--border);">
	<!-- Header -->
	<div class="flex items-baseline justify-between gap-6">
		<div class="flex items-baseline gap-3 min-w-0">
			<span
				class="mono tabular-nums shrink-0 text-[11px]"
				style="color: var(--ink-faint);"
				aria-hidden="true"
			>
				{index}
			</span>
			<h3
				class="serif text-[36px] leading-none sm:text-[44px]"
				style="color: var(--ink);"
			>
				{project.name}
			</h3>
			<span class="mono tabular-nums shrink-0 text-[11px]" style="color: var(--ink-faint);">
				{project.year}
			</span>
			{#if project.stars}
				<span
					class="mono tabular-nums shrink-0 text-[11px]"
					style="color: var(--ink-faint);"
				>
					★ {project.stars}
				</span>
			{/if}
		</div>
	</div>

	<!-- Tagline -->
	<p
		class="mono mt-4 text-[13px] uppercase tracking-[0.15em]"
		style="color: var(--ink-muted);"
	>
		{project.tagline}
	</p>

	<!-- Description -->
	{#if project.description}
		<p
			class="mt-6 max-w-2xl text-[16px] leading-[1.75]"
			style="color: var(--ink);"
		>
			{project.description}
		</p>
	{/if}

	<!-- Metrics -->
	{#if project.metrics}
		<ul class="mt-6 max-w-2xl space-y-2.5">
			{#each project.metrics as metric}
				<li
					class="flex gap-3 text-[15px] leading-[1.7]"
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
	<div class="mt-7 flex flex-wrap items-center gap-2">
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
	<div class="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
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
			<a
				href={project.caseStudy}
				class="link-reveal text-[13px]"
				style="color: var(--ink);"
			>
				case study →
			</a>
		{/if}
	</div>
</article>
