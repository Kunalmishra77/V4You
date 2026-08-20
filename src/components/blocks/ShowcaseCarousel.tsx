'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

import type { CaseStudyCard } from '@/components/blocks/CaseStudyRail'
import { BrandFigure, type FigureName } from '@/components/shared/BrandFigure'
import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { Headline } from '@/components/shared/Headline'
import { Marquee } from '@/components/shared/Marquee'
import { SectionShell, type Canvas } from '@/components/shared/SectionShell'
import { cn } from '@/lib/utils'

/**
 * ShowcaseCarousel — a 2D rotary wheel, read off the reference's live DOM.
 *
 * Every card sits on the rim of a very large wheel whose hub is far below the
 * viewport, and the whole wheel turns. Nothing is pinned in the middle: the card
 * that happens to be at 0° is the one facing the reader, and a moment later it
 * is a different card. That is the mechanism the reference uses, and it is not
 * 3D — its cards report `transform-style: flat` and `perspective: none`, with
 * plain 2D rotations stepping 20° apart around a `transform-origin` about
 * 2290px beneath each card.
 *
 * **The angle is continuous.** A single `angle` in degrees is the source of
 * truth; a card's place on the rim is `index × step − angle`, wrapped so the
 * set spreads either side of centre rather than queueing off to the right. The
 * selected index is read back out of the angle, never stored separately — two
 * copies of the same state is how a carousel ends up with the pill and the card
 * disagreeing.
 *
 * **Dragging turns the wheel, it does not step it.** The angle follows the
 * pointer directly and the CSS transition is switched off while a drag is
 * running, so the wheel tracks the hand exactly. On release the transition
 * comes back and the angle settles to the nearest card. Stepping in fixed jumps
 * — the previous version — is what made it feel notched rather than turned.
 *
 * Three layers, kept apart on purpose:
 *
 *   1. **The wheel** — `absolute inset-0 z-0`, a stacking context of its own, so
 *      everything inside it including the drag badge is sealed in and cannot
 *      paint over a later sibling however high its z-index climbs.
 *   2. **The pills and arrows** — a real `tablist` above, with arrow keys and a
 *      roving tabindex. Dragging and clicking a card are pointer shortcuts on
 *      top of it, never the only way through.
 *   3. **The rail** — a separate marquee below, continuous, paused on hover.
 */

/**
 * Wheel radius in px, matching `--wheel-radius` in globals.css. Needed here
 * because flattening the path into an oval requires a cosine, and CSS has no
 * trigonometry in `calc()`.
 */
const RADIUS_PX = 175 * 16

/**
 * How much of the circle's vertical drop to keep. A true circle drops the outer
 * cards `radius × (1 − cos θ)` — 169px at 20° — and all of that empty space has
 * to be reserved below the wheel, where it reads as a hole in the section.
 * Keeping 40% flattens the path into a shallow oval: 0px, 17px and 68px of fall
 * across the set, which descends visibly without costing the height.
 */
const OVAL = 0.4

/**
 * Degrees between one card and the next on the rim.
 *
 * Small, deliberately. The tilt of a card is its own step multiplied by how far
 * it is from the middle, so a large step turns the outer cards into unreadable
 * diagonals. 10° keeps the furthest card at 20°, which still reads. The spacing
 * is made up by the radius instead — see globals.css.
 */
const STEP = 10

/**
 * Degrees of wheel rotation per pixel of pointer travel. 0.065 puts one card at
 * roughly 150px of drag, which is far enough that a small slip does not change
 * the selection and short enough that reaching the far card is one gesture.
 */
const DEG_PER_PX = 0.065

/** Pointer travel, in px, past which a drag is a drag and not a click. */
const CLICK_SLOP = 6

/**
 * A figure per card.
 *
 * The reference fills each card with a product screenshot, which is most of why
 * theirs read as objects. There is none to use — nothing built for a real client
 * can be shown — so the cards carry the brand's own abstract figures. They
 * occupy the same space and claim nothing.
 */
const FIGURES: FigureName[] = ['grid', 'flow', 'layers', 'signal', 'converge']

export function ShowcaseCarousel({
  eyebrow,
  heading,
  body,
  items,
  cta,
  marqueeItems,
  marqueeLabel,
  isSample = false,
  canvas = 'navy',
}: {
  eyebrow: string
  heading: string
  body?: string
  items: CaseStudyCard[]
  /** The band between the wheel and the rail. */
  cta?: { heading: string; body: string; label: string; href: string }
  /** The rail below the wheel. Continuous, pauses on hover. */
  marqueeItems?: readonly string[]
  marqueeLabel?: string
  isSample?: boolean
  canvas?: Canvas
}) {
  const [angle, setAngle] = useState(0)
  const [badge, setBadge] = useState<{ x: number; y: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  // The badge belongs to the draggable space, so it hides over a card — where
  // the gesture is a click, not a turn.
  const [overCard, setOverCard] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const drag = useRef({ active: false, lastX: 0, moved: 0, startAngle: 0 })

  const count = items.length

  // The selection is derived, never stored. One source of truth means the pill
  // and the card in front cannot drift apart.
  const active = ((Math.round(angle / STEP) % count) + count) % count

  /** Turn the wheel to a card, by the shortest way round. */
  const goTo = useCallback(
    (index: number, focusTab = false) => {
      setAngle((current) => {
        const span = count * STEP
        let target = index * STEP
        // Choose the equivalent target nearest the current angle, so selecting
        // the last card from the first turns one step back rather than four
        // forward.
        while (target - current > span / 2) target -= span
        while (current - target > span / 2) target += span
        return target
      })
      if (focusTab) tabRefs.current[index]?.focus()
    },
    [count],
  )

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        goTo((index + 1) % count, true)
        break
      case 'ArrowLeft':
        event.preventDefault()
        goTo((index - 1 + count) % count, true)
        break
      case 'Home':
        event.preventDefault()
        goTo(0, true)
        break
      case 'End':
        event.preventDefault()
        goTo(count - 1, true)
        break
    }
  }

  // --- Drag: turns the wheel continuously -----------------------------------
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    // Touch already swipes the page; hijacking it makes the section a trap.
    if (event.pointerType !== 'mouse' || !stageRef.current) return
    // Capture, or the gesture dies the moment the cursor leaves the stage —
    // which on something you drag sideways is most of the time.
    stageRef.current.setPointerCapture(event.pointerId)
    drag.current = { active: true, lastX: event.clientX, moved: 0, startAngle: angle }
    setDragging(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && stageRef.current) {
      const box = stageRef.current.getBoundingClientRect()
      setBadge({ x: event.clientX - box.left, y: event.clientY - box.top })
    }
    if (!drag.current.active) return

    const delta = event.clientX - drag.current.lastX
    drag.current.lastX = event.clientX
    drag.current.moved += Math.abs(delta)
    // Dragging left turns the wheel forwards, which is the direction the
    // content moves under the hand.
    setAngle((current) => current - delta * DEG_PER_PX)
  }

  const endDrag = (event?: PointerEvent<HTMLDivElement>) => {
    if (event && stageRef.current?.hasPointerCapture(event.pointerId)) {
      stageRef.current.releasePointerCapture(event.pointerId)
    }
    if (drag.current.active) {
      // Settle on the nearest card. The transition is back on by this point, so
      // the wheel eases into place rather than jumping.
      setAngle((current) => Math.round(current / STEP) * STEP)
    }
    drag.current.active = false
    setDragging(false)
  }

  // Escape releases a drag stranded by a lost pointerup — a real case when the
  // pointer leaves the window mid-gesture.
  useEffect(() => {
    if (!dragging) return
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return
      drag.current.active = false
      setDragging(false)
      setAngle((current) => Math.round(current / STEP) * STEP)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [dragging])

  if (!count) return null

  return (
    // `bleed` drops SectionShell's centred container, so the wheel and the rail
    // run edge to edge. The text blocks put the gutter back for themselves —
    // full-bleed is about the moving parts, and a heading against the bezel is
    // just hard to read.
    <SectionShell canvas={canvas} bleed className="overflow-hidden">
      <div className="px-gutter text-center">
        <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
        <Headline className="mx-auto mt-5">{heading}</Headline>
        {body && <p className="mx-auto mt-5 max-w-measure text-body-lg">{body}</p>}
      </div>

      {isSample && (
        <p
          role="note"
          className="mx-gutter mt-8 max-w-measure border-l-2 border-amber-500 bg-navy-800 px-5 py-4 text-left text-body-sm text-bone"
        >
          <strong className="font-display font-semibold">Placeholder content.</strong> These are not
          real engagements and contain no measured results.
        </p>
      )}

      <div className="mt-10 flex items-center justify-center gap-3 px-gutter">
        <ArrowButton label="Previous" direction="prev" onClick={() => goTo((active - 1 + count) % count)} />

        <div
          role="tablist"
          aria-label={heading}
          className="flex max-w-full gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, index) => {
            const selected = index === active
            return (
              <button
                key={item.slug}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
                type="button"
                role="tab"
                id={`showcase-tab-${item.slug}`}
                aria-selected={selected}
                aria-controls={`showcase-panel-${item.slug}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => goTo(index)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                className={cn(
                  'min-h-11 shrink-0 px-5 py-2.5 font-display text-body-sm font-medium whitespace-nowrap',
                  'transition-colors duration-(--duration-card) ease-out',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500',
                  selected ? 'bg-bone text-navy-900' : 'bg-navy-800 text-slate-300 hover:text-bone',
                )}
              >
                {item.industry}
              </button>
            )
          })}
        </div>

        <ArrowButton label="Next" direction="next" onClick={() => goTo((active + 1) % count)} />
      </div>

      {/* `isolate` keeps the wheel from negotiating z-index with the page. */}
      <div // Tall enough for a whole card plus the drop of the outermost one. A card is
          // ~457px and the 20° card sits ~184px lower, so anything under 36rem once the path is flattened
          // clips the bottom off the cards at the edges.
          className="showcase relative isolate mt-12 min-h-[36rem]">
        <div
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={(event) => {
            endDrag(event)
            setBadge(null)
          }}
          // A drag across text starts a selection and a drag across anything
          // draggable starts the browser's own drag-and-drop — either one
          // cancels the pointer stream mid-gesture.
          onDragStart={(event) => event.preventDefault()}
          className={cn(
            'showcase-stage absolute inset-0 z-0 select-none',
            // No transition while the hand is on it, so the wheel tracks the
            // pointer exactly rather than easing behind it.
            dragging ? 'showcase-stage--dragging cursor-grabbing' : 'cursor-grab',
          )}
        >
          {items.map((item, index) => {
            // Place on the rim relative to the current angle, then wrap so the
            // set spreads either side of centre instead of queueing off to the
            // right. Continuous, not an integer — this is what makes the drag
            // smooth rather than notched.
            const span = count * STEP
            let offsetDeg = index * STEP - angle
            offsetDeg = (((offsetDeg + span / 2) % span) + span) % span
            offsetDeg -= span / 2

            // Place the card explicitly rather than swinging it about a hub
            // far below. Same arc, but every term is separate and can be read:
            // x is where on the rim it sits, y is how far it has fallen, and the
            // rotation is the tilt. Deriving all three from one distant
            // `transform-origin` was what put the ±10° cards *above* the middle
            // one — the rotation and the correction for it were fighting, and
            // the sequence came out scattered instead of descending.
            const rad = (offsetDeg * Math.PI) / 180
            const x = RADIUS_PX * Math.sin(rad)
            const y = RADIUS_PX * (1 - Math.cos(rad)) * OVAL

            const isFront = index === active

            return (
              <div
                key={item.slug}
                {...(isFront
                  ? {
                      role: 'tabpanel',
                      id: `showcase-panel-${item.slug}`,
                      'aria-labelledby': `showcase-tab-${item.slug}`,
                    }
                  : // `aria-hidden` but **not** `inert`. Inert excludes an
                    // element from hit-testing altogether, so an inert card
                    // never receives the hover or the click — which is exactly
                    // what stopped a side card being clickable. Dropping it
                    // costs nothing here because a hidden card carries no
                    // focusable content: the button below is rendered on the
                    // front card only.
                    { 'aria-hidden': true as const })}
                // A card is for clicking; the space around it is for dragging.
                // Stopping the pointer here keeps a press on a card from
                // starting a turn, so a click always lands as a click.
                onPointerDown={(event) => {
                  event.stopPropagation()
                  // Clear the distance from any previous gesture. Without this a
                  // click on a card can be swallowed by the slop check below,
                  // using a number left over from the last drag.
                  drag.current.moved = 0
                }}
                onPointerEnter={() => setOverCard(true)}
                onPointerLeave={() => setOverCard(false)}
                onClick={() => {
                  if (drag.current.moved > CLICK_SLOP) return
                  goTo(index)
                }}
                style={
                  {
                    '--card-deg': `${offsetDeg}deg`,
                    '--card-x': `${x}px`,
                    '--card-y': `${y}px`,
                    // Stacking follows distance from the middle rather than the
                    // selected/not-selected flag. Flipping a z-index the moment
                    // `active` changes makes two cards swap depth in one frame,
                    // which is the jump you see as the selection moves.
                    zIndex: Math.max(1, 20 - Math.round(Math.abs(offsetDeg))),
                  } as CSSProperties
                }
                className="showcase-card flex flex-col overflow-hidden border border-navy-700 bg-navy-800 surface-navy-800"
              >
                <div className="flex min-h-0 flex-1 flex-col p-6">
                  <p className="font-mono text-label text-(--accent-text) uppercase">
                    {item.confidentialityLabel ?? item.clientDisplayName}
                  </p>
                  <h3 className="mt-3 font-display text-h4 text-(--ink)">{item.headline}</h3>
                  {/* Clamped, because the card's height is fixed and a long
                      outcome would otherwise push the button out of the box. */}
                  <p className="mt-3 line-clamp-4 text-body-sm">{item.outcome}</p>

                  {isSample && (
                    <p className="mt-5 font-mono text-label text-(--ink-muted) uppercase">
                      Sample — not a real engagement
                    </p>
                  )}

                  {/*
                    The button is on the front card only. Every other card is
                    `aria-hidden`, and a focusable control inside a hidden
                    subtree is reachable by Tab but invisible to a screen
                    reader — the `aria-hidden-focus` failure. The side cards are
                    previews: click one and it comes to the front, button and
                    all.

                    Samples go to contact rather than a case-study page. Those
                    are Phase 2 and do not exist, and `next/link` would prefetch
                    a 404 for every card in the set.
                  */}
                  {/* The slot is always here, whether or not it holds a button.
                      Adding one only when a card reaches the front would reflow
                      the card's insides at the exact moment it is moving, which
                      is the other half of the jump. */}
                  <div className="mt-auto min-h-[3.25rem] pt-6">
                    {isFront && (
                      <Button
                        href={isSample ? '/contact' : `/case-studies/${item.slug}`}
                        variant="ghost-dark"
                      >
                        {isSample ? 'Ask about work like this' : 'Read the case study'}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="relative h-24 shrink-0 overflow-hidden border-t border-navy-700 bg-navy-900">
                  <BrandFigure
                    name={FIGURES[index % FIGURES.length]}
                    className="absolute top-1/2 left-1/2 w-[150%] -translate-x-1/2 -translate-y-1/2 opacity-60"
                  />
                </div>
              </div>
            )
          })}

          {/*
            Inside the wheel layer, not beside it. The wheel is a stacking
            context, so this badge is sealed within it and cannot paint over
            anything that comes after.
          */}
          {badge && !overCard && (
            <span
              aria-hidden="true"
              style={{ '--badge-x': badge.x + 'px', '--badge-y': badge.y + 'px' } as CSSProperties}
              className="drag-badge pointer-events-none absolute z-30 hidden size-20 place-content-center rounded-full border border-amber-500 bg-navy-900/85 text-center font-mono text-label text-amber-500 uppercase backdrop-blur-sm [@media(pointer:fine)]:grid"
            >
              {dragging ? 'Dragging' : 'Drag'}
            </span>
          )}
        </div>
      </div>

      {cta && (
        <div className="px-gutter">
          <div className="mx-auto mt-4 flex max-w-content flex-col gap-8 border border-navy-700 bg-navy-800 p-8 surface-navy-800 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <div>
              <Headline size="h3" className="whitespace-pre-line">
                {cta.heading}
              </Headline>
              <p className="mt-4 max-w-measure text-body-sm">{cta.body}</p>
            </div>
            <div className="shrink-0">
              <Button href={cta.href}>{cta.label}</Button>
            </div>
          </div>
        </div>
      )}

      {/* The rail. Separate, continuous, pauses on hover. */}
      {marqueeItems && marqueeItems.length > 0 && (
        <div className="mt-16 border-y border-navy-700">
          {marqueeLabel && (
            <p className="pt-6 font-mono text-label text-(--ink-muted) uppercase">{marqueeLabel}</p>
          )}
          <Marquee
            items={marqueeItems}
            duration={54}
            className="py-6"
            gap="gap-4"
            itemClassName="border border-navy-700 px-7 py-5 font-display text-h3 text-(--ink-muted)"
          />
        </div>
      )}
    </SectionShell>
  )
}

function ArrowButton({
  label,
  direction,
  onClick,
}: {
  label: string
  direction: 'prev' | 'next'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-11 shrink-0 items-center justify-center border border-navy-700 text-bone transition-colors duration-(--duration-card) ease-out hover:border-amber-500 hover:text-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
    >
      <span
        aria-hidden="true"
        className={cn(
          'block size-2.5 border-t-2 border-r-2 border-current',
          direction === 'next' ? '-translate-x-0.5 rotate-45' : 'translate-x-0.5 -rotate-135',
        )}
      />
    </button>
  )
}
