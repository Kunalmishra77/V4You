import { cn } from '@/lib/utils'

/**
 * KpiTable — docs/04 §17.
 *
 * Metric, Before, After, Change, Method — with an `evidenceType` badge on every
 * row. docs/03 calls `evidenceType` the single most important field in the
 * schema for a company whose positioning is evidence-led, and this component is
 * where that shows: there is no prop shape that renders a figure without one.
 *
 * The badge is text, not a colour. docs/06 §C1 forbids conveying information by
 * colour alone, and "measured" versus "estimated" is exactly the distinction
 * someone would otherwise miss.
 *
 * Stacks to cards under 700px, keeping real table markup — only `display`
 * changes, so the semantics survive.
 */

export type EvidenceType = 'measured' | 'modelled' | 'estimated' | 'client-reported'

export type Kpi = {
  metric: string
  before: string
  after: string
  change: string
  method: string
  evidenceType: EvidenceType
}

const EVIDENCE_LABEL: Record<EvidenceType, string> = {
  measured: 'Measured',
  modelled: 'Modelled',
  estimated: 'Estimated',
  'client-reported': 'Client-reported',
}

export function KpiTable({ kpis, caption }: { kpis: Kpi[]; caption: string }) {
  // A KPI table with nothing in it is not an empty state to design — it is a
  // caller passing an empty array, and the section around it should not have
  // rendered.
  if (kpis.length === 0) return null

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left max-[699px]:block">
        <caption className="sr-only">{caption}</caption>

        <thead className="max-[699px]:sr-only">
          <tr className="border-y border-(--line)">
            {['Metric', 'Before', 'After', 'Change', 'How it was measured'].map((heading) => (
              <th key={heading} scope="col" className="py-4 pr-6 font-mono text-label uppercase">
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="max-[699px]:block">
          {kpis.map((kpi) => (
            <tr
              key={kpi.metric}
              className="border-b border-(--line) align-top max-[699px]:block max-[699px]:py-5"
            >
              <th
                scope="row"
                className="py-5 pr-6 text-left font-display text-body font-semibold text-(--ink) max-[699px]:block max-[699px]:py-0"
              >
                {kpi.metric}
              </th>
              <td
                className="py-5 pr-6 font-mono text-body-sm max-[699px]:block max-[699px]:py-1"
                data-label="Before"
              >
                <span className="font-mono text-label uppercase min-[700px]:hidden">Before: </span>
                {kpi.before}
              </td>
              <td className="py-5 pr-6 font-mono text-body-sm max-[699px]:block max-[699px]:py-1">
                <span className="font-mono text-label uppercase min-[700px]:hidden">After: </span>
                {kpi.after}
              </td>
              <td className="py-5 pr-6 font-mono text-body-sm font-medium text-(--ink) max-[699px]:block max-[699px]:py-1">
                <span className="font-mono text-label uppercase min-[700px]:hidden">Change: </span>
                {kpi.change}
              </td>
              <td className="py-5 max-[699px]:block max-[699px]:pt-3">
                <span
                  className={cn(
                    'inline-block border border-(--line) px-2 py-0.5 font-mono text-label uppercase',
                    kpi.evidenceType === 'measured' ? 'text-(--ink)' : 'text-(--ink-muted)',
                  )}
                >
                  {EVIDENCE_LABEL[kpi.evidenceType]}
                </span>
                <span className="mt-2 block text-body-sm">{kpi.method}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
