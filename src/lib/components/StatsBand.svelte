<script lang="ts">
	import type { Stat } from '$lib/types';
	import { animateCounter } from '$lib/actions/animateCounter';

	let { stats }: { stats: Stat[] } = $props();

	function parseNumericValue(value: string): { numeric: boolean; number: number; prefix: string; suffix: string; decimals: number } {
		const match = value.match(/^([^\d]*)(\d+\.?\d*)(.*)$/);
		if (match) {
			const prefix = match[1];
			const number = parseFloat(match[2]);
			const suffix = match[3];
			const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0;
			return { numeric: true, number, prefix, suffix, decimals };
		}
		return { numeric: false, number: 0, prefix: '', suffix: '', decimals: 0 };
	}
</script>

<div
	class="grid grid-cols-2 gap-x-3 gap-y-6 border-t border-b py-8 sm:gap-x-6 sm:gap-y-10 sm:py-10 md:grid-cols-4"
	style="border-color: var(--border);"
>
	{#each stats as stat}
		{@const parsed = parseNumericValue(stat.value)}
		<div class="flex flex-col gap-2 sm:gap-3">
			{#if parsed.numeric}
				<span
					class="stat-value tabular-nums"
					use:animateCounter={{
						duration: 2000,
						delay: 200,
						decimals: parsed.decimals,
						prefix: parsed.prefix,
						suffix: parsed.suffix
					}}
				>
					{parsed.number}
				</span>
			{:else}
				<span class="stat-value tabular-nums">{stat.value}</span>
			{/if}
			<div class="flex flex-col gap-1">
				<span class="stat-label">{stat.label}</span>
				<span class="stat-detail">{stat.detail}</span>
			</div>
		</div>
	{/each}
</div>
