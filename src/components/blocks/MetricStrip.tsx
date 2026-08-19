import { SectionShell } from '@/components/shared/SectionShell'
import { reportMissingAsset } from '@/lib/missing-assets'
import { revealChild } from '@/lib/reveal'

import type { EvidenceType } from './KpiTable'

/**
 * MetricStrip — docs/04 §13.
 *
 * Gated. It renders only when **every** metric carries both a `method` and an
 * `evidenceType`; if any is missing it returns null and logs what it needed.
 *
 * The gate is on the whole set, not per item, and that is the point. A strip
 * showing three sourced figures beside one unsourced one reads as four
 * verified figures — the missing method disappears into the pattern. Better to
 * show none than to launder one.
 *
 * No count-up animation, per docs/04: an animated number implies a live
 * measurement, and these are historical.
 */

export type Metric = {
  value: string
  label: string
  method?: string
  evidenceType?: EvidenceType
}

export function MetricStrip({
  metrics,
  canvas = 'navy-800',
}: {
  metrics: Metric[]
  canvas?: 'navy-800' | 'bone-2'
}) {
  if (metrics.length === 0) return null

  const unsourced = metrics.filter((metric) => !metric.method || !metric.evidenceType)

  if (unsourced.length > 0) {
    reportMissingAsset({
      component: 'MetricStrip',
      needs: `method and evidenceType on: ${unsourced.map((m) => m.label).join(', ')}`,
      blocks: 'the metric strip is omitted entirely — a number without a method does not publish',
    })
    return null
  }

  return (
    <SectionShell canvas={canvas} density="tight" reveal="stagger">
      <dl className="grid gap-px bg-(--line) sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <div key={metric.label} {...revealChild(index)} className="bg-(--surface) p-6 lg:p-7">
            <dt className="text-body-sm">{metric.label}</dt>
            <dd className="mt-3 font-display text-metric text-(--ink)">{metric.value}</dd>
            <dd className="mt-4 border-t border-(--line) pt-3">
              <span className="font-mono text-label text-(--accent-text) uppercase">
                {metric.evidenceType}
              </span>
              <span className="mt-1 block text-body-sm">{metric.method}</span>
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  )
}
