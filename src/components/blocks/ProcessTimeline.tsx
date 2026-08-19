import { Headline } from '@/components/shared/Headline'
import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { BrandFigure } from '@/components/shared/BrandFigure'
import { SectionShell } from '@/components/shared/SectionShell'
import { processTimeline } from '@/seed/home-proof'
import { revealChild } from '@/lib/reveal'

/**
 * ProcessTimeline — docs/04 §24.
 *
 * Six steps with an amber rule above each. docs/04 notes that numbering is
 * legitimate here, which is worth spelling out: these are a real sequence, so
 * the numbers carry information and stay in the accessible name. ProblemCards,
 * by contrast, hides its numbers because four symptoms have no order.
 *
 * `<ol>` rather than a grid of divs, for the same reason.
 */
export function ProcessTimeline({ canvas = 'bone-2' }: { canvas?: 'bone-2' | 'bone' | 'navy' }) {
  return (
    <SectionShell canvas={canvas} reveal="stagger">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:gap-16">
        <div className="max-w-measure">
          <Eyebrow>{processTimeline.eyebrow}</Eyebrow>
          <Headline className="mt-5">{processTimeline.heading}</Headline>
          <p className="mt-5 text-body-lg">{processTimeline.body}</p>
        </div>
        <BrandFigure name="layers" className="max-w-[16rem] justify-self-end max-lg:hidden" />
      </div>

      <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {processTimeline.steps.map((step, index) => (
          <li key={step.title} {...revealChild(index)}>
            <span aria-hidden="true" className="block h-0.5 w-full bg-amber-500" />
            <p className="mt-4 font-mono text-label text-(--accent-text) uppercase">
              Step {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-2 font-display text-h3 text-(--ink)">{step.title}</h3>
            <p className="mt-3 text-body-sm">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12">
        <Button href={processTimeline.cta.href} variant="ghost-light">
          {processTimeline.cta.label}
        </Button>
      </div>
    </SectionShell>
  )
}
