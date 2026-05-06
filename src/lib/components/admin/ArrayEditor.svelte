<script lang="ts">
	let {
		items = $bindable<string[]>([]),
		placeholder = '',
		multiline = false,
		label = ''
	}: {
		items: string[];
		placeholder?: string;
		multiline?: boolean;
		label?: string;
	} = $props();

	function add() {
		items = [...items, ''];
	}
	function remove(i: number) {
		items = items.filter((_, idx) => idx !== i);
	}
	function move(i: number, dir: -1 | 1) {
		const j = i + dir;
		if (j < 0 || j >= items.length) return;
		const next = items.slice();
		[next[i], next[j]] = [next[j], next[i]];
		items = next;
	}
	function setItem(i: number, value: string) {
		const next = items.slice();
		next[i] = value;
		items = next;
	}
</script>

{#if label}
	<span
		class="mono mb-2 block text-[10px] uppercase tracking-[0.15em]"
		style="color: var(--ink-muted);">{label}</span
	>
{/if}

<div class="space-y-2">
	{#each items as item, i (i)}
		<div class="flex items-start gap-2">
			{#if multiline}
				<textarea
					value={item}
					oninput={(e) => setItem(i, (e.currentTarget as HTMLTextAreaElement).value)}
					rows="2"
					{placeholder}
					class="mono w-full border px-3 py-2 text-[13px] leading-[1.5] outline-none"
					style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
				></textarea>
			{:else}
				<input
					type="text"
					value={item}
					oninput={(e) => setItem(i, (e.currentTarget as HTMLInputElement).value)}
					{placeholder}
					class="mono w-full border px-3 py-2 text-[13px] outline-none"
					style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
				/>
			{/if}
			<div class="flex shrink-0 flex-col gap-1 sm:flex-row">
				<button
					type="button"
					onclick={() => move(i, -1)}
					disabled={i === 0}
					title="Move up"
					class="mono px-2 py-1 text-[10px] uppercase disabled:opacity-30"
					style="color: var(--ink-muted); border: 1px solid var(--border-strong);">↑</button
				>
				<button
					type="button"
					onclick={() => move(i, 1)}
					disabled={i === items.length - 1}
					title="Move down"
					class="mono px-2 py-1 text-[10px] uppercase disabled:opacity-30"
					style="color: var(--ink-muted); border: 1px solid var(--border-strong);">↓</button
				>
				<button
					type="button"
					onclick={() => remove(i)}
					title="Remove"
					class="mono px-2 py-1 text-[10px] uppercase"
					style="color: #ef4444; border: 1px solid var(--border-strong);">×</button
				>
			</div>
		</div>
	{/each}
</div>

<button
	type="button"
	onclick={add}
	class="mono mt-3 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em]"
	style="color: var(--ink); border: 1px solid var(--border-strong);"
>
	+ add
</button>
