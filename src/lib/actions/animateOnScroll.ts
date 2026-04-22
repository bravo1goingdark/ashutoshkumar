import type { Action } from 'svelte/action';

interface AnimateOptions {
	delay?: number;
	threshold?: number;
}

export const animateOnScroll: Action<HTMLElement, AnimateOptions | undefined> = (
	node,
	options = {}
) => {
	const { delay = 0, threshold = 0.1 } = options;

	// Respect reduced motion preference
	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (prefersReduced) {
		node.classList.add('animate-in');
		return { destroy() {} };
	}

	node.style.opacity = '0';
	node.style.transform = 'translateY(12px)';

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setTimeout(() => {
						node.classList.add('animate-in');
						node.style.opacity = '';
						node.style.transform = '';
					}, delay);
					observer.unobserve(node);
				}
			});
		},
		{ threshold, rootMargin: '0px 0px -40px 0px' }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
