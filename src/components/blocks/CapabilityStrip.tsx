import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'
import { capabilityStrip } from '@/seed/home'

/**
 * CapabilityStrip — docs/04 §12.
 *
 * Four cells: Model, Method, Standard, Ownership. This is the honest substitute
 * for a metric strip when verified numbers do not exist, and docs/04 is clear
 * that it ships in Phase 1 regardless — the section's job still needs doing.
 *
 * Note what it does not contain: no figures, no "X+ projects", no years in
 * business. Every cell describes how the company works, which is a claim that
 * can be checked in a conversation rather than one that needs a footnote.
 */
export function CapabilityStrip({ canvas = 'navy-800' }: { canvas?: 'navy-800' | 'bone-2' }) {
  return (
    <SectionShell canvas={canvas} density="tight" reveal>
      <div className="max-w-measure">
        <Eyebrow>What you can rely on</Eyebrow>
        <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
          {capabilityStrip.heading}
        </h2>
        <p className="mt-4 text-body-lg">{capabilityStrip.body}</p>
      </div>

      {/*
        1px gaps over a --line background, so the four cells read as one object
        rather than four floating boxes — the same device as PillarCards.
      */}
      <ul className="mt-12 grid gap-px bg-(--line) sm:grid-cols-2 lg:grid-cols-4">
        {capabilityStrip.cells.map((cell) => (
          <li key={cell.label} className="bg-(--surface) p-6 lg:p-7">
            <p className="font-mono text-label text-(--accent-text) uppercase">{cell.label}</p>
            <h3 className="mt-4 font-display text-h3 text-(--ink)">{cell.title}</h3>
            <p className="mt-3 text-body-sm">{cell.body}</p>
          </li>
        ))}
      </ul>
    </SectionShell>
  )
}
