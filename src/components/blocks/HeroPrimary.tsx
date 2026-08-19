import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { technologyEcosystem } from '@/seed/home-proof'

import { HeroMedia } from './HeroMedia'
import { HeroProofStrip } from './HeroProofStrip'

/**
 * HeroPrimary — docs/04 §8, home only.
 *
 * One viewport, header included. The header is 76px and shrinks to 64px on
 * scroll, so the hero subtracts the taller of the two from `100svh` — `svh`
 * rather than `vh` because mobile browser chrome makes `vh` taller than the
 * space actually visible, which pushes the CTA below the fold on exactly the
 * devices where that matters most.
 *
 * Copy sits left and vertically centred; the proof strip sits bottom right.
 * The background is video when one exists and an abstract field until then —
 * see HeroMedia, which also owns the contrast guarantee, since text over
 * moving imagery cannot be checked against a fixed colour.
 *
 * The orchestration diagram that used to live here has moved directly below the
 * fold. It is the page's argument and worth its space, but it was competing
 * with the headline for the one screen that decides whether anyone scrolls.
 */
export function HeroPrimary({
  eyebrow,
  headline,
  body,
  primaryCta,
  secondaryCta,
  videoSrc,
  videoPoster,
}: {
  eyebrow: string
  headline: { lead: string; accent: string }
  body: string
  trustLine?: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  videoSrc?: string
  videoPoster?: string
}) {
  return (
    <section
      className="relative isolate flex min-h-[calc(100svh-var(--spacing-header))] flex-col justify-center overflow-hidden surface-navy"
      aria-labelledby="hero-heading"
    >
      <HeroMedia src={videoSrc} poster={videoPoster} />

      {/*
        Short viewports are the constraint, not tall ones. A 1280×720 laptop —
        still extremely common — has 87px less room than the copy and the strip
        want, so padding and gap tighten by viewport *height* rather than width.
        Width-based breakpoints cannot see this: the same 1280px-wide layout is
        comfortable at 900px tall and overflowing at 720px.
      */}
      <div className="mx-auto grid w-full max-w-content flex-1 grid-rows-[1fr_auto] gap-10 px-gutter py-14 lg:py-20 [@media(max-height:820px)]:gap-6 [@media(max-height:820px)]:py-8 lg:[@media(max-height:820px)]:py-10">
        {/* Copy — left, vertically centred */}
        <div className="flex max-w-2xl flex-col justify-center [text-shadow:0_1px_24px_color-mix(in_oklab,var(--color-navy-900)_70%,transparent)]">
          <Eyebrow as="p">{eyebrow}</Eyebrow>

          <h1
            id="hero-heading"
            className="mt-6 max-w-headline font-display text-display text-(--ink) [@media(max-height:820px)]:mt-4"
          >
            {headline.lead} <span className="text-amber-500">{headline.accent}</span>
          </h1>

          <p className="mt-6 max-w-measure text-body-lg [@media(max-height:820px)]:mt-4">{body}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4 [@media(max-height:820px)]:mt-6">
            <Button href={primaryCta.href} size="lg">
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Button href={secondaryCta.href} variant="ghost-dark" size="lg">
                {secondaryCta.label}
              </Button>
            )}
          </div>
        </div>

        {/* Proof strip — bottom right */}
        <div className="flex justify-start lg:justify-end">
          <HeroProofStrip
            items={technologyEcosystem.groups.flatMap((group) => group.items)}
            label={technologyEcosystem.label}
          />
        </div>
      </div>
    </section>
  )
}
