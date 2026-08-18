import type { Metadata } from 'next'
import Link from 'next/link'

import { WhatsAppButton } from '@/components/forms/WhatsAppButton'
import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'
import { getSiteSettings } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

/**
 * /thank-you — T-056, docs/05 and blueprint §13.3.
 *
 * `noindex`, because a confirmation page in search results is a page someone
 * lands on having submitted nothing.
 *
 * It repeats the three commitments the form made rather than saying only
 * "thanks". Someone who has just handed over their details is deciding whether
 * that was sensible, and the answer to that is specifics.
 *
 * blueprint §13.3 also asks it to name the person who will reply, where known.
 * No team records exist yet, so it names the commitment instead of inventing a
 * person — that line arrives with the team data.
 */
export const metadata: Metadata = buildMetadata({
  title: 'Your next step is clear — V4You Technologies',
  description: 'We have your enquiry. Here is what happens next.',
  path: '/thank-you',
  noIndex: true,
})

const NEXT_STEPS = [
  {
    title: 'We reply within one business day',
    body: 'A person reads your enquiry and replies — not an autoresponder, and not a sequence.',
  },
  {
    title: 'The first call is 30 minutes',
    body: 'We come with questions, not a pitch. If we have looked at something publicly available about your business, we will say what and why.',
  },
  {
    title: 'You leave with a suggested next step',
    body: 'Even if it is not us. A useful answer is worth more to both of us than a bigger pitch.',
  },
]

export default async function ThankYouPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <SectionShell canvas="navy" as="div">
        <Eyebrow>Received</Eyebrow>
        <h1 className="mt-5 max-w-headline font-display text-h1 text-(--ink)">
          Your next step is clear.
        </h1>
        <p className="mt-6 max-w-measure text-body-lg">
          Your enquiry reached us and someone is reading it. A confirmation is on its way to the
          address you gave — if it has not arrived in a few minutes, check the spam folder before
          assuming it did not send.
        </p>
      </SectionShell>

      <SectionShell canvas="bone">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
          <div>
            <h2 className="max-w-headline font-display text-h2 text-(--ink)">What happens next</h2>
            <ol className="mt-8 space-y-8">
              {NEXT_STEPS.map((step, index) => (
                <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-4">
                  <span aria-hidden="true" className="font-mono text-label text-(--accent-text)">
                    0{index + 1}
                  </span>
                  <span>
                    <span className="block font-display text-h3 text-(--ink)">{step.title}</span>
                    <span className="mt-2 block text-body-sm">{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t border-(--line) pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
            <h2 className="font-mono text-label text-(--accent-text) uppercase">
              Worth thinking about before the call
            </h2>
            <ul className="mt-5 space-y-3 text-body-sm">
              <li>What happens today, and who it affects.</li>
              <li>What you would want to be different in six months.</li>
              <li>Which systems already hold the data involved.</li>
              <li>Who would need to agree before anything changed.</li>
            </ul>
            <p className="mt-6 text-body-sm text-(--ink-muted)">
              Rough answers are fine. That is what the call is for.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <WhatsAppButton number={settings.contact.whatsapp} />
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell canvas="bone-2" density="tight">
        <h2 className="max-w-headline font-display text-h3 text-(--ink)">
          While you wait, one thing worth reading
        </h2>
        <p className="mt-4 max-w-measure text-body-sm">
          How we work, stage by stage — what each one produces and what you get to disagree with
          before the next begins.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button href="/services" variant="ghost-light">
            See how we work
          </Button>
          <Link
            href="/industries"
            className="font-display text-body-sm font-medium text-(--ink) underline underline-offset-4"
          >
            Or find your industry
          </Link>
        </div>
      </SectionShell>
    </>
  )
}
