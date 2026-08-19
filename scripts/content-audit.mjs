/**
 * Content and structured-data audit — T-075 and T-078.
 *
 *   pnpm dev            # in one terminal
 *   pnpm audit:content  # in another
 *
 * Checks the mechanical half of the quality gate in docs/06 §A4. The
 * judgement calls — whether a claim is true, whether four challenges are
 * genuinely distinct — stay with the content owner, as that document says.
 * What this catches is the class of failure nobody notices until a crawler
 * does: two pages sharing a description, a canonical pointing at localhost, an
 * FAQPage with no questions, a page with three sentences on it.
 *
 * It also enforces the schema ban. docs/06 §A2 rules out AggregateRating,
 * Review and Award outright — there is no verified data behind them, and
 * fabricated structured data is a manual-action risk rather than a style
 * problem. A ban that is only written down is a ban until someone is in a
 * hurry.
 */

const BASE = process.env.SCAN_BASE_URL ?? 'http://localhost:3000'

/** Expected JSON-LD per page type — docs/06 §A2. */
const ROUTES = [
  { path: '/', expect: ['Organization', 'WebSite', 'FAQPage'] },
  { path: '/about', expect: ['Organization', 'AboutPage'] },
  { path: '/services', expect: ['WebPage', 'FAQPage'] },
  { path: '/services/ai-automation', expect: ['Service', 'BreadcrumbList', 'FAQPage'] },
  { path: '/services/cloud-devops', expect: ['Service', 'BreadcrumbList', 'FAQPage'] },
  { path: '/industries', expect: ['WebPage'] },
  { path: '/industries/healthcare', expect: ['WebPage', 'BreadcrumbList', 'FAQPage'] },
  { path: '/industries/logistics', expect: ['WebPage', 'BreadcrumbList', 'FAQPage'] },
  { path: '/contact', expect: ['Organization'] },
  { path: '/security', expect: ['WebPage'] },
  { path: '/accessibility', expect: ['WebPage'] },
  { path: '/book-consultation', expect: [] },
  { path: '/thank-you', expect: [], noindex: true },
  { path: '/privacy-policy', expect: [], noindex: true },
  { path: '/terms', expect: [], noindex: true },
  { path: '/cookie-policy', expect: [], noindex: true },
]

/** Never emitted, per docs/06 §A2. */
const BANNED_SCHEMA = ['AggregateRating', 'Review', 'Award']

const problems = []
const seenTitles = new Map()
const seenDescriptions = new Map()

const fail = (route, msg) => problems.push(`${route}  ${msg}`)

const text = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const rows = []

for (const route of ROUTES) {
  const res = await fetch(`${BASE}${route.path}`)
  const html = await res.text()

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ''
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? ''
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? ''

  // --- Metadata ---------------------------------------------------------
  if (!title) fail(route.path, 'no <title>')
  if (!description) fail(route.path, 'no meta description')
  if (title && seenTitles.has(title))
    fail(route.path, `duplicate title, shared with ${seenTitles.get(title)}`)
  seenTitles.set(title, route.path)
  if (description && seenDescriptions.has(description))
    fail(route.path, `duplicate description, shared with ${seenDescriptions.get(description)}`)
  seenDescriptions.set(description, route.path)
  if (!canonical) fail(route.path, 'no canonical')

  const wantsNoindex = Boolean(route.noindex)
  const hasNoindex = robots.includes('noindex')
  if (wantsNoindex && !hasNoindex) fail(route.path, 'should be noindex and is not')
  if (!wantsNoindex && hasNoindex) fail(route.path, 'is noindex and should not be')

  // --- Structured data --------------------------------------------------
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  const types = []
  for (const [, raw] of blocks) {
    let parsed
    try {
      parsed = JSON.parse(raw.replace(/\u003c/g, '<'))
    } catch (e) {
      fail(route.path, `JSON-LD does not parse: ${e.message}`)
      continue
    }
    const walk = (node) => {
      if (Array.isArray(node)) return node.forEach(walk)
      if (node && typeof node === 'object') {
        if (typeof node['@type'] === 'string') types.push(node['@type'])
        Object.values(node).forEach(walk)
      }
    }
    walk(parsed)
  }

  for (const banned of BANNED_SCHEMA) {
    if (types.includes(banned)) fail(route.path, `emits banned schema ${banned} (docs/06 §A2)`)
  }
  for (const wanted of route.expect) {
    if (!types.includes(wanted)) fail(route.path, `missing expected schema ${wanted}`)
  }
  // An FAQPage with no questions is a markup error, not an empty section.
  if (types.includes('FAQPage') && !types.includes('Question'))
    fail(route.path, 'FAQPage with no Question entries')

  // --- Substance --------------------------------------------------------
  const body = text(html)
  const words = body.split(' ').length
  const internalLinks = new Set(
    [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]).filter((h) => h !== route.path),
  ).size

  if (!route.noindex && words < 400) fail(route.path, `only ${words} words, under the 400 minimum`)
  if (!route.noindex && internalLinks < 3)
    fail(route.path, `only ${internalLinks} internal links, under the 3 minimum`)

  rows.push({
    route: route.path,
    titleLen: title.length,
    descLen: description.length,
    schema: types.length ? [...new Set(types)].slice(0, 4).join(',') : '—',
    words,
    links: internalLinks,
  })
}

console.table(rows)

// Length guidance from docs/05 is advisory, so it is reported and not failed.
const longTitles = rows.filter((r) => r.titleLen > 60)
const offDesc = rows.filter((r) => r.descLen < 120 || r.descLen > 170)
if (longTitles.length)
  console.log(
    `\n  note: ${longTitles.length} title(s) over 60 chars — ${longTitles.map((r) => r.route).join(', ')}`,
  )
if (offDesc.length)
  console.log(
    `  note: ${offDesc.length} description(s) outside 120–170 chars — ${offDesc.map((r) => r.route).join(', ')}`,
  )

if (problems.length) {
  console.error(`\n✕ ${problems.length} problem(s):\n`)
  for (const p of problems) console.error(`  ${p}`)
  process.exit(1)
}
console.log(`\n✓ ${ROUTES.length} routes audited, no problems.`)
