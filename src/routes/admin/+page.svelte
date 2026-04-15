<script lang="ts">
	import { marked } from 'marked';

	let { data } = $props();

	// ── Auth gate ────────────────────────────────────────────
	let keyInput = $state('');
	let authError = $state('');
	let authLoading = $state(false);

	async function login() {
		authLoading = true;
		authError = '';
		try {
			const res = await fetch('/api/admin/auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key: keyInput })
			});
			if (res.ok) {
				window.location.reload();
			} else {
				const { error } = await res.json();
				authError = error ?? 'Invalid key';
			}
		} finally {
			authLoading = false;
		}
	}

	async function logout() {
		await fetch('/api/admin/auth', { method: 'DELETE' });
		window.location.reload();
	}

	// ── Editor state ─────────────────────────────────────────
	type View = 'list' | 'edit';
	let view = $state<View>('list');
	let editingSlug = $state<string | null>(null); // null = new post
	let tab = $state<'write' | 'preview'>('write');
	let saving = $state(false);
	let saveMsg = $state('');
	let deleteConfirm = $state(false);

	// Form fields
	let title = $state('');
	let slugField = $state('');
	let slugCustomized = $state(false);
	let description = $state('');
	let tagsInput = $state('');
	let date = $state(new Date().toISOString().slice(0, 10));
	let content = $state('');
	let published = $state(false);

	// Post list (reactive copy so we can update after save/delete)
	let posts = $state(data.posts ?? []);

	// Auto-derive slug from title unless user has manually edited it
	$effect(() => {
		if (!slugCustomized) {
			slugField = title
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, '')
				.replace(/\s+/g, '-')
				.replace(/-+/g, '-')
				.trim();
		}
	});

	function openNew() {
		editingSlug = null;
		slugCustomized = false;
		title = '';
		slugField = '';
		description = '';
		tagsInput = '';
		date = new Date().toISOString().slice(0, 10);
		content = '';
		published = false;
		tab = 'write';
		saveMsg = '';
		deleteConfirm = false;
		view = 'edit';
	}

	function openEdit(post: { slug: string; title: string; date: string; published: boolean }) {
		// Fetch full post content from API — re-use the public route
		fetch(`/api/admin/posts/${post.slug}`)
			.then((r) => r.json())
			.then((p) => {
				editingSlug = p.slug;
				slugCustomized = true;
				title = p.title;
				slugField = p.slug;
				description = p.description;
				tagsInput = Array.isArray(p.tags) ? p.tags.join(', ') : '';
				date = p.date;
				content = p.content;
				published = p.published;
				tab = 'write';
				saveMsg = '';
				deleteConfirm = false;
				view = 'edit';
			});
	}

	async function save() {
		if (!title.trim() || !slugField.trim() || !date) return;
		saving = true;
		saveMsg = '';
		try {
			const tags = tagsInput
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean);
			const body = {
				slug: slugField.trim(),
				title: title.trim(),
				description: description.trim(),
				date,
				tags,
				content,
				published
			};
			const method = editingSlug ? 'PUT' : 'POST';
			const url = editingSlug
				? `/api/admin/posts/${editingSlug}`
				: '/api/admin/posts';
			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
			if (!res.ok) {
				const { error } = await res.json();
				saveMsg = `Error: ${error}`;
				return;
			}
			const { slug: newSlug } = (await res.json()) as { slug?: string; ok: boolean };
			saveMsg = published ? 'Published.' : 'Saved as draft.';
			editingSlug = newSlug ?? slugField.trim();

			// Refresh list
			posts = await fetch('/api/admin/posts')
				.then((r) => r.json())
				.catch(() => posts);
		} finally {
			saving = false;
		}
	}

	async function remove() {
		if (!editingSlug) return;
		saving = true;
		try {
			await fetch(`/api/admin/posts/${editingSlug}`, { method: 'DELETE' });
			posts = posts.filter((p) => p.slug !== editingSlug);
			view = 'list';
		} finally {
			saving = false;
			deleteConfirm = false;
		}
	}

	let previewHtml = $derived(
		tab === 'preview' ? String(marked.parse(content || '_nothing yet_')) : ''
	);
</script>

<svelte:head>
	<title>Admin — Ashutosh Kumar</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="mx-auto max-w-3xl px-6 pt-20 pb-24">
	<!-- ── AUTH GATE ───────────────────────────────────────── -->
	{#if !data.authenticated}
		<div class="mt-8 max-w-xs">
			<p class="mono mb-8 text-[10px] uppercase tracking-[0.22em]" style="color: var(--ink);">
				Admin
			</p>
			<label class="block">
				<span class="mono block mb-2 text-[10px] uppercase tracking-[0.15em]" style="color: var(--ink-muted);">
					Write key
				</span>
				<input
					type="password"
					bind:value={keyInput}
					onkeydown={(e) => e.key === 'Enter' && login()}
					class="w-full border px-3 py-2.5 text-[14px] font-mono outline-none"
					style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
					placeholder="••••••••••••"
					autocomplete="current-password"
				/>
			</label>
			{#if authError}
				<p class="mono mt-2 text-[11px]" style="color: #ef4444;">{authError}</p>
			{/if}
			<button
				onclick={login}
				disabled={authLoading}
				class="btn btn-primary mt-4 w-full justify-center"
			>
				{authLoading ? 'checking…' : 'unlock →'}
			</button>
		</div>

	<!-- ── POST LIST ───────────────────────────────────────── -->
	{:else if view === 'list'}
		<div class="flex items-baseline justify-between">
			<p class="mono text-[10px] uppercase tracking-[0.22em]" style="color: var(--ink);">Admin</p>
			<button
				onclick={logout}
				class="mono text-[10px] uppercase tracking-[0.15em] transition-opacity hover:opacity-50"
				style="color: var(--ink-faint);"
			>
				sign out
			</button>
		</div>

		{#if data.devMode}
			<p class="mono mt-8 text-[12px]" style="color: var(--ink-muted);">
				D1 not available in <code>npm run dev</code>. Run <code>wrangler pages dev</code> or deploy to Cloudflare to write posts.
			</p>
		{:else}
			<div class="mt-10">
				{#if posts.length > 0}
					{#each posts as post}
						<button
							onclick={() => openEdit(post)}
							class="row-hover group flex w-full items-baseline justify-between border-t -mx-4 px-4 py-4 text-left hover:no-underline"
							style="border-color: var(--border);"
						>
							<span class="serif text-[18px] leading-tight" style="color: var(--ink);">{post.title}</span>
							<div class="mono flex shrink-0 items-center gap-3 text-[10px] uppercase tracking-[0.1em]" style="color: var(--ink-faint);">
								<span>{post.date}</span>
								<span
									class="px-1.5 py-0.5 border text-[9px]"
									style="border-color: {post.published ? 'var(--accent)' : 'var(--border-strong)'}; color: {post.published ? 'var(--accent)' : 'var(--ink-faint)'};"
								>
									{post.published ? 'live' : 'draft'}
								</span>
							</div>
						</button>
					{/each}
					<div class="border-t" style="border-color: var(--border);"></div>
				{:else}
					<p class="py-8 text-[14px]" style="color: var(--ink-muted);">No posts yet.</p>
				{/if}
			</div>

			<button onclick={openNew} class="btn btn-primary mt-10">
				+ new post
			</button>
		{/if}

	<!-- ── EDITOR ───────────────────────────────────────────── -->
	{:else}
		<div class="flex items-center justify-between">
			<button
				onclick={() => (view = 'list')}
				class="mono link-reveal text-[11px] uppercase tracking-[0.2em]"
				style="color: var(--ink-muted);"
			>
				← posts
			</button>
			{#if saveMsg}
				<span class="mono text-[11px]" style="color: var(--accent);">{saveMsg}</span>
			{/if}
		</div>

		<div class="mt-10 space-y-5">
			<!-- Title + Slug -->
			<div class="grid gap-4 sm:grid-cols-2">
				<label class="block">
					<span class="mono block mb-1.5 text-[10px] uppercase tracking-[0.15em]" style="color: var(--ink-muted);">Title</span>
					<input
						type="text"
						bind:value={title}
						class="w-full border px-3 py-2.5 text-[15px] outline-none"
						style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						placeholder="Post title"
					/>
				</label>
				<label class="block">
					<span class="mono block mb-1.5 text-[10px] uppercase tracking-[0.15em]" style="color: var(--ink-muted);">Slug</span>
					<input
						type="text"
						bind:value={slugField}
						oninput={() => (slugCustomized = true)}
						class="mono w-full border px-3 py-2.5 text-[13px] outline-none"
						style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						placeholder="url-slug"
					/>
				</label>
			</div>

			<!-- Description -->
			<label class="block">
				<span class="mono block mb-1.5 text-[10px] uppercase tracking-[0.15em]" style="color: var(--ink-muted);">Description</span>
				<input
					type="text"
					bind:value={description}
					class="w-full border px-3 py-2.5 text-[14px] outline-none"
					style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
					placeholder="One-line summary shown in listings"
				/>
			</label>

			<!-- Tags + Date -->
			<div class="grid gap-4 sm:grid-cols-2">
				<label class="block">
					<span class="mono block mb-1.5 text-[10px] uppercase tracking-[0.15em]" style="color: var(--ink-muted);">Tags (comma-separated)</span>
					<input
						type="text"
						bind:value={tagsInput}
						class="w-full border px-3 py-2.5 text-[13px] outline-none"
						style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						placeholder="rust, systems, go"
					/>
				</label>
				<label class="block">
					<span class="mono block mb-1.5 text-[10px] uppercase tracking-[0.15em]" style="color: var(--ink-muted);">Date</span>
					<input
						type="date"
						bind:value={date}
						class="mono w-full border px-3 py-2.5 text-[13px] outline-none"
						style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
					/>
				</label>
			</div>

			<!-- Write / Preview tabs -->
			<div>
				<div class="mb-0 flex border-b" style="border-color: var(--border);">
					<button
						onclick={() => (tab = 'write')}
						class="mono px-4 py-2 text-[10px] uppercase tracking-[0.15em] border-b-2 -mb-px transition-colors"
						style="border-color: {tab === 'write' ? 'var(--ink)' : 'transparent'}; color: {tab === 'write' ? 'var(--ink)' : 'var(--ink-faint)'};"
					>
						Write
					</button>
					<button
						onclick={() => (tab = 'preview')}
						class="mono px-4 py-2 text-[10px] uppercase tracking-[0.15em] border-b-2 -mb-px transition-colors"
						style="border-color: {tab === 'preview' ? 'var(--ink)' : 'transparent'}; color: {tab === 'preview' ? 'var(--ink)' : 'var(--ink-faint)'};"
					>
						Preview
					</button>
				</div>

				{#if tab === 'write'}
					<textarea
						bind:value={content}
						class="mono w-full border border-t-0 px-4 py-4 text-[13px] leading-[1.7] outline-none resize-none"
						style="background: var(--bg-subtle); color: var(--ink); border-color: var(--border-strong); min-height: 480px;"
						placeholder="Write in Markdown…"
						spellcheck="false"
					></textarea>
				{:else}
					<div
						class="prose prose-sm max-w-none border border-t-0 px-4 py-6"
						style="border-color: var(--border-strong); min-height: 480px;"
					>
						{@html previewHtml}
					</div>
				{/if}
			</div>

			<!-- Actions -->
			<div class="flex flex-wrap items-center justify-between gap-4 pt-2">
				<div class="flex items-center gap-3">
					<button
						onclick={() => (published = !published)}
						class="mono flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] transition-opacity hover:opacity-70"
						style="color: {published ? 'var(--accent)' : 'var(--ink-faint)'};"
					>
						<span
							class="inline-block h-2 w-2 rounded-full border"
							style="background: {published ? 'var(--accent)' : 'transparent'}; border-color: {published ? 'var(--accent)' : 'var(--ink-faint)'};"
						></span>
						{published ? 'published' : 'draft'}
					</button>
				</div>

				<div class="flex items-center gap-3">
					{#if editingSlug}
						{#if deleteConfirm}
							<button
								onclick={remove}
								disabled={saving}
								class="mono text-[11px] uppercase tracking-[0.15em]"
								style="color: #ef4444;"
							>
								confirm delete
							</button>
							<button
								onclick={() => (deleteConfirm = false)}
								class="mono text-[11px] uppercase tracking-[0.15em]"
								style="color: var(--ink-faint);"
							>
								cancel
							</button>
						{:else}
							<button
								onclick={() => (deleteConfirm = true)}
								class="mono text-[11px] uppercase tracking-[0.15em] transition-opacity hover:opacity-70"
								style="color: var(--ink-faint);"
							>
								delete
							</button>
						{/if}
					{/if}
					<button
						onclick={save}
						disabled={saving || !title.trim() || !slugField.trim()}
						class="btn btn-primary"
					>
						{saving ? 'saving…' : published ? 'publish →' : 'save draft'}
					</button>
				</div>
			</div>
		</div>
	{/if}
</main>
