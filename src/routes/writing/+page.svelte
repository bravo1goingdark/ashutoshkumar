<script lang="ts">
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import { animateOnScroll } from '$lib/actions/animateOnScroll';

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
		class="serif text-[64px] leading-[0.95] sm:text-[84px]"
		style="color: var(--ink);"
		use:animateOnScroll
	>
		notes.
	</h1>

	<p
		class="mt-8 max-w-xl text-[17px] leading-[1.65]"
		style="color: var(--ink);"
		use:animateOnScroll={{ delay: 80 }}
	>
		Thoughts on systems, Rust, Go, and distributed infrastructure. Mostly things I wanted to
		read but couldn't find.
	</p>

	{#if data.posts.length > 0}
		{@const allTags = [...new Set(data.posts.flatMap((p) => p.tags))].sort()}
		{#if allTags.length > 0}
			<div class="mt-10 flex flex-wrap gap-x-3 gap-y-1" use:animateOnScroll={{ delay: 160 }}>
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

	<div class="mt-20" use:animateOnScroll={{ delay: 100 }}>
		{#if data.posts.length === 0}
			<p class="py-12 text-sm" style="color: var(--ink-muted);">Nothing yet. Soon.</p>
		{:else}
			<ul class="list-none">
				{#each data.posts as post}
					<li><PostCard {post} /></li>
				{/each}
			</ul>
			<div class="border-t" style="border-color: var(--border);"></div>
		{/if}
	</div>
</section>
