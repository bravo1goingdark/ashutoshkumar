<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { data, children } = $props();

	const SITE_URL = 'https://ashutoshk.pages.dev';
	const OG_IMAGE = `${SITE_URL}/og.png`;

	const title = $derived(data.site.profile.seo.title || `${data.site.profile.name} — ${data.site.profile.role}`);
	const description = $derived(data.site.profile.seo.description);
	const author = $derived(data.site.profile.name);

	const sameAs = $derived(
		Object.values(data.site.profile.socials).filter((u): u is string => typeof u === 'string' && u.length > 0)
	);

	const knowsAbout = $derived(
		Array.from(
			new Set(
				data.site.skillTiers
					.flatMap((t) => t.items)
					.concat(data.site.hiring.domains.flatMap((d) => d.split(/[,·]/).map((s) => s.trim())))
					.filter(Boolean)
			)
		)
	);

	const structuredData = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: data.site.profile.name,
			url: SITE_URL,
			image: data.site.profile.photo || OG_IMAGE,
			jobTitle: data.site.profile.role,
			description,
			alumniOf: data.site.education.institution
				? {
						'@type': 'CollegeOrUniversity',
						name: data.site.education.institution
					}
				: undefined,
			knowsAbout,
			sameAs
		})
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="author" content={author} />
	<link rel="canonical" href={SITE_URL} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={SITE_URL} />
	<meta property="og:site_name" content={author} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta property="og:image:secure_url" content={OG_IMAGE} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={`${author} — ${data.site.profile.role}`} />

	<!-- Twitter / X Card -->
	<meta name="twitter:card" content="summary_large_image" />
	{#if data.site.profile.socials.x}
		<meta name="twitter:site" content={'@' + data.site.profile.handle} />
		<meta name="twitter:creator" content={'@' + data.site.profile.handle} />
	{/if}
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={OG_IMAGE} />
	<meta name="twitter:image:alt" content={`${author} — ${data.site.profile.role}`} />

	<!-- JSON-LD structured data -->
	{@html `<script type="application/ld+json">${structuredData}</` + `script>`}
</svelte:head>

<Nav profile={data.site.profile} sections={data.site.sections} />
<main>
	{@render children()}
</main>
<Footer profile={data.site.profile} />
