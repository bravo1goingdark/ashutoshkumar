<script lang="ts">
	import { experience, education } from '$lib/content/experience';
</script>

<div class="space-y-14">
	{#each experience as job}
		<div>
			<div class="flex flex-wrap items-baseline justify-between gap-3">
				<h3 class="serif text-2xl leading-tight" style="color: var(--ink);">
					{job.role}
					<span style="color: var(--ink-muted);"> @ {job.company}</span>
				</h3>
				<span
					class="mono tabular-nums shrink-0 text-[11px] uppercase tracking-[0.1em]"
					style="color: var(--ink-muted);"
				>
					{job.period}
				</span>
			</div>
			<p class="mt-1 text-[11px]" style="color: var(--ink-faint);">
				{job.location}
			</p>
			<ul class="mt-5 space-y-2.5">
				{#each job.bullets as bullet}
					<li
						class="flex gap-3 text-[15px] leading-[1.7]"
						style="color: var(--ink-muted);"
					>
						<span
							class="shrink-0 pt-[2px]"
							style="color: var(--ink-faint);"
							aria-hidden="true"
						>
							—
						</span>
						<span>{bullet}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/each}

	<!-- Education -->
	<div>
		<div class="flex flex-wrap items-baseline justify-between gap-3">
			<h3 class="serif text-2xl leading-tight" style="color: var(--ink);">
				{education.degree}
				<span style="color: var(--ink-muted);"> @ {education.institution}</span>
			</h3>
			<span
				class="mono tabular-nums shrink-0 text-[11px] uppercase tracking-[0.1em]"
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
					class="flex gap-3 text-[15px] leading-[1.7]"
					style="color: var(--ink-muted);"
				>
					<span
						class="shrink-0 pt-[2px]"
						style="color: var(--ink-faint);"
						aria-hidden="true"
					>
						—
					</span>
					<span>{award}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
