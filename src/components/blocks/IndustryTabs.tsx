import Link from 'next/link'

import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell, type Canvas } from '@/components/shared/SectionShell'
import { industryTabs } from '@/seed/industries'

import { Tabs, type TabItem } from './Tabs'

/**
 * IndustryTabs — docs/04 §21, home §4.8.
 *
 * Two columns in the panel: the operating context and its challenges on the
 * left, the four-step "where we typically start" reference flow on the right.
 *
 * Each panel links through to the full industry page. docs/12.3 wants internal
 * links to be a consequence of the content model rather than a hand-maintained
 * list, and this is that in miniature — eleven links generated from eleven
 * records.
 */
export function IndustryTabs({ canvas = 'bone' }: { canvas?: Canvas } = {}) {
  const items: TabItem[] = industryTabs.map((industry) => ({
    id: industry.slug,
    label: industry.label,
    panel: (
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
        <div>
          <h3 className="max-w-headline font-display text-h3 text-(--ink)">
            How {industry.label.toLowerCase()} actually operates
          </h3>
          <p className="mt-4 max-w-measure text-body-lg">{industry.context}</p>

          <p className="mt-8 font-mono text-label text-(--accent-text) uppercase">
            What we see repeatedly
          </p>
          <ul className="mt-4 space-y-2">
            {industry.challenges.map((challenge) => (
              <li key={challenge} className="flex gap-3 text-body-sm">
                <span
                  aria-hidden="true"
                  className="mt-1.5 block size-3 shrink-0 bg-amber-500 cut-slash"
                />
                {challenge}
              </li>
            ))}
          </ul>

          <p className="mt-8">
            <Link
              href={`/industries/${industry.slug}`}
              className="font-display text-body-sm font-medium text-(--ink) underline underline-offset-4 hover:text-amber-500"
            >
              {industry.label} in depth
            </Link>
          </p>
        </div>

        <div className="border-t border-(--line) pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
          <p className="font-mono text-label text-(--accent-text) uppercase">
            Where we typically start
          </p>
          <ol className="mt-6 space-y-6">
            {industry.whereWeStart.map((step) => (
              <li key={step.step} className="grid grid-cols-[2rem_1fr] gap-4">
                <span aria-hidden="true" className="font-mono text-label text-(--ink-muted)">
                  {step.step}
                </span>
                <span>
                  <span className="block w-fit border border-(--line) px-2 py-0.5 font-mono text-label text-(--ink-muted) uppercase">
                    {step.tag}
                  </span>
                  <span className="mt-2 block text-body-sm">{step.label}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    ),
  }))

  return (
    <SectionShell canvas={canvas} reveal>
      <div className="max-w-measure">
        <Eyebrow>Industries</Eyebrow>
        <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
          Technology shaped around how your industry operates.
        </h2>
        <p className="mt-5 text-body-lg">
          Eleven sectors, each with its own operating reality. Pick yours and see where we would
          start.
        </p>
      </div>

      <Tabs items={items} selectLabel="Industries" className="mt-12" />
    </SectionShell>
  )
}
