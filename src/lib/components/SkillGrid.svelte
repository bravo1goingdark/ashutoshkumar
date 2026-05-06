<script lang="ts">
	import type { SkillTier } from '$lib/types';

	let {
		skillTiers,
		achievements
	}: { skillTiers: SkillTier[]; achievements: string[] } = $props();
</script>

<div class="space-y-8 sm:space-y-10">
	{#each skillTiers as tier}
		<div>
			<div class="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
				<span
					class="mono text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em]"
					style="color: var(--ink);"
				>
					{tier.label}
				</span>
				<span class="mono text-[10px]" style="color: var(--ink-faint);">— {tier.note}</span>
			</div>
			<p class="text-[15px] leading-[1.8] sm:text-[16px]" style="color: var(--ink);">
				{#each tier.items as item, i}
					{item}{#if i < tier.items.length - 1}<span style="color: var(--ink-faint);"
							>&nbsp;·&nbsp;</span
						>{/if}
				{/each}
			</p>
		</div>
	{/each}

	<!-- Milestones -->
	<div class="border-t pt-8 sm:pt-10" style="border-color: var(--border);">
		<span
			class="mono text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em]"
			style="color: var(--ink);"
		>
			Milestones
		</span>
		<ul class="mt-4 space-y-2">
			{#each achievements as a}
				<li
					class="flex gap-3 text-[14px] leading-[1.7] sm:text-[15px]"
					style="color: var(--ink-muted);"
				>
					<span style="color: var(--ink-faint);" aria-hidden="true">—</span>
					<span>{a}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
