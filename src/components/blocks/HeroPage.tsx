import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'
import type { Breadcrumb } from '@/lib/seo'

/**
 * HeroPage — docs/04 §9.
 *
 * The hero for every page except home: eyebrow, H1, lede, up to two CTAs, and
 * an optional breadcrumb. Driven by the collection's `hero` group.
 *
 * Not revealed on scroll. It is the first thing in the viewport, so a reveal
 * would either fire instantly — pointless — or briefly hide the page's own
 * headline, which is worse.
 */
export function HeroPage({
  eyebrow,
  headline,
  body,
  primaryCta,
  secondaryCta,
  breadcrumbs,
}: {
  eyebrow?: string
  headline: string
  body?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  breadcrumbs?: Breadcrumb[]
}) {
  return (
    <SectionShell canvas="navy" as="div">
      {breadcrumbs && (
        <div className="mb-10">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}

      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

      <h1 className="mt-5 max-w-headline font-display text-h1 text-(--ink)">{headline}</h1>

      {body && <p className="mt-6 max-w-measure text-body-lg">{body}</p>}

      {(primaryCta || secondaryCta) && (
        <div className="mt-10 flex flex-wrap items-center gap-4">
          {primaryCta && <Button href={primaryCta.href}>{primaryCta.label}</Button>}
          {secondaryCta && (
            <Button href={secondaryCta.href} variant="ghost-dark">
              {secondaryCta.label}
            </Button>
          )}
        </div>
      )}
    </SectionShell>
  )
}
