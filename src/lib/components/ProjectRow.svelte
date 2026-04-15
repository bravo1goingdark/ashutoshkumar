<script lang="ts">
	import type { Project } from '$lib/types';

	let { project }: { project: Project } = $props();
</script>

<a
	href={project.url ?? project.github}
	target="_blank"
	rel="noopener noreferrer"
	class="row-hover group block border-t px-4 py-7 -mx-4 hover:no-underline"
	style="border-color: var(--border);"
>
	<div class="flex items-start justify-between gap-6">
		<div class="min-w-0 flex-1">
			<!-- Title row -->
			<div class="flex items-baseline gap-3">
				<h3
					class="serif text-[26px] leading-tight transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-[30px]"
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
			<p class="mt-2.5 max-w-xl text-[15px] leading-[1.65]" style="color: var(--ink-muted);">
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
						<span
							class="text-[10px]"
							style="color: var(--ink-faint);"
							aria-hidden="true"
						>
							·
						</span>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Arrow -->
		<span
			class="shrink-0 pt-2 text-[15px] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
			style="color: var(--ink-muted);"
			aria-hidden="true"
		>
			↗
		</span>
	</div>
</a>
