import { Button } from '@/components/shared/Button'
import { CutCard } from '@/components/shared/CutCard'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'
import { problemSection } from '@/seed/home'

/**
 * ProblemCards — docs/04 §18, home §4.3.
 *
 * Four CutCards with numbered eyebrows. The numbering is ordinal, not a
 * sequence — these are four symptoms of one condition, not four steps — so the
 * numbers are `aria-hidden`. A screen reader announcing "zero one" before each
 * heading adds nothing a sighted reader gets from the visual rhythm.
 *
 * The cards are not interactive: no link, no lift, no notch fill. Movement
 * without a destination reads as a glitch, and docs/15.4 in the blueprint asks
 * hover states to reveal affordance rather than create motion.
 */
export function ProblemCards() {
  return (
    <SectionShell canvas="bone" reveal>
      <div className="max-w-measure">
        <Eyebrow>{problemSection.eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
          {problemSection.heading}
        </h2>
        <p className="mt-5 text-body-lg">{problemSection.body}</p>
      </div>

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {problemSection.cards.map((card, index) => (
          <CutCard as="li" key={card.title} className="p-6 lg:p-7">
            <p aria-hidden="true" className="font-mono text-label text-(--accent-text) uppercase">
              {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-4 font-display text-h3 text-(--ink)">{card.title}</h3>
            <p className="mt-3 text-body-sm">{card.body}</p>
          </CutCard>
        ))}
      </ul>

      <div className="mt-12">
        <Button href={problemSection.cta.href} variant="navy">
          {problemSection.cta.label}
        </Button>
      </div>
    </SectionShell>
  )
}
