<script lang="ts">
	import { profile } from '$lib/content/profile';
</script>

<footer class="mt-10 py-16">
	<div class="mx-auto max-w-3xl px-6">
		<div
			class="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center"
		>
			<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
				<a
					href="mailto:{profile.email}"
					class="link-reveal text-xs"
					style="color: var(--ink-muted);"
				>
					email
				</a>
				<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
				<a
					href={profile.socials.github}
					target="_blank"
					rel="noopener noreferrer"
					class="link-reveal text-xs"
					style="color: var(--ink-muted);"
				>
					github
				</a>
				<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
				<a
					href={profile.socials.x}
					target="_blank"
					rel="noopener noreferrer"
					class="link-reveal text-xs"
					style="color: var(--ink-muted);"
				>
					twitter
				</a>
				<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
				<a
					href={profile.socials.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					class="link-reveal text-xs"
					style="color: var(--ink-muted);"
				>
					linkedin
				</a>
				<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
				<a
					href={profile.socials.leetcode}
					target="_blank"
					rel="noopener noreferrer"
					class="link-reveal text-xs"
					style="color: var(--ink-muted);"
				>
					leetcode
				</a>
				<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
				<a
					href={profile.socials.mankind}
					target="_blank"
					rel="noopener noreferrer"
					class="link-reveal text-xs"
					style="color: var(--ink-muted);"
				>
					themankindproject
				</a>
				<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
				<a href="/rss.xml" class="link-reveal text-xs" style="color: var(--ink-muted);">
					rss
				</a>
			</div>
			<span
				class="mono tabular-nums text-[10px] uppercase tracking-[0.1em]"
				style="color: var(--ink-faint);"
			>
				© {new Date().getFullYear()} · bravo1goingdark
			</span>
		</div>
	</div>
</footer>
