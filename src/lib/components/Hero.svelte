<script lang="ts">
	import StatsBand from './StatsBand.svelte';
	import type { Profile, Stat } from '$lib/types';

	let { profile, stats }: { profile: Profile; stats: Stat[] } = $props();

	const FALLBACK_PHOTO = 'https://avatars.githubusercontent.com/u/70029422?v=4';
	const FALLBACK_RESUME = '/ashutosh-kumar.pdf';
	const photoSrc = $derived(profile.photo || FALLBACK_PHOTO);
	const resumeHref = $derived(profile.resumeUrl || FALLBACK_RESUME);

	const nameParts = $derived(profile.name.split(' '));
</script>

<section class="relative overflow-hidden" id="top">
	<div class="mx-auto max-w-3xl px-5 pt-16 pb-12 sm:px-6 sm:pt-28 sm:pb-20">
		<!-- Status pill -->
		{#if profile.available}
			<div class="animate-in pill">
				<span
					class="status-dot inline-block h-1.5 w-1.5 rounded-full"
					style="background: var(--accent);"
					aria-hidden="true"
				></span>
				Open to work · {profile.availableDate}
			</div>
		{/if}

		<!-- Name + Profile photo -->
		<div
			class="animate-in animate-in-d1 mt-8 flex flex-col items-start gap-5 sm:mt-10 sm:flex-row sm:items-start sm:gap-8"
		>
			<h1
				class="serif text-[44px] leading-[0.95] break-words sm:text-[72px] lg:text-[92px]"
				style="color: var(--ink);"
			>
				{#if nameParts.length > 1}
					{nameParts.slice(0, -1).join(' ')}<br />{nameParts[nameParts.length - 1]}.
				{:else}
					{profile.name}.
				{/if}
			</h1>
			<img
				src={photoSrc}
				alt={profile.name}
				class="h-24 w-24 shrink-0 rounded-full border-2 sm:h-40 sm:w-40 sm:border-4 lg:h-48 lg:w-48"
				style="border-color: var(--border-strong);"
				loading="eager"
				fetchpriority="high"
			/>
		</div>

		<!-- Role line -->
		<p
			class="mono animate-in animate-in-d1 mt-6 text-[11px] uppercase tracking-[0.12em] sm:text-[13px] sm:tracking-[0.2em]"
			style="color: var(--ink-muted);"
		>
			{profile.role} · {profile.tagline}
		</p>

		<!-- Primary pitch -->
		<p
			class="animate-in animate-in-d2 mt-8 max-w-xl text-[16px] leading-[1.7] sm:mt-10 sm:text-[18px]"
			style="color: var(--ink);"
		>
			{profile.bio}
		</p>

		<!-- Academic + availability -->
		<p
			class="animate-in animate-in-d2 mt-4 max-w-xl text-[14px] leading-[1.7] sm:text-[15px]"
			style="color: var(--ink-muted);"
		>
			{profile.education}
		</p>

		<!-- Primary CTAs -->
		<div class="animate-in animate-in-d3 mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
			<a href={resumeHref} download class="btn btn-primary">
				<span aria-hidden="true">↓</span>
				Download résumé
			</a>
			<a href="#hiring" class="btn btn-secondary">
				Get in touch
				<span aria-hidden="true">→</span>
			</a>
		</div>

		<!-- Quick links -->
		<div class="animate-in animate-in-d3 mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
			{#if profile.socials.github}
				<a
					href={profile.socials.github}
					target="_blank"
					rel="noopener noreferrer"
					class="link-reveal text-[13px]"
					style="color: var(--ink-muted);">github</a
				>
				<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
			{/if}
			{#if profile.socials.x}
				<a
					href={profile.socials.x}
					target="_blank"
					rel="noopener noreferrer"
					class="link-reveal text-[13px]"
					style="color: var(--ink-muted);">twitter</a
				>
				<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
			{/if}
			{#if profile.socials.linkedin}
				<a
					href={profile.socials.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					class="link-reveal text-[13px]"
					style="color: var(--ink-muted);">linkedin</a
				>
				<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
			{/if}
			{#if profile.socials.leetcode}
				<a
					href={profile.socials.leetcode}
					target="_blank"
					rel="noopener noreferrer"
					class="link-reveal text-[13px]"
					style="color: var(--ink-muted);">leetcode</a
				>
				<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
			{/if}
			{#if profile.socials.mankind}
				<a
					href={profile.socials.mankind}
					target="_blank"
					rel="noopener noreferrer"
					class="link-reveal text-[13px]"
					style="color: var(--ink-muted);">themankindproject</a
				>
			{/if}
		</div>

		<!-- Stats band -->
		<div class="animate-in animate-in-d4 mt-12 sm:mt-16">
			<StatsBand {stats} />
		</div>
	</div>
</section>
