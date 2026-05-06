<script lang="ts">
	import { onMount } from 'svelte';
	import type { Profile, SiteSections } from '$lib/types';

	let { profile, sections }: { profile: Profile; sections: SiteSections } = $props();

	let menuOpen = $state(false);
	let isDark = $state(false);

	onMount(() => {
		const saved = localStorage.getItem('theme');
		if (saved === 'dark') {
			isDark = true;
		} else if (saved === 'light') {
			isDark = false;
		} else {
			isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
	});

	function toggleTheme() {
		isDark = !isDark;
		const next = isDark ? 'dark' : 'light';
		localStorage.setItem('theme', next);
		document.documentElement.setAttribute('data-theme', next);
	}

	function close() {
		menuOpen = false;
	}

	const resumeHref = $derived(profile.resumeUrl || '/ashutosh-kumar.pdf');
	const navName = $derived(profile.name.toLowerCase());
	const navTagline = $derived(profile.role);

	// Build nav links from configured visible sections; writing always points to /writing route.
	const links = $derived.by(() => {
		const out: { href: string; label: string }[] = [];
		if (sections.work.visible) {
			out.push({ href: `/#${sections.work.id}`, label: sections.work.label.toLowerCase() });
		}
		if (sections.experience.visible) {
			out.push({
				href: `/#${sections.experience.id}`,
				label: sections.experience.label.toLowerCase()
			});
		}
		if (sections.stack.visible) {
			out.push({ href: `/#${sections.stack.id}`, label: sections.stack.label.toLowerCase() });
		}
		if (sections.writing.visible) {
			out.push({ href: '/writing', label: 'writing' });
		}
		return out;
	});
</script>

<header
	class="sticky top-0 z-50 backdrop-blur-md"
	style="background: color-mix(in srgb, var(--bg) 88%, transparent);"
>
	<nav class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
		<!-- Logo -->
		<a href="/" onclick={close} class="flex items-baseline gap-2 min-w-0">
			<span class="truncate text-sm font-medium tracking-tight" style="color: var(--ink);">
				{navName}
			</span>
			<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
			<span class="hidden truncate text-[11px] sm:inline" style="color: var(--ink-muted);">
				{navTagline}
			</span>
		</a>

		<!-- Right side -->
		<div class="flex items-center gap-2">
			<!-- Desktop links -->
			<div class="hidden items-center gap-5 sm:flex">
				{#each links as link}
					<a href={link.href} class="link-reveal text-[12px]" style="color: var(--ink-muted);">
						{link.label}
					</a>
				{/each}
				<a
					href={resumeHref}
					download
					class="link-reveal text-[12px]"
					style="color: var(--ink-muted);"
				>
					cv ↓
				</a>
			</div>

			<!-- Theme toggle -->
			<button
				onclick={toggleTheme}
				class="flex h-8 w-8 items-center justify-center transition-opacity hover:opacity-60"
				aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
				title={isDark ? 'Light mode' : 'Dark mode'}
			>
				{#if isDark}
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						style="color: var(--ink-muted);"
					>
						<circle cx="12" cy="12" r="5" />
						<line x1="12" y1="1" x2="12" y2="3" />
						<line x1="12" y1="21" x2="12" y2="23" />
						<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
						<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
						<line x1="1" y1="12" x2="3" y2="12" />
						<line x1="21" y1="12" x2="23" y2="12" />
						<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
						<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
					</svg>
				{:else}
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						style="color: var(--ink-muted);"
					>
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
					</svg>
				{/if}
			</button>

			<!-- Mobile hamburger -->
			<button
				onclick={() => (menuOpen = !menuOpen)}
				class="flex h-8 w-8 flex-col items-center justify-center gap-[5px] sm:hidden"
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			>
				<span
					class="block h-px w-5 origin-center transition-all duration-200"
					style="background: var(--ink); transform: {menuOpen
						? 'translateY(6px) rotate(45deg)'
						: 'none'};"
				></span>
				<span
					class="block h-px w-5 transition-all duration-200"
					style="background: var(--ink); opacity: {menuOpen ? 0 : 1};"
				></span>
				<span
					class="block h-px w-5 origin-center transition-all duration-200"
					style="background: var(--ink); transform: {menuOpen
						? 'translateY(-6px) rotate(-45deg)'
						: 'none'};"
				></span>
			</button>
		</div>
	</nav>

	<!-- Mobile menu dropdown -->
	{#if menuOpen}
		<div class="border-t sm:hidden" style="border-color: var(--border); background: var(--bg);">
			<div class="mx-auto max-w-3xl px-4 py-2 sm:px-6">
				{#each links as link}
					<a
						href={link.href}
						onclick={close}
						class="block border-b py-3 text-[15px] font-medium sm:py-4"
						style="color: var(--ink); border-color: var(--border);"
					>
						{link.label}
					</a>
				{/each}
				<a
					href={resumeHref}
					download
					onclick={close}
					class="block py-3 text-[15px] font-medium sm:py-4"
					style="color: var(--ink);"
				>
					cv ↓
				</a>
			</div>
		</div>
	{/if}
</header>
