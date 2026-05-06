<script lang="ts">
	let { data } = $props();
	let post = $derived(data.post);
	let contentHtml = $derived(data.contentHtml);
	let seriesPosts = $derived(data.seriesPosts as { slug: string; title: string; seriesOrder: number }[]);

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	const currentIndex = $derived(
		seriesPosts.findIndex((p) => p.slug === post.slug)
	);
	const prevPost = $derived(currentIndex > 0 ? seriesPosts[currentIndex - 1] : null);
	const nextPost = $derived(currentIndex >= 0 && currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null);
</script>

<svelte:head>
	<title>{post.title} — Ashutosh Kumar</title>
	<meta name="description" content={post.description} />
	<meta property="og:title" content="{post.title} — Ashutosh Kumar" />
	<meta property="og:description" content={post.description} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="@bravo1goingdark" />
</svelte:head>

<article class="mx-auto max-w-2xl px-6 pt-16 pb-20 sm:pt-24">
	<!-- Back link -->
	<a
		href="/writing"
		class="mono link-reveal inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]"
		style="color: var(--ink-muted);"
	>
		← writing
	</a>

	<!-- Series banner -->
	{#if post.series && seriesPosts.length > 1}
		<div class="mt-8 border-l-2 pl-5 py-4" style="border-color: var(--border-strong);">
			<span
				class="mono text-[10px] uppercase tracking-[0.22em]"
				style="color: var(--ink);"
			>
				SERIES: {post.series.toUpperCase()}
			</span>
			<p class="mt-2 text-[14px]" style="color: var(--ink-muted);">
				Part {currentIndex + 1} of {seriesPosts.length}
			</p>
			{#if prevPost || nextPost}
				<nav class="mt-3 flex flex-wrap gap-4 text-[13px]">
					{#if prevPost}
						<a
							href="/writing/{prevPost.slug}"
							class="mono link-reveal"
							style="color: var(--ink-muted);"
						>
							← {prevPost.title}
						</a>
					{/if}
					{#if nextPost}
						<a
							href="/writing/{nextPost.slug}"
							class="mono link-reveal"
							style="color: var(--ink-muted);"
						>
							{nextPost.title} →
						</a>
					{/if}
				</nav>
			{/if}
		</div>
	{/if}

	<!-- Header -->
	<header class="mt-8 mb-14">
		<h1
			class="serif text-[40px] leading-[1.05] tracking-tight sm:text-[52px]"
			style="color: var(--ink);"
		>
			{post.title}
		</h1>

		{#if post.description}
			<p class="mt-7 max-w-xl text-[17px] leading-[1.65]" style="color: var(--ink-muted);">
				{post.description}
			</p>
		{/if}

		<div
			class="mono mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.15em]"
			style="color: var(--ink-faint);"
		>
			<time datetime={post.date}>{formatDate(post.date)}</time>
			{#if post.readTime}
				<span aria-hidden="true">·</span>
				<span>{post.readTime}</span>
			{/if}
			{#if post.tags?.length}
				<span aria-hidden="true">·</span>
				{#each post.tags as tag, i}
					<span>{tag}{#if i < post.tags.length - 1}<span aria-hidden="true">&nbsp;·&nbsp;</span>{/if}</span>
				{/each}
			{/if}
		</div>
	</header>

	<!-- Content rendered from markdown -->
	<article class="prose prose-sm max-w-none">
		{@html contentHtml}
	</article>

	<!-- Footer -->
	<div class="mt-20 border-t pt-8" style="border-color: var(--border);">
		<div class="flex items-center justify-between">
			<a
				href="/writing"
				class="mono link-reveal text-[11px] uppercase tracking-[0.2em]"
				style="color: var(--ink-muted);"
			>
				← all writing
			</a>
			<a
				href="https://x.com/bravo1goingdark"
				target="_blank"
				rel="noopener noreferrer"
				class="mono link-reveal text-[11px] uppercase tracking-[0.2em]"
				style="color: var(--ink-muted);"
			>
				discuss on x ↗
			</a>
		</div>
	</div>
</article>
