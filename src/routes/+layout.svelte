<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

	const SITE_URL = 'https://ashutoshk.pages.dev';
	const OG_IMAGE = `${SITE_URL}/og.png`;
	const TITLE = 'Ashutosh Kumar — Backend & Systems Engineer';
	const DESCRIPTION =
		'Backend & Systems engineer building high-performance infrastructure in Rust and Go. Obol, Clairo, Mailgrid. MUJ CS \'26. Available immediately.';
</script>

<svelte:head>
	<title>{TITLE}</title>
	<meta name="description" content={DESCRIPTION} />
	<meta name="author" content="Ashutosh Kumar" />
	<meta
		name="keywords"
		content="Ashutosh Kumar, backend engineer, systems engineer, Rust, Go, TypeScript, SvelteKit, distributed systems, MUJ, bravo1goingdark, portfolio"
	/>
	<link rel="canonical" href={SITE_URL} />

	<!-- Open Graph — WhatsApp, LinkedIn, Facebook, Telegram -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={SITE_URL} />
	<meta property="og:site_name" content="Ashutosh Kumar" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content={TITLE} />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta property="og:image:secure_url" content={OG_IMAGE} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Ashutosh Kumar — Backend & Systems Engineer" />

	<!-- Twitter / X Card — shows large banner image -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@bravo1goingdark" />
	<meta name="twitter:creator" content="@bravo1goingdark" />
	<meta name="twitter:title" content={TITLE} />
	<meta name="twitter:description" content={DESCRIPTION} />
	<meta name="twitter:image" content={OG_IMAGE} />
	<meta name="twitter:image:alt" content="Ashutosh Kumar — Backend & Systems Engineer" />

	<!-- JSON-LD structured data -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Ashutosh Kumar',
		url: SITE_URL,
		image: OG_IMAGE,
		jobTitle: 'Backend & Systems Engineer',
		description: DESCRIPTION,
		nationality: 'Indian',
		alumniOf: {
			'@type': 'CollegeOrUniversity',
			name: 'Manipal University Jaipur',
			url: 'https://jaipur.manipal.edu'
		},
		knowsAbout: [
			'Rust',
			'Go',
			'TypeScript',
			'Distributed Systems',
			'Backend Engineering',
			'Message Queues',
			'Cloud Infrastructure',
			'SvelteKit',
			'Cloudflare Workers'
		],
		sameAs: [
			'https://github.com/bravo1goingdark',
			'https://linkedin.com/in/bravo1goingdark',
			'https://x.com/bravo1goingdark',
			'https://leetcode.com/u/bravo1goingdark/'
		]
	})}</script>`}
</svelte:head>

<Nav />
<main>
	{@render children()}
</main>
<Footer />
