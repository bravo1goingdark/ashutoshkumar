<script lang="ts">
	let { data } = $props();
	const { post, contentHtml } = data;

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
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

	<!-- Header -->
	<header class="mt-14 mb-14">
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
			<span>{formatDate(post.date)}</span>
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
	<div class="prose prose-sm max-w-none">
		{@html contentHtml}
	</div>

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
