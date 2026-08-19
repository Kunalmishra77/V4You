import type { Metadata } from 'next'

import { MotionProvider } from '@/components/motion/MotionProvider'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { StickyMobileCTA } from '@/components/layout/StickyMobileCTA'
import { LeadCaptureModal } from '@/components/forms/LeadCaptureModal'
import { getNavigation } from '@/lib/content'
import { fontVariables } from '@/lib/fonts'

import '../globals.css'

/**
 * The public marketing shell — and a **root** layout, so it owns <html> and
 * <body>.
 *
 * There is deliberately no `src/app/layout.tsx`. Payload's admin brings its own
 * root layout, and Next allows only one <html> per tree — a shared root would
 * nest Payload's <html> inside ours. Each route group is its own root instead:
 * (site) here, (dev) for the design system, (payload) for the admin.
 *
 * `pb-20` under 700px is the counterweight to StickyMobileCTA's fixed bar. The
 * two have to change together; if the bar grows, this grows.
 *
 * `#main` carries `tabIndex={-1}` so the skip link actually moves focus rather
 * than only scrolling — without it the next Tab returns to the top of the header.
 */
export const metadata: Metadata = {
  title: 'V4You Technologies',
  description:
    'V4You helps startups, SMEs and enterprises turn complex business problems into intelligent products, connected workflows and measurable growth.',
}

export default async function SiteLayout({ children }: LayoutProps<'/'>) {
  const navigation = await getNavigation()

  return (
    <html
      lang="en"
      className={`${fontVariables} no-js h-full antialiased`}
      // The script below removes `no-js` before React hydrates, so the client's
      // class list legitimately differs from the server's. Suppression applies
      // to this element's attributes only, which is exactly the scope wanted.
      suppressHydrationWarning
    >
      <head>
        {/*
          Two guarantees, both about the same risk.

          Sections that reveal on scroll are server-rendered in their hidden
          state, so there is no flash of content being hidden after hydration.
          The cost of that is a page which stays blank below the fold if the
          animation never runs. Line one covers the case where JavaScript is
          off. The timer covers the case that actually happens in production —
          JavaScript is on, but the motion chunk 404s behind a stale cache, or
          something earlier in the tree threw before it mounted.

          MotionProvider sets `data-motion="ready"` as the first statement in
          its effect. Four seconds is long enough that a slow connection is not
          punished with a page that skips its own animation, and short enough
          that nobody is left looking at emptiness wondering if the site is
          broken.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              `document.documentElement.classList.remove('no-js');` +
              `setTimeout(function(){` +
              `var d=document.documentElement;` +
              `if(d.dataset.motion!=='ready')d.classList.add('motion-failed')` +
              `},4000)`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        {/*
          The motion runtime: Lenis, ScrollTrigger and the heading splits. It
          renders nothing. Mounted above the header so its effect runs before
          any section has had a chance to scroll past its trigger.
        */}
        <MotionProvider />

        <SiteHeader navigation={navigation} />
        <main id="main" tabIndex={-1} className="flex-1 pb-20 min-[700px]:pb-0">
          {children}
        </main>
        <SiteFooter />
        <StickyMobileCTA cta={navigation.stickyCta} />

        {/*
          Shown once per session, on exit intent — blueprint §13.6. Exit intent
          rather than a timer on arrival: a modal that interrupts before the
          visitor has read anything converts worse and is what Google's
          intrusive-interstitial guidance is aimed at. Change to
          `trigger={{ afterSeconds: 20 }}` if you want it on a delay instead.
        */}
        <LeadCaptureModal trigger="exit-intent" source="exit-intent-modal" />
      </body>
    </html>
  )
}
