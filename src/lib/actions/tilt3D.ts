import type { Action } from 'svelte/action';

export interface Tilt3DOptions {
	maxTilt?: number;
	perspective?: number;
	scale?: number;
	speed?: number;
	easing?: string;
	glare?: boolean;
	maxGlare?: number;
}

const prefersReducedMotion = () => {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const isTouchDevice = () => {
	if (typeof window === 'undefined') return false;
	return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const tilt3D: Action<HTMLElement, Tilt3DOptions | void> = (
	node,
	options = {}
) => {
	const {
		maxTilt = 15,
		perspective = 1000,
		scale = 1.02,
		speed = 400,
		easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
		glare = true,
		maxGlare = 0.15
	} = options;

	if (prefersReducedMotion() || isTouchDevice()) {
		return;
	}

	node.style.transformStyle = 'preserve-3d';
	node.style.willChange = 'transform';

	let glareElement: HTMLElement | null = null;

	if (glare) {
		glareElement = document.createElement('div');
		glareElement.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			pointer-events: none;
			border-radius: inherit;
			background: linear-gradient(
				135deg,
				rgba(255, 255, 255, ${maxGlare}) 0%,
				rgba(255, 255, 255, 0) 60%
			);
			opacity: 0;
			transition: opacity ${speed}ms ${easing};
			z-index: 10;
		`;
		node.style.position = 'relative';
		node.style.overflow = 'hidden';
		node.appendChild(glareElement);
	}

	const handleMouseMove = (e: MouseEvent) => {
		const rect = node.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;
		const rotateX = ((y - centerY) / centerY) * -maxTilt;
		const rotateY = ((x - centerX) / centerX) * maxTilt;

		node.style.transition = `transform ${speed}ms ${easing}`;
		node.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;

		if (glareElement) {
			glareElement.style.opacity = '1';
			glareElement.style.background = `
				radial-gradient(
					circle at ${x}px ${y}px,
					rgba(255, 255, 255, ${maxGlare}) 0%,
					rgba(255, 255, 255, 0) 70%
				)
			`;
		}
	};

	const handleMouseLeave = () => {
		node.style.transition = `transform ${speed}ms ${easing}`;
		node.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
		
		if (glareElement) {
			glareElement.style.opacity = '0';
		}
	};

	const handleMouseEnter = () => {
		node.style.transition = 'none';
	};

	node.addEventListener('mouseenter', handleMouseEnter);
	node.addEventListener('mousemove', handleMouseMove);
	node.addEventListener('mouseleave', handleMouseLeave);

	return {
		destroy() {
			node.removeEventListener('mouseenter', handleMouseEnter);
			node.removeEventListener('mousemove', handleMouseMove);
			node.removeEventListener('mouseleave', handleMouseLeave);
			if (glareElement && glareElement.parentNode) {
				glareElement.parentNode.removeChild(glareElement);
			}
		}
	};
};
