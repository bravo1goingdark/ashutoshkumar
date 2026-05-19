<script lang="ts">
	import { onMount } from 'svelte';

	let time = $state(0);
	let rafId: number;

	const prefersReducedMotion = () => {
		if (typeof window === 'undefined') return false;
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	};

	onMount(() => {
		if (prefersReducedMotion()) return;

		let lastTime = performance.now();

		const animate = (currentTime: number) => {
			const delta = (currentTime - lastTime) / 1000;
			lastTime = currentTime;
			time += delta * 0.1;
			rafId = requestAnimationFrame(animate);
		};

		rafId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(rafId);
		};
	});
</script>

<svg
	class="fixed inset-0 w-full h-full pointer-events-none -z-10 opacity-[0.03]"
	viewBox="0 0 100 100"
	preserveAspectRatio="xMidYMid slice"
	aria-hidden="true"
>
	<defs>
		<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
			<stop offset="0%" style="stop-color:var(--accent);stop-opacity:0.3" />
			<stop offset="100%" style="stop-color:var(--ink);stop-opacity:0.1" />
		</linearGradient>
		<linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
			<stop offset="0%" style="stop-color:var(--accent);stop-opacity:0.2" />
			<stop offset="100%" style="stop-color:var(--ink-muted);stop-opacity:0.1" />
		</linearGradient>
	</defs>

	<!-- Floating geometric shapes -->
	<g transform={`translate(${50 + Math.sin(time) * 10}, ${50 + Math.cos(time * 0.7) * 10})`}>
		<circle cx="0" cy="0" r="15" fill="none" stroke="url(#grad1)" stroke-width="0.2" />
	</g>

	<g transform={`translate(${30 + Math.cos(time * 0.8) * 8}, ${40 + Math.sin(time * 0.6) * 8})`}>
		<rect
			x="-8"
			y="-8"
			width="16"
			height="16"
			fill="none"
			stroke="url(#grad2)"
			stroke-width="0.2"
			transform={`rotate(${time * 20})`}
		/>
	</g>

	<g transform={`translate(${70 + Math.sin(time * 0.9) * 12}, ${60 + Math.cos(time * 0.5) * 12})`}>
		<polygon
			points="0,-10 10,10 -10,10"
			fill="none"
			stroke="url(#grad1)"
			stroke-width="0.2"
			transform={`rotate(${time * -15})`}
		/>
	</g>

	<!-- Connecting lines -->
	<line
		x1={50 + Math.sin(time) * 10}
		y1={50 + Math.cos(time * 0.7) * 10}
		x2={30 + Math.cos(time * 0.8) * 8}
		y2={40 + Math.sin(time * 0.6) * 8}
		stroke="url(#grad1)"
		stroke-width="0.1"
		opacity="0.5"
	/>

	<line
		x1={30 + Math.cos(time * 0.8) * 8}
		y1={40 + Math.sin(time * 0.6) * 8}
		x2={70 + Math.sin(time * 0.9) * 12}
		y2={60 + Math.cos(time * 0.5) * 12}
		stroke="url(#grad2)"
		stroke-width="0.1"
		opacity="0.5"
	/>

	<!-- Dots at intersections -->
	<circle cx={50 + Math.sin(time) * 10} cy={50 + Math.cos(time * 0.7) * 10} r="0.5" fill="var(--accent)" />
	<circle cx={30 + Math.cos(time * 0.8) * 8} cy={40 + Math.sin(time * 0.6) * 8} r="0.5" fill="var(--accent)" />
	<circle cx={70 + Math.sin(time * 0.9) * 12} cy={60 + Math.cos(time * 0.5) * 12} r="0.5" fill="var(--accent)" />
</svg>
