import type { Action } from 'svelte/action';

export interface AnimateCounterOptions {
	duration?: number;
	delay?: number;
	decimals?: number;
	suffix?: string;
	prefix?: string;
}

const prefersReducedMotion = () => {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const animateCounter: Action<HTMLElement, AnimateCounterOptions | void> = (
	node,
	options = {}
) => {
	const {
		duration = 2000,
		delay = 0,
		decimals = 0,
		suffix = '',
		prefix = ''
	} = options;

	const targetValue = parseFloat(node.textContent?.replace(/[^0-9.-]/g, '') ?? '0');
	
	if (isNaN(targetValue)) return;

	if (prefersReducedMotion()) {
		node.textContent = `${prefix}${targetValue.toFixed(decimals)}${suffix}`;
		return;
	}

	let startTime: number | null = null;
	let animationFrame: number;

	const easeOutExpo = (t: number): number => {
		return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
	};

	const animate = (timestamp: number) => {
		if (!startTime) startTime = timestamp;
		const elapsed = timestamp - startTime;
		const progress = Math.min(elapsed / duration, 1);
		const easedProgress = easeOutExpo(progress);
		const currentValue = targetValue * easedProgress;

		node.textContent = `${prefix}${currentValue.toFixed(decimals)}${suffix}`;

		if (progress < 1) {
			animationFrame = requestAnimationFrame(animate);
		}
	};

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setTimeout(() => {
						animationFrame = requestAnimationFrame(animate);
					}, delay);
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.5 }
	);

	observer.observe(node);

	return {
		destroy() {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
			observer.disconnect();
		}
	};
};
