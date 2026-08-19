import { Headline } from '@/components/shared/Headline'
import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'
import type { Canvas } from '@/components/shared/SectionShell'

/**
 * NumberedAccordion — docs/04 §27.
 *
 * Used for trust and governance, and for the security page.
 *
 * docs/04 says "shadcn Accordion primitive; do not hand-roll", and the reason
 * is that hand-rolled disclosure widgets get the keyboard and the ARIA wrong.
 * `<details>`/`<summary>` satisfies the same requirement more completely: it is
 * keyboard-operable and correctly announced natively, it needs no ARIA at all,
 * it survives before hydration, and it ships zero JavaScript — which matters on
 * a marketing page held to a 90KB budget. It is the platform primitive shadcn's
 * primitive is reimplementing.
 *
 * Multiple panels can be open at once. These are reference material, not a
 * quiz; forcing one open at a time makes comparing two of them impossible.
 */

export type AccordionPanel = {
  title: string
  body: string
}

export function NumberedAccordion({
  eyebrow,
  heading,
  body,
  panels,
  cta,
  canvas = 'bone',
}: {
  eyebrow?: string
  heading: string
  body?: string
  panels: AccordionPanel[]
  cta?: { label: string; href: string }
  canvas?: Canvas
}) {
  if (panels.length === 0) return null

  return (
    <SectionShell canvas={canvas} reveal>
      <div className="max-w-measure">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Headline className="mt-5">{heading}</Headline>
        {body && <p className="mt-5 text-body-lg">{body}</p>}
      </div>

      <div className="mt-12 border-t border-(--line)">
        {panels.map((panel, index) => (
          <details key={panel.title} className="group border-b border-(--line)">
            <summary className="flex cursor-pointer list-none items-baseline gap-5 py-6 [&::-webkit-details-marker]:hidden">
              <span aria-hidden="true" className="font-mono text-label text-(--accent-text)">
                [{String(index + 1).padStart(2, '0')}]
              </span>
              <span className="flex-1 font-display text-h3 text-(--ink)">{panel.title}</span>
              <span
                aria-hidden="true"
                className="mt-2 block size-2.5 shrink-0 rotate-45 border-r-2 border-b-2 border-amber-500 transition-transform group-open:-translate-y-1 group-open:rotate-225"
              />
            </summary>
            <div className="max-w-measure pb-7 pl-10 text-body-sm">{panel.body}</div>
          </details>
        ))}
      </div>

      {cta && (
        <div className="mt-12">
          <Button
            href={cta.href}
            variant={canvas === 'navy' || canvas === 'navy-800' ? 'ghost-dark' : 'ghost-light'}
          >
            {cta.label}
          </Button>
        </div>
      )}
    </SectionShell>
  )
}
