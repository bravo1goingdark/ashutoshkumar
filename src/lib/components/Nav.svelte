<script lang="ts">
	import { page } from '$app/stores';
	let menuOpen = $state(false);

	function close() {
		menuOpen = false;
	}

	const links = [
		{ href: '/#work', label: 'work' },
		{ href: '/#experience', label: 'experience' },
		{ href: '/#stack', label: 'stack' },
		{ href: '/writing', label: 'writing' }
	] as const;
</script>

<header
	class="sticky top-0 z-50 backdrop-blur-md"
	style="background: color-mix(in srgb, var(--bg) 88%, transparent);"
>
	<nav class="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
		<!-- Logo -->
		<a href="/" onclick={close} class="flex items-baseline gap-2">
			<span class="text-sm font-medium tracking-tight" style="color: var(--ink);">
				ashutosh kumar
			</span>
			<span style="color: var(--ink-faint);" aria-hidden="true">·</span>
			<span class="hidden text-[11px] sm:inline" style="color: var(--ink-muted);">
				backend & systems
			</span>
		</a>

		<!-- Desktop links -->
		<div class="hidden items-center gap-5 sm:flex">
			{#each links as link}
				<a
					href={link.href}
					class="link-reveal text-[12px]"
					style="color: var(--ink-muted);"
				>
					{link.label}
				</a>
			{/each}
			<a
				href="/ashutosh-kumar.pdf"
				download
				class="link-reveal text-[12px]"
				style="color: var(--ink-muted);"
			>
				cv ↓
			</a>
		</div>

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
	</nav>

	<!-- Mobile menu dropdown -->
	{#if menuOpen}
		<div class="border-t sm:hidden" style="border-color: var(--border); background: var(--bg);">
			<div class="mx-auto max-w-3xl px-6 py-2">
				{#each links as link}
					<a
						href={link.href}
						onclick={close}
						class="block border-b py-4 text-[15px] font-medium"
						style="color: var(--ink); border-color: var(--border);"
					>
						{link.label}
					</a>
				{/each}
				<a
					href="/ashutosh-kumar.pdf"
					download
					onclick={close}
					class="block py-4 text-[15px] font-medium"
					style="color: var(--ink);"
				>
					cv ↓
				</a>
			</div>
		</div>
	{/if}
</header>
