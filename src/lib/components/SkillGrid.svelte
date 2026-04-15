<script lang="ts">
	import { skillTiers, achievements } from '$lib/content/skills';
</script>

<div class="space-y-10">
	{#each skillTiers as tier}
		<div>
			<div class="mb-3 flex items-baseline gap-3">
				<span
					class="mono text-[10px] uppercase tracking-[0.22em]"
					style="color: var(--ink);"
				>
					{tier.label}
				</span>
				<span
					class="mono text-[10px]"
					style="color: var(--ink-faint);"
				>
					— {tier.note}
				</span>
			</div>
			<p class="text-[16px] leading-[1.8]" style="color: var(--ink);">
				{#each tier.items as item, i}
					{item}{#if i < tier.items.length - 1}<span style="color: var(--ink-faint);"
							>&nbsp;·&nbsp;</span
						>{/if}
				{/each}
			</p>
		</div>
	{/each}

	<!-- Milestones -->
	<div class="border-t pt-10" style="border-color: var(--border);">
		<span
			class="mono text-[10px] uppercase tracking-[0.22em]"
			style="color: var(--ink);"
		>
			Milestones
		</span>
		<ul class="mt-4 space-y-2">
			{#each achievements as a}
				<li
					class="flex gap-3 text-[15px] leading-[1.7]"
					style="color: var(--ink-muted);"
				>
					<span style="color: var(--ink-faint);" aria-hidden="true">—</span>
					<span>{a}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
