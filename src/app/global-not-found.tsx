import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'
import { INDUSTRY_LABELS, SERVICE_LABELS, SERVICE_SLUGS } from '@/lib/routes'
import { fontVariables } from '@/lib/fonts'

import './globals.css'

/**
 * The 404 for URLs that match no route at all — T-068, T-077.
 *
 * This app has three root layouts, so there is no single layout Next can
 * compose a global 404 from. `global-not-found` is Next 16's answer to exactly
 * that situation: it bypasses layout entirely, which is why this file renders
 * its own <html> and <body> and imports the fonts and stylesheet directly.
 *
 * Because it skips the layout it also has no header, footer or sticky CTA. That
 * is a constraint of the file convention rather than a choice, so the page
 * carries its own route back into the site — which is what someone who has
 * just failed to find something actually needs.
 *
 * Search-oriented, not a joke page (docs/05).
 */
export const metadata: Metadata = {
  title: 'Page not found — V4You Technologies',
  description: 'That page is not here. Here is where most people are going.',
  robots: { index: false, follow: true },
}

export default function GlobalNotFound() {
  const topIndustries = ['healthcare', 'manufacturing', 'finance', 'logistics'] as const

  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <main id="main">
          <SectionShell canvas="navy" as="div">
            <Link
              href="/"
              className="inline-flex font-display text-body-sm font-medium text-amber-500 underline underline-offset-4"
            >
              V4You Technologies
            </Link>

            <div className="mt-12">
              <Eyebrow>404</Eyebrow>
              <h1 className="mt-5 max-w-headline font-display text-h1 text-(--ink)">
                That page is not here.
              </h1>
              <p className="mt-6 max-w-measure text-body-lg">
                The link may be out of date, or the page may have moved. Here is where most people
                are going.
              </p>
            </div>

            <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <h2 className="font-mono text-label text-amber-500 uppercase">Services</h2>
                <ul className="mt-4 space-y-2">
                  {SERVICE_SLUGS.map((slug) => (
                    <li key={slug}>
                      <Link
                        href={`/services/${slug}`}
                        className="text-body-sm text-slate-300 transition-colors hover:text-bone"
                      >
                        {SERVICE_LABELS[slug]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-mono text-label text-amber-500 uppercase">Industries</h2>
                <ul className="mt-4 space-y-2">
                  {topIndustries.map((slug) => (
                    <li key={slug}>
                      <Link
                        href={`/industries/${slug}`}
                        className="text-body-sm text-slate-300 transition-colors hover:text-bone"
                      >
                        {INDUSTRY_LABELS[slug]}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/industries"
                      className="text-body-sm text-amber-500 underline underline-offset-4"
                    >
                      All industries
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-mono text-label text-amber-500 uppercase">Talk to someone</h2>
                <p className="mt-4 text-body-sm text-slate-300">
                  If you were looking for something specific, tell us what it was. We will point you
                  at it.
                </p>
                <Button href="/contact" className="mt-5">
                  Get in touch
                </Button>
              </div>
            </div>
          </SectionShell>
        </main>
      </body>
    </html>
  )
}
