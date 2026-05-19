<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let progress = $state(0);
	let visible = $state(false);

	let rafId: number | null = null;

	function updateProgress() {
		const scrollTop = window.scrollY;
		const docHeight = document.documentElement.scrollHeight - window.innerHeight;
		progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
		visible = window.scrollY > 100;

		if (visible) {
			rafId = requestAnimationFrame(updateProgress);
		}
	}

	onMount(() => {
		window.addEventListener('scroll', () => {
			if (!rafId) {
				rafId = requestAnimationFrame(updateProgress);
			}
		}, { passive: true });
	});

	onDestroy(() => {
		if (rafId) {
			cancelAnimationFrame(rafId);
		}
	});
</script>

<div
	class="fixed top-0 left-0 right-0 z-50 h-0.5 origin-left transition-opacity duration-300"
	style="background: var(--accent);"
	role="progressbar"
	aria-valuenow={Math.round(progress)}
	aria-valuemin="0"
	aria-valuemax="100"
	aria-label="Reading progress"
	class:opacity-0={!visible}
	class:opacity-100={visible}
>
	<div
		class="h-full transition-transform duration-100 ease-out"
		style="transform: scaleX({progress / 100});"
	></div>
</div>
