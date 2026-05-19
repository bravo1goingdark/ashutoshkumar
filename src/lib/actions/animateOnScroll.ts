import type { Action } from 'svelte/action';

export interface AnimateOnScrollOptions {
	delay?: number;
	duration?: number;
	threshold?: number;
	stagger?: boolean;
	staggerDelay?: number;
}

const prefersReducedMotion = () => {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const animateOnScroll: Action<HTMLElement, AnimateOnScrollOptions | void> = (
	node,
	options = {}
) => {
	const {
		delay = 0,
		duration = 700,
		threshold = 0.1,
		stagger = false,
		staggerDelay = 80
	} = options;

	if (prefersReducedMotion()) {
		node.style.opacity = '1';
		node.style.transform = 'translateY(0)';
		return;
	}

	node.style.opacity = '0';
	node.style.transform = 'translateY(12px)';
	node.style.transition = `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const children = stagger ? Array.from(node.children) : [];
					children.forEach((child, index) => {
						const el = child as HTMLElement;
						el.style.opacity = '0';
						el.style.transform = 'translateY(8px)';
						el.style.transition = `opacity ${duration * 0.8}ms cubic-bezier(0.22, 1, 0.36, 1) ${index * staggerDelay}ms, transform ${duration * 0.8}ms cubic-bezier(0.22, 1, 0.36, 1) ${index * staggerDelay}ms`;
						requestAnimationFrame(() => {
							el.style.opacity = '1';
							el.style.transform = 'translateY(0)';
						});
					});

					requestAnimationFrame(() => {
						node.style.opacity = '1';
						node.style.transform = 'translateY(0)';
					});
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
