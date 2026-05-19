<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { navigating } from '$app/stores';

	let transitioning = $state(false);
	let progress = $state(0);

	let rafId: number | null = null;

	const prefersReducedMotion = () => {
		if (typeof window === 'undefined') return false;
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	};

	onMount(() => {
		if (prefersReducedMotion()) return;

		const unsubscribe = navigating.subscribe((nav) => {
			if (nav && !transitioning) {
				transitioning = true;
				progress = 0;

				const startTime = performance.now();
				const duration = 300;

				const animate = (currentTime: number) => {
					const elapsed = currentTime - startTime;
					progress = Math.min(elapsed / duration, 1);
					
					if (progress < 1) {
						rafId = requestAnimationFrame(animate);
					} else {
						transitioning = false;
					}
				};

				rafId = requestAnimationFrame(animate);
			}
		});

		return () => {
			unsubscribe();
			if (rafId) {
				cancelAnimationFrame(rafId);
			}
		};
	});
</script>

{#if transitioning}
	<div
		class="fixed inset-0 z-40 pointer-events-none"
		style="background: var(--bg);"
	>
		<div
			class="absolute inset-0"
			style="opacity: {1 - progress}; background: var(--bg);"
		></div>
	</div>
{/if}
