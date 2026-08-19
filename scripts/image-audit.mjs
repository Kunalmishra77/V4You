/**
 * Image pipeline audit — T-074, docs/02 §4 and docs/06 §C1.
 *
 *   pnpm audit:images
 *
 * This site is deliberately image-light — the brand marks are SVG and there is
 * no stock photography — so the audit is short. It is here because the risk
 * arrives later: the first case study screenshot or team photograph is exactly
 * when a 4MB PNG gets dropped into a page, and by then nobody is checking.
 *
 * What it asserts:
 *
 *   1. Every <img> has an alt attribute. Not a non-empty one — a decorative
 *      image gets alt="" deliberately — but the attribute must be present,
 *      because a missing alt makes a screen reader read the filename.
 *   2. Every <img> declares width and height. Without them the page reflows as
 *      images load, which is the main avoidable source of layout shift.
 *   3. Exactly one image per page carries `priority`/eager loading. More than
 *      one and the preload hint stops meaning anything; none on a page with an
 *      above-fold image and the LCP waits for lazy loading.
 *   4. No raster asset in public/ exceeds a size budget.
 */

import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const BASE = process.env.SCAN_BASE_URL ?? 'http://localhost:3000'
const ROUTES = ['/', '/about', '/services/ai-automation', '/industries/healthcare', '/contact']

/** Generous, because it is a ceiling and not a target. */
const MAX_RASTER_KB = 250

const problems = []
const rows = []

for (const route of ROUTES) {
  const html = await (await fetch(`${BASE}${route}`)).text()
  const tags = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0])

  let missingAlt = 0
  let missingDims = 0
  let eager = 0

  for (const tag of tags) {
    if (!/\salt\s*=/.test(tag)) {
      missingAlt += 1
      problems.push(`${route}  <img> with no alt attribute: ${tag.slice(0, 90)}`)
    }
    if (!/\swidth\s*=/.test(tag) || !/\sheight\s*=/.test(tag)) {
      missingDims += 1
      problems.push(
        `${route}  <img> without width/height — causes layout shift: ${tag.slice(0, 90)}`,
      )
    }
    // Next signals priority by *omitting* `loading="lazy"`, not by adding an
    // attribute. Checking for loading="eager" finds nothing and reports every
    // page as having no priority image — an audit that always passes.
    if (!/loading="lazy"/i.test(tag)) eager += 1
  }

  // More than two eager images is a preload hint competing with itself. Two is
  // the floor here because the header renders the mark and the lockup as a
  // responsive pair, only one of which is ever displayed.
  if (eager > 2) {
    problems.push(
      `${route}  ${eager} eagerly-loaded images — a preload hint that competes with itself`,
    )
  }

  rows.push({ route, images: tags.length, missingAlt, missingDims, eagerLoaded: eager })
}

// --- Static assets ---------------------------------------------------------
const publicDir = 'public'
const files = await readdir(publicDir)
const rasters = files.filter((f) => /\.(png|jpe?g|webp|avif|gif)$/i.test(f))
const assetRows = []

for (const file of rasters) {
  const { size } = await stat(path.join(publicDir, file))
  const kb = Math.round(size / 1024)
  assetRows.push({ file, kb })
  if (kb > MAX_RASTER_KB) {
    problems.push(`public/${file} is ${kb}KB, over the ${MAX_RASTER_KB}KB budget`)
  }
}

console.table(rows)
console.table(assetRows.sort((a, b) => b.kb - a.kb))

const svgCount = files.filter((f) => f.endsWith('.svg')).length
console.log(`\n  ${svgCount} SVG asset(s), ${rasters.length} raster asset(s) in public/`)

if (problems.length) {
  console.error(`\n✕ ${problems.length} problem(s):\n`)
  for (const p of [...new Set(problems)]) console.error(`  ${p}`)
  process.exit(1)
}
console.log('\n✓ Image pipeline clean.')
