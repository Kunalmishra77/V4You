import Link from 'next/link'

import { CutCard } from '@/components/shared/CutCard'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'
import { serviceCards } from '@/seed/services'

/**
 * ServiceCardGrid — docs/04 §20.
 *
 * Each card carries the outcome headline, a description, up to four capability
 * chips and a CTA.
 *
 * The whole card is clickable via a stretched pseudo-element on the title link,
 * but the visible text link is the real one — blueprint §4.17 asks for exactly
 * that: clickable cards that still expose a text link. The focus ring lands on
 * the link, which is why CutCard leaves its host unclipped.
 *
 * The chips are a `<ul>`, not a row of divs. They are a list of capabilities
 * and a screen reader should be able to count them.
 */
export function ServiceCardGrid({
  heading = 'Choose the capability you need today.',
  body = 'Build the foundation you will need tomorrow. Every engagement can start narrow and widen once it has proven itself.',
  eyebrow = 'What we do',
}: {
  heading?: string
  body?: string
  eyebrow?: string
}) {
  return (
    <SectionShell canvas="bone" reveal>
      <div className="max-w-measure">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">{heading}</h2>
        <p className="mt-5 text-body-lg">{body}</p>
      </div>

      <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {serviceCards.map((service) => (
          <CutCard as="li" key={service.slug} interactive className="flex flex-col p-6 lg:p-7">
            <p className="font-mono text-label text-(--accent-text) uppercase">{service.title}</p>

            <h3 className="mt-4 font-display text-h3 text-(--ink)">
              <Link
                href={`/services/${service.slug}`}
                className="after:absolute after:inset-0 hover:underline hover:underline-offset-4"
              >
                {service.outcome}
              </Link>
            </h3>

            <p className="mt-3 text-body-sm">{service.body}</p>

            <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${service.title} capabilities`}>
              {service.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="border border-(--line) px-2.5 py-1 font-mono text-label text-(--ink-muted) uppercase"
                >
                  {capability}
                </li>
              ))}
            </ul>

            <p
              aria-hidden="true"
              className="mt-6 pt-2 font-display text-body-sm font-medium text-(--ink)"
            >
              Explore {service.title} →
            </p>
          </CutCard>
        ))}
      </ul>
    </SectionShell>
  )
}
