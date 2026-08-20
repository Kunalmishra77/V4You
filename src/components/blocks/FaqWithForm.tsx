import { ConsultationForm } from '@/components/forms/ConsultationForm'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { Headline } from '@/components/shared/Headline'
import { JsonLd } from '@/components/shared/JsonLd'
import { SectionShell, type Canvas } from '@/components/shared/SectionShell'
import { faqSchema, type Faq } from '@/lib/seo'

/**
 * FaqWithForm — the last section before the footer.
 *
 * Two panels side by side: the form on the left, every answer on the right in a
 * panel that scrolls inside itself. It replaces a full-width accordion that ran
 * to eight questions down the page, and the swap earns its place — a visitor who
 * reached the bottom either found their answer or did not, and this puts the way
 * to ask directly beside the answers rather than one section further down.
 *
 * **The right panel scrolls internally and shows no scrollbar.** Two things make
 * that safe rather than merely tidy:
 *
 * A scrollable region has to be reachable by keyboard, and this one is — every
 * question is a `<summary>`, so tabbing through them scrolls the panel natively.
 * That is the difference between hiding a scrollbar and hiding the content: no
 * key handler is being reimplemented here, the platform is doing it.
 *
 * And a hidden scrollbar removes the only cue that there is more below, so the
 * panel fades out at its bottom edge with a mask. A mask rather than a gradient
 * overlay, because an overlay is a coloured box sitting on text — it changes the
 * contrast of whatever is under it, and text at 60% of its own contrast is text
 * that fails. A mask fades the pixels to transparent instead, so nothing is
 * dimmed against the wrong background.
 *
 * The JSON-LD comes from the same array the panel renders, so the structured
 * data cannot drift from what is on the page.
 */
export function FaqWithForm({
  faqs,
  eyebrow,
  heading,
  formEyebrow,
  formHeading,
  formBody,
  canvas = 'bone',
}: {
  faqs: Faq[]
  eyebrow: string
  heading: string
  formEyebrow: string
  formHeading: string
  formBody: string
  canvas?: Canvas
}) {
  if (!faqs.length) return null

  return (
    <SectionShell canvas={canvas} reveal>
      {/* Only emitted where the answers are actually on the page. */}
      <JsonLd schemas={[faqSchema(faqs)]} />

      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
        {/* --- Left: the way to ask ---------------------------------------- */}
        <div className="border border-navy-700 bg-navy-900 p-8 surface-navy lg:p-10">
          <Eyebrow>{formEyebrow}</Eyebrow>
          <Headline size="h3" className="mt-5">
            {formHeading}
          </Headline>
          <p className="mt-4 max-w-measure text-body-sm">{formBody}</p>

          <div className="mt-8">
            <ConsultationForm source="home-faq" />
          </div>
        </div>

        {/* --- Right: every answer, scrolling in place ---------------------- */}
        <div className="border border-(--line) bg-white p-8 surface-white lg:p-10">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Headline size="h3" className="mt-5">
            {heading}
          </Headline>

          <div
            className={[
              'faq-scroll mt-8 overflow-y-auto pr-1',
              // Tall enough to show three or four questions, so the panel reads
              // as a list with more in it rather than as a cropped paragraph.
              'max-h-[26rem] lg:max-h-[34rem]',
              '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            ].join(' ')}
          >
            <div className="border-t border-(--line)">
              {faqs.map((faq) => (
                <details key={faq.question} className="group border-b border-(--line)">
                  <summary className="flex cursor-pointer list-none items-baseline gap-5 py-5 [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500">
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
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
