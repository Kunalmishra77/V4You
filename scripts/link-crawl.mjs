/**
 * Internal link crawl — T-077, and docs/06 §A3.
 *
 *   pnpm build && pnpm start
 *   pnpm audit:links
 *
 * Three things, all of which are easy to believe are fine and cheap to check:
 *
 *   1. Every internal link resolves. A dead link inside your own site is the
 *      one kind nobody reports, because the person who hits it assumes they
 *      did something wrong.
 *   2. No published page is more than three clicks from home (docs/06 §A3).
 *   3. No orphans — every route in the sitemap is reachable by following links
 *      from home. A page nobody can reach by clicking is a page that exists
 *      only in the sitemap.
 */

const BASE = process.env.SCAN_BASE_URL ?? 'http://localhost:3000'
const MAX_DEPTH_ALLOWED = 3

const seen = new Map() // path -> { status, depth, linkedFrom }
const problems = []
const queue = [{ path: '/', depth: 0, from: '(entry)' }]

const normalise = (href) => {
  if (!href) return null
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) return null
  const [path] = href.split('#')
  if (!path.startsWith('/')) return null
  // Ignore the CMS and API — they are not part of the public link graph.
  if (path.startsWith('/admin') || path.startsWith('/api')) return null
  return path.replace(/\/$/, '') || '/'
}

while (queue.length) {
  const { path, depth, from } = queue.shift()
  if (seen.has(path)) continue

  const res = await fetch(`${BASE}${path}`)
  seen.set(path, { status: res.status, depth, linkedFrom: from })

  if (res.status !== 200) {
    problems.push(`${path} → ${res.status}, linked from ${from}`)
    continue
  }
  if (depth > MAX_DEPTH_ALLOWED) {
    problems.push(`${path} is ${depth} clicks from home, over the ${MAX_DEPTH_ALLOWED} maximum`)
  }

  const html = await res.text()
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    const target = normalise(href)
    if (target && !seen.has(target)) queue.push({ path: target, depth: depth + 1, from: path })
  }
}

// --- Orphans: in the sitemap but never linked to -----------------------------
const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text()
const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/',
)

for (const path of sitemapPaths) {
  if (!seen.has(path)) {
    problems.push(`${path} is in the sitemap but unreachable by following links from home`)
  }
}

const byDepth = {}
for (const info of seen.values()) {
  if (info.status !== 200) continue
  byDepth[info.depth] = (byDepth[info.depth] ?? 0) + 1
}

console.log(`  crawled ${seen.size} internal URLs from /`)
console.log(`  sitemap lists ${sitemapPaths.length}`)
console.log(
  '  depth: ' +
    Object.entries(byDepth)
      .map(([d, n]) => `${n} at ${d} click${d === '1' ? '' : 's'}`)
      .join(', '),
)

const broken = [...seen.entries()].filter(([, i]) => i.status !== 200)
if (broken.length) {
  console.log('\n  non-200 responses:')
  for (const [p, i] of broken) console.log(`    ${i.status}  ${p}  (from ${i.linkedFrom})`)
}

if (problems.length) {
  console.error(`\n✕ ${problems.length} problem(s):\n`)
  for (const p of [...new Set(problems)]) console.error(`  ${p}`)
  process.exit(1)
}
console.log('\n✓ Every internal link resolves, nothing is orphaned, nothing is too deep.')
