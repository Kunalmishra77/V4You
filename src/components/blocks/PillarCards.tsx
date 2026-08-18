import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell, type Canvas } from '@/components/shared/SectionShell'
import { pillarSection } from '@/seed/home'

/**
 * PillarCards — docs/04 §19, home §4.4.
 *
 * Discover, Design, Engineer, Scale. Four cells with 1px gaps over a
 * `line-dark` background, so the grid reads as one object rather than four
 * separate cards.
 *
 * These are ordered — the four are a sequence, unlike ProblemCards — so the
 * numbers stay in the accessible name rather than being hidden.
 */
export function PillarCards({ canvas = 'navy' }: { canvas?: Canvas } = {}) {
  return (
    <SectionShell canvas={canvas} reveal>
      <div className="max-w-measure">
        <Eyebrow>{pillarSection.eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
          {pillarSection.heading}
        </h2>
        <p className="mt-5 text-body-lg">{pillarSection.body}</p>
      </div>

      <ol className="mt-14 grid gap-px bg-(--line) sm:grid-cols-2 lg:grid-cols-4">
        {pillarSection.pillars.map((pillar, index) => (
          <li key={pillar.title} className="bg-(--surface) p-7 lg:p-8">
            <p className="font-mono text-label text-(--accent-text) uppercase">Step {index + 1}</p>
            <h3 className="mt-4 font-display text-h3 text-(--ink)">{pillar.title}</h3>
            <p className="mt-3 text-body-sm">{pillar.body}</p>
          </li>
        ))}
      </ol>
    </SectionShell>
  )
}
