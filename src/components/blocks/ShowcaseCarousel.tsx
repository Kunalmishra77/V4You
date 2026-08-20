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
import { Eyebrow } from '@/components/shared/Eyebrow'
import { Headline } from '@/components/shared/Headline'
import { SectionShell, type Canvas } from '@/components/shared/SectionShell'
import { cn } from '@/lib/utils'

/**
 * ShowcaseCarousel — the 3D card stage, modelled on the reference site's work
 * showcase.
 *
 * A row of name pills sits above a stage. The selected card faces the reader;
 * its neighbours sit back and to the side, tilted. Dragging sideways moves
 * through them, the pills follow, and a badge saying DRAG rides the pointer
 * whenever it is over the stage.
 *
 * **The ARIA tab pattern, with a carousel drawn on top.** The pills are a real
 * `tablist`, the front card is its `tabpanel`, arrow keys move between them and
 * a roving tabindex means Tab reaches the content rather than walking every
 * pill first. Dragging and the two arrow buttons are additions to that, never a
 * replacement: everything reachable by dragging is reachable by keyboard.
 * The reference's own version is drag-and-click only, which is unusable without
 * a pointer.
 *
 * **Only the front card is in the accessibility tree.** The cards either side
 * are previews of content that is one keystroke away, so announcing all five at
 * once would read as five copies of the same section. They are `aria-hidden`
 * and inert; the front one is the panel.
 *
 * **No animation library.** Position, rotation and depth come from one custom
 * property per card and a single transition. The state driving them is React's
 * already, so a tween would only be duplicating it — and it means the whole
 * thing honours `prefers-reduced-motion` through the stylesheet rather than
 * through a check in here.
 */

export function ShowcaseCarousel({
  eyebrow,
  heading,
  body,
  items,
  isSample = false,
  canvas = 'navy',
}: {
  eyebrow: string
  heading: string
  body?: string
  items: CaseStudyCard[]
  isSample?: boolean
  canvas?: Canvas
}) {
  const [active, setActive] = useState(0)
  const [badge, setBadge] = useState<{ x: number; y: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const baseId = useId()
  const stageRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const drag = useRef({ active: false, startX: 0 })

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

  // --- Drag -----------------------------------------------------------------
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    // Touch already swipes the page; hijacking it makes the section a trap.
    if (event.pointerType !== 'mouse' || !stageRef.current) return
    // Capture, or the gesture dies the moment the cursor crosses the stage edge
    // — which on a stage you drag sideways is most of the time.
    stageRef.current.setPointerCapture(event.pointerId)
    drag.current = { active: true, startX: event.clientX }
    setDragging(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && stageRef.current) {
      const box = stageRef.current.getBoundingClientRect()
      setBadge({ x: event.clientX - box.left, y: event.clientY - box.top })
    }
    if (!drag.current.active) return

    const delta = event.clientX - drag.current.startX

    // One card per 140px of travel, committed as the threshold is crossed
    // rather than on release. Waiting for release makes a long drag feel like
    // it did nothing until you let go.
    if (Math.abs(delta) > 140) {
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

  // Escape releases a drag left stranded by a lost pointerup — a real case when
  // the pointer leaves the window mid-gesture.
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

        {/*
          The pills are the real control. Scrollable rather than wrapping, so a
          long set stays one row and the selected pill can be scrolled to rather
          than the row growing taller as the section fills up.
        */}
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
        // The cards carry no links, but a drag across text starts a selection
        // and a drag across anything draggable starts the browser's own
        // drag-and-drop — either one cancels the pointer stream mid-gesture.
        onDragStart={(event) => event.preventDefault()}
        className={cn(
          'showcase-stage relative mt-12 min-h-[24rem] select-none lg:min-h-[27rem]',
          dragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
      >
        {badge && (
          <span
            aria-hidden="true"
            style={{ '--badge-x': badge.x + 'px', '--badge-y': badge.y + 'px' } as CSSProperties}
            className="drag-badge pointer-events-none absolute z-30 hidden border border-amber-500 bg-navy-900/80 px-3 py-1.5 font-mono text-label text-amber-500 uppercase backdrop-blur-sm [@media(pointer:fine)]:block"
          >
            {dragging ? 'Dragging' : 'Drag'}
          </span>
        )}

        {items.map((item, index) => {
          const offset = index - active
          const isFront = offset === 0
          const panelProps = isFront
            ? {
                role: 'tabpanel',
                id: baseId + '-panel',
                'aria-labelledby': baseId + '-tab-' + index,
              }
            : { 'aria-hidden': true as const, inert: true }

          return (
            // A `div`, not an `article`. `article` carries an implicit role
            // that `tabpanel` is not allowed to override — axe flags it as
            // `aria-allowed-role`, and a browser resolving the conflict its own
            // way is exactly the ambiguity that rule exists to prevent.
            <div
              key={item.slug}
              {...panelProps}
              style={{ '--offset': offset } as CSSProperties}
              className="showcase-card absolute inset-x-0 top-0 mx-auto w-[min(88vw,34rem)] border border-navy-700 bg-navy-800 p-8 surface-navy-800 lg:p-10"
            >
              <p className="font-mono text-label text-(--accent-text) uppercase">
                {item.confidentialityLabel ?? item.clientDisplayName}
              </p>
              <h3 className="mt-5 font-display text-h2 text-(--ink)">{item.headline}</h3>
              <p className="mt-4 text-body">{item.outcome}</p>
              {isSample && (
                <p className="mt-6 border-t border-navy-700 pt-4 font-mono text-label text-(--ink-muted) uppercase">
                  Sample — not a real engagement
                </p>
              )}
            </div>
          )
        })}
      </div>
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
