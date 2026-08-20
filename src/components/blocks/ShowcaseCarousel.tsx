'use client'

import {
  useCallback,
  useEffect,
  useId,
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
 * ShowcaseCarousel — three layers, deliberately separate.
 *
 * The first version folded the centre card into the arc, and that one decision
 * caused the bug it was reported for: the drag layer and its badge painted over
 * the card in the middle, because they were siblings in the same container and
 * the badge simply had a higher `z-index`. Nudging that number would have hidden
 * the symptom until the next element arrived. The layers are now genuinely
 * separate and the stacking is enforced by structure rather than by arithmetic.
 *
 *   1. **The arc** — every card on a ring, tilted by position, draggable,
 *      clickable. `absolute inset-0 z-0`, which makes it a stacking context of
 *      its own. Everything inside it, the drag badge included, is sealed into
 *      that context and *cannot* paint above a later sibling however high its
 *      own `z-index` climbs. That is the fix, and it holds for anything added
 *      to the arc later.
 *
 *   2. **The centre card** — a sibling of the arc, never a child, at `z-20`.
 *      Its wrapper is `pointer-events-none` so a drag beginning beside the card
 *      still reaches the arc underneath; the card itself is
 *      `pointer-events-auto`, so its own button stays clickable. You drag the
 *      space around it, and the card is never obstructed.
 *
 *   3. **The marquee** — a separate rail below, scrolling continuously and
 *      pausing on hover. It shares no stacking context with either.
 *
 * `isolation: isolate` on the wrapper stops all of this negotiating with
 * anything else on the page.
 *
 * **Controls.** The pills are a real `tablist` and the centre card its
 * `tabpanel`, with arrow keys and a roving tabindex. Dragging, the two arrow
 * buttons and clicking a card in the arc are pointer shortcuts on top of that —
 * the arc cards are `aria-hidden` because selecting one does exactly what its
 * pill does, and announcing both would read as two of every sector.
 */

/**
 * A figure per position on the ring.
 *
 * The reference fills each card with a product screenshot, which is most of why
 * theirs read as objects. There is none to use — nothing built for a real client
 * can be shown — so the cards carry the brand's own abstract figures. They
 * occupy the same space and claim nothing. Assigned by index because it is
 * decoration: a case study's record should not have to know which drawing sits
 * behind it.
 */
const FIGURES: FigureName[] = ['grid', 'flow', 'layers', 'signal', 'converge']

/** Pointer travel, in px, past which a drag is a drag and not a click. */
const CLICK_SLOP = 6

/** Pointer travel, in px, that advances the arc by one card. */
const STEP_DISTANCE = 140

export function ShowcaseCarousel({
  eyebrow,
  heading,
  body,
  items,
  marqueeItems,
  marqueeLabel,
  isSample = false,
  canvas = 'navy',
}: {
  eyebrow: string
  heading: string
  body?: string
  items: CaseStudyCard[]
  /** The rail below the arc. Continuous, pauses on hover. */
  marqueeItems?: readonly string[]
  marqueeLabel?: string
  isSample?: boolean
  canvas?: Canvas
}) {
  const [active, setActive] = useState(0)
  const [badge, setBadge] = useState<{ x: number; y: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const baseId = useId()
  const stageRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const drag = useRef({ active: false, startX: 0, moved: 0 })

  const count = items.length

  const go = useCallback(
    (next: number, focusTab = false) => {
      if (!count) return
      const index = ((next % count) + count) % count
      setActive(index)
      if (focusTab) tabRefs.current[index]?.focus()
    },
    [count],
  )

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        go(index + 1, true)
        break
      case 'ArrowLeft':
        event.preventDefault()
        go(index - 1, true)
        break
      case 'Home':
        event.preventDefault()
        go(0, true)
        break
      case 'End':
        event.preventDefault()
        go(count - 1, true)
        break
    }
  }

  // --- Drag, on the arc layer only ------------------------------------------
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    // Touch already swipes the page; hijacking it makes the section a trap.
    if (event.pointerType !== 'mouse' || !stageRef.current) return
    // Capture, or the gesture dies the moment the cursor crosses the arc's edge
    // — which on something you drag sideways is most of the time.
    stageRef.current.setPointerCapture(event.pointerId)
    drag.current = { active: true, startX: event.clientX, moved: 0 }
    setDragging(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && stageRef.current) {
      const box = stageRef.current.getBoundingClientRect()
      setBadge({ x: event.clientX - box.left, y: event.clientY - box.top })
    }
    if (!drag.current.active) return

    const delta = event.clientX - drag.current.startX
    drag.current.moved = Math.max(drag.current.moved, Math.abs(delta))

    // Committed as the threshold is crossed rather than on release. Waiting for
    // release makes a long drag feel like it did nothing until you let go.
    if (Math.abs(delta) > STEP_DISTANCE) {
      go(active + (delta < 0 ? 1 : -1))
      drag.current.startX = event.clientX
    }
  }

  const endDrag = (event?: PointerEvent<HTMLDivElement>) => {
    if (event && stageRef.current?.hasPointerCapture(event.pointerId)) {
      stageRef.current.releasePointerCapture(event.pointerId)
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
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [dragging])

  if (!count) return null

  const current = items[active]

  return (
    <SectionShell canvas={canvas} className="overflow-hidden">
      <div className="text-center">
        <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
        <Headline className="mx-auto mt-5">{heading}</Headline>
        {body && <p className="mx-auto mt-5 max-w-measure text-body-lg">{body}</p>}
      </div>

      {isSample && (
        <p
          role="note"
          className="mx-auto mt-8 max-w-measure border-l-2 border-amber-500 bg-navy-800 px-5 py-4 text-left text-body-sm text-bone"
        >
          <strong className="font-display font-semibold">Placeholder content.</strong> These are not
          real engagements and contain no measured results.
        </p>
      )}

      <div className="mt-10 flex items-center justify-center gap-3">
        <ArrowButton label="Previous" direction="prev" onClick={() => go(active - 1)} />

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
                id={baseId + '-tab-' + index}
                aria-selected={selected}
                aria-controls={baseId + '-panel'}
                tabIndex={selected ? 0 : -1}
                onClick={() => go(index)}
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

        <ArrowButton label="Next" direction="next" onClick={() => go(active + 1)} />
      </div>

      {/*
        The stacking context for layers 1 and 2. `isolate` keeps the whole
        arrangement from negotiating z-index with anything else on the page.
      */}
      <div className="showcase relative isolate mt-12 min-h-[32rem] lg:min-h-[36rem]">
        {/* --- LAYER 1: the arc. Background, draggable, z-0. ---------------- */}
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
            dragging ? 'cursor-grabbing' : 'cursor-grab',
          )}
        >
          <div className="showcase-ring">
            {items.map((item, index) => {
              // The *shortest* signed distance round the ring, not
              // `index - active`. Plain subtraction puts every card on one side
              // when the first is selected, and the carousel visibly has an end.
              let offset = index - active
              if (offset > count / 2) offset -= count
              if (offset < -count / 2) offset += count

              return (
                <div
                  key={item.slug}
                  // Decorative. Clicking one does exactly what its pill does, so
                  // announcing both would read as two of every sector — and the
                  // pill is the version that works without a pointer.
                  aria-hidden="true"
                  onClick={() => {
                    // A drag that happens to end over a card is not a click.
                    if (drag.current.moved > CLICK_SLOP) return
                    go(index)
                  }}
                  style={{ '--offset': offset } as CSSProperties}
                  className="showcase-card flex flex-col overflow-hidden border border-navy-700 bg-navy-800 surface-navy-800"
                >
                  <div className="p-7">
                    <p className="font-mono text-label text-(--accent-text) uppercase">
                      {item.confidentialityLabel ?? item.clientDisplayName}
                    </p>
                    <h3 className="mt-4 font-display text-h3 text-(--ink)">{item.headline}</h3>
                    <p className="mt-3 text-body-sm">{item.outcome}</p>
                  </div>

                  <div className="relative h-40 shrink-0 overflow-hidden border-t border-navy-700 bg-navy-900">
                    <BrandFigure
                      name={FIGURES[index % FIGURES.length]}
                      className="absolute top-1/2 left-1/2 w-[150%] -translate-x-1/2 -translate-y-1/2 opacity-60"
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/*
            Inside the arc layer, not beside it. That is the fix: the arc is a
            stacking context, so this badge is sealed within it and cannot paint
            over the centre card whatever its own z-index says.
          */}
          {badge && (
            <span
              aria-hidden="true"
              style={{ '--badge-x': badge.x + 'px', '--badge-y': badge.y + 'px' } as CSSProperties}
              className="drag-badge pointer-events-none absolute hidden size-20 place-content-center rounded-full border border-amber-500 bg-navy-900/85 text-center font-mono text-label text-amber-500 uppercase backdrop-blur-sm [@media(pointer:fine)]:grid"
            >
              {dragging ? 'Dragging' : 'Drag'}
            </span>
          )}
        </div>

        {/* --- LAYER 2: the centre card. Foreground, z-20. ------------------ */}
        <div className="pointer-events-none relative z-20 flex justify-center">
          <div
            role="tabpanel"
            id={baseId + '-panel'}
            aria-labelledby={baseId + '-tab-' + active}
            tabIndex={0}
            className="showcase-center pointer-events-auto flex w-[min(90vw,38rem)] flex-col overflow-hidden border border-navy-700 bg-navy-800 surface-navy-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500"
          >
            <div className="p-8 lg:p-9">
              <p className="font-mono text-label text-(--accent-text) uppercase">
                {current.confidentialityLabel ?? current.clientDisplayName}
              </p>
              <h3 className="mt-4 font-display text-h3 text-(--ink)">{current.headline}</h3>
              <p className="mt-3 text-body-sm">{current.outcome}</p>

              {isSample && (
                <p className="mt-5 font-mono text-label text-(--ink-muted) uppercase">
                  Sample — not a real engagement
                </p>
              )}

              <div className="mt-7">
                {/*
                  A sample goes to contact, not to a case-study page. Those are
                  Phase 2 and do not exist, and `next/link` would prefetch a 404
                  for every card in the set.
                */}
                <Button
                  href={isSample ? '/contact' : `/case-studies/${current.slug}`}
                  variant="ghost-dark"
                >
                  {isSample ? 'Ask about work like this' : 'Read the case study'}
                </Button>
              </div>
            </div>

            <div className="relative h-44 shrink-0 overflow-hidden border-t border-navy-700 bg-navy-900 lg:h-52">
              <BrandFigure
                name={FIGURES[active % FIGURES.length]}
                className="absolute top-1/2 left-1/2 w-[150%] -translate-x-1/2 -translate-y-1/2 opacity-60"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- LAYER 3: the rail. Separate, continuous, pauses on hover. ------ */}
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
