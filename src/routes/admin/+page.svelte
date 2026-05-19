<script lang="ts">
	import { marked } from 'marked';
	import { untrack, onMount, onDestroy } from 'svelte';
	import ArrayEditor from '$lib/components/admin/ArrayEditor.svelte';
	import SectionPanel from '$lib/components/admin/SectionPanel.svelte';
	import ImageField from '$lib/components/admin/ImageField.svelte';
	import FileField from '$lib/components/admin/FileField.svelte';
	import type {
		Profile,
		Stat,
		Hiring,
		AiSection,
		AIProject,
		HowIBuild,
		BuildPrinciple,
		Experience,
		Education,
		SkillTier,
		Project,
		SiteSections
	} from '$lib/types';

	interface PostListItem {
		slug: string;
		title: string;
		date: string;
		published: boolean;
	}
	interface ApiError {
		error?: string;
	}
	interface ApiSlugResponse {
		ok: boolean;
		slug?: string;
	}
	interface FullPost extends PostListItem {
		description: string;
		tags: string[];
		content: string;
		series: string;
		seriesOrder: number;
	}

	let { data } = $props();

	const existingSeries = $derived((data.series as string[]) ?? []);

	// ── Unsaved changes warning ──────────────────────────────
	let hasUnsavedChanges = $state(false);

	function handleBeforeUnload(e: BeforeUnloadEvent) {
		if (hasUnsavedChanges) {
			e.preventDefault();
			e.returnValue = '';
		}
	}

	// ── Keyboard shortcuts ──────────────────────────────────
	function handleKeyboard(e: KeyboardEvent) {
		// Ctrl/Cmd + S to save
		if ((e.ctrlKey || e.metaKey) && e.key === 's') {
			e.preventDefault();
			if (view === 'edit' && editingSlug !== null) {
				savePost();
			} else if (projectView === 'edit') {
				saveProject();
			}
		}
		// Escape to go back
		if (e.key === 'Escape') {
			if (view === 'edit') {
				view = 'list';
			} else if (projectView === 'edit') {
				projectView = 'list';
			}
		}
	}

	onMount(() => {
		window.addEventListener('beforeunload', handleBeforeUnload);
		window.addEventListener('keydown', handleKeyboard);
	});

	onDestroy(() => {
		window.removeEventListener('beforeunload', handleBeforeUnload);
		window.removeEventListener('keydown', handleKeyboard);
	});

	// ── Fetch helper with error handling ─────────────────────
	async function safeFetch(url: string, options: RequestInit = {}): Promise<Response | null> {
		try {
			const res = await fetch(url, options);
			if (!res.ok) {
				const body = (await res.json().catch(() => ({}))) as { error?: string };
				return null;
			}
			return res;
		} catch (err) {
			console.error(`Fetch error for ${url}:`, err);
			return null;
		}
	}

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
				const body = (await res.json()) as ApiError;
				authError = body.error ?? 'Invalid key';
			}
		} finally {
			authLoading = false;
		}
	}

	async function logout() {
		await fetch('/api/admin/auth', { method: 'DELETE' });
		window.location.reload();
	}

	// ── Clear cache ─────────────────────────────────────────
	let cacheClearing = $state(false);
	let cacheMsg = $state('');

	async function clearCache() {
		cacheClearing = true;
		cacheMsg = '';
		try {
			const res = await fetch('/api/admin/cache/clear', { method: 'POST' });
			if (!res.ok) {
				const body = (await res.json().catch(() => ({}))) as ApiError;
				cacheMsg = `Error: ${body.error ?? res.status}`;
				return;
			}
			const body = (await res.json()) as { cleared: number; total: number; dev?: boolean };
			cacheMsg = body.dev
				? 'No edge cache in dev.'
				: `Cleared ${body.cleared}/${body.total} URLs.`;
		} finally {
			cacheClearing = false;
			setTimeout(() => (cacheMsg = ''), 4000);
		}
	}

	// ── Top-level tabs ──────────────────────────────────────
	type Tab = 'posts' | 'profile' | 'experience' | 'projects' | 'skills' | 'extras' | 'layout';
	let topTab = $state<Tab>('posts');

	const TABS: { id: Tab; label: string }[] = [
		{ id: 'posts', label: 'Posts' },
		{ id: 'profile', label: 'Profile' },
		{ id: 'experience', label: 'Experience' },
		{ id: 'projects', label: 'Projects' },
		{ id: 'skills', label: 'Skills' },
		{ id: 'extras', label: 'Hiring & AI' },
		{ id: 'layout', label: 'Layout' }
	];

	// ── Post list (existing) ─────────────────────────────────
	let posts = $state<PostListItem[]>([]);
	let postsInitialized = $state(false);
	$effect.pre(() => {
		if (!postsInitialized) {
			posts = data.posts ?? [];
			postsInitialized = true;
		}
	});
	let deleteConfirmSlug = $state<string | null>(null);

	async function deleteFromList(slug: string) {
		await fetch(`/api/admin/posts/${slug}`, { method: 'DELETE' });
		posts = posts.filter((p) => p.slug !== slug);
		deleteConfirmSlug = null;
	}

	type View = 'list' | 'edit';
	let view = $state<View>('list');
	let editingSlug = $state<string | null>(null);
	let writeTab = $state<'write' | 'preview'>('write');
	let saving = $state(false);
	let saveMsg = $state('');
	let deleteConfirm = $state(false);

	let title = $state('');
	let slugField = $state('');
	let slugCustomized = $state(false);
	let description = $state('');
	let tagsInput = $state('');
	let date = $state(new Date().toISOString().slice(0, 10));
	let content = $state('');
	let published = $state(false);
	let seriesInput = $state('');
	let seriesOrderInput = $state(0);
	let seriesDropdown = $state<string>('__none__');

	$effect(() => {
		if (seriesDropdown === '__new__') {
			// keep seriesInput as-is
		} else if (seriesDropdown === '__none__') {
			seriesInput = '';
		} else {
			seriesInput = seriesDropdown;
		}
	});

	let textareaEl = $state<HTMLTextAreaElement | null>(null);
	let fileInputEl = $state<HTMLInputElement | null>(null);
	let uploading = $state(false);

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
		seriesInput = '';
		seriesOrderInput = 0;
		seriesDropdown = '__none__';
		writeTab = 'write';
		saveMsg = '';
		deleteConfirm = false;
		view = 'edit';
	}

	function openEdit(post: PostListItem) {
		fetch(`/api/admin/posts/${post.slug}`)
			.then((r) => {
				if (!r.ok) throw new Error('Failed to load post');
				return r.json() as Promise<FullPost>;
			})
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
				seriesInput = p.series || '';
				seriesOrderInput = p.seriesOrder ?? 0;
				seriesDropdown = existingSeries.includes(seriesInput)
					? seriesInput
					: seriesInput
						? '__new__'
						: '__none__';
				writeTab = 'write';
				saveMsg = '';
				deleteConfirm = false;
				view = 'edit';
			})
			.catch((err) => {
				saveMsg = `Error: ${err.message}`;
			});
	}

	async function savePost() {
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
				published,
				series: seriesInput.trim(),
				seriesOrder: seriesOrderInput
			};
			const method = editingSlug ? 'PUT' : 'POST';
			const url = editingSlug ? `/api/admin/posts/${editingSlug}` : '/api/admin/posts';
			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
			if (!res.ok) {
				const errBody = (await res.json()) as ApiError;
				saveMsg = `Error: ${errBody.error ?? 'Unknown error'}`;
				return;
			}
			const result = (await res.json()) as ApiSlugResponse;
			saveMsg = published ? 'Published.' : 'Saved as draft.';
			editingSlug = result.slug ?? slugField.trim();
			const refreshedRes = await fetch('/api/admin/posts');
			const refreshed = refreshedRes.ok 
				? ((await refreshedRes.json()) as PostListItem[])
				: posts;
			posts = refreshed;
			hasUnsavedChanges = false;
		} catch (err) {
			saveMsg = `Error: ${err instanceof Error ? err.message : 'Failed to save'}`;
		} finally {
			saving = false;
		}
	}

	async function removeFromEditor() {
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

	function insertAtCursor(text: string) {
		if (!textareaEl) {
			content += '\n' + text;
			return;
		}
		const start = textareaEl.selectionStart ?? content.length;
		const end = textareaEl.selectionEnd ?? content.length;
		content = content.slice(0, start) + text + content.slice(end);
		requestAnimationFrame(() => {
			if (textareaEl) {
				textareaEl.selectionStart = textareaEl.selectionEnd = start + text.length;
				textareaEl.focus();
			}
		});
	}

	async function handleImageFile(file: File) {
		uploading = true;
		saveMsg = '';
		try {
			const fd = new FormData();
			fd.append('file', file);
			const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
			if (!res.ok) {
				const body = (await res.json().catch(() => ({}))) as ApiError;
				saveMsg = `Upload failed: ${body.error ?? res.status}`;
				return;
			}
			const { url } = (await res.json()) as { url: string };
			const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
			insertAtCursor(`\n![${alt}](${url})\n`);
		} finally {
			uploading = false;
			if (fileInputEl) fileInputEl.value = '';
		}
	}

	async function onFileInput(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) await handleImageFile(file);
	}

	function onPaste(e: ClipboardEvent) {
		const file = Array.from(e.clipboardData?.items ?? [])
			.find((i) => i.kind === 'file' && i.type.startsWith('image/'))
			?.getAsFile();
		if (file) {
			e.preventDefault();
			handleImageFile(file);
		}
	}

	let previewHtml = $derived(
		writeTab === 'preview'
			? String(marked.parse(content || '_nothing yet_', {
					breaks: true,
					gfm: true
				}))
			: ''
	);

	// ── Site config local state (snapshot of server data on mount) ──────
	const initial = untrack(() => ({
		profile: structuredClone(data.site.profile),
		stats: structuredClone(data.site.stats),
		hiring: structuredClone(data.site.hiring),
		ai: structuredClone(data.site.ai),
		aiProjects: structuredClone(data.site.aiProjects),
		howIBuild: structuredClone(data.site.howIBuild),
		experience: structuredClone(data.site.experience),
		education: structuredClone(data.site.education),
		skillTiers: structuredClone(data.site.skillTiers),
		achievements: structuredClone(data.site.achievements),
		sections: structuredClone(data.site.sections),
		projects: structuredClone(data.projects)
	}));
	let profileEdit = $state<Profile>(initial.profile);
	let statsEdit = $state<Stat[]>(initial.stats);
	let hiringEdit = $state<Hiring>(initial.hiring);
	let aiEdit = $state<AiSection>(initial.ai);
	let aiProjectsEdit = $state<AIProject[]>(initial.aiProjects);
	let howIBuildEdit = $state<HowIBuild>(initial.howIBuild);
	let experienceEdit = $state<Experience[]>(initial.experience);
	let educationEdit = $state<Education>(initial.education);
	let skillTiersEdit = $state<SkillTier[]>(initial.skillTiers);
	let achievementsEdit = $state<string[]>(initial.achievements);
	let sectionsEdit = $state<SiteSections>(initial.sections);
	let projectsEdit = $state<Project[]>(initial.projects);

	const SECTION_DEFS: { key: keyof SiteSections; hint: string }[] = [
		{ key: 'work', hint: 'Flagship + also-built projects' },
		{ key: 'experience', hint: 'Work history + education' },
		{ key: 'stack', hint: 'Skill tiers + milestones' },
		{ key: 'howIBuild', hint: 'Engineering principles' },
		{ key: 'ai', hint: 'AI stance + AI projects' },
		{ key: 'writing', hint: 'Recent writing list' },
		{ key: 'hiring', hint: 'For-hiring-teams CTA block' }
	];

	// ── Save state per section ───────────────────────────────
	let savingSection = $state<Record<string, boolean>>({});
	let savedMsg = $state<Record<string, string>>({});

	async function saveSection(key: string, value: unknown) {
		savingSection = { ...savingSection, [key]: true };
		savedMsg = { ...savedMsg, [key]: '' };
		try {
			const res = await fetch(`/api/admin/config/${key}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(value)
			});
			if (!res.ok) {
				const body = (await res.json().catch(() => ({}))) as ApiError;
				savedMsg = { ...savedMsg, [key]: `Error: ${body.error ?? res.status}` };
				return;
			}
			savedMsg = { ...savedMsg, [key]: 'Saved.' };
			hasUnsavedChanges = false;
		} catch (err) {
			savedMsg = { ...savedMsg, [key]: `Error: ${err instanceof Error ? err.message : 'Failed to save'}` };
		} finally {
			savingSection = { ...savingSection, [key]: false };
		}
	}

	// ── Projects: edit / new state ───────────────────────────
	type ProjectView = 'list' | 'edit';
	let projectView = $state<ProjectView>('list');
	let editingProjectOriginalSlug = $state<string | null>(null);
	let projectDraft = $state<Project>(blankProject());
	let projectSaving = $state(false);
	let projectSaveMsg = $state('');
	let projectDeleteConfirmSlug = $state<string | null>(null);
	let projectSlugCustomized = $state(false);

	function blankProject(): Project {
		return {
			slug: '',
			number: '',
			name: '',
			year: '',
			tagline: '',
			description: '',
			stack: [],
			metrics: [],
			image: '',
			github: '',
			url: '',
			caseStudy: '',
			stars: 0,
			featured: false,
			sortOrder: projectsEdit.length
		};
	}

	$effect(() => {
		if (!projectSlugCustomized && projectDraft.name) {
			projectDraft.slug = projectDraft.name
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, '')
				.replace(/\s+/g, '-')
				.replace(/-+/g, '-')
				.trim();
		}
	});

	function openNewProject() {
		projectDraft = blankProject();
		editingProjectOriginalSlug = null;
		projectSlugCustomized = false;
		projectSaveMsg = '';
		projectView = 'edit';
	}

	function openEditProject(p: Project) {
		// $state.snapshot strips Svelte 5's reactive proxy so the draft is a plain
		// object — structuredClone errors on the proxy with DataCloneError.
		projectDraft = $state.snapshot(p) as Project;
		editingProjectOriginalSlug = p.slug;
		projectSlugCustomized = true;
		projectSaveMsg = '';
		projectView = 'edit';
	}

	async function saveProject() {
		if (!projectDraft.name.trim() || !projectDraft.slug.trim()) {
			projectSaveMsg = 'Error: name and slug required';
			return;
		}
		projectSaving = true;
		projectSaveMsg = '';
		try {
			const url = editingProjectOriginalSlug
				? `/api/admin/projects/${editingProjectOriginalSlug}`
				: `/api/admin/projects`;
			const method = editingProjectOriginalSlug ? 'PUT' : 'POST';
			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(projectDraft)
			});
			if (!res.ok) {
				const body = (await res.json().catch(() => ({}))) as ApiError;
				projectSaveMsg = `Error: ${body.error ?? res.status}`;
				return;
			}
			projectSaveMsg = 'Saved.';
			const refreshedRes = await fetch('/api/admin/projects');
			const refreshed = refreshedRes.ok 
				? ((await refreshedRes.json()) as Project[])
				: projectsEdit;
			projectsEdit = refreshed;
			editingProjectOriginalSlug = projectDraft.slug;
			hasUnsavedChanges = false;
		} catch (err) {
			projectSaveMsg = `Error: ${err instanceof Error ? err.message : 'Failed to save'}`;
		} finally {
			projectSaving = false;
		}
	}

	async function deleteProject(slug: string) {
		await fetch(`/api/admin/projects/${slug}`, { method: 'DELETE' });
		projectsEdit = projectsEdit.filter((p) => p.slug !== slug);
		projectDeleteConfirmSlug = null;
	}

	let seedingDefaults = $state(false);
	let seedMsg = $state('');

	async function restoreDefaultProjects() {
		seedingDefaults = true;
		seedMsg = '';
		try {
			const res = await fetch('/api/admin/projects/seed', { method: 'POST' });
			if (!res.ok) {
				const body = (await res.json().catch(() => ({}))) as ApiError;
				seedMsg = `Error: ${body.error ?? res.status}`;
				return;
			}
			const body = (await res.json()) as { inserted: number; skipped: number };
			seedMsg = `Restored ${body.inserted} (${body.skipped} already present).`;
			const refreshed = (await fetch('/api/admin/projects').then((r) => r.json())) as Project[];
			projectsEdit = refreshed;
		} finally {
			seedingDefaults = false;
			setTimeout(() => (seedMsg = ''), 4000);
		}
	}

	async function moveProject(idx: number, dir: -1 | 1) {
		const j = idx + dir;
		if (j < 0 || j >= projectsEdit.length) return;
		const next = projectsEdit.slice();
		[next[idx], next[j]] = [next[j], next[idx]];
		projectsEdit = next;
		await fetch('/api/admin/projects/order', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ slugs: projectsEdit.map((p) => p.slug) })
		});
	}

	// ── Experience helpers ──────────────────────────────────
	function addExperience() {
		experienceEdit = [
			...experienceEdit,
			{ company: '', role: '', period: '', location: '', bullets: [''] }
		];
	}
	function removeExperience(i: number) {
		experienceEdit = experienceEdit.filter((_, idx) => idx !== i);
	}
	function moveExperience(i: number, dir: -1 | 1) {
		const j = i + dir;
		if (j < 0 || j >= experienceEdit.length) return;
		const next = experienceEdit.slice();
		[next[i], next[j]] = [next[j], next[i]];
		experienceEdit = next;
	}

	// ── Skill tier helpers ──────────────────────────────────
	function addSkillTier() {
		skillTiersEdit = [...skillTiersEdit, { label: '', note: '', items: [] }];
	}
	function removeSkillTier(i: number) {
		skillTiersEdit = skillTiersEdit.filter((_, idx) => idx !== i);
	}

	// ── Stats helpers ───────────────────────────────────────
	function addStat() {
		statsEdit = [...statsEdit, { value: '', label: '', detail: '' }];
	}
	function removeStat(i: number) {
		statsEdit = statsEdit.filter((_, idx) => idx !== i);
	}

	// ── AI projects helpers ─────────────────────────────────
	function addAiProject() {
		aiProjectsEdit = [
			...aiProjectsEdit,
			{ name: '', description: '', stack: '', github: '' }
		];
	}
	function removeAiProject(i: number) {
		aiProjectsEdit = aiProjectsEdit.filter((_, idx) => idx !== i);
	}

	// ── How I build helpers ─────────────────────────────────
	function addPrinciple() {
		howIBuildEdit = {
			...howIBuildEdit,
			principles: [...howIBuildEdit.principles, { label: '', detail: '' } as BuildPrinciple]
		};
	}
	function removePrinciple(i: number) {
		howIBuildEdit = {
			...howIBuildEdit,
			principles: howIBuildEdit.principles.filter((_, idx) => idx !== i)
		};
	}
</script>

<svelte:head>
	<title>Admin — Site Editor</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="mx-auto max-w-3xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20 sm:pb-24">
	<!-- ── AUTH GATE ───────────────────────────────────────── -->
	{#if !data.authenticated}
		<div class="mt-4 max-w-xs sm:mt-8">
			<p
				class="mono mb-6 text-[10px] uppercase tracking-[0.18em] sm:mb-8 sm:tracking-[0.22em]"
				style="color: var(--ink);"
			>
				Admin
			</p>
			<label class="block">
				<span
					class="mono mb-2 block text-[10px] uppercase tracking-[0.15em]"
					style="color: var(--ink-muted);">Write key</span
				>
				<input
					type="password"
					bind:value={keyInput}
					onkeydown={(e) => e.key === 'Enter' && login()}
					class="w-full border px-3 py-2.5 font-mono text-[14px] outline-none"
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
	{:else}
		<!-- ── HEADER ─────────────────────────────────────── -->
		<div class="flex items-baseline justify-between gap-3">
			<div class="flex items-center gap-3">
				<p
					class="mono text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em]"
					style="color: var(--ink);"
				>
					Admin
				</p>
				{#if hasUnsavedChanges}
					<span class="mono text-[10px] uppercase tracking-[0.12em]" style="color: #f59e0b;">
						● Unsaved changes
					</span>
				{/if}
			</div>
			<div class="mono flex items-center gap-3 text-[10px] uppercase tracking-[0.12em] sm:gap-4 sm:tracking-[0.15em]">
				{#if cacheMsg}
					<span style="color: {cacheMsg.startsWith('Error') ? '#ef4444' : 'var(--accent)'};"
						>{cacheMsg}</span
					>
				{/if}
				<button
					onclick={clearCache}
					disabled={cacheClearing}
					class="transition-opacity hover:opacity-50 disabled:opacity-40"
					style="color: var(--ink-muted);"
					title="Purge edge cache for /, /writing, /rss.xml and post pages">
					{cacheClearing ? 'clearing…' : 'clear cache'}
				</button>
				<button
					onclick={logout}
					class="transition-opacity hover:opacity-50"
					style="color: var(--ink-faint);">sign out</button
				>
			</div>
		</div>

		<!-- ── TAB BAR ────────────────────────────────────── -->
		<div
			class="admin-tabs mt-6 flex gap-1 overflow-x-auto border-b sm:mt-8 sm:gap-2"
			style="border-color: var(--border);"
		>
			{#each TABS as t}
				<button
					type="button"
					onclick={() => (topTab = t.id)}
					class="mono shrink-0 -mb-px border-b-2 px-3 py-2 text-[10px] uppercase tracking-[0.12em] transition-colors sm:px-4 sm:text-[11px] sm:tracking-[0.15em]"
					style="border-color: {topTab === t.id ? 'var(--ink)' : 'transparent'}; color: {topTab ===
					t.id
						? 'var(--ink)'
						: 'var(--ink-faint)'};"
				>
					{t.label}
				</button>
			{/each}
		</div>

		{#if data.devMode}
			<p class="mono mt-8 text-[12px]" style="color: var(--ink-muted);">
				D1 not available in <code>npm run dev</code>. Deploy to Cloudflare to write changes.
			</p>
		{/if}

		<!-- ── POSTS TAB ───────────────────────────────────── -->
		{#if topTab === 'posts'}
			{#if view === 'list'}
				<div class="mt-8">
					{#if posts.length > 0}
						{#each posts as post (post.slug)}
							<div
								class="flex items-center justify-between gap-3 border-t -mx-3 px-3 py-3 sm:-mx-4 sm:px-4"
								style="border-color: var(--border);"
							>
								<div class="min-w-0 flex-1">
									<p
										class="serif truncate text-[15px] leading-tight sm:text-[17px]"
										style="color: var(--ink);"
									>
										{post.title}
									</p>
									<p class="mono mt-0.5 text-[10px]" style="color: var(--ink-faint);">
										{post.date} ·
										<span style="color: {post.published ? 'var(--accent)' : 'var(--ink-faint)'};">
											{post.published ? 'live' : 'draft'}
										</span>
									</p>
								</div>
								<div
									class="mono flex shrink-0 items-center gap-2 text-[10px] uppercase tracking-[0.1em] sm:gap-3 sm:tracking-[0.12em]"
								>
									<button
										onclick={() => openEdit(post)}
										class="transition-opacity hover:opacity-60"
										style="color: var(--ink-muted);">edit</button
									>
									{#if deleteConfirmSlug === post.slug}
										<button
											onclick={() => deleteFromList(post.slug)}
											class="font-medium"
											style="color: #ef4444;">confirm</button
										>
										<button
											onclick={() => (deleteConfirmSlug = null)}
											style="color: var(--ink-faint);">cancel</button
										>
									{:else}
										<button
											onclick={() => (deleteConfirmSlug = post.slug)}
											class="transition-opacity hover:opacity-60"
											style="color: var(--ink-faint);">delete</button
										>
									{/if}
								</div>
							</div>
						{/each}
						<div class="border-t" style="border-color: var(--border);"></div>
					{:else}
						<p class="py-8 text-[14px]" style="color: var(--ink-muted);">No posts yet.</p>
					{/if}
				</div>
				<button onclick={openNew} class="btn btn-primary mt-8 sm:mt-10">+ new post</button>
			{:else}
				<div class="mt-8 flex items-center justify-between">
					<button
						onclick={() => (view = 'list')}
						class="mono link-reveal text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em]"
						style="color: var(--ink-muted);">← posts</button
					>
					{#if saveMsg}
						<span
							class="mono text-[11px]"
							style="color: {saveMsg.startsWith('Error') || saveMsg.startsWith('Upload')
								? '#ef4444'
								: 'var(--accent)'};">{saveMsg}</span
						>
					{/if}
				</div>

				<div class="mt-8 space-y-5 sm:mt-10">
					<div class="grid gap-4 sm:grid-cols-2">
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Title</span
							>
							<input
								type="text"
								bind:value={title}
								class="w-full border px-3 py-2.5 text-[15px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
								placeholder="Post title"
							/>
						</label>
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Slug</span
							>
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

					<label class="block">
						<span
							class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
							style="color: var(--ink-muted);">Description</span
						>
						<input
							type="text"
							bind:value={description}
							class="w-full border px-3 py-2.5 text-[14px] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							placeholder="One-line summary shown in listings"
						/>
					</label>

					<div class="grid gap-4 sm:grid-cols-2">
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Tags (comma-separated)</span
							>
							<input
								type="text"
								bind:value={tagsInput}
								class="w-full border px-3 py-2.5 text-[13px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
								placeholder="rust, systems, go"
							/>
						</label>
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Date</span
							>
							<input
								type="date"
								bind:value={date}
								class="mono w-full border px-3 py-2.5 text-[13px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
					</div>

					<div class="grid gap-4 sm:grid-cols-2">
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Series</span
							>
							<select
								bind:value={seriesDropdown}
								class="w-full border px-3 py-2.5 text-[13px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							>
								<option value="__none__">No series</option>
								{#each existingSeries as s}
									<option value={s}>{s}</option>
								{/each}
								<option value="__new__">+ New series…</option>
							</select>
						</label>
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Series order</span
							>
							<input
								type="number"
								bind:value={seriesOrderInput}
								min="0"
								class="mono w-full border px-3 py-2.5 text-[13px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
					</div>

					{#if seriesDropdown === '__new__'}
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">New series name</span
							>
							<input
								type="text"
								bind:value={seriesInput}
								class="w-full border px-3 py-2.5 text-[13px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
								placeholder="e.g. Database Internals"
							/>
						</label>
					{/if}

					<div>
						<div class="flex items-center justify-between border-b" style="border-color: var(--border);">
							<div class="flex">
								<button
									onclick={() => (writeTab = 'write')}
									class="mono -mb-px border-b-2 px-3 py-2 text-[10px] uppercase tracking-[0.12em] transition-colors sm:px-4 sm:tracking-[0.15em]"
									style="border-color: {writeTab === 'write'
										? 'var(--ink)'
										: 'transparent'}; color: {writeTab === 'write' ? 'var(--ink)' : 'var(--ink-faint)'};"
									>Write</button
								>
								<button
									onclick={() => (writeTab = 'preview')}
									class="mono -mb-px border-b-2 px-3 py-2 text-[10px] uppercase tracking-[0.12em] transition-colors sm:px-4 sm:tracking-[0.15em]"
									style="border-color: {writeTab === 'preview'
										? 'var(--ink)'
										: 'transparent'}; color: {writeTab === 'preview' ? 'var(--ink)' : 'var(--ink-faint)'};"
									>Preview</button
								>
							</div>

							{#if writeTab === 'write'}
								<button
									onclick={() => fileInputEl?.click()}
									disabled={uploading}
									class="mono mb-1 flex items-center gap-1.5 border px-2 py-1 text-[10px] uppercase tracking-[0.1em] transition-opacity hover:opacity-60 sm:px-3 sm:py-1.5 sm:tracking-[0.12em]"
									style="color: var(--ink-muted); border-color: var(--border-strong);"
									title="Upload image (or paste from clipboard)"
								>
									{#if uploading}uploading…{:else}↑ image{/if}
								</button>
								<input
									bind:this={fileInputEl}
									type="file"
									accept="image/*"
									class="hidden"
									onchange={onFileInput}
								/>
							{/if}
						</div>

						{#if writeTab === 'write'}
							<textarea
								bind:this={textareaEl}
								bind:value={content}
								onpaste={onPaste}
								class="mono w-full resize-none border border-t-0 px-3 py-3 text-[13px] leading-[1.7] outline-none sm:px-4 sm:py-4"
								style="background: var(--bg-subtle); color: var(--ink); border-color: var(--border-strong); min-height: 360px;"
								placeholder="Write in Markdown… paste or drag an image to upload it inline"
								spellcheck="false"
							></textarea>
						{:else}
							<div
								class="prose prose-sm max-w-none border border-t-0 px-3 py-5 sm:px-4 sm:py-6"
								style="border-color: var(--border-strong); min-height: 360px;"
							>
								{@html previewHtml}
							</div>
						{/if}
					</div>

					<div class="flex flex-wrap items-center justify-between gap-3 pt-2">
						<button
							onclick={() => (published = !published)}
							class="mono flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] transition-opacity hover:opacity-70 sm:tracking-[0.15em]"
							style="color: {published ? 'var(--accent)' : 'var(--ink-faint)'};"
						>
							<span
								class="inline-block h-2 w-2 rounded-full border"
								style="background: {published ? 'var(--accent)' : 'transparent'}; border-color: {published
									? 'var(--accent)'
									: 'var(--ink-faint)'};"
							></span>
							{published ? 'published' : 'draft'}
						</button>
						<div class="flex items-center gap-3">
							{#if editingSlug && !published}
								<button
									onclick={() => {
										const previewWindow = window.open('', '_blank');
										if (previewWindow) {
											previewWindow.document.write(`
												<!DOCTYPE html>
												<html>
												<head><title>Draft Preview</title></head>
												<body style="font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 20px;">
													<h1>${title}</h1>
													${previewHtml}
												</body>
												</html>
											`);
											previewWindow.document.close();
										}
									}}
									class="mono text-[11px] uppercase tracking-[0.12em] transition-opacity hover:opacity-70 sm:tracking-[0.15em]"
									style="color: var(--ink-muted);"
								>
									preview draft ↗
								</button>
							{/if}
							{#if editingSlug}
								{#if deleteConfirm}
									<button
										onclick={removeFromEditor}
										disabled={saving}
										class="mono text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.15em]"
										style="color: #ef4444;">confirm delete</button
									>
									<button
										onclick={() => (deleteConfirm = false)}
										class="mono text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.15em]"
										style="color: var(--ink-faint);">cancel</button
									>
								{:else}
									<button
										onclick={() => (deleteConfirm = true)}
										class="mono text-[11px] uppercase tracking-[0.12em] transition-opacity hover:opacity-70 sm:tracking-[0.15em]"
										style="color: var(--ink-faint);">delete</button
									>
								{/if}
							{/if}
							<button
								onclick={savePost}
								disabled={saving || !title.trim() || !slugField.trim()}
								class="btn btn-primary"
							>
								{saving ? 'saving…' : published ? 'publish →' : 'save draft'}
							</button>
						</div>
					</div>
				</div>
			{/if}

		<!-- ── PROFILE TAB ─────────────────────────────────── -->
		{:else if topTab === 'profile'}
			<div class="mt-8 space-y-10 sm:mt-10">
				<SectionPanel
					title="Profile"
					hint="Identity, bio, photo, socials, SEO"
					saving={savingSection.profile}
					saveMsg={savedMsg.profile}
					onSave={() => saveSection('profile', profileEdit)}
				>
					<div class="grid gap-4 sm:grid-cols-2">
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Name</span
							>
							<input
								type="text"
								bind:value={profileEdit.name}
								class="w-full border px-3 py-2.5 text-[14px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Handle</span
							>
							<input
								type="text"
								bind:value={profileEdit.handle}
								class="mono w-full border px-3 py-2.5 text-[13px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Role</span
							>
							<input
								type="text"
								bind:value={profileEdit.role}
								class="w-full border px-3 py-2.5 text-[14px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Tagline</span
							>
							<input
								type="text"
								bind:value={profileEdit.tagline}
								class="w-full border px-3 py-2.5 text-[14px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
					</div>

					<label class="block">
						<span
							class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
							style="color: var(--ink-muted);">Bio</span
						>
						<textarea
							bind:value={profileEdit.bio}
							rows="4"
							class="w-full border px-3 py-2.5 text-[14px] leading-[1.6] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						></textarea>
					</label>

					<label class="block">
						<span
							class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
							style="color: var(--ink-muted);">Education line</span
						>
						<textarea
							bind:value={profileEdit.education}
							rows="2"
							class="w-full border px-3 py-2.5 text-[14px] leading-[1.6] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						></textarea>
					</label>

					<div class="grid gap-4 sm:grid-cols-3">
						<label class="block sm:col-span-1">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Location</span
							>
							<input
								type="text"
								bind:value={profileEdit.location}
								class="w-full border px-3 py-2.5 text-[14px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
						<label class="block sm:col-span-1">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Available date</span
							>
							<input
								type="text"
								bind:value={profileEdit.availableDate}
								class="w-full border px-3 py-2.5 text-[14px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
						<label class="flex items-center gap-2 pt-6 sm:col-span-1">
							<input type="checkbox" bind:checked={profileEdit.available} class="h-4 w-4" />
							<span
								class="mono text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Available now</span
							>
						</label>
					</div>

					<label class="block">
						<span
							class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
							style="color: var(--ink-muted);">Email</span
						>
						<input
							type="email"
							bind:value={profileEdit.email}
							class="mono w-full border px-3 py-2.5 text-[13px] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						/>
					</label>

					<ImageField
						bind:value={profileEdit.photo}
						label="Hero photo"
						hint="leave empty for GitHub avatar fallback"
					/>

					<FileField
						bind:value={profileEdit.resumeUrl}
						label="Résumé / CV (PDF)"
						hint="leave empty to use /ashutosh-kumar.pdf"
						accept="application/pdf"
					/>

					<div>
						<span
							class="mono mb-3 block text-[10px] uppercase tracking-[0.15em]"
							style="color: var(--ink-muted);">Socials</span
						>
						<div class="grid gap-3 sm:grid-cols-2">
							{#each ['github', 'linkedin', 'x', 'leetcode', 'clairo', 'mankind'] as key}
								<label class="block">
									<span class="mono mb-1 block text-[10px] uppercase" style="color: var(--ink-faint);"
										>{key}</span
									>
									<input
										type="text"
										value={profileEdit.socials[key] ?? ''}
										oninput={(e) =>
											(profileEdit.socials = {
												...profileEdit.socials,
												[key]: (e.currentTarget as HTMLInputElement).value
											})}
										class="mono w-full border px-3 py-2 text-[12px] outline-none"
										style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
									/>
								</label>
							{/each}
						</div>
					</div>

					<div class="grid gap-4 sm:grid-cols-2">
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">SEO title</span
							>
							<input
								type="text"
								bind:value={profileEdit.seo.title}
								class="w-full border px-3 py-2.5 text-[14px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">SEO description</span
							>
							<input
								type="text"
								bind:value={profileEdit.seo.description}
								class="w-full border px-3 py-2.5 text-[14px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
					</div>
				</SectionPanel>

				<SectionPanel
					title="Stats"
					hint="Hero stats band — value, label, detail"
					saving={savingSection.stats}
					saveMsg={savedMsg.stats}
					onSave={() => saveSection('stats', statsEdit)}
				>
					<div class="space-y-3">
						{#each statsEdit as stat, i (i)}
							<div class="grid gap-2 border p-3 sm:grid-cols-[1fr_1fr_2fr_auto]" style="border-color: var(--border);">
								<input
									type="text"
									bind:value={stat.value}
									placeholder="value"
									class="mono w-full border px-2 py-1.5 text-[12px] outline-none"
									style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
								/>
								<input
									type="text"
									bind:value={stat.label}
									placeholder="label"
									class="mono w-full border px-2 py-1.5 text-[12px] outline-none"
									style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
								/>
								<input
									type="text"
									bind:value={stat.detail}
									placeholder="detail"
									class="w-full border px-2 py-1.5 text-[12px] outline-none"
									style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
								/>
								<button
									type="button"
									onclick={() => removeStat(i)}
									class="mono px-2 py-1 text-[10px] uppercase"
									style="color: #ef4444; border: 1px solid var(--border-strong);">×</button
								>
							</div>
						{/each}
					</div>
					<button
						type="button"
						onclick={addStat}
						class="mono mt-3 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em]"
						style="color: var(--ink); border: 1px solid var(--border-strong);">+ add stat</button
					>
				</SectionPanel>
			</div>

		<!-- ── EXPERIENCE TAB ──────────────────────────────── -->
		{:else if topTab === 'experience'}
			<div class="mt-8 space-y-10 sm:mt-10">
				<SectionPanel
					title="Experience"
					hint="Roles, companies, bullets"
					saving={savingSection.experience}
					saveMsg={savedMsg.experience}
					onSave={() => saveSection('experience', experienceEdit)}
				>
					<div class="space-y-6">
						{#each experienceEdit as job, i (i)}
							<div class="border p-4" style="border-color: var(--border);">
								<div class="mb-3 flex items-center justify-between">
									<span
										class="mono text-[10px] uppercase tracking-[0.12em]"
										style="color: var(--ink-faint);">role #{i + 1}</span
									>
									<div class="flex gap-1">
										<button
											type="button"
											onclick={() => moveExperience(i, -1)}
											disabled={i === 0}
											class="mono px-2 py-1 text-[10px] disabled:opacity-30"
											style="color: var(--ink-muted); border: 1px solid var(--border-strong);"
											>↑</button
										>
										<button
											type="button"
											onclick={() => moveExperience(i, 1)}
											disabled={i === experienceEdit.length - 1}
											class="mono px-2 py-1 text-[10px] disabled:opacity-30"
											style="color: var(--ink-muted); border: 1px solid var(--border-strong);"
											>↓</button
										>
										<button
											type="button"
											onclick={() => removeExperience(i)}
											class="mono px-2 py-1 text-[10px]"
											style="color: #ef4444; border: 1px solid var(--border-strong);">×</button
										>
									</div>
								</div>
								<div class="grid gap-3 sm:grid-cols-2">
									<input
										type="text"
										bind:value={job.company}
										placeholder="Company"
										class="w-full border px-3 py-2 text-[13px] outline-none"
										style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
									/>
									<input
										type="text"
										bind:value={job.role}
										placeholder="Role"
										class="w-full border px-3 py-2 text-[13px] outline-none"
										style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
									/>
									<input
										type="text"
										bind:value={job.period}
										placeholder="Period — May 2025 – Jul 2025"
										class="mono w-full border px-3 py-2 text-[12px] outline-none"
										style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
									/>
									<input
										type="text"
										bind:value={job.location}
										placeholder="Location"
										class="w-full border px-3 py-2 text-[13px] outline-none"
										style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
									/>
								</div>
								<div class="mt-3">
									<ArrayEditor
										bind:items={job.bullets}
										label="Bullets"
										placeholder="Achievement / responsibility"
										multiline={true}
									/>
								</div>
							</div>
						{/each}
					</div>
					<button
						type="button"
						onclick={addExperience}
						class="mono mt-3 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em]"
						style="color: var(--ink); border: 1px solid var(--border-strong);">+ add role</button
					>
				</SectionPanel>

				<SectionPanel
					title="Education"
					saving={savingSection.education}
					saveMsg={savedMsg.education}
					onSave={() => saveSection('education', educationEdit)}
				>
					<div class="grid gap-3 sm:grid-cols-2">
						<input
							type="text"
							bind:value={educationEdit.institution}
							placeholder="Institution"
							class="w-full border px-3 py-2 text-[13px] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						/>
						<input
							type="text"
							bind:value={educationEdit.degree}
							placeholder="Degree"
							class="w-full border px-3 py-2 text-[13px] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						/>
						<input
							type="text"
							bind:value={educationEdit.specialisation}
							placeholder="Specialisation"
							class="w-full border px-3 py-2 text-[13px] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						/>
						<input
							type="text"
							bind:value={educationEdit.cgpa}
							placeholder="CGPA"
							class="mono w-full border px-3 py-2 text-[12px] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						/>
						<input
							type="text"
							bind:value={educationEdit.period}
							placeholder="Period"
							class="mono w-full border px-3 py-2 text-[12px] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						/>
						<input
							type="text"
							bind:value={educationEdit.location}
							placeholder="Location"
							class="w-full border px-3 py-2 text-[13px] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						/>
					</div>
					<ArrayEditor
						bind:items={educationEdit.awards}
						label="Awards"
						placeholder="Award / honour"
					/>
				</SectionPanel>
			</div>

		<!-- ── PROJECTS TAB ────────────────────────────────── -->
		{:else if topTab === 'projects'}
			{#if projectView === 'list'}
				<div class="mt-8 sm:mt-10">
					<div class="mb-4 flex flex-wrap items-baseline justify-between gap-3">
						<h2 class="serif text-[20px] sm:text-[24px]" style="color: var(--ink);">Projects</h2>
						<div class="flex flex-wrap items-center gap-3">
							{#if seedMsg}
								<span
									class="mono text-[11px]"
									style="color: {seedMsg.startsWith('Error') ? '#ef4444' : 'var(--accent)'};"
									>{seedMsg}</span
								>
							{/if}
							<button
								onclick={restoreDefaultProjects}
								disabled={seedingDefaults}
								class="mono px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] disabled:opacity-40"
								style="color: var(--ink-muted); border: 1px solid var(--border-strong);"
								title="Add any missing default projects (won't overwrite existing rows)">
								{seedingDefaults ? 'restoring…' : 'restore defaults'}
							</button>
							<button onclick={openNewProject} class="btn btn-primary">+ new project</button>
						</div>
					</div>
					{#if projectsEdit.length === 0}
						<p class="py-8 text-[14px]" style="color: var(--ink-muted);">No projects yet.</p>
					{:else}
						<div>
							{#each projectsEdit as project, idx (project.slug)}
								<div
									class="row-hover flex items-center gap-3 border-t -mx-3 px-3 py-3 sm:-mx-4 sm:px-4 sm:gap-4"
									style="border-color: var(--border);"
								>
									<button
										type="button"
										onclick={() => openEditProject(project)}
										class="flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4"
										title="Edit {project.name}"
									>
										<div
											class="shrink-0 overflow-hidden rounded-sm border"
											style="border-color: var(--border); width: 56px; height: 56px;"
										>
											{#if project.image}
												<img
													src={project.image}
													alt={project.name}
													class="h-full w-full object-cover"
												/>
											{:else}
												<div
													class="flex h-full w-full items-center justify-center"
													style="background: var(--bg-subtle); color: var(--ink-faint);"
												>
													<span class="mono text-[10px]">{project.number}</span>
												</div>
											{/if}
										</div>
										<div class="min-w-0 flex-1">
											<p
												class="serif truncate text-[15px] leading-tight sm:text-[17px]"
												style="color: var(--ink);"
											>
												{project.name}
											</p>
											<p class="mono mt-0.5 text-[10px]" style="color: var(--ink-faint);">
												{project.year} ·
												<span style="color: {project.featured ? 'var(--accent)' : 'var(--ink-faint)'};"
													>{project.featured ? 'flagship' : 'also-built'}</span
												>
											</p>
										</div>
									</button>
									<div
										class="mono flex shrink-0 items-center gap-1 text-[12px] uppercase tracking-[0.1em] sm:gap-2"
									>
										<button
											type="button"
											onclick={() => moveProject(idx, -1)}
											disabled={idx === 0}
											aria-label="Move up"
											class="flex h-9 w-9 items-center justify-center disabled:opacity-30"
											style="color: var(--ink-muted); border: 1px solid var(--border-strong);"
											>↑</button
										>
										<button
											type="button"
											onclick={() => moveProject(idx, 1)}
											disabled={idx === projectsEdit.length - 1}
											aria-label="Move down"
											class="flex h-9 w-9 items-center justify-center disabled:opacity-30"
											style="color: var(--ink-muted); border: 1px solid var(--border-strong);"
											>↓</button
										>
										{#if projectDeleteConfirmSlug === project.slug}
											<button
												type="button"
												onclick={() => deleteProject(project.slug)}
												class="flex h-9 items-center px-3 font-medium"
												style="color: #ef4444; border: 1px solid var(--border-strong);"
												>confirm</button
											>
											<button
												type="button"
												onclick={() => (projectDeleteConfirmSlug = null)}
												class="flex h-9 items-center px-3"
												style="color: var(--ink-faint); border: 1px solid var(--border-strong);"
												>cancel</button
											>
										{:else}
											<button
												type="button"
												onclick={() => (projectDeleteConfirmSlug = project.slug)}
												aria-label="Delete project"
												class="flex h-9 w-9 items-center justify-center text-[16px] transition-opacity hover:opacity-60"
												style="color: var(--ink-faint); border: 1px solid var(--border-strong);"
												>×</button
											>
										{/if}
									</div>
								</div>
							{/each}
							<div class="border-t" style="border-color: var(--border);"></div>
						</div>
						<p class="mono mt-3 text-[10px]" style="color: var(--ink-faint);">
							tap a row to edit · use ↑↓ to reorder · × to delete
						</p>
					{/if}
				</div>
			{:else}
				<div class="mt-8 flex items-center justify-between sm:mt-10">
					<button
						onclick={() => (projectView = 'list')}
						class="mono link-reveal text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em]"
						style="color: var(--ink-muted);">← projects</button
					>
					{#if projectSaveMsg}
						<span
							class="mono text-[11px]"
							style="color: {projectSaveMsg.startsWith('Error') ? '#ef4444' : 'var(--accent)'};"
							>{projectSaveMsg}</span
						>
					{/if}
				</div>
				<div class="mt-6 space-y-4 sm:mt-8">
					<div class="grid gap-3 sm:grid-cols-2">
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Name</span
							>
							<input
								type="text"
								bind:value={projectDraft.name}
								class="w-full border px-3 py-2 text-[13px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
					<label class="block">
						<span
							class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
							style="color: var(--ink-muted);">Slug</span
						>
						<input
							type="text"
							bind:value={projectDraft.slug}
							oninput={() => (projectSlugCustomized = true)}
							class="mono w-full border px-3 py-2 text-[12px] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						/>
					</label>
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Number</span
							>
							<input
								type="text"
								bind:value={projectDraft.number}
								placeholder="01"
								class="mono w-full border px-3 py-2 text-[12px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Year</span
							>
							<input
								type="text"
								bind:value={projectDraft.year}
								class="mono w-full border px-3 py-2 text-[12px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
					</div>

					<label class="block">
						<span
							class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
							style="color: var(--ink-muted);">Tagline</span
						>
						<input
							type="text"
							bind:value={projectDraft.tagline}
							class="w-full border px-3 py-2 text-[13px] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						/>
					</label>

					<label class="block">
						<span
							class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
							style="color: var(--ink-muted);">Description</span
						>
						<textarea
							bind:value={projectDraft.description}
							rows="3"
							class="w-full border px-3 py-2 text-[13px] leading-[1.6] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						></textarea>
					</label>

					<ImageField bind:value={projectDraft.image as string} label="Project image" />

					<div>
						<ArrayEditor
							bind:items={projectDraft.stack}
							label="Stack"
							placeholder="Rust, Tokio, ..."
						/>
					</div>

					<div>
						<ArrayEditor
							bind:items={projectDraft.metrics as string[]}
							label="Metrics / highlights"
							placeholder="Quantitative claim with units"
							multiline={true}
						/>
					</div>

					<div class="grid gap-3 sm:grid-cols-2">
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">GitHub URL</span
							>
							<input
								type="text"
								bind:value={projectDraft.github as string}
								class="mono w-full border px-3 py-2 text-[12px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Live URL</span
							>
							<input
								type="text"
								bind:value={projectDraft.url as string}
								class="mono w-full border px-3 py-2 text-[12px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Case study path</span
							>
							<input
								type="text"
								bind:value={projectDraft.caseStudy as string}
								class="mono w-full border px-3 py-2 text-[12px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
						<label class="block">
							<span
								class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
								style="color: var(--ink-muted);">Stars</span
							>
							<input
								type="number"
								bind:value={projectDraft.stars as number}
								min="0"
								class="mono w-full border px-3 py-2 text-[12px] outline-none"
								style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
							/>
						</label>
					</div>

					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={projectDraft.featured as boolean} class="h-4 w-4" />
						<span
							class="mono text-[11px] uppercase tracking-[0.12em]"
							style="color: var(--ink-muted);">Flagship project</span
						>
					</label>

					<div class="flex flex-wrap items-center justify-end gap-3 pt-4">
						<button
							onclick={saveProject}
							disabled={projectSaving}
							class="btn btn-primary"
						>
							{projectSaving ? 'saving…' : 'save project'}
						</button>
					</div>
				</div>
			{/if}

		<!-- ── SKILLS TAB ──────────────────────────────────── -->
		{:else if topTab === 'skills'}
			<div class="mt-8 space-y-10 sm:mt-10">
				<SectionPanel
					title="Skill tiers"
					hint="Production / Comfortable / Exploring"
					saving={savingSection.skillTiers}
					saveMsg={savedMsg.skillTiers}
					onSave={() => saveSection('skillTiers', skillTiersEdit)}
				>
					<div class="space-y-6">
						{#each skillTiersEdit as tier, i (i)}
							<div class="border p-4" style="border-color: var(--border);">
								<div class="mb-3 flex items-center justify-between">
									<span
										class="mono text-[10px] uppercase tracking-[0.12em]"
										style="color: var(--ink-faint);">tier #{i + 1}</span
									>
									<button
										type="button"
										onclick={() => removeSkillTier(i)}
										class="mono px-2 py-1 text-[10px]"
										style="color: #ef4444; border: 1px solid var(--border-strong);">×</button
									>
								</div>
								<div class="grid gap-3 sm:grid-cols-2">
									<input
										type="text"
										bind:value={tier.label}
										placeholder="Label"
										class="w-full border px-3 py-2 text-[13px] outline-none"
										style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
									/>
									<input
										type="text"
										bind:value={tier.note}
										placeholder="Note"
										class="w-full border px-3 py-2 text-[13px] outline-none"
										style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
									/>
								</div>
								<div class="mt-3">
									<ArrayEditor bind:items={tier.items} label="Items" placeholder="Skill" />
								</div>
							</div>
						{/each}
					</div>
					<button
						type="button"
						onclick={addSkillTier}
						class="mono mt-3 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em]"
						style="color: var(--ink); border: 1px solid var(--border-strong);">+ add tier</button
					>
				</SectionPanel>

				<SectionPanel
					title="Achievements"
					hint="Milestones list"
					saving={savingSection.achievements}
					saveMsg={savedMsg.achievements}
					onSave={() => saveSection('achievements', achievementsEdit)}
				>
					<ArrayEditor
						bind:items={achievementsEdit}
						placeholder="Milestone or honour"
						multiline={true}
					/>
				</SectionPanel>
			</div>

		<!-- ── HIRING & AI TAB ─────────────────────────────── -->
		{:else if topTab === 'extras'}
			<div class="mt-8 space-y-10 sm:mt-10">
				<SectionPanel
					title="Hiring"
					hint="For-hiring-teams section"
					saving={savingSection.hiring}
					saveMsg={savedMsg.hiring}
					onSave={() => saveSection('hiring', hiringEdit)}
				>
					<label class="block">
						<span
							class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
							style="color: var(--ink-muted);">Status</span
						>
						<input
							type="text"
							bind:value={hiringEdit.status}
							class="w-full border px-3 py-2 text-[13px] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						/>
					</label>

					<ArrayEditor bind:items={hiringEdit.roles} label="Roles" placeholder="SDE-1 / Backend" />
					<ArrayEditor
						bind:items={hiringEdit.domains}
						label="Domains"
						placeholder="Distributed systems, ..."
					/>
					<ArrayEditor
						bind:items={hiringEdit.openTo}
						label="Open to"
						placeholder="Remote, India, ..."
					/>

					<label class="block">
						<span
							class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
							style="color: var(--ink-muted);">Not looking for</span
						>
						<textarea
							bind:value={hiringEdit.notLookingFor}
							rows="2"
							class="w-full border px-3 py-2 text-[13px] leading-[1.6] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						></textarea>
					</label>
				</SectionPanel>

				<SectionPanel
					title="AI section"
					hint="Heading + paragraphs"
					saving={savingSection.ai}
					saveMsg={savedMsg.ai}
					onSave={() => saveSection('ai', aiEdit)}
				>
					<label class="block">
						<span
							class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
							style="color: var(--ink-muted);">Heading</span
						>
						<textarea
							bind:value={aiEdit.heading}
							rows="2"
							class="w-full border px-3 py-2 text-[13px] leading-[1.6] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						></textarea>
					</label>
					<ArrayEditor
						bind:items={aiEdit.paragraphs}
						label="Paragraphs"
						multiline={true}
						placeholder="Body paragraph"
					/>
				</SectionPanel>

				<SectionPanel
					title="AI projects"
					hint="What you've shipped with AI"
					saving={savingSection.aiProjects}
					saveMsg={savedMsg.aiProjects}
					onSave={() => saveSection('aiProjects', aiProjectsEdit)}
				>
					<div class="space-y-4">
						{#each aiProjectsEdit as p, i (i)}
							<div class="border p-3" style="border-color: var(--border);">
								<div class="mb-3 flex items-center justify-between">
									<span
										class="mono text-[10px] uppercase tracking-[0.12em]"
										style="color: var(--ink-faint);">project #{i + 1}</span
									>
									<button
										type="button"
										onclick={() => removeAiProject(i)}
										class="mono px-2 py-1 text-[10px]"
										style="color: #ef4444; border: 1px solid var(--border-strong);">×</button
									>
								</div>
								<div class="grid gap-2 sm:grid-cols-2">
									<input
										type="text"
										bind:value={p.name}
										placeholder="Name"
										class="w-full border px-3 py-2 text-[13px] outline-none"
										style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
									/>
									<input
										type="text"
										bind:value={p.stack}
										placeholder="Stack"
										class="mono w-full border px-3 py-2 text-[12px] outline-none"
										style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
									/>
									<input
										type="text"
										bind:value={p.github}
										placeholder="GitHub URL"
										class="mono w-full border px-3 py-2 text-[12px] outline-none sm:col-span-2"
										style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
									/>
									<textarea
										bind:value={p.description}
										rows="2"
										placeholder="Description"
										class="w-full border px-3 py-2 text-[13px] leading-[1.6] outline-none sm:col-span-2"
										style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
									></textarea>
								</div>
							</div>
						{/each}
					</div>
					<button
						type="button"
						onclick={addAiProject}
						class="mono mt-3 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em]"
						style="color: var(--ink); border: 1px solid var(--border-strong);">+ add project</button
					>
				</SectionPanel>

				<SectionPanel
					title="How I build"
					hint="Heading + principles"
					saving={savingSection.howIBuild}
					saveMsg={savedMsg.howIBuild}
					onSave={() => saveSection('howIBuild', howIBuildEdit)}
				>
					<label class="block">
						<span
							class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
							style="color: var(--ink-muted);">Heading</span
						>
						<input
							type="text"
							bind:value={howIBuildEdit.heading}
							class="w-full border px-3 py-2 text-[13px] outline-none"
							style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
						/>
					</label>
					<div class="space-y-3">
						{#each howIBuildEdit.principles as p, i (i)}
							<div class="border p-3" style="border-color: var(--border);">
								<div class="mb-2 flex items-center justify-between">
									<span
										class="mono text-[10px] uppercase tracking-[0.12em]"
										style="color: var(--ink-faint);">principle #{i + 1}</span
									>
									<button
										type="button"
										onclick={() => removePrinciple(i)}
										class="mono px-2 py-1 text-[10px]"
										style="color: #ef4444; border: 1px solid var(--border-strong);">×</button
									>
								</div>
								<input
									type="text"
									bind:value={p.label}
									placeholder="Label"
									class="mono mb-2 w-full border px-3 py-2 text-[12px] outline-none"
									style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
								/>
								<textarea
									bind:value={p.detail}
									rows="2"
									placeholder="Detail"
									class="w-full border px-3 py-2 text-[13px] leading-[1.6] outline-none"
									style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
								></textarea>
							</div>
						{/each}
					</div>
					<button
						type="button"
						onclick={addPrinciple}
						class="mono mt-3 px-3 py-1.5 text-[10px] uppercase tracking-[0.12em]"
						style="color: var(--ink); border: 1px solid var(--border-strong);">+ add principle</button
					>
				</SectionPanel>
			</div>

		<!-- ── LAYOUT TAB ──────────────────────────────────── -->
		{:else if topTab === 'layout'}
			<div class="mt-8 space-y-10 sm:mt-10">
				<SectionPanel
					title="Sections"
					hint="Section labels, anchor IDs, and visibility"
					saving={savingSection.sections}
					saveMsg={savedMsg.sections}
					onSave={() => saveSection('sections', sectionsEdit)}
				>
					<div class="space-y-4">
						{#each SECTION_DEFS as def (def.key)}
							{@const sec = sectionsEdit[def.key]}
							<div class="border p-3 sm:p-4" style="border-color: var(--border);">
								<div class="mb-3 flex flex-wrap items-baseline justify-between gap-2">
									<span
										class="mono text-[10px] uppercase tracking-[0.12em]"
										style="color: var(--ink-faint);">{def.key} — {def.hint}</span
									>
									<label class="flex items-center gap-2">
										<input
											type="checkbox"
											bind:checked={sectionsEdit[def.key].visible}
											class="h-4 w-4"
										/>
										<span
											class="mono text-[10px] uppercase tracking-[0.12em]"
											style="color: {sec.visible ? 'var(--accent)' : 'var(--ink-faint)'};"
											>{sec.visible ? 'visible' : 'hidden'}</span
										>
									</label>
								</div>
								<div class="grid gap-3 sm:grid-cols-2">
									<label class="block">
										<span
											class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
											style="color: var(--ink-muted);">Label</span
										>
										<input
											type="text"
											bind:value={sectionsEdit[def.key].label}
											placeholder="SECTION HEADER"
											class="mono w-full border px-3 py-2 text-[12px] outline-none"
											style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
										/>
									</label>
									<label class="block">
										<span
											class="mono mb-1.5 block text-[10px] uppercase tracking-[0.15em]"
											style="color: var(--ink-muted);">Anchor ID (#…)</span
										>
										<input
											type="text"
											bind:value={sectionsEdit[def.key].id}
											placeholder="anchor-id"
											class="mono w-full border px-3 py-2 text-[12px] outline-none"
											style="background: var(--bg); color: var(--ink); border-color: var(--border-strong);"
										/>
									</label>
								</div>
							</div>
						{/each}
					</div>
				</SectionPanel>
			</div>
		{/if}
	{/if}
</main>

<style>
	.admin-tabs {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.admin-tabs::-webkit-scrollbar {
		display: none;
	}
</style>
