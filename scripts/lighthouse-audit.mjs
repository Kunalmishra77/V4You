/**
 * Lighthouse across the key routes — T-072, CLAUDE.md's page definition of done.
 *
 *   pnpm build && pnpm start   # in one terminal
 *   pnpm audit:lighthouse      # in another
 *
 * Run against a production build. A dev server compiles on request, ships an
 * unminified bundle and injects an overlay, so a score from it measures the
 * development experience rather than the site.
 *
 * The target is 95 across all four categories (CLAUDE.md, "definition of done
 * for any page"). Failures print the specific audits that cost the points
 * rather than just the number, because a score on its own tells you nothing
 * actionable.
 */

import { launch } from 'chrome-launcher'
import lighthouse from 'lighthouse'
import { writeFile } from 'node:fs/promises'

const BASE = process.env.SCAN_BASE_URL ?? 'http://localhost:3000'
const TARGET = 95

/**
 * One per template rather than every route — the templates are what vary.
 *
 * `noindex` marks routes that are deliberately excluded from search. Lighthouse
 * scores "page is blocked from indexing" as an SEO failure, which is correct in
 * general and wrong here: the legal pages are noindexed on purpose until they
 * have been through legal review. Applying the SEO threshold to them would make
 * the gate fail for doing the right thing, and the usual response to that is to
 * stop trusting the gate.
 */
const ROUTES = [
  { path: '/' },
  { path: '/about' },
  { path: '/services' },
  { path: '/services/ai-automation' },
  { path: '/industries/healthcare' },
  { path: '/contact' },
  { path: '/security' },
  { path: '/privacy-policy', noindex: true },
]

const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo']

const chrome = await launch({
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
})

const rows = []
const failures = []

for (const route of ROUTES) {
  process.stdout.write(`  ${route.path} … `)

  const result = await lighthouse(
    `${BASE}${route.path}`,
    { port: chrome.port, output: 'json', logLevel: 'error' },
    {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: CATEGORIES,
        // Mobile emulation is the default and the right default: it is the
        // slower device and the one most visitors actually use.
        formFactor: 'mobile',
        screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75 },
      },
    },
  )

  const lhr = result.lhr
  const scores = Object.fromEntries(
    CATEGORIES.map((c) => [c, Math.round((lhr.categories[c]?.score ?? 0) * 100)]),
  )

  // SEO is not asserted on a deliberately noindexed route.
  const asserted = CATEGORIES.filter((c) => !(route.noindex && c === 'seo'))
  const short = asserted.filter((c) => scores[c] < TARGET).length
  console.log(short === 0 ? 'ok' : `${short} below ${TARGET}`)

  for (const category of asserted) {
    if (scores[category] >= TARGET) continue
    const audits = lhr.categories[category].auditRefs
      .map((ref) => lhr.audits[ref.id])
      .filter((a) => a && a.score !== null && a.score < 0.9 && ref_weight(lhr, category, a.id) > 0)
      .slice(0, 4)
      .map((a) => `      ${a.title}${a.displayValue ? ` — ${a.displayValue}` : ''}`)
    failures.push(`  ${route.path}  ${category} ${scores[category]}\n${audits.join('\n')}`)
  }

  rows.push({
    route: route.path + (route.noindex ? ' (noindex)' : ''),
    perf: scores.performance,
    a11y: scores.accessibility,
    bestPractices: scores['best-practices'],
    seo: scores.seo,
    lcp: lhr.audits['largest-contentful-paint']?.displayValue ?? '—',
    cls: lhr.audits['cumulative-layout-shift']?.displayValue ?? '—',
  })
}

function ref_weight(lhr, category, auditId) {
  return lhr.categories[category].auditRefs.find((r) => r.id === auditId)?.weight ?? 0
}

await chrome.kill()
console.table(rows)

await writeFile('lighthouse-report.json', JSON.stringify(rows, null, 2))
console.log('\n  Full scores written to lighthouse-report.json')

if (failures.length) {
  console.error(`\n✕ ${failures.length} category score(s) below ${TARGET}:\n`)
  for (const f of failures) console.error(f)
  process.exit(1)
}
console.log(`\n✓ ${ROUTES.length} routes at ${TARGET}+ across all four categories.`)
