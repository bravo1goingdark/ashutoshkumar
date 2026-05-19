import type { Action } from 'svelte/action';

export interface ParallaxOptions {
	speed?: number;
	direction?: 'up' | 'down' | 'left' | 'right';
	threshold?: number;
}

const prefersReducedMotion = () => {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const parallax: Action<HTMLElement, ParallaxOptions | void> = (
	node,
	options = {}
) => {
	const {
		speed = 0.5,
		direction = 'up',
		threshold = 0.1
	} = options;

	if (prefersReducedMotion()) {
		return;
	}

	node.style.willChange = 'transform';
	node.style.transition = 'transform 0.1s linear';

	const handleScroll = () => {
		const rect = node.getBoundingClientRect();
		const windowHeight = window.innerHeight;
		const scrolled = (windowHeight - rect.top) / (windowHeight + rect.height);
		const offset = (scrolled - 0.5) * 100 * speed;

		let transform = '';
		switch (direction) {
			case 'up':
				transform = `translateY(${offset}px)`;
				break;
			case 'down':
				transform = `translateY(${-offset}px)`;
				break;
			case 'left':
				transform = `translateX(${offset}px)`;
				break;
			case 'right':
				transform = `translateX(${-offset}px)`;
				break;
		}

		node.style.transform = transform;
	};

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					window.addEventListener('scroll', handleScroll, { passive: true });
					handleScroll();
				} else {
					window.removeEventListener('scroll', handleScroll);
				}
			});
		},
		{ threshold }
	);

	observer.observe(node);

	return {
		destroy() {
			window.removeEventListener('scroll', handleScroll);
			observer.disconnect();
		}
	};
};
