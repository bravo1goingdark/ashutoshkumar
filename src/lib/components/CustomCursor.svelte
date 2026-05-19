<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let x = $state(-100);
	let y = $state(-100);
	let isPointer = $state(false);
	let isVisible = $state(false);
	let isClicking = $state(false);

	let rafId: number | null = null;
	let targetX = -100;
	let targetY = -100;

	const prefersReducedMotion = () => {
		if (typeof window === 'undefined') return false;
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	};

	const isTouchDevice = () => {
		if (typeof window === 'undefined') return false;
		return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	};

	function lerp(start: number, end: number, factor: number) {
		return start + (end - start) * factor;
	}

	function animate() {
		x = lerp(x, targetX, 0.15);
		y = lerp(y, targetY, 0.15);
		rafId = requestAnimationFrame(animate);
	}

	function handleMouseMove(e: MouseEvent) {
		targetX = e.clientX;
		targetY = e.clientY;

		if (!isVisible) {
			isVisible = true;
		}
	}

	function handleMouseOver(e: MouseEvent) {
		const target = e.target as HTMLElement;
		const isInteractive =
			target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer') !== null;
		isPointer = isInteractive;
	}

	function handleMouseDown() {
		isClicking = true;
	}

	function handleMouseUp() {
		isClicking = false;
	}

	function handleMouseLeave() {
		isVisible = false;
	}

	function handleMouseEnter() {
		isVisible = true;
	}

	onMount(() => {
		if (prefersReducedMotion() || isTouchDevice()) {
			return;
		}

		window.addEventListener('mousemove', handleMouseMove, { passive: true });
		window.addEventListener('mouseover', handleMouseOver, { passive: true });
		window.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mouseup', handleMouseUp);
		window.addEventListener('mouseleave', handleMouseLeave);
		window.addEventListener('mouseenter', handleMouseEnter);

		rafId = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseover', handleMouseOver);
			window.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mouseup', handleMouseUp);
			window.removeEventListener('mouseleave', handleMouseLeave);
			window.removeEventListener('mouseenter', handleMouseEnter);
			if (rafId) {
				cancelAnimationFrame(rafId);
			}
		};
	});
</script>

{#if isVisible}
	<div
		class="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
		style="transform: translate({x - 4}px, {y - 4}px);"
	>
		<div
			class="rounded-full bg-white transition-all duration-200 ease-out"
			style="width: {isPointer ? 16 : 8}px; height: {isPointer ? 16 : 8}px; transform: scale({isClicking ? 0.8 : 1});"
		></div>
	</div>
{/if}
