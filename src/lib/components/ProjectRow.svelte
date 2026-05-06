<script lang="ts">
	import type { Project } from '$lib/types';

	let { project }: { project: Project } = $props();

	const href = $derived(project.url ?? project.github ?? '#');
</script>

<a
	{href}
	target="_blank"
	rel="noopener noreferrer"
	class="row-hover group block border-t -mx-4 px-4 py-6 hover:no-underline sm:py-7"
	style="border-color: var(--border);"
>
	<div class="flex items-start gap-3 sm:gap-5">
		<!-- Image / placeholder thumbnail -->
		<div
			class="shrink-0 overflow-hidden rounded-sm border"
			style="border-color: var(--border);"
		>
			{#if project.image}
				<img
					src={project.image}
					alt="{project.name} screenshot"
					class="h-14 w-14 object-cover sm:h-20 sm:w-20"
					loading="lazy"
				/>
			{:else}
				<div
					class="flex h-14 w-14 items-center justify-center sm:h-20 sm:w-20"
					style="background: var(--bg-subtle); color: var(--ink-faint);"
					aria-hidden="true"
				>
					<span class="mono text-[11px]">{project.number}</span>
				</div>
			{/if}
		</div>

		<div class="min-w-0 flex-1">
			<!-- Title row -->
			<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
				<h3
					class="serif text-[22px] leading-tight transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-[30px]"
					style="color: var(--ink);"
				>
					{project.name}
				</h3>
				<span class="mono tabular-nums text-[11px]" style="color: var(--ink-faint);">
					{project.year}
				</span>
				{#if project.stars}
					<span class="mono tabular-nums text-[11px]" style="color: var(--ink-faint);">
						★ {project.stars}
					</span>
				{/if}
			</div>

			<!-- Tagline -->
			<p
				class="mt-2 max-w-xl text-[14px] leading-[1.65] sm:text-[15px]"
				style="color: var(--ink-muted);"
			>
				{project.tagline}
			</p>

			<!-- Stack -->
			<div class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
				{#each project.stack as tech, i}
					<span
						class="mono text-[10px] uppercase tracking-[0.15em]"
						style="color: var(--ink-faint);"
					>
						{tech}
					</span>
					{#if i < project.stack.length - 1}
						<span class="text-[10px]" style="color: var(--ink-faint);" aria-hidden="true">·</span>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Arrow -->
		<span
			class="shrink-0 self-start pt-2 text-[15px] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
			style="color: var(--ink-muted);"
			aria-hidden="true"
		>
			↗
		</span>
	</div>
</a>
