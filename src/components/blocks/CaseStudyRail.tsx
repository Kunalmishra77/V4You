'use client'

import Link from 'next/link'
import { useRef, useState, type PointerEvent } from 'react'

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
 */

export type CaseStudyCard = {
  slug: string
  clientDisplayName: string
  industry: string
  headline: string
  outcome: string
  confidentialityLabel?: string
}

export function CaseStudyRail({ studies }: { studies: CaseStudyCard[] }) {
  const railRef = useRef<HTMLUListElement>(null)
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 })
  const [dragging, setDragging] = useState(false)

  const onPointerDown = (event: PointerEvent<HTMLUListElement>) => {
    // Touch and pen already pan natively; hijacking them makes it worse.
    if (event.pointerType !== 'mouse' || !railRef.current) return
    drag.current = {
      active: true,
      startX: event.clientX,
      startScroll: railRef.current.scrollLeft,
      moved: 0,
    }
    setDragging(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    if (!drag.current.active || !railRef.current) return
    const delta = event.clientX - drag.current.startX
    drag.current.moved = Math.abs(delta)
    railRef.current.scrollLeft = drag.current.startScroll - delta
  }

  const endDrag = () => {
    drag.current.active = false
    setDragging(false)
  }

  if (studies.length === 0) return <CaseStudyEmptyState />

  return (
    <ul
      ref={railRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      className={cn(
        'flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4',
        // Hide the scrollbar only where a drag affordance replaces it.
        '[scrollbar-width:thin]',
        dragging && 'cursor-grabbing select-none',
      )}
    >
      {studies.map((study) => (
        <CutCard
          as="li"
          key={study.slug}
          interactive
          variant="dark"
          className="w-[min(88vw,22rem)] shrink-0 snap-start p-6"
        >
          <p className="font-mono text-label text-(--accent-text) uppercase">
            {study.confidentialityLabel ?? study.clientDisplayName} · {study.industry}
          </p>
          <h3 className="mt-4 font-display text-h3 text-(--ink)">
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
          </h3>
          <p className="mt-3 text-body-sm">{study.outcome}</p>
        </CutCard>
      ))}
    </ul>
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
