<script lang="ts">
	import { stats } from '$lib/content/profile';
</script>

<div
	class="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-b py-10 sm:grid-cols-4"
	style="border-color: var(--border);"
>
	{#each stats as stat}
		<div class="flex flex-col gap-3">
			<span class="stat-value tabular-nums">{stat.value}</span>
			<div class="flex flex-col gap-1">
				<span class="stat-label">{stat.label}</span>
				<span class="stat-detail">{stat.detail}</span>
			</div>
		</div>
	{/each}
</div>
