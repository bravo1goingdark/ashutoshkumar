<script lang="ts">
	import type { Post } from '$lib/types';

	let { post }: { post: Post } = $props();

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<article>
	<a
		href="/writing/{post.slug}"
		class="row-hover group block border-t -mx-4 px-4 py-7 hover:no-underline"
		style="border-color: var(--border);"
	>
		<div class="flex items-start justify-between gap-6">
			<div class="min-w-0 flex-1">
				<h3
					class="serif text-[24px] leading-tight transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-[28px]"
					style="color: var(--ink);"
				>
					{post.title}
				</h3>
				<p
					class="mt-2.5 max-w-xl text-[14px] leading-[1.6]"
					style="color: var(--ink-muted);"
				>
					{post.description}
				</p>
				<div class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
					{#each post.tags as tag, i}
						<span
							class="mono text-[10px] uppercase tracking-[0.15em]"
							style="color: var(--ink-faint);"
						>
							{tag}
						</span>
						{#if i < post.tags.length - 1}
							<span
								class="text-[10px]"
								style="color: var(--ink-faint);"
								aria-hidden="true"
							>
								·
							</span>
						{/if}
					{/each}
				</div>
			</div>

			<div class="flex shrink-0 flex-col items-end gap-1 pt-2">
				<time
					datetime={post.date}
					class="mono tabular-nums text-[10px] uppercase tracking-[0.1em]"
					style="color: var(--ink-faint);"
				>
					{formatDate(post.date)}
				</time>
				{#if post.readTime}
					<span
						class="mono text-[10px] uppercase tracking-[0.1em]"
						style="color: var(--ink-faint);"
					>
						{post.readTime}
					</span>
				{/if}
			</div>
		</div>
	</a>
</article>
