<script lang="ts">
	let {
		value = $bindable<string>(''),
		label = 'Image',
		hint = ''
	}: { value: string; label?: string; hint?: string } = $props();

	let uploading = $state(false);
	let error = $state('');
	let fileInputEl = $state<HTMLInputElement | null>(null);

	async function onFileChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		uploading = true;
		error = '';
		try {
			const fd = new FormData();
			fd.append('file', file);
			const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
			if (!res.ok) {
				const body = (await res.json().catch(() => ({}))) as { error?: string };
				error = body.error ?? `Upload failed (${res.status})`;
				return;
			}
			const { url } = (await res.json()) as { url: string };
			value = url;
		} finally {
			uploading = false;
			if (fileInputEl) fileInputEl.value = '';
		}
	}

	function clear() {
		value = '';
	}
</script>

<div>
	<div class="flex flex-wrap items-baseline justify-between gap-2">
		<span class="mono text-[10px] uppercase tracking-[0.15em]" style="color: var(--ink-muted);">
			{label}
		</span>
		{#if hint}
			<span class="mono text-[10px]" style="color: var(--ink-faint);">{hint}</span>
		{/if}
	</div>
	<div class="mt-2 flex flex-wrap items-start gap-3">
		<div
			class="shrink-0 overflow-hidden rounded-sm border"
			style="border-color: var(--border-strong); width: 96px; height: 96px;"
		>
			{#if value}
				<img src={value} alt="preview" class="h-full w-full object-cover" />
			{:else}
				<div
					class="flex h-full w-full items-center justify-center"
					style="background: var(--bg-subtle); color: var(--ink-faint);"
				>
					<span class="mono text-[10px] uppercase">empty</span>
				</div>
			{/if}
		</div>
		<div class="flex min-w-0 flex-1 flex-col gap-2">
			<input
				type="text"
				bind:value
				placeholder="/images/... or full URL"
				class="mono w-full border px-3 py-2 text-[12px] outline-none"
				style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
			/>
			<div class="flex flex-wrap items-center gap-2">
				<button
					type="button"
					onclick={() => fileInputEl?.click()}
					disabled={uploading}
					class="mono px-3 py-1.5 text-[10px] uppercase tracking-[0.12em]"
					style="color: var(--ink); border: 1px solid var(--border-strong);"
				>
					{uploading ? 'uploading…' : '↑ upload'}
				</button>
				{#if value}
					<button
						type="button"
						onclick={clear}
						class="mono px-3 py-1.5 text-[10px] uppercase tracking-[0.12em]"
						style="color: #ef4444; border: 1px solid var(--border-strong);"
					>
						clear
					</button>
				{/if}
			</div>
			{#if error}
				<span class="mono text-[11px]" style="color: #ef4444;">{error}</span>
			{/if}
		</div>
	</div>
	<input
		bind:this={fileInputEl}
		type="file"
		accept="image/*"
		class="hidden"
		onchange={onFileChange}
	/>
</div>
