import type { Metadata } from 'next'
import Link from 'next/link'

import { CTABand } from '@/components/blocks/CTABand'
import { HeroPage } from '@/components/blocks/HeroPage'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { JsonLd } from '@/components/shared/JsonLd'
import { SectionShell } from '@/components/shared/SectionShell'
import { getSiteSettings } from '@/lib/content'
import { buildMetadata, webPageSchema } from '@/lib/seo'

/**
 * /accessibility — T-067, docs/05 and docs/06 §C4.
 *
 * docs/06 §C4 sets the tone precisely: "It is a real commitment, not a badge —
 * do not claim conformance that has not been tested."
 *
 * So this page states the standard targeted, what has been tested and how,
 * what is known to be incomplete, and a working route to report a problem. The
 * known-limitations section is the part that makes the rest credible; an
 * accessibility statement with no limitations is a statement nobody has
 * checked.
 *
 * `LAST_REVIEWED` is a hardcoded date on purpose. Deriving it from the build
 * date would make it re-stamp itself on every deploy, which would turn a
 * meaningful claim into an automatic one.
 */

const LAST_REVIEWED = '18 August 2026'

export const metadata: Metadata = buildMetadata({
  title: 'Accessibility — V4You Technologies',
  description:
    'The accessibility standard we target, exactly what has been tested so far, the limitations we know about, and how to tell us when something does not work.',
  path: '/accessibility',
})

const TESTED = [
  {
    title: 'Keyboard operation',
    body: 'Every interactive component is operable without a mouse, with visible focus. The mega menu, mobile drawer and tab panels were each walked with the keyboard: Escape closes and returns focus, arrow keys move between tabs, and a closed panel is removed from the tab order rather than left as a trap.',
  },
  {
    title: 'Contrast',
    body: 'Every colour pairing is checked against a matrix rather than by eye. Body text meets 4.5:1 and interface borders meet 3:1. Amber is never used as a text colour on a light background — it is 1.98:1 there, and the design system makes that combination structurally unavailable rather than merely discouraged.',
  },
  {
    title: 'Semantic structure',
    body: 'One h1 per page, heading levels in order, landmarks for header, navigation, main and footer, and a skip link as the first focusable element. Tables are real tables with scoped headers rather than grids of divs.',
  },
  {
    title: 'Reduced motion',
    body: 'Under prefers-reduced-motion, scroll reveals become instant, the technology marquee stops, and the hero diagram’s animated dots are removed from the page entirely rather than paused.',
  },
  {
    title: 'Forms',
    body: 'Every field has a real label. Errors are announced, linked to their field, and summarised at the top of the form with focus moved there on a failed submit. The consultation form works with JavaScript disabled.',
  },
  {
    title: 'Automated testing across every route',
    body: 'An axe-core scan runs against seventeen routes — every page template, plus a deliberately broken URL — checking WCAG 2.2 A and AA rules along with axe’s best-practice set. It currently reports zero violations, and it runs as a script so it can be repeated rather than remembered.',
  },
  {
    title: 'Without JavaScript',
    body: 'The site renders and is navigable with scripting off. Sections that animate in on scroll are visible rather than hidden, which took a specific guard to get right.',
  },
]

const LIMITATIONS = [
  {
    title: 'No screen reader pass yet',
    body: 'Markup and ARIA were written to the pattern and verified programmatically, but the site has not yet been walked with NVDA, JAWS or VoiceOver. An automated scan finds what can be checked mechanically, which is perhaps a third of what matters — a page can pass every rule and still be exhausting to listen to.',
  },
  {
    title: 'No testing with assistive technology users',
    body: 'Nothing here has been tested by people who use assistive technology daily. That is the test that finds what the others miss, and until it happens this statement describes intent supported by evidence rather than a verified outcome.',
  },
  {
    title: 'The architecture diagrams',
    body: 'Each interactive diagram has a visible written summary beside it, so no information is available only through the diagram. The interactive version itself is likely to be a poorer experience with a screen reader than the summary, and we would rather say so than imply parity.',
  },
]

export default async function AccessibilityPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <JsonLd
        schemas={[
          webPageSchema({
            name: 'Accessibility',
            description:
              'The standard we target, what has been tested, known limitations, and how to report a problem.',
            path: '/accessibility',
          }),
        ]}
      />

      <HeroPage
        eyebrow="Accessibility"
        headline="What we target, what we have tested, and what we have not."
        body="We aim to meet WCAG 2.2 Level AA. We are not claiming we have achieved it, because a claim of conformance needs testing we have not finished — and an accessibility statement that overstates itself is worse than none."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Accessibility', path: '/accessibility' },
        ]}
        primaryCta={{ label: 'Report an accessibility problem', href: '/contact' }}
      />

      <SectionShell canvas="bone" reveal>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Eyebrow>The standard</Eyebrow>
            <p className="mt-5 font-display text-h2 text-(--ink)">WCAG 2.2 Level AA</p>
            <p className="mt-4 font-mono text-label text-(--ink-muted) uppercase">
              Last reviewed {LAST_REVIEWED}
            </p>
          </div>
          <p className="max-w-measure self-center text-body-lg">
            Accessibility was treated as a build requirement rather than an audit before launch —
            every component was checked for keyboard operation, contrast and semantics as it was
            written. That is the approach most likely to produce a usable site, and it still does
            not entitle anyone to claim conformance without testing the finished thing.
          </p>
        </div>
      </SectionShell>

      <SectionShell canvas="navy" reveal>
        <div className="max-w-measure">
          <Eyebrow>Tested</Eyebrow>
          <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
            What has actually been checked.
          </h2>
        </div>
        <ul className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {TESTED.map((item) => (
            <li key={item.title} className="border-t border-(--line) pt-5">
              <h3 className="font-display text-h3 text-(--ink)">{item.title}</h3>
              <p className="mt-3 text-body-sm">{item.body}</p>
            </li>
          ))}
        </ul>
      </SectionShell>

      {/* The section that makes the rest credible. */}
      <SectionShell canvas="bone-2" reveal>
        <div className="max-w-measure">
          <Eyebrow>Known limitations</Eyebrow>
          <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
            What is not done yet.
          </h2>
          <p className="mt-5 text-body-lg">
            An accessibility statement with no limitations is a statement nobody has checked. These
            are the gaps we know about.
          </p>
        </div>
        <ul className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {LIMITATIONS.map((item) => (
            <li key={item.title} className="border-t border-(--line) pt-5">
              <h3 className="font-display text-h3 text-(--ink)">{item.title}</h3>
              <p className="mt-3 text-body-sm">{item.body}</p>
            </li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell canvas="bone" reveal>
        <div className="max-w-measure">
          <Eyebrow>Reporting a problem</Eyebrow>
          <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
            If something here does not work for you, tell us.
          </h2>
          <p className="mt-5 text-body-lg">
            Describe what you were trying to do, what happened, and what you were using — browser,
            device, and any assistive technology. We will reply, and we will tell you whether we can
            fix it and roughly when. If we cannot, we will say that too.
          </p>
          <p className="mt-8">
            {settings.contact.email ? (
              <a
                href={`mailto:${settings.contact.email}?subject=Accessibility`}
                className="font-display text-body font-medium text-(--ink) underline underline-offset-4"
              >
                {settings.contact.email}
              </a>
            ) : (
              <Link
                href="/contact"
                className="font-display text-body font-medium text-(--ink) underline underline-offset-4"
              >
                Use the contact form
              </Link>
            )}
          </p>
        </div>
      </SectionShell>

      <CTABand secondaryCta={{ label: 'Read about security', href: '/security' }} />
    </>
  )
}
