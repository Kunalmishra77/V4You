/**
 * Keyboard walkthrough of every route — T-070, docs/06 §C3.
 *
 *   pnpm dev              # or pnpm start
 *   pnpm audit:keyboard
 *
 * docs/06 says to test by unplugging the mouse. This does the mechanical part
 * of that: it presses Tab through each page and checks the things a person
 * doing it manually would notice, on every route, every time.
 *
 * What it asserts, and why each one is here:
 *
 *   1. The skip link is the first focusable element. docs/06 §C1 requires it,
 *      and it is only useful if nothing precedes it.
 *   2. No positive `tabindex`. A positive value jumps an element ahead of the
 *      document order and breaks the sequence for everything after it.
 *   3. Every focused element shows a visible indicator. `outline: none` with
 *      no replacement is the single most common way a site becomes
 *      unusable without a mouse.
 *   4. **No focused element carries a `clip-path`.** This one is specific to
 *      this design system. The brand's 45° cut is drawn with clip-path, and
 *      clip-path clips the focus ring too — so a button that clipped itself
 *      would have its ring sliced off at both corners. Button and CutCard put
 *      the clip on a child for exactly this reason, and this check is what
 *      stops someone moving it back.
 *   5. Focus never gets stuck. If Tab does not move focus, something has
 *      trapped it outside a dialog.
 */

import { chromium } from 'playwright'

const BASE = process.env.SCAN_BASE_URL ?? 'http://localhost:3000'

const ROUTES = [
  '/',
  '/about',
  '/contact',
  '/services',
  '/services/ai-automation',
  '/industries',
  '/industries/healthcare',
  '/security',
  '/accessibility',
  '/privacy-policy',
  '/this-route-does-not-exist',
]

const MAX_TABS = 60

const describe = () => {
  const el = document.activeElement
  if (!el || el === document.body) return null
  const cs = getComputedStyle(el)
  const name =
    el.getAttribute('aria-label') ||
    (el.labels?.[0]?.textContent ?? '') ||
    el.textContent?.trim().slice(0, 40) ||
    el.getAttribute('title') ||
    ''
  return {
    tag: el.tagName,
    name: name.replace(/\s+/g, ' ').trim(),
    tabIndex: el.tabIndex,
    // A visible indicator can be an outline or a ring drawn with box-shadow.
    outlineWidth: cs.outlineWidth,
    outlineStyle: cs.outlineStyle,
    boxShadow: cs.boxShadow === 'none' ? '' : 'ring',
    clipPath: cs.clipPath,
    inDialog: Boolean(el.closest('[role="dialog"]')),
  }
}

const problems = []
const rows = []

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.setDefaultNavigationTimeout(240_000)

for (const route of ROUTES) {
  process.stdout.write(`  ${route} … `)
  await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(250)

  // Positive tabindex is a document-wide property, so check it once per page.
  const positiveTabindex = await page.evaluate(() =>
    [...document.querySelectorAll('[tabindex]')]
      .filter((el) => Number(el.getAttribute('tabindex')) > 0)
      .map((el) => el.tagName + (el.id ? `#${el.id}` : '')),
  )
  for (const el of positiveTabindex) {
    problems.push(`${route}  positive tabindex on ${el} — it jumps the document order`)
  }

  const sequence = []
  let previous = null
  let stuck = 0

  for (let i = 0; i < MAX_TABS; i++) {
    await page.keyboard.press('Tab')
    const focused = await page.evaluate(describe)
    if (!focused) break
    // Next injects a dev-mode overlay element into the page. It is tooling,
    // not markup we ship, and it is absent from a production build.
    if (focused.tag === 'NEXTJS-PORTAL') continue

    const signature = `${focused.tag}:${focused.name}`
    if (signature === previous) {
      stuck += 1
      if (stuck > 2) {
        problems.push(`${route}  focus stuck on ${signature} — possible keyboard trap`)
        break
      }
    } else {
      stuck = 0
    }
    previous = signature

    // 3 — a visible focus indicator
    const hasOutline = focused.outlineStyle !== 'none' && parseFloat(focused.outlineWidth) > 0
    if (!hasOutline && !focused.boxShadow) {
      problems.push(`${route}  no visible focus indicator on ${focused.tag} "${focused.name}"`)
    }

    // 4 — the focused element must not clip its own ring
    if (focused.clipPath && focused.clipPath !== 'none') {
      problems.push(
        `${route}  focused ${focused.tag} "${focused.name}" has clip-path: ${focused.clipPath} — ` +
          'this slices the focus ring. Move the clip to a child.',
      )
    }

    sequence.push(focused)
  }

  // 1 — skip link first
  const first = sequence[0]
  if (!first || !/skip/i.test(first.name)) {
    // The global 404 has no header, so it has no skip link by design.
    if (route !== '/this-route-does-not-exist') {
      problems.push(
        `${route}  first focusable is "${first?.name ?? 'nothing'}", expected a skip link`,
      )
    }
  }

  console.log(problems.length ? 'checked' : 'ok')
  rows.push({
    route,
    focusables: sequence.length,
    first: first?.name.slice(0, 24) ?? '—',
    allHaveFocusRing: sequence.every(
      (s) => (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow,
    ),
    noClippedRings: sequence.every((s) => !s.clipPath || s.clipPath === 'none'),
  })
}

await browser.close()
console.table(rows)

if (problems.length) {
  console.error(`\n✕ ${problems.length} problem(s):\n`)
  for (const p of [...new Set(problems)]) console.error(`  ${p}`)
  process.exit(1)
}
console.log(`\n✓ ${ROUTES.length} routes walked by keyboard, no problems.`)
