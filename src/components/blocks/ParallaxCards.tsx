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
 * Vertical gap between one card's starting position and the next.
 *
 * 240px puts the fourth card 720px below the first at rest. At 150 the whole
 * effect was a 226px spread on entry — small enough that a reader scrolling at
 * normal speed never registers it as motion, only as cards that happened to be
 * slightly out of line. At 300 the fourth card started so far down that the
 * section clipped it entirely and it appeared from nowhere halfway through.
 *
 * The slowness comes from the staggered scrub below, not from the distance.
 */
const OFFSET_STEP = 240

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

          for (const [index, card] of items.entries()) {
            // The first card is already where it belongs; the rest start a step
            // lower each and rise to meet it.
            if (index === 0) continue

            gsap.fromTo(
              card,
              { y: index * OFFSET_STEP },
              {
                y: 0,
                // Linear, because the scroll position is the timing. An ease
                // here would make the cards speed up and slow down under a
                // steady scroll, which reads as a stutter rather than a curve.
                ease: 'none',
                scrollTrigger: {
                  trigger: sectionRef.current,
                  // Begins the moment the section's top edge appears and ends
                  // with its centre just above the middle of the screen. The
                  // convergence therefore finishes exactly where the reader is
                  // looking, and it has most of a viewport and a half to do it
                  // in — a shorter window made the cards snap into line rather
                  // than travel.
                  //
                  // Scrub is seconds of catch-up, and these values are high on
                  // purpose. It is what makes the movement feel weighted rather
                  // than welded to the wheel: the cards keep easing for a beat
                  // after the scroll has stopped, and a fast flick does not snap
                  // them into line. At 0.8 they tracked the scroll closely
                  // enough to read as mechanical.
                  start: 'top bottom',
                  end: 'center 30%',
                  // Scrub rises with the index, so each card trails the scroll
                  // a little more than the one before it. A single value for all
                  // three made them travel at the same rate and simply start
                  // from different heights, which converges faster than it
                  // looks like it should — the gap between them closes at a
                  // constant rate and the last card arrives almost with the
                  // second. Staggering the lag means the fourth card is still
                  // easing after the second has settled.
                  scrub: 1.2 + index * 0.5,
                },
              },
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
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-measure">
            <Eyebrow>{eyebrow}</Eyebrow>
            <Headline className="mt-5">{heading}</Headline>
            <p className="mt-5 text-body-lg">{body}</p>
          </div>

          <div className="shrink-0">
            <Button href={cta.href} variant={isDark ? 'ghost-dark' : 'ghost-light'}>
              {cta.label}
            </Button>
          </div>
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
        <ul className="mt-14 grid border-y border-(--line) md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <li
              key={card.slug}
              className={cn(
                'group/card relative overflow-hidden border-(--line)',
                'transition-colors duration-(--duration-card) ease-out',
                // Stacked: a rule between each, none above the first. Two
                // columns: no rule above the second either, and a divider down
                // the middle. Four columns: no horizontal rules at all, a
                // divider to the left of every column but the first. The outer
                // top and bottom rules belong to the list, not to a cell, so
                // they stay put whatever the breakpoint does.
                'border-t first:border-t-0',
                'md:[&:nth-child(2)]:border-t-0 md:[&:nth-child(even)]:border-l',
                'lg:border-t-0 lg:border-l lg:first:border-l-0',
                isDark
                  ? 'hover:bg-navy-800 focus-within:bg-navy-800'
                  : 'hover:bg-white focus-within:bg-white',
              )}
            >
              <div
                data-parallax-card=""
                style={{ '--reveal-index': index } as CSSProperties}
                className="flex min-h-[24rem] flex-col p-7 lg:min-h-[27rem] lg:p-8"
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
      </div>
    </SectionShell>
  )
}
