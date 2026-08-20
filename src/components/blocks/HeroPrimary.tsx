import type { CSSProperties } from 'react'

import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { Typewriter } from '@/components/shared/Typewriter'
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
          {/* The one typed line on the site. It sits on the label rather than
              the headline on purpose: typing withholds text from a reader who
              is trying to read it, which is acceptable for four words of
              category and not for the sentence they came for. */}
          <Eyebrow as="p" data-hero-item="" style={{ '--reveal-index': 0 } as CSSProperties}>
            <Typewriter>{eyebrow}</Typewriter>
          </Eyebrow>

          {/*
            Deliberately *not* split into masked lines.

            The obvious move is to mask `lead` and `accent` as two lines, since
            the copy already declares them separately. It is wrong twice. They
            are not two lines — they are one sentence with three words picked
            out in amber, and the seed says so: the lead ends mid-clause on
            "Automate what". Forcing a break there imposes a line ending the
            copy never asked for and overrides where the headline actually
            wraps at each width. It also drops the space between them, which
            joins two words in the accessible name.

            SplitText would measure the real wrap, but it runs after paint, and
            above the fold that means the hero renders finished and then jumps
            back to its start. So the headline rises and fades with everything
            else, and the masked line reveal stays where it can be measured
            honestly — on the scroll-triggered headings below.
          */}
          <h1
            id="hero-heading"
            data-hero-item=""
            style={{ '--reveal-index': 1 } as CSSProperties}
            className="mt-6 max-w-headline font-display text-display text-(--ink) [@media(max-height:820px)]:mt-4"
          >
            {headline.lead} <span className="text-amber-500">{headline.accent}</span>
          </h1>

          <p
            data-hero-item=""
            style={{ '--reveal-index': 2 } as CSSProperties}
            className="mt-6 max-w-measure text-body-lg [@media(max-height:820px)]:mt-4"
          >
            {body}
          </p>

          <div
            data-hero-item=""
            style={{ '--reveal-index': 3 } as CSSProperties}
            className="mt-9 flex flex-wrap items-center gap-4 [@media(max-height:820px)]:mt-6"
          >
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

        {/* Proof strip — bottom right. Last in, because it is the last thing
            worth reading and arriving first would make it compete with the
            headline. */}
        <div
          data-hero-item=""
          style={{ '--reveal-index': 4 } as CSSProperties}
          className="flex justify-start lg:justify-end"
        >
          <HeroProofStrip
            items={technologyEcosystem.groups.flatMap((group) => group.items)}
            label={technologyEcosystem.label}
          />
        </div>
      </div>
    </section>
  )
}
