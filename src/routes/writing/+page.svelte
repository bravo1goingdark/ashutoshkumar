<script lang="ts">
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import PostCard from '$lib/components/PostCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Writing — Ashutosh Kumar</title>
	<meta
		name="description"
		content="Notes on systems engineering, Rust, Go, and distributed infrastructure by Ashutosh Kumar."
	/>
</svelte:head>

<section class="mx-auto max-w-3xl px-6 pt-24 pb-16 sm:pt-32">
	<div class="flex items-center justify-between">
		<SectionHeader label="WRITING" />
		<a
			href="/admin"
			class="mono text-[10px] uppercase tracking-[0.2em] transition-opacity hover:opacity-50"
			style="color: var(--ink-faint);"
		>
			admin ↗
		</a>
	</div>

	<h1
		class="serif animate-in text-[64px] leading-[0.95] sm:text-[84px]"
		style="color: var(--ink);"
	>
		notes.
	</h1>

	<p
		class="animate-in animate-in-d1 mt-8 max-w-xl text-[17px] leading-[1.65]"
		style="color: var(--ink);"
	>
		Thoughts on systems, Rust, Go, and distributed infrastructure. Mostly things I wanted to
		read but couldn't find.
	</p>

	{#if data.posts.length > 0}
		{@const allTags = [...new Set(data.posts.flatMap((p) => p.tags))].sort()}
		{#if allTags.length > 0}
			<div class="animate-in animate-in-d2 mt-10 flex flex-wrap gap-x-3 gap-y-1">
				{#each allTags as tag}
					<span
						class="mono text-[10px] uppercase tracking-[0.15em]"
						style="color: var(--ink-faint);"
					>
						{tag}
					</span>
				{/each}
			</div>
		{/if}
	{/if}

	<div class="mt-20">
		{#if data.posts.length === 0}
			<p class="py-12 text-sm" style="color: var(--ink-muted);">Nothing yet. Soon.</p>
		{:else}
			{#each data.posts as post}
				<PostCard {post} />
			{/each}
			<div class="border-t" style="border-color: var(--border);"></div>
		{/if}
	</div>
</section>
