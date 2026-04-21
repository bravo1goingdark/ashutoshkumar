<script lang="ts">
	import { profile } from '$lib/content/profile';
	import StatsBand from './StatsBand.svelte';

	const PROFILE_PHOTO = 'https://avatars.githubusercontent.com/u/70029422?v=4';
</script>

<section class="relative overflow-hidden" id="top">
	<div class="mx-auto max-w-3xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
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

		<!-- Profile photo + Name -->
		<div class="animate-in animate-in-d1 mt-8 flex items-center gap-6 sm:mt-10">
			<img
				src={PROFILE_PHOTO}
				alt="Ashutosh Kumar"
				class="h-20 w-20 shrink-0 rounded-full border-2 sm:h-24 sm:w-24"
				style="border-color: var(--border-strong);"
			/>
			<h1
				class="serif text-[48px] leading-[0.92] sm:text-[72px] lg:text-[92px]"
				style="color: var(--ink);"
			>
				Ashutosh<br />Kumar.
			</h1>
		</div>

		<!-- Role line -->
		<p
			class="mono animate-in animate-in-d1 mt-6 text-[13px] uppercase tracking-[0.2em]"
			style="color: var(--ink-muted);"
		>
			Backend Engineer · Systems · Infrastructure · Go · Rust · TypeScript
		</p>

		<!-- Primary pitch -->
		<p
			class="animate-in animate-in-d2 mt-10 max-w-xl text-[18px] leading-[1.7]"
			style="color: var(--ink);"
		>
			{profile.bio}
		</p>

		<!-- Academic + availability -->
		<p
			class="animate-in animate-in-d2 mt-4 max-w-xl text-[15px] leading-[1.7]"
			style="color: var(--ink-muted);"
		>
			{profile.education}
			Looking for
			<em class="serif italic" style="color: var(--ink);">SDE-1</em>,
			<em class="serif italic" style="color: var(--ink);">Backend</em>, or
			<em class="serif italic" style="color: var(--ink);">Infrastructure Engineer</em>
			roles. Available immediately — open to full-time, internship, remote, India, or relocation.
		</p>

		<!-- Primary CTAs -->
		<div
			class="animate-in animate-in-d3 mt-10 flex flex-wrap items-center gap-3"
		>
			<a href="/ashutosh-kumar.pdf" download class="btn btn-primary">
				<span aria-hidden="true">↓</span>
				Download résumé
			</a>
			<a href="#hiring" class="btn btn-secondary">
				Get in touch
				<span aria-hidden="true">→</span>
			</a>
		</div>

		<!-- Quick links -->
		<div
			class="animate-in animate-in-d3 mt-6 flex flex-wrap items-center gap-x-4 gap-y-2"
		>
			<a
				href={profile.socials.github}
				target="_blank"
				rel="noopener noreferrer"
				class="link-reveal text-[13px]"
				style="color: var(--ink-muted);"
			>
				github
			</a>
			<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
			<a
				href={profile.socials.x}
				target="_blank"
				rel="noopener noreferrer"
				class="link-reveal text-[13px]"
				style="color: var(--ink-muted);"
			>
				twitter
			</a>
			<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
			<a
				href={profile.socials.linkedin}
				target="_blank"
				rel="noopener noreferrer"
				class="link-reveal text-[13px]"
				style="color: var(--ink-muted);"
			>
				linkedin
			</a>
			<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
			<a
				href={profile.socials.leetcode}
				target="_blank"
				rel="noopener noreferrer"
				class="link-reveal text-[13px]"
				style="color: var(--ink-muted);"
			>
				leetcode
			</a>
			<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
			<a
				href={profile.socials.mankind}
				target="_blank"
				rel="noopener noreferrer"
				class="link-reveal text-[13px]"
				style="color: var(--ink-muted);"
			>
				themankindproject
			</a>
		</div>

		<!-- Stats band -->
		<div class="animate-in animate-in-d4 mt-16">
			<StatsBand />
		</div>
	</div>
</section>
