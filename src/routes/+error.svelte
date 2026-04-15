<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status} — Ashutosh Kumar</title>
</svelte:head>

<div class="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-6">
	<span
		class="mono tabular-nums text-[11px] uppercase tracking-[0.2em]"
		style="color: var(--ink-muted);"
	>
		— {$page.status}
	</span>
	<h1 class="serif mt-5 text-[64px] leading-[0.95] sm:text-[84px]" style="color: var(--ink);">
		{#if $page.status === 404}
			lost.
		{:else}
			broken.
		{/if}
	</h1>
	<p class="mt-6 max-w-md text-[15px] leading-relaxed" style="color: var(--ink-muted);">
		{$page.error?.message ?? "This page doesn't exist."}
	</p>
	<a
		href="/"
		class="link-reveal mt-8 inline-block w-fit text-sm"
		style="color: var(--ink);"
	>
		← back home
	</a>
</div>
