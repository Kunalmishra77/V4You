/**
 * Accessibility scan across every route — T-069.
 *
 *   pnpm dev            # in one terminal
 *   pnpm a11y           # in another
 *
 * Requires a browser: `pnpm exec playwright install chromium` once.
 *
 * Three details matter, and each was learned by getting it wrong first:
 *
 * **Transitions are disabled before scanning.** Sections reveal on scroll by
 * animating opacity. Scanning mid-transition makes axe measure text at partial
 * opacity and report contrast violations that do not exist. The first run of
 * this scan produced eight phantom "serious" contrast failures for exactly
 * that reason.
 *
 * **Reveals are forced open.** Otherwise everything below the fold is
 * `opacity: 0` and axe skips it, which looks like a clean scan of a page it
 * never actually examined.
 *
 * **`color-contrast` incompletes are expected on this site and are not
 * failures.** Buttons and cards paint their background on a clipped child
 * behind the label, so axe cannot resolve the effective background and returns
 * "incomplete" rather than a verdict. Those pairings are verified numerically
 * instead — see the contrast assertions below, which compute the real ratio
 * from the layer that is actually painted.
 */

import { chromium } from 'playwright'

const BASE = process.env.SCAN_BASE_URL ?? 'http://localhost:3000'

const ROUTES = [
  '/',
  '/about',
  '/contact',
  '/book-consultation',
  '/thank-you',
  '/services',
  '/services/ai-automation',
  '/services/consulting',
  '/industries',
  '/industries/healthcare',
  '/industries/finance',
  '/security',
  '/accessibility',
  '/privacy-policy',
  '/terms',
  '/cookie-policy',
  '/this-route-does-not-exist',
]

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']

const SETTLE_CSS = `
  *, *::before, *::after { transition: none !important; animation: none !important; }
  [data-reveal] { opacity: 1 !important; transform: none !important; }
`

/** Computes real contrast for button labels, which axe cannot resolve. */
const CONTRAST_PROBE = () => {
  const lum = (c) => {
    const [r, g, b] = c.map((v) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const ratio = (a, b) => {
    const l1 = lum(a)
    const l2 = lum(b)
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  }
  const parse = (s) => (s.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number)

  const out = []
  // Keyed off the shape span Button marks, not off "any aria-hidden span in a
  // .group". The looser selector also matched decoration that sits *beside* a
  // label rather than behind it — a rail line next to its own text reads as
  // 1:1 and fails a control that is perfectly legible.
  for (const shape of document.querySelectorAll('[data-button-shape]')) {
    const btn = shape.closest('a, button')
    const label = btn && btn.querySelector('span:not([aria-hidden])')
    if (!label) continue
    const inner = shape.querySelector('span')
    const painted =
      inner && getComputedStyle(inner).backgroundColor !== 'rgba(0, 0, 0, 0)' ? inner : shape
    const fg = parse(getComputedStyle(label).color)
    const bg = parse(getComputedStyle(painted).backgroundColor)
    if (fg.length === 3 && bg.length === 3) {
      out.push({ text: label.textContent.trim().slice(0, 40), ratio: +ratio(fg, bg).toFixed(2) })
    }
  }
  return out
}

const run = async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  /**
   * A dev server compiles each route on first request, and a page with eleven
   * blocks can take well over a minute. Playwright's 30s default turns that
   * into a scan failure that looks like a site failure. Against a production
   * build this is never approached.
   */
  page.setDefaultNavigationTimeout(240_000)

  let violationCount = 0
  let contrastFailures = 0
  const rows = []

  for (const [index, route] of ROUTES.entries()) {
    process.stdout.write(`  [${index + 1}/${ROUTES.length}] ${route} … `)
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' })
    await page.addStyleTag({ content: SETTLE_CSS })
    await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' })
    await page.waitForTimeout(300)

    const result = await page.evaluate(
      async (tags) => window.axe.run(document, { runOnly: { type: 'tag', values: tags } }),
      TAGS,
    )

    const contrasts = await page.evaluate(CONTRAST_PROBE)
    const worst = contrasts.length ? Math.min(...contrasts.map((c) => c.ratio)) : null
    // 4.5:1 is the AA threshold for body text; buttons here use body-sm.
    const failing = contrasts.filter((c) => c.ratio < 4.5)

    violationCount += result.violations.length
    contrastFailures += failing.length

    console.log(
      result.violations.length === 0 && failing.length === 0
        ? 'ok'
        : `${result.violations.length + failing.length} problem(s)`,
    )

    rows.push({
      route,
      violations: result.violations.length,
      passes: result.passes.length,
      worstButtonContrast: worst ? `${worst}:1` : '—',
    })

    for (const v of result.violations) {
      console.error(`\n  ✕ ${route} — ${v.id} (${v.impact}, ${v.nodes.length} nodes)`)
      console.error(`    ${v.help}`)
      console.error(`    ${v.nodes[0]?.html?.slice(0, 140)}`)
    }
    for (const c of failing) {
      console.error(`\n  ✕ ${route} — button "${c.text}" at ${c.ratio}:1, below 4.5:1`)
    }
  }

  await browser.close()

  console.table(rows)
  const total = violationCount + contrastFailures
  console.log(
    total === 0
      ? `\n✓ ${ROUTES.length} routes scanned, zero violations.`
      : `\n✕ ${total} problem(s) across ${ROUTES.length} routes.`,
  )
  process.exit(total === 0 ? 0 : 1)
}

await run()
