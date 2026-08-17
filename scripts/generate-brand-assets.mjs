/**
 * Generate every raster brand derivative from the vector masters in `assets/brand/`.
 *
 *   node scripts/generate-brand-assets.mjs
 *
 * Run `scripts/vectorise-logo.py` first — it produces the SVGs this reads.
 * Outputs go to `assets/brand/` (the source-of-truth copies) and `public/`
 * (what the site actually serves), so the two never drift.
 *
 * Requires: sharp, opentype.js. Network access is used once, to fetch the two
 * brand faces for the Open Graph card; glyphs are converted to paths so nothing
 * depends on a font being installed.
 */

import { Buffer } from 'node:buffer'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import opentype from 'opentype.js'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const brand = path.join(root, 'assets', 'brand')
const publicDir = path.join(root, 'public')

// docs/01 §1
const NAVY = '#0A1D3E'
const BONE = '#F6F5F1'
const AMBER = '#EDA11A'
const SLATE_300 = '#93A4BF'

// The two faces the OG card uses (docs/01 §3). Resolved through the CSS API rather
// than hardcoding gstatic URLs, which carry a version segment and rot.
const FONTS = {
  display: { family: 'Schibsted Grotesk', weight: 700 },
  mono: { family: 'IBM Plex Mono', weight: 500 },
}

const out = []

async function emit(dirs, name, buffer) {
  for (const dir of dirs) {
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, name), buffer)
  }
  out.push(`${name.padEnd(26)} ${(buffer.length / 1024).toFixed(1).padStart(7)} KB`)
}

const render = (svg, size, density = 900) =>
  sharp(Buffer.from(svg), { density }).resize(size, size).png({ compressionLevel: 9 }).toBuffer()

/** A square tile with the mark centred at `scale` of the tile width. */
function tile(markSvg, background, scale) {
  const inner = markSvg
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>$/, '')
    .replace(/<title>.*?<\/title>/, '')
  const viewBox = markSvg.match(/viewBox="([^"]+)"/)[1]
  const [, , w] = viewBox.split(' ').map(Number)
  const pad = ((1 - scale) / 2) * w
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${w}">` +
    `<rect width="${w}" height="${w}" fill="${background}"/>` +
    `<g transform="translate(${pad} ${pad}) scale(${scale})">${inner}</g></svg>`
  )
}

/**
 * Minimal ICO writer. Each entry is a PNG payload, which every browser in support
 * since IE11 reads, and it keeps the file a fraction of BMP-encoded size.
 */
function ico(entries) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(entries.length, 4)

  let offset = 6 + entries.length * 16
  const dir = []
  for (const { size, png } of entries) {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0)
    e.writeUInt8(size >= 256 ? 0 : size, 1)
    e.writeUInt8(0, 2) // palette
    e.writeUInt8(0, 3) // reserved
    e.writeUInt16LE(1, 4) // colour planes
    e.writeUInt16LE(32, 6) // bits per pixel
    e.writeUInt32LE(png.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += png.length
    dir.push(e)
  }
  return Buffer.concat([header, ...dir, ...entries.map((e) => e.png)])
}

/** Lay text out as SVG path data so the card never depends on an installed font. */
function textPath(font, text, x, y, size, tracking = 0) {
  const scale = size / font.unitsPerEm
  let cursor = x
  let d = ''
  let previous = null
  for (const char of text) {
    const glyph = font.charToGlyph(char)
    if (previous) cursor += font.getKerningValue(previous, glyph) * scale
    d += glyph.getPath(cursor, y, size).toPathData(2)
    cursor += glyph.advanceWidth * scale + tracking
    previous = glyph
  }
  return { d, width: cursor - x - tracking }
}

async function loadFont({ family, weight }) {
  // A modern UA would get woff2, which opentype.js cannot parse; an old one gets ttf.
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`,
    { headers: { 'User-Agent': 'Mozilla/4.0' } },
  )
  if (!css.ok) throw new Error(`font css lookup failed: ${family} (${css.status})`)
  const url = (await css.text()).match(/https:\/\/[^)]+\.ttf/)?.[0]
  if (!url) throw new Error(`no ttf found for ${family} ${weight}`)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`font fetch failed: ${url} (${res.status})`)
  return opentype.parse(await res.arrayBuffer())
}

async function main() {
  const markNavy = await readFile(path.join(brand, 'logo-mark.svg'), 'utf8')
  const markLight = await readFile(path.join(brand, 'logo-mark-light.svg'), 'utf8')
  const lockupLight = await readFile(path.join(brand, 'logo-full-light.svg'), 'utf8')

  // --- Favicons: transparent, navy ink. The .svg master already swaps to bone
  //     under a dark browser chrome; PNG and ICO cannot, so they stay navy.
  const png512 = await render(markNavy, 512)
  await emit([brand, publicDir], 'favicon.png', png512)

  const icoSizes = [16, 32, 48]
  const icoEntries = []
  for (const size of icoSizes) {
    icoEntries.push({ size, png: await render(markNavy, size) })
  }
  await emit([brand, publicDir], 'favicon.ico', ico(icoEntries))

  // --- PWA / manifest icons: transparent for `any`, navy-tiled for `maskable`
  //     (the safe zone is the middle 80%, so the mark sits at 58%).
  await emit([brand, publicDir], 'icon-192.png', await render(markNavy, 192))
  await emit([brand, publicDir], 'icon-512.png', png512)
  await emit(
    [brand, publicDir],
    'maskable-icon-512.png',
    await render(tile(markLight, NAVY, 0.58), 512),
  )

  // --- Apple touch icon: iOS composites onto white and adds its own corner
  //     radius, so this one has to be opaque. Navy is the brand ground.
  await emit(
    [brand, publicDir],
    'apple-touch-icon.png',
    await render(tile(markLight, NAVY, 0.66), 180),
  )

  // --- Open Graph default card (1200 × 630)
  const [display, mono] = await Promise.all([loadFont(FONTS.display), loadFont(FONTS.mono)])

  const W = 1200
  const H = 630
  const PAD = 88

  const lockupHeight = 84
  const [, , , lh] = lockupLight.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number)
  const lockupScale = lockupHeight / lh
  const lockupInner = lockupLight
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>$/, '')
    .replace(/<title>.*?<\/title>/, '')

  // Positioning statement, blueprint §1.2 (short version) — verbatim, not invented.
  const headline = ['AI-first transformation', 'for businesses ready', 'to move forward.']
  const headlineSize = 62
  const headlineTop = 310

  const lines = headline
    .map((line, i) => {
      const { d } = textPath(display, line, PAD, headlineTop + i * (headlineSize * 1.14), headlineSize)
      return `<path d="${d}" fill="${BONE}"/>`
    })
    .join('')

  const label = textPath(mono, 'V4YOU.TECH', PAD, H - PAD + 6, 20, 3.2)

  const og =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect width="${W}" height="${H}" fill="${NAVY}"/>` +
    // A single amber rule, hairline-thin, running the full bleed under the lockup.
    `<rect x="0" y="${H - 8}" width="${W}" height="8" fill="${AMBER}"/>` +
    `<g transform="translate(${PAD} ${PAD}) scale(${lockupScale})">${lockupInner}</g>` +
    `<rect x="${PAD}" y="${headlineTop - 86}" width="72" height="5" fill="${AMBER}"/>` +
    lines +
    `<path d="${label.d}" fill="${SLATE_300}"/>` +
    `</svg>`

  const ogPng = await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toBuffer()
  await emit([brand, publicDir], 'og-default.png', ogPng)

  // --- The SVG masters are served too, so the header can use a real vector.
  for (const name of [
    'logo-full.svg',
    'logo-full-light.svg',
    'logo-mark.svg',
    'logo-mark-light.svg',
    'favicon.svg',
  ]) {
    await emit([publicDir], name, await readFile(path.join(brand, name)))
  }

  console.log(out.join('\n'))
}

await main()
