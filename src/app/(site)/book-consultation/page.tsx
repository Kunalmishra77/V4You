import type { Metadata } from 'next'

import { ConsultationForm } from '@/components/forms/ConsultationForm'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'
import { reportMissingAsset } from '@/lib/missing-assets'
import { buildMetadata } from '@/lib/seo'

/**
 * /book-consultation — docs/05, "additional Phase 1 routes".
 *
 * A focused conversion page: the form, with no navigation competing for
 * attention. Everything on it either helps someone complete the form or
 * explains what completing it leads to.
 *
 * docs/05 specifies a Cal.com embed if a calendar link is supplied and the
 * form-only variant otherwise. No link has been supplied, so this is the
 * form-only variant — logged rather than stubbed with a dead booking widget.
 */
export const metadata: Metadata = buildMetadata({
  title: 'Book a transformation consultation — V4You',
  description:
    'Thirty minutes, no pitch. Tell us what you are trying to build, modernise, automate or grow, and we will come prepared with questions.',
  path: '/book-consultation',
})

export default function BookConsultationPage() {
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK

  if (!calLink) {
    reportMissingAsset({
      component: 'BookConsultationPage',
      needs: 'NEXT_PUBLIC_CAL_LINK — a Cal.com booking link and whose calendar it points at',
      blocks: 'the calendar embed; the form-only variant renders instead',
    })
  }

  return (
    <>
      <SectionShell canvas="navy" as="div">
        <Eyebrow>Ready when you are</Eyebrow>
        <h1 className="mt-5 max-w-headline font-display text-h1 text-(--ink)">
          Bring us the challenge.
        </h1>
        <p className="mt-6 max-w-measure text-body-lg">
          Thirty minutes. We come with questions, not a pitch, and you leave with a practical next
          step — even if that step is not us.
        </p>
      </SectionShell>

      <SectionShell canvas="bone">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,20rem)] lg:gap-16">
          <div>
            <h2 className="sr-only">Consultation request form</h2>
            <ConsultationForm source="/book-consultation" />
          </div>

          <aside className="border-t border-(--line) pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
            <h2 className="font-mono text-label text-(--accent-text) uppercase">
              What the 30 minutes covers
            </h2>
            <ul className="mt-5 space-y-4 text-body-sm">
              <li>What is happening today and where it costs you.</li>
              <li>Which part of it is worth changing first, and why that one.</li>
              <li>What a sensible first step would look like, and roughly what it involves.</li>
              <li>Whether we are the right people for it.</li>
            </ul>

            <h2 className="mt-10 font-mono text-label text-(--accent-text) uppercase">
              What it does not cover
            </h2>
            <ul className="mt-5 space-y-4 text-body-sm">
              <li>A slide deck about us.</li>
              <li>A price quoted before anyone understands the scope.</li>
              <li>A follow-up sequence you did not ask for.</li>
            </ul>
          </aside>
        </div>
      </SectionShell>
    </>
  )
}
