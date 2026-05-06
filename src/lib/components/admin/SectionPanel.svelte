<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		hint = '',
		saving = false,
		saveMsg = '',
		onSave,
		children
	}: {
		title: string;
		hint?: string;
		saving?: boolean;
		saveMsg?: string;
		onSave: () => void;
		children: Snippet;
	} = $props();
</script>

<section class="border-t pt-6 sm:pt-8" style="border-color: var(--border);">
	<div class="mb-5 flex flex-wrap items-baseline justify-between gap-3 sm:mb-6">
		<div>
			<h2 class="serif text-[20px] leading-tight sm:text-[24px]" style="color: var(--ink);">
				{title}
			</h2>
			{#if hint}
				<p class="mono mt-1 text-[10px] uppercase tracking-[0.12em]" style="color: var(--ink-faint);">
					{hint}
				</p>
			{/if}
		</div>
		<div class="flex items-center gap-3">
			{#if saveMsg}
				<span
					class="mono text-[11px]"
					style="color: {saveMsg.startsWith('Error') ? '#ef4444' : 'var(--accent)'};"
				>
					{saveMsg}
				</span>
			{/if}
			<button
				type="button"
				onclick={onSave}
				disabled={saving}
				class="btn btn-primary"
			>
				{saving ? 'saving…' : 'save'}
			</button>
		</div>
	</div>

	<div class="space-y-5">
		{@render children()}
	</div>
</section>
