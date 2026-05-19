import type { Action } from 'svelte/action';

export interface TypingOptions {
	text: string;
	speed?: number;
	startDelay?: number;
	cursorChar?: string;
	cursorBlink?: boolean;
	loop?: boolean;
	loopDelay?: number;
}

const prefersReducedMotion = () => {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const typing: Action<HTMLElement, TypingOptions> = (
	node,
	options
) => {
	let {
		text = '',
		speed = 50,
		startDelay = 500,
		cursorChar = '|',
		cursorBlink = true,
		loop = false,
		loopDelay = 3000
	} = options ?? { text: '' };

	if (prefersReducedMotion()) {
		node.textContent = text;
		return;
	}

	let timeout: ReturnType<typeof setTimeout>;
	let currentIndex = 0;
	let isDeleting = false;

	const cursorSpan = document.createElement('span');
	cursorSpan.style.cssText = `
		display: inline-block;
		opacity: 1;
		margin-left: 2px;
		animation: blink 1s step-end infinite;
	`;
	cursorSpan.textContent = cursorChar;

	const style = document.createElement('style');
	style.textContent = `
		@keyframes blink {
			0%, 50% { opacity: 1; }
			51%, 100% { opacity: 0; }
		}
	`;
	document.head.appendChild(style);

	if (!cursorBlink) {
		cursorSpan.style.animation = 'none';
	}

	const type = () => {
		if (!isDeleting) {
			currentIndex++;
			node.textContent = text.substring(0, currentIndex);
			node.appendChild(cursorSpan);

			if (currentIndex < text.length) {
				timeout = setTimeout(type, speed);
			} else if (loop) {
				timeout = setTimeout(() => {
					isDeleting = true;
					type();
				}, loopDelay);
			}
		} else {
			currentIndex--;
			node.textContent = text.substring(0, currentIndex);
			node.appendChild(cursorSpan);

			if (currentIndex > 0) {
				timeout = setTimeout(type, speed / 2);
			} else {
				isDeleting = false;
				timeout = setTimeout(type, startDelay);
			}
		}
	};

	timeout = setTimeout(type, startDelay);

	return {
		update(newOptions) {
			text = newOptions?.text ?? text;
			currentIndex = 0;
			isDeleting = false;
			clearTimeout(timeout);
			timeout = setTimeout(type, startDelay);
		},
		destroy() {
			clearTimeout(timeout);
			if (cursorSpan.parentNode) {
				cursorSpan.parentNode.removeChild(cursorSpan);
			}
			if (style.parentNode) {
				style.parentNode.removeChild(style);
			}
		}
	};
};
