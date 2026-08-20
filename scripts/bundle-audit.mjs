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
 *
 * `nomodule` scripts are excluded from both. Next emits a 110KB core-js
 * polyfill bundle that way, and every browser with ES module support — which is
 * every browser this site targets — skips it without fetching it. Counting it
 * inflated every route by 110KB and, worse, left that much room under the
 * ceiling for a real regression to hide in.
 */

import { readFile, readdir, stat } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { join } from 'node:path'

const BASE = process.env.SCAN_BASE_URL ?? 'http://localhost:3000'
const CHUNK_DIR = '.next/static/chunks'

/**
 * Raw KB of executed initial JS a route may ship.
 *
 * **These are ratchets, not targets.** They sit a little above what the routes
 * ship today, so the next thing added to the layout has to be a deliberate
 * decision rather than a drift. Never raise one without saying in the commit
 * what bought the increase.
 *
 * For scale: a content route is 520KB raw, 155KB gzipped, and the three largest
 * chunks — 487KB of it — are React, React DOM and the App Router. Attributing
 * the rest by marker finds no Payload, no zod and no Turnstile on a content
 * route, so the project's own client components are a small remainder. That
 * bounds what is available here: this is a framework baseline, and moving it
 * means changing how much of the site is a client component at all, not finding
 * a stray import.
 */
const MAX_INITIAL_KB = 560

/** The two routes with a form also carry validation and the bot check. */
const MAX_INITIAL_KB_FORM = 850
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
  const text = await readFile(path, 'utf8')
  chunks.set(file, {
    kb: Math.round((await stat(path)).size / 1024),
    gzipKb: Math.round(gzipSync(text).length / 1024),
    text,
  })
}

const rows = []
const problems = []

for (const route of ROUTES) {
  const html = await fetch(`${BASE}${route}`).then((r) => r.text())

  // Only <script src> counts, and only if the browser will run it. A chunk
  // named in a flight payload or a preload hint is not necessarily executed
  // before the page is interactive, and a `nomodule` script is not executed at
  // all by anything with ES module support.
  const referenced = [...html.matchAll(/<script([^>]+)src="([^"]+\.js)"([^>]*)>/g)]
    .filter((m) => !/nomodule/i.test(m[1] + m[3]))
    .map((m) => m[2].split('/').pop())
    .filter((f, i, all) => all.indexOf(f) === i)
    .filter((f) => chunks.has(f))

  const kb = referenced.reduce((sum, f) => sum + chunks.get(f).kb, 0)
  const gzipKb = referenced.reduce((sum, f) => sum + chunks.get(f).gzipKb, 0)

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
    // What is actually transferred. Reported rather than asserted on: the
    // budget is on raw bytes because that is what the browser has to parse,
    // and parse time is the part that shows up as blocking.
    gzipKb,
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
