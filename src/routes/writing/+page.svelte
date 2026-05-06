<script lang="ts">
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import { animateOnScroll } from '$lib/actions/animateOnScroll';

	let { data } = $props();

	interface SeriesPost {
		slug: string;
		title: string;
		description: string;
		date: string;
		tags: string[];
		readTime?: string;
		series: string;
		seriesOrder: number;
	}

	const posts = $derived(data.posts as SeriesPost[]);
	const series = $derived(data.series as string[]);

	const standalonePosts = $derived(posts.filter((p) => !p.series));
	const seriesMap = $derived(() => {
		const map: Record<string, SeriesPost[]> = {};
		for (const p of posts) {
			if (p.series) {
				if (!map[p.series]) map[p.series] = [];
				map[p.series].push(p);
			}
		}
		for (const key of Object.keys(map)) {
			map[key].sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0) || new Date(a.date).getTime() - new Date(b.date).getTime());
		}
		return map;
	});

	const seriesOrder = $derived(series.filter((s) => seriesMap()[s]?.length));
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

	{#if posts.length > 0}
		{@const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort()}
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
		{#if posts.length === 0}
			<p class="py-12 text-sm" style="color: var(--ink-muted);">Nothing yet. Soon.</p>
		{:else}
			<!-- Series sections -->
			{#each seriesOrder as seriesName}
				{@const seriesPosts = seriesMap()[seriesName]}
				{#if seriesPosts.length > 0}
					<div class="mb-16">
						<div class="mb-6 flex items-baseline gap-3">
							<span
								class="mono text-[10px] uppercase tracking-[0.22em]"
								style="color: var(--ink);"
							>
								SERIES: {seriesName.toUpperCase()}
							</span>
							<span class="mono text-[10px]" style="color: var(--ink-faint);">
								— {seriesPosts.length} {seriesPosts.length === 1 ? 'part' : 'parts'}
							</span>
						</div>
						<ul class="list-none">
							{#each seriesPosts as post}
								<li><PostCard {post} /></li>
							{/each}
						</ul>
						<div class="border-t" style="border-color: var(--border);"></div>
					</div>
				{/if}
			{/each}

			<!-- Standalone posts -->
			{#if standalonePosts.length > 0}
				{#if seriesOrder.length > 0}
					<div class="mb-8 flex items-baseline gap-3">
						<span
							class="mono text-[10px] uppercase tracking-[0.22em]"
							style="color: var(--ink);"
						>
							STANDALONE
						</span>
					</div>
				{/if}
				<ul class="list-none">
					{#each standalonePosts as post}
						<li><PostCard {post} /></li>
					{/each}
				</ul>
				<div class="border-t" style="border-color: var(--border);"></div>
			{/if}
		{/if}
	</div>
</section>
