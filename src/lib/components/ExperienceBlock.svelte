<script lang="ts">
	import type { Experience, Education } from '$lib/types';

	let {
		experience,
		education
	}: { experience: Experience[]; education: Education } = $props();
</script>

<div class="space-y-12 sm:space-y-14">
	{#each experience as job}
		<div>
			<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
				<h3 class="serif text-[20px] leading-tight sm:text-2xl" style="color: var(--ink);">
					{job.role}
					<span style="color: var(--ink-muted);"> @ {job.company}</span>
				</h3>
				<span
					class="mono tabular-nums shrink-0 text-[10px] uppercase tracking-[0.1em] sm:text-[11px]"
					style="color: var(--ink-muted);"
				>
					{job.period}
				</span>
			</div>
			<p class="mt-1 text-[11px]" style="color: var(--ink-faint);">{job.location}</p>
			<ul class="mt-5 space-y-2.5">
				{#each job.bullets as bullet}
					<li
						class="flex gap-3 text-[14px] leading-[1.7] sm:text-[15px]"
						style="color: var(--ink-muted);"
					>
						<span class="shrink-0 pt-[2px]" style="color: var(--ink-faint);" aria-hidden="true"
							>—</span
						>
						<span>{bullet}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/each}

	<!-- Education -->
	<div>
		<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
			<h3 class="serif text-[20px] leading-tight sm:text-2xl" style="color: var(--ink);">
				{education.degree}
				<span style="color: var(--ink-muted);"> @ {education.institution}</span>
			</h3>
			<span
				class="mono tabular-nums shrink-0 text-[10px] uppercase tracking-[0.1em] sm:text-[11px]"
				style="color: var(--ink-muted);"
			>
				{education.period}
			</span>
		</div>
		<p class="mt-1 text-[11px]" style="color: var(--ink-faint);">
			{education.location} · CGPA {education.cgpa} · {education.specialisation}
		</p>
		<ul class="mt-5 space-y-2">
			{#each education.awards as award}
				<li
					class="flex gap-3 text-[14px] leading-[1.7] sm:text-[15px]"
					style="color: var(--ink-muted);"
				>
					<span class="shrink-0 pt-[2px]" style="color: var(--ink-faint);" aria-hidden="true"
						>—</span
					>
					<span>{award}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
