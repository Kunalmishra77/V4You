import Link from 'next/link'

import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'
import { INDUSTRY_LABELS, SERVICE_LABELS, SERVICE_SLUGS } from '@/lib/routes'

/**
 * 404 — docs/05, "additional Phase 1 routes".
 *
 * Search-oriented, not a joke page. Someone here has already failed to find
 * something; the useful response is the most likely destinations, not wit.
 */
export default function NotFound() {
  const topIndustries = ['healthcare', 'manufacturing', 'finance', 'logistics'] as const

  return (
    <SectionShell canvas="navy" as="div">
      <Eyebrow>404</Eyebrow>
      <h1 className="mt-5 max-w-headline font-display text-h1 text-(--ink)">
        That page is not here.
      </h1>
      <p className="mt-6 max-w-measure text-body-lg">
        The link may be out of date, or the page may have moved. Here is where most people are
        going.
      </p>

      <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
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
            If you were looking for something specific, tell us what it was. We will point you at
            it.
          </p>
          <Button href="/contact" className="mt-5">
            Get in touch
          </Button>
        </div>
      </div>
    </SectionShell>
  )
}
