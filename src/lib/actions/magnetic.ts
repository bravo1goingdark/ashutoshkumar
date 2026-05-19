import type { Action } from 'svelte/action';

export interface MagneticOptions {
	intensity?: number;
	distance?: number;
	duration?: number;
	easing?: string;
}

const prefersReducedMotion = () => {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const isTouchDevice = () => {
	if (typeof window === 'undefined') return false;
	return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const magnetic: Action<HTMLElement, MagneticOptions | void> = (
	node,
	options = {}
) => {
	const {
		intensity = 0.3,
		distance = 50,
		duration = 300,
		easing = 'cubic-bezier(0.22, 1, 0.36, 1)'
	} = options;

	if (prefersReducedMotion() || isTouchDevice()) {
		return;
	}

	node.style.transition = `transform ${duration}ms ${easing}`;
	node.style.willChange = 'transform';

	let animationFrame: number | null = null;
	let currentX = 0;
	let currentY = 0;
	let targetX = 0;
	let targetY = 0;

	const lerp = (start: number, end: number, factor: number) => {
		return start + (end - start) * factor;
	};

	const animate = () => {
		currentX = lerp(currentX, targetX, intensity);
		currentY = lerp(currentY, targetY, intensity);

		node.style.transform = `translate(${currentX}px, ${currentY}px)`;

		if (Math.abs(currentX - targetX) > 0.1 || Math.abs(currentY - targetY) > 0.1) {
			animationFrame = requestAnimationFrame(animate);
		} else {
			animationFrame = null;
		}
	};

	const handleMouseMove = (e: MouseEvent) => {
		const rect = node.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		const deltaX = e.clientX - centerX;
		const deltaY = e.clientY - centerY;
		const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

		if (dist < distance) {
			const factor = 1 - dist / distance;
			targetX = deltaX * factor * 0.5;
			targetY = deltaY * factor * 0.5;

			if (!animationFrame) {
				animationFrame = requestAnimationFrame(animate);
			}
		} else {
			targetX = 0;
			targetY = 0;

			if (!animationFrame) {
				animationFrame = requestAnimationFrame(animate);
			}
		}
	};

	const handleMouseLeave = () => {
		targetX = 0;
		targetY = 0;

		if (!animationFrame) {
			animationFrame = requestAnimationFrame(animate);
		}
	};

	node.addEventListener('mousemove', handleMouseMove);
	node.addEventListener('mouseleave', handleMouseLeave);

	return {
		destroy() {
			node.removeEventListener('mousemove', handleMouseMove);
			node.removeEventListener('mouseleave', handleMouseLeave);
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
		}
	};
};
