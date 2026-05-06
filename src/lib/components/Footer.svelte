<script lang="ts">
	import type { Profile } from '$lib/types';

	let { profile }: { profile: Profile } = $props();

	const handle = $derived(profile.handle || profile.name);
</script>

<footer class="mt-10 py-12 sm:py-16">
	<div class="mx-auto max-w-3xl px-5 sm:px-6">
		<div class="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
			<div class="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4">
				{#if profile.email}
					<a
						href="mailto:{profile.email}"
						class="link-reveal text-xs"
						style="color: var(--ink-muted);">email</a
					>
					<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
				{/if}
				{#if profile.socials.github}
					<a
						href={profile.socials.github}
						target="_blank"
						rel="noopener noreferrer"
						class="link-reveal text-xs"
						style="color: var(--ink-muted);">github</a
					>
					<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
				{/if}
				{#if profile.socials.x}
					<a
						href={profile.socials.x}
						target="_blank"
						rel="noopener noreferrer"
						class="link-reveal text-xs"
						style="color: var(--ink-muted);">twitter</a
					>
					<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
				{/if}
				{#if profile.socials.linkedin}
					<a
						href={profile.socials.linkedin}
						target="_blank"
						rel="noopener noreferrer"
						class="link-reveal text-xs"
						style="color: var(--ink-muted);">linkedin</a
					>
					<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
				{/if}
				{#if profile.socials.leetcode}
					<a
						href={profile.socials.leetcode}
						target="_blank"
						rel="noopener noreferrer"
						class="link-reveal text-xs"
						style="color: var(--ink-muted);">leetcode</a
					>
					<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
				{/if}
				{#if profile.socials.mankind}
					<a
						href={profile.socials.mankind}
						target="_blank"
						rel="noopener noreferrer"
						class="link-reveal text-xs"
						style="color: var(--ink-muted);">themankindproject</a
					>
					<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
				{/if}
				<a href="/rss.xml" class="link-reveal text-xs" style="color: var(--ink-muted);">rss</a>
			</div>
			<span
				class="mono tabular-nums text-[10px] uppercase tracking-[0.1em]"
				style="color: var(--ink-faint);"
			>
				© {new Date().getFullYear()} · {handle}
			</span>
		</div>
	</div>
</footer>
