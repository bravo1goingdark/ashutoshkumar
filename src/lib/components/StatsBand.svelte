<script lang="ts">
	import type { Stat } from '$lib/types';

	let { stats }: { stats: Stat[] } = $props();
</script>

<div
	class="grid grid-cols-2 gap-x-3 gap-y-6 border-t border-b py-8 sm:gap-x-6 sm:gap-y-10 sm:py-10 md:grid-cols-4"
	style="border-color: var(--border);"
>
	{#each stats as stat}
		<div class="flex flex-col gap-2 sm:gap-3">
			<span class="stat-value tabular-nums">{stat.value}</span>
			<div class="flex flex-col gap-1">
				<span class="stat-label">{stat.label}</span>
				<span class="stat-detail">{stat.detail}</span>
			</div>
		</div>
	{/each}
</div>
