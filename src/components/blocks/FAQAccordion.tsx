import { Headline } from '@/components/shared/Headline'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { JsonLd } from '@/components/shared/JsonLd'
import { SectionShell } from '@/components/shared/SectionShell'
import type { Canvas } from '@/components/shared/SectionShell'
import { faqSchema, type Faq } from '@/lib/seo'
import { revealChild } from '@/lib/reveal'

/**
 * FAQAccordion — docs/04 §28, docs/06 §A2.
 *
 * Emits `FAQPage` JSON-LD from the same array it renders, so the markup and the
 * page can never disagree — which is the failure mode Google issues manual
 * actions for.
 *
 * docs/04 adds a content rule worth keeping in view: only for genuine FAQs, not
 * to bulk out a thin page. If a question has never been asked by an actual
 * prospect, it is copy pretending to be a question.
 */
export function FAQAccordion({
  faqs,
  heading = 'Questions we are asked',
  eyebrow = 'FAQ',
  canvas = 'bone',
}: {
  faqs: Faq[]
  heading?: string
  eyebrow?: string
  canvas?: Canvas
}) {
  if (faqs.length === 0) return null

  return (
    <SectionShell canvas={canvas} reveal="stagger">
      {/* Only emitted where the answers are visible on the page. */}
      <JsonLd schemas={[faqSchema(faqs)]} />

      <div className="max-w-measure">
        <Eyebrow>{eyebrow}</Eyebrow>
        <Headline className="mt-5">{heading}</Headline>
      </div>

      <div className="mt-12 max-w-measure border-t border-(--line)">
        {faqs.map((faq, index) => (
          <details
            key={faq.question}
            {...revealChild(index)}
            className="group border-b border-(--line)"
          >
            <summary className="flex cursor-pointer list-none items-baseline gap-5 py-5 [&::-webkit-details-marker]:hidden">
              <span className="flex-1 font-display text-body font-semibold text-(--ink)">
                {faq.question}
              </span>
              <span
                aria-hidden="true"
                className="mt-1.5 block size-2.5 shrink-0 rotate-45 border-r-2 border-b-2 border-amber-500 transition-transform group-open:-translate-y-1 group-open:rotate-225"
              />
            </summary>
            <p className="pb-6 text-body-sm">{faq.answer}</p>
          </details>
        ))}
      </div>
    </SectionShell>
  )
}
