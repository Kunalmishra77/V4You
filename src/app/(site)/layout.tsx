import type { Metadata } from 'next'

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
          Removes `.no-js` before first paint. Sections that reveal on scroll are
          server-rendered in their hidden state so there is no flash of content
          being hidden after hydration — which means that without JavaScript they
          would stay hidden forever. This one line is the guarantee that they do
          not.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js')`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
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
