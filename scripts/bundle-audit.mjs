/**
 * What each route actually ships before it is interactive — the deterministic
 * half of the performance story.
 *
 *   pnpm build && pnpm start
 *   pnpm audit:bundle
 *
 * `pnpm audit:lighthouse` is the other half, and on a developer machine its
 * performance score is noise: the T-072 commit recorded a ±25 point swing
 * between two runs of one unchanged build. This script measures something that
 * does not move — which scripts the server puts in the HTML, and how many bytes
 * those files are on disk. Same build in, same answer out, on any machine.
 *
 * Two assertions:
 *
 *   1. **No motion library in a route's initial payload.** GSAP, ScrollTrigger
 *      and SplitText are 118KB of JavaScript that exists to animate things a
 *      visitor has not scrolled to yet. They belong in a chunk fetched after
 *      hydration, which is what the dynamic import in MotionProvider is for. A
 *      static import from anywhere reachable by the site layout silently undoes
 *      that, and nothing else in CI would notice.
 *
 *   2. **A ceiling on initial JavaScript per route**, so the next thing added
 *      to the layout has to be a deliberate decision rather than a drift.
 */

import { readFile, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const BASE = process.env.SCAN_BASE_URL ?? 'http://localhost:3000'
const CHUNK_DIR = '.next/static/chunks'

/**
 * Raw KB of initial JS a route may ship.
 *
 * **These are ratchets, not targets.** They sit at what the routes ship today
 * plus a little headroom, so the next thing added to the layout has to be a
 * deliberate decision rather than a drift. They are not an endorsement of the
 * number: 630KB raw on a page of static text is a long way from CLAUDE.md's
 * "marketing pages should ship almost no JS", and nearly all of it is the React
 * 19 + App Router baseline rather than anything this project wrote. Bringing it
 * down is real work that has not been done. Lower these when it is; never raise
 * one without saying in the commit what bought the increase.
 */
const MAX_INITIAL_KB = 680

/** The two routes with a form also carry validation and the bot check. */
const MAX_INITIAL_KB_FORM = 960
const FORM_ROUTES = new Set(['/contact', '/book-consultation'])

/**
 * Libraries that must never appear in an initial payload, and a string that
 * identifies each one once the bundle has been minified.
 *
 * Picking the marker took two attempts and the first one was silently useless.
 * `ScrollTrigger.batch` — the call this project actually makes — does not
 * survive minification: the import becomes a one-letter local and the call
 * reads `X.batch(...)`. A marker that can never match is worse than no check,
 * because the audit passes and reads as proof.
 *
 * These are property names inside the libraries' own object literals, which
 * minifiers cannot rename. `minHits` is above one because Next's runtime chunk
 * carries a module-name map that mentions each of these exactly once — that
 * single mention is the map, not the library.
 */
const DEFERRED_ONLY = [
  { name: 'gsap/ScrollTrigger', marker: 'scrollTrigger', minHits: 5 },
  { name: 'lenis', marker: 'lenis', minHits: 5 },
]

const ROUTES = [
  '/',
  '/about',
  '/services',
  '/services/ai-automation',
  '/industries',
  '/industries/healthcare',
  '/contact',
  '/book-consultation',
  '/security',
  '/privacy-policy',
]

/** Every chunk on disk, with its size and its contents, read once. */
const chunks = new Map()
for (const file of await readdir(CHUNK_DIR)) {
  if (!file.endsWith('.js')) continue
  const path = join(CHUNK_DIR, file)
  chunks.set(file, {
    kb: Math.round((await stat(path)).size / 1024),
    text: await readFile(path, 'utf8'),
  })
}

const rows = []
const problems = []

for (const route of ROUTES) {
  const html = await fetch(`${BASE}${route}`).then((r) => r.text())

  // Only <script src> counts. A chunk named in a flight payload or a preload
  // hint is not necessarily executed before the page is interactive.
  const referenced = [...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)]
    .map((m) => m[1].split('/').pop())
    .filter((f, i, all) => all.indexOf(f) === i)
    .filter((f) => chunks.has(f))

  const kb = referenced.reduce((sum, f) => sum + chunks.get(f).kb, 0)

  const carried = DEFERRED_ONLY.filter(({ marker, minHits }) =>
    referenced.some((f) => chunks.get(f).text.split(marker).length - 1 >= minHits),
  ).map((d) => d.name)

  if (carried.length) {
    problems.push(
      `${route} ships ${carried.join(', ')} before hydration — it should be behind a dynamic import`,
    )
  }
  const budget = FORM_ROUTES.has(route) ? MAX_INITIAL_KB_FORM : MAX_INITIAL_KB
  if (kb > budget) {
    problems.push(`${route} ships ${kb}KB of initial JS, over the ${budget}KB budget`)
  }

  rows.push({
    route,
    scripts: referenced.length,
    initialJsKb: kb,
    deferredLeaks: carried.join(',') || '—',
  })
}

console.table(rows)

if (problems.length) {
  console.error(`\n✕ ${problems.length} problem(s):\n`)
  for (const p of problems) console.error(`  ${p}`)
  process.exit(1)
}
console.log(`\n✓ ${ROUTES.length} routes within budget, no deferred library in an initial payload.`)
