'use client'

import Link from 'next/link'
import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'

import { CutCard } from '@/components/shared/CutCard'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'

/**
 * CaseStudyRail — docs/04 §16, docs/06 §C2.
 *
 * A drag-to-browse horizontal rail. The important constraint: **drag is an
 * enhancement, never the only way through.** The rail is a native
 * overflow-scroll container with scroll-snap, so it is already scrollable by
 * wheel, trackpad, touch and keyboard before any of this JavaScript runs. The
 * pointer handlers add mouse-dragging on top; removing them would cost the
 * feature, not the function.
 *
 * Each card is a normal focusable link, so tabbing through the rail scrolls it
 * natively — no roving tabindex, no key handlers, no reimplementation of
 * something the platform does correctly.
 *
 * Empty state is **explain**, not omit or substitute — docs/04's third
 * behaviour, chosen here because the absence is itself informative: studies
 * publish on client approval, and saying so is more credible than a section
 * that quietly does not exist.
 *
 * **The drag badge follows the pointer; the system cursor stays.** The
 * reference site hides the native cursor and draws its own. That looks good and
 * it quietly breaks anyone who has set a larger or higher-contrast pointer in
 * their OS — a setting people choose because they need it, not because they
 * like it. So the rail keeps a real `grab` / `grabbing` cursor and the badge
 * rides alongside as decoration. Nothing is taken away, and the affordance is
 * still unmistakable.
 *
 * The badge only exists for a fine pointer. On touch there is no hover state to
 * follow, and the rail already pans with a finger.
 *
 * **Sample mode** puts a visible badge on every card. It is not styling — a
 * placeholder study that looks like a real one is exactly the failure
 * `CLAUDE.md` rule 1 describes, so the label is part of the component rather
 * than something a caller can forget.
 */

export type CaseStudyCard = {
  slug: string
  clientDisplayName: string
  industry: string
  headline: string
  outcome: string
  confidentialityLabel?: string
}

export function CaseStudyRail({
  studies,
  /** Marks every card as placeholder content. See `src/lib/sample-content.ts`. */
  isSample = false,
}: {
  studies: CaseStudyCard[]
  isSample?: boolean
}) {
  const railRef = useRef<HTMLUListElement>(null)
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 })
  const [dragging, setDragging] = useState(false)
  const [badge, setBadge] = useState<{ x: number; y: number } | null>(null)

  const onPointerDown = (event: PointerEvent<HTMLUListElement>) => {
    // Touch and pen already pan natively; hijacking them makes it worse.
    if (event.pointerType !== 'mouse' || !railRef.current) return

    // Capture the pointer for the duration of the drag. Without it the whole
    // gesture dies the moment the cursor crosses the rail's edge — which on a
    // rail you drag sideways is most of the time — because `pointerleave` fires
    // and takes the drag state with it.
    railRef.current.setPointerCapture(event.pointerId)

    drag.current = {
      active: true,
      startX: event.clientX,
      startScroll: railRef.current.scrollLeft,
      moved: 0,
    }
    setDragging(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType === 'mouse' && railRef.current) {
      // Coordinates relative to the rail, so the badge is positioned in the
      // rail's own space and a page scroll cannot leave it behind.
      const box = railRef.current.getBoundingClientRect()
      setBadge({ x: event.clientX - box.left, y: event.clientY - box.top })
    }

    if (!drag.current.active || !railRef.current) return
    const delta = event.clientX - drag.current.startX
    drag.current.moved = Math.abs(delta)
    railRef.current.scrollLeft = drag.current.startScroll - delta
  }

  const endDrag = (event?: PointerEvent<HTMLUListElement>) => {
    if (event && railRef.current?.hasPointerCapture(event.pointerId)) {
      railRef.current.releasePointerCapture(event.pointerId)
    }
    drag.current.active = false
    setDragging(false)
  }

  const leaveRail = (event: PointerEvent<HTMLUListElement>) => {
    endDrag(event)
    setBadge(null)
  }

  if (studies.length === 0) return <CaseStudyEmptyState />

  return (
    <div className="relative">
      {isSample && <SampleNotice />}

      {/*
        A scrolling box has to be reachable by keyboard, and normally this one
        is for free: every card is a link, so tabbing through them scrolls the
        rail natively. Sample cards do not link anywhere, which leaves a
        scrollable region with nothing focusable inside it — reachable by mouse
        and trackpad and by nobody else. axe calls this
        `scrollable-region-focusable`, and it caught it here.

        The fix is to make the container itself focusable in exactly that case.
        A focused scroll container responds to the arrow keys natively, so this
        is one attribute rather than a key handler. It is conditional because
        when the cards *are* links the container would be a redundant extra tab
        stop in front of them.
      */}
      <ul
        ref={railRef}
        tabIndex={isSample ? 0 : undefined}
        aria-label={isSample ? 'Sample case studies, scrollable' : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        // Every card is covered by a link overlay, so a mouse-down anywhere on
        // the rail lands on an `<a>`. Dragging one starts the browser's own
        // link drag-and-drop, which cancels the pointer stream — the rail then
        // never scrolls and the ghost of a URL follows the cursor instead.
        // One `preventDefault` is the difference between the feature working
        // and doing nothing at all.
        onDragStart={(event) => event.preventDefault()}
        onPointerLeave={leaveRail}
        className={cn(
          'relative flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4',
          'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500',
          // Hide the scrollbar only where a drag affordance replaces it.
          '[scrollbar-width:thin]',
          dragging ? 'cursor-grabbing select-none' : 'cursor-grab',
        )}
      >
        {/* Decoration beside the real cursor, never instead of it. */}
        {badge && (
          <span
            aria-hidden="true"
            style={{ '--badge-x': `${badge.x}px`, '--badge-y': `${badge.y}px` } as CSSProperties}
            className={cn(
              'drag-badge pointer-events-none absolute z-10 hidden font-mono text-label uppercase',
              'border border-amber-500 bg-navy-900/80 px-3 py-1.5 text-amber-500 backdrop-blur-sm',
              '[@media(pointer:fine)]:block',
            )}
          >
            {dragging ? 'Dragging' : 'Drag'}
          </span>
        )}

      {studies.map((study) => (
        <CutCard
          as="li"
          key={study.slug}
          interactive={!isSample}
          variant="dark"
          className="w-[min(88vw,22rem)] shrink-0 snap-start p-6"
        >
          <p className="font-mono text-label text-(--accent-text) uppercase">
            {study.confidentialityLabel ?? study.clientDisplayName} · {study.industry}
          </p>
          <h3 className="mt-4 font-display text-h3 text-(--ink)">
            {/*
              A sample card does not link anywhere. Case-study detail pages are
              Phase 2 and do not exist, so `/case-studies/<slug>` is a 404 — and
              because `next/link` prefetches, five of them were being requested
              on every home page load before anyone clicked anything.

              `CLAUDE.md` asks that every CTA have a working destination. The
              honest reading of that for placeholder content is not a link
              pointing somewhere else; it is no link. The card is still a card,
              the sample notice above already says why it goes nowhere, and the
              card drops its interactive treatment so nothing about it invites a
              click it cannot honour.
            */}
            {isSample ? (
              study.headline
            ) : (
              <Link
                href={`/case-studies/${study.slug}`}
                onClick={(event) => {
                  // A drag that ends over a link should not follow it.
                  if (drag.current.moved > 6) event.preventDefault()
                  else track('case_study_view', { slug: study.slug })
                }}
                className="after:absolute after:inset-0 hover:underline hover:underline-offset-4"
              >
                {study.headline}
              </Link>
            )}
          </h3>
          <p className="mt-3 text-body-sm">{study.outcome}</p>

          {isSample && (
            <p className="mt-5 border-t border-(--line) pt-3 font-mono text-label text-(--ink-muted) uppercase">
              Sample — not a real engagement
            </p>
          )}
        </CutCard>
        ))}
      </ul>
    </div>
  )
}

/**
 * The banner above a sample rail.
 *
 * Deliberately loud. A quiet label on placeholder proof is worse than none — it
 * lets a reviewer skim past it and treat the cards as evidence, which is the
 * exact outcome the flag exists to prevent.
 */
function SampleNotice() {
  return (
    <p
      role="note"
      className="mb-8 border-l-2 border-amber-500 bg-navy-800 px-5 py-4 text-body-sm text-bone"
    >
      <strong className="font-display font-semibold">Placeholder content.</strong> These are not
      real engagements and contain no measured results. They exist so this section can be designed
      before client-approved studies arrive, and they render only while{' '}
      <code className="font-mono text-label">NEXT_PUBLIC_SAMPLE_CONTENT=1</code> is set.
    </p>
  )
}

/**
 * The explanatory empty state. It says what would be here and why it is not,
 * which is the honest version of "coming soon".
 */
function CaseStudyEmptyState() {
  return (
    <CutCard variant="dark" className="max-w-measure p-8">
      <p className="font-mono text-label text-(--accent-text) uppercase">
        Proof, when it is ours to share
      </p>
      <p className="mt-4 font-display text-h3 text-(--ink)">
        Case studies publish once the client approves them.
      </p>
      <p className="mt-4 text-body-sm">
        We do not publish anonymous numbers, and we do not name a client before they have agreed to
        it in writing. That means this section fills up more slowly than it could — which is the
        trade we would rather make. If you would like to talk to a reference directly, ask us and we
        will arrange it where the client is willing.
      </p>
      <p className="mt-6">
        <Link
          href="/contact"
          className="font-display text-body-sm font-medium text-(--ink) underline underline-offset-4 hover:text-amber-500"
        >
          Ask about relevant work
        </Link>
      </p>
    </CutCard>
  )
}
