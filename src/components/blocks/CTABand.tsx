import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'

/**
 * CTABand — docs/04 §29.
 *
 * Amber canvas, navy text, navy button — 7.72:1, and docs/04 calls it the
 * site's most confident element. It appears **once per page**, near the end.
 * Repeating it is what turns a confident element into wallpaper.
 *
 * The `navy` button variant is a deliberate choice at the call site rather than
 * something the canvas substitutes silently: `primary` here would be amber on
 * amber, and a component that quietly rewrites a caller's variant hides the
 * mistake instead of making it visible.
 */
export function CTABand({
  eyebrow = 'Ready when you are',
  heading = 'Tell us what you are trying to change.',
  body = 'Bring us the challenge — what you want to build, modernise, automate or grow. We will come prepared with questions, options and a practical next step.',
  primaryCta = { label: 'Book a transformation consultation', href: '/book-consultation' },
  secondaryCta,
}: {
  eyebrow?: string
  heading?: string
  body?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}) {
  return (
    <SectionShell canvas="amber" reveal>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">{heading}</h2>
          <p className="mt-5 max-w-measure text-body-lg">{body}</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button href={primaryCta.href} variant="navy" size="lg">
            {primaryCta.label}
          </Button>
          {secondaryCta && (
            <Button href={secondaryCta.href} variant="ghost-light" size="lg">
              {secondaryCta.label}
            </Button>
          )}
        </div>
      </div>
    </SectionShell>
  )
}
