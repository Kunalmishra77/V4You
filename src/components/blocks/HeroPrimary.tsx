import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'

import { OrchestrationDiagram } from './OrchestrationDiagram'

/**
 * HeroPrimary — docs/04 §8, home only.
 *
 * Two columns: copy left, orchestration diagram right, stacking at 1000px.
 *
 * The accent phrase is amber on navy — 7.72:1, the strongest pairing in the
 * brand, and the one place on the page where amber carries meaning rather than
 * decoration.
 */
export function HeroPrimary({
  eyebrow,
  headline,
  body,
  trustLine,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string
  headline: { lead: string; accent: string }
  body: string
  trustLine?: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}) {
  return (
    <SectionShell canvas="navy" as="div">
      <div className="grid items-center gap-14 max-lg:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        <div>
          <Eyebrow as="p">{eyebrow}</Eyebrow>

          <h1 className="mt-6 max-w-headline font-display text-display text-(--ink)">
            {headline.lead} <span className="text-amber-500">{headline.accent}</span>
          </h1>

          <p className="mt-7 max-w-measure text-body-lg">{body}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href={primaryCta.href} size="lg">
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Button href={secondaryCta.href} variant="ghost-dark" size="lg">
                {secondaryCta.label}
              </Button>
            )}
          </div>

          {trustLine && (
            <p className="mt-8 max-w-measure border-t border-navy-700 pt-6 text-body-sm">
              {trustLine}
            </p>
          )}
        </div>

        {/*
          The diagram is decorative-adjacent: it carries the page's argument, so
          it has a real label, but it is not essential to understanding the copy
          beside it. On small screens it stays — a shrunken architecture diagram
          is still legible in a way a shrunken photograph is not.
        */}
        <div className="lg:pl-4">
          <OrchestrationDiagram />
        </div>
      </div>
    </SectionShell>
  )
}
