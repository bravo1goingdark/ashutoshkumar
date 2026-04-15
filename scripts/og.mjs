/**
 * Generates static/og.png (1200×630) and static/apple-touch-icon.png (180×180)
 * Run: node scripts/og.mjs
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = (f) => join(root, 'static', f);

/* ── OG image SVG ─────────────────────────────────────────────── */
const ogSvg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="#fafaf9"/>

  <!-- Vertical accent rule -->
  <rect x="72" y="60" width="1" height="460" fill="#e7e5e4"/>

  <!-- Top label -->
  <text x="96" y="100" font-family="'Courier New',Courier,monospace" font-size="12"
        fill="#a8a29e" letter-spacing="4">PORTFOLIO · 2026</text>

  <!-- Name — two-line serif -->
  <text x="96" y="290" font-family="Georgia,'Times New Roman',serif" font-size="92"
        fill="#0c0a09" letter-spacing="-2">Ashutosh</text>
  <text x="96" y="400" font-family="Georgia,'Times New Roman',serif" font-size="92"
        fill="#0c0a09" letter-spacing="-2">Kumar.</text>

  <!-- Role line -->
  <text x="96" y="458" font-family="'Courier New',Courier,monospace" font-size="17"
        fill="#78716c" letter-spacing="3">BACKEND &amp; SYSTEMS ENGINEER</text>

  <!-- Stack -->
  <text x="96" y="490" font-family="'Courier New',Courier,monospace" font-size="14"
        fill="#a8a29e" letter-spacing="2">Rust · Go · TypeScript</text>

  <!-- Vertical divider between text and stats -->
  <rect x="680" y="100" width="1" height="400" fill="#e7e5e4"/>

  <!-- Stats — 2 × 2 grid on the right -->
  <!-- GPA -->
  <text x="724" y="218" font-family="Georgia,'Times New Roman',serif" font-size="56"
        fill="#0c0a09">8.61</text>
  <text x="724" y="242" font-family="'Courier New',Courier,monospace" font-size="11"
        fill="#a8a29e" letter-spacing="3">GPA</text>
  <text x="724" y="258" font-family="'Courier New',Courier,monospace" font-size="10"
        fill="#d6d3d1">Dean&apos;s List · MUJ CS &apos;26</text>

  <!-- OSS Stars -->
  <text x="960" y="218" font-family="Georgia,'Times New Roman',serif" font-size="56"
        fill="#0c0a09">80&#9733;</text>
  <text x="960" y="242" font-family="'Courier New',Courier,monospace" font-size="11"
        fill="#a8a29e" letter-spacing="3">OSS STARS</text>
  <text x="960" y="258" font-family="'Courier New',Courier,monospace" font-size="10"
        fill="#d6d3d1">all public repos</text>

  <!-- LeetCode -->
  <text x="724" y="388" font-family="Georgia,'Times New Roman',serif" font-size="56"
        fill="#0c0a09">500+</text>
  <text x="724" y="412" font-family="'Courier New',Courier,monospace" font-size="11"
        fill="#a8a29e" letter-spacing="3">LEETCODE</text>
  <text x="724" y="428" font-family="'Courier New',Courier,monospace" font-size="10"
        fill="#d6d3d1">Java · DSA</text>

  <!-- Latency -->
  <text x="960" y="388" font-family="Georgia,'Times New Roman',serif" font-size="56"
        fill="#0c0a09">35%</text>
  <text x="960" y="412" font-family="'Courier New',Courier,monospace" font-size="11"
        fill="#a8a29e" letter-spacing="3">LATENCY CUT</text>
  <text x="960" y="428" font-family="'Courier New',Courier,monospace" font-size="10"
        fill="#d6d3d1">Bindisa internship</text>

  <!-- Bottom bar -->
  <rect x="0" y="543" width="1200" height="87" fill="#0c0a09"/>
  <circle cx="96" cy="586" r="5" fill="#059669"/>
  <text x="114" y="592" font-family="'Courier New',Courier,monospace" font-size="13"
        fill="#fafaf9" letter-spacing="2">AVAILABLE IMMEDIATELY</text>
  <text x="1128" y="592" font-family="'Courier New',Courier,monospace" font-size="13"
        fill="#a8a29e" text-anchor="end">ashutoshk.pages.dev</text>
</svg>`;

/* ── Favicon SVG (reuse existing) ─────────────────────────────── */
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="24" fill="#0c0a09"/>
  <text x="90" y="136" font-family="Georgia,'Times New Roman',serif" font-size="110"
        font-style="italic" fill="#fafaf9" text-anchor="middle">a</text>
</svg>`;

/* ── Generate ─────────────────────────────────────────────────── */
await sharp(Buffer.from(ogSvg))
  .png({ quality: 95, compressionLevel: 8 })
  .toFile(out('og.png'));
console.log('✓ static/og.png (1200×630)');

await sharp(Buffer.from(faviconSvg))
  .resize(180, 180)
  .png({ quality: 95 })
  .toFile(out('apple-touch-icon.png'));
console.log('✓ static/apple-touch-icon.png (180×180)');

// Also generate a 32×32 PNG favicon for older browsers
await sharp(Buffer.from(faviconSvg))
  .resize(32, 32)
  .png()
  .toFile(out('favicon-32.png'));
console.log('✓ static/favicon-32.png (32×32)');
