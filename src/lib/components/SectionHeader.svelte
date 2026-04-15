<script lang="ts">
	let { label }: { label: string } = $props();
</script>

<div class="mb-12">
	<span
		class="mono text-[11px] uppercase tracking-[0.2em]"
		style="color: var(--ink-muted);"
	>
		— {label}
	</span>
</div>
