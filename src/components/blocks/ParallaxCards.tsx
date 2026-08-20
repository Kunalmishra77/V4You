'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { Headline } from '@/components/shared/Headline'
import { SectionShell, type Canvas } from '@/components/shared/SectionShell'
import { prefersReducedMotion } from '@/lib/reduced-motion'
import { cn } from '@/lib/utils'
import type { ServiceCard } from '@/seed/services'

/**
 * ParallaxCards — the staggered rise, modelled on the reference site's services
 * section.
 *
 * Four cards enter the viewport at different heights and converge as you
 * scroll: the first is already in place, the second sits a step lower, the
 * third lower still, and by the time the section is centred all four are level.
 *
 * **It is scrubbed, not triggered.** Every other animation on this site fires
 * once when its section crosses a line. This one is tied to scroll *position* —
 * the cards are wherever the scroll says they are, forwards or backwards, and
 * they stop the instant the reader stops. That is the whole effect. A triggered
 * version plays a fixed animation at you; a scrubbed one feels like the page
 * responding to your hand, which is why it reads as expensive.
 *
 * `scrub: 0.6` rather than `true` adds just over half a second of catch-up, so
 * the cards trail the scroll slightly instead of tracking it exactly. Tracking
 * exactly looks mechanical; the lag is what makes it feel weighted.
 *
 * **Desktop only, through `matchMedia`.** Below the large breakpoint the grid
 * is a single column, and offsetting a stack of cards vertically just inserts
 * hundreds of pixels of empty space between them. GSAP's `matchMedia` reverts
 * the tweens when the query stops matching, so a resize past the breakpoint
 * cleans up after itself rather than leaving cards stranded mid-transform.
 *
 * The section clips, because the lowered cards extend past its bottom edge
 * before they rise. Without it they overlap whatever follows.
 */
/**
 * Vertical gap between one column's starting position and the next.
 *
 * It has to stay under the height of a column, because each column clips its
 * own contents. At 280 the fourth column started 840px down inside a 432px
 * cell — entirely outside it, so it was invisible for most of the sequence and
 * then appeared from nowhere. 150 puts it 450px down, just past the bottom
 * edge, so its top rule is showing almost from the start and the reader can
 * watch all four arrive.
 *
 * Distance is not what sets the pace here. The pin does: the sequence is spread
 * over a fixed amount of scroll regardless of how far anything travels, so
 * shortening the distance makes the movement gentler, not quicker.
 */
const OFFSET_STEP = 150

export function ParallaxCards({
  eyebrow,
  heading,
  body,
  cards,
  cta,
  canvas = 'bone',
}: {
  eyebrow: string
  heading: string
  body: string
  cards: ServiceCard[]
  cta: { label: string; href: string }
  canvas?: Canvas
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const isDark = canvas === 'navy' || canvas === 'navy-800'

  useEffect(() => {
    // Asked before the import, not after: the answer decides whether 136KB of
    // animation library is worth fetching at all.
    if (prefersReducedMotion() || !sectionRef.current) return

    let revert: (() => void) | undefined
    let cancelled = false

    void import('@/lib/motion').then(({ gsap, registerGsap }) => {
      if (cancelled || !sectionRef.current) return
      registerGsap()

      const ctx = gsap.context(() => {
        const mm = gsap.matchMedia()

        mm.add('(min-width: 1024px)', () => {
          const items = gsap.utils.toArray<HTMLElement>('[data-parallax-card]')

          // One pinned timeline rather than four independent scrubs.
          //
          // Independent tweens meant the reader could scroll straight past
          // while the fourth column was still hundreds of pixels down — the
          // section left the viewport before its own animation had finished,
          // which is the one outcome that makes the whole effect pointless.
          // Pinning holds the section still and spends scroll on the timeline
          // instead of on moving the page, so the columns are guaranteed to
          // land before anything else comes into view.
          //
          // `anticipatePin` starts the pin a fraction early; without it a fast
          // scroll shows one frame of the section jumping as it becomes fixed.
          // `invalidateOnRefresh` re-reads the offsets on resize, so the
          // distances are recalculated rather than kept from the old width.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'center center',
              end: '+=1600',
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })

          for (const [index, card] of items.entries()) {
            // The first column is already where it belongs; the rest start a
            // step lower each and rise to meet it.
            if (index === 0) continue

            // Later columns are given longer to travel, so they finish in
            // order rather than together. All three start at position 0 of the
            // timeline; only their durations differ.
            tl.fromTo(
              card,
              { y: index * OFFSET_STEP },
              {
                y: 0,
                // Linear, because the scroll position is the timing. An ease
                // here would make the columns speed up and slow down under a
                // steady scroll, which reads as a stutter rather than a curve.
                ease: 'none',
                duration: 0.4 + index * 0.2,
              },
              0,
            )
          }

          // The CTA arrives after the last column has landed — literally, at
          // the point on the timeline where the longest tween ends.
          if (ctaRef.current) {
            tl.from(
              ctaRef.current,
              { opacity: 0, y: 40, ease: 'none', duration: 0.25 },
              '>-0.05',
            )
          }
        })
      }, sectionRef)

      revert = () => ctx.revert()
    })

    return () => {
      cancelled = true
      revert?.()
    }
  }, [])

  return (
    <SectionShell canvas={canvas} className="overflow-hidden">
      <div ref={sectionRef}>
        {/*
          The CTA sits up here beside the heading, not under the grid.

          Under the grid it was being covered: the cards are moved with a
          transform, which is visual only, so the layout still has them where
          they started and a card offset several hundred pixels down lands on
          top of whatever follows. Reserving space for the offset would leave a
          few hundred pixels of hole once they settle. Up here there is nothing
          below them to hit.
        */}
        <div className="max-w-measure">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Headline className="mt-5">{heading}</Headline>
          <p className="mt-5 text-body-lg">{body}</p>
        </div>

        {/*
          A static grid of outlined columns, with the content sliding inside
          them — which is what the reference is actually doing, and not what the
          first version did.

          That version moved whole bordered cards, so the outlines travelled
          with them and there was no grid, just four boxes at four heights. Here
          the `ul` and its cells never move: the top and bottom rules and the
          three dividers are fixed, and each column clips its own contents. What
          rises is the block inside.

          It also removes the transform question entirely. Nothing GSAP touches
          carries a hover state, so all four columns respond identically —
          previously the first card lifted and the other three, the ones with
          tweens, did not.

          No fill. The reference's cards are the section's own background inside
          an outline, not white panels sitting on it, and the difference is most
          of why theirs reads as one object and ours read as four. The fill
          arrives on hover instead, which gives the column something to do.
        */}
        <ul className="mt-14 grid md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <li
              key={card.slug}
              className={cn(
                'group/card relative overflow-hidden border-(--line)',
                'transition-colors duration-(--duration-card) ease-out',
                // The cell owns only the vertical divider, and the cell never
                // moves — so the verticals run unbroken down the whole section
                // however far apart the columns are. The horizontal rules are
                // on the block inside, which does move, so each column arrives
                // carrying its own top and bottom edge. That split is the whole
                // look: one fixed rule across the top of all four made them a
                // table with shifting contents rather than four cards rising.
                'md:[&:nth-child(even)]:border-l',
                'lg:border-l lg:first:border-l-0',
                isDark
                  ? 'hover:bg-navy-800 focus-within:bg-navy-800'
                  : 'hover:bg-white focus-within:bg-white',
              )}
            >
              <div
                data-parallax-card=""
                style={{ '--reveal-index': index } as CSSProperties}
                className="flex min-h-[24rem] flex-col border-y border-(--line) p-7 lg:min-h-[27rem] lg:p-8"
              >
                <span
                  aria-hidden="true"
                  className="block size-8 shrink-0 bg-(--accent-glyph) cut-slash"
                />

                <p className="mt-7 font-mono text-label text-(--accent-text) uppercase">
                  {card.title}
                </p>

                <h3 className="mt-4 font-display text-h3 text-(--ink)">{card.outcome}</h3>

                <p className="mt-4 flex-1 text-body-sm">{card.body}</p>

                {/*
                  The label is the service title alone. "View " in front of it
                  said nothing the button's position did not already say, and it
                  cost the longest label a second line.

                  It must stay a single string. Written as `View {card.title}`
                  it is two children, not one, and Button's label falls back to
                  a plain span — the masked swap then never renders, silently,
                  on every card in the section.

                  `block`, so all four are the width of their column and
                  therefore the same size as each other.
                */}
                <div className="mt-8">
                  <Button
                    href={`/services/${card.slug}`}
                    variant={isDark ? 'ghost-dark' : 'ghost-light'}
                    block
                  >
                    {card.title}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/*
          Below the grid, and last to arrive.

          It sat beside the heading for a while because the moving cards used to
          cover it. They no longer do — the cells are fixed and clip their own
          contents, so nothing overlaps what follows — and below the four
          columns is where it belongs: it is the step after reading them, not
          an alternative to it.

          `gsap.from` rather than `to`, so the button is visible in the markup
          and only hidden once the animation is actually running. The other way
          round, a chunk that fails to load leaves it invisible for good.
        */}
        <div ref={ctaRef} className="mt-14 flex justify-center">
          <Button href={cta.href} variant={isDark ? 'ghost-dark' : 'ghost-light'}>
            {cta.label}
          </Button>
        </div>
      </div>
    </SectionShell>
  )
}
