'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

/**
 * StickyContextualNav — docs/05 §4–10, blueprint §15.7.
 *
 * A sub-navigation that appears after the hero and tracks scroll position
 * through a long page. docs/05 calls it required on service pages, and the
 * reason is length: thirteen blocks is more than anyone will scroll through
 * hoping the section they want is further down.
 *
 * The active section is decided by an IntersectionObserver rather than by
 * comparing scroll offsets on every frame — the observer fires only when
 * something crosses the boundary, so this costs nothing while idle.
 *
 * `rootMargin` puts the detection line near the top of the viewport, under the
 * sticky header. Without it the observer reports whichever section fills the
 * most screen, which lags the heading a reader is actually looking at.
 *
 * Anchor links, not buttons: each one is a real URL that can be copied, shared
 * and opened directly. The click handler only smooths the scroll.
 */

export type NavSection = { id: string; label: string }

export function StickyContextualNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-88px 0px -70% 0px', threshold: 0 },
    )

    for (const section of sections) {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [sections])

  // Keep the active item in view when the list itself scrolls horizontally.
  useEffect(() => {
    const current = listRef.current?.querySelector<HTMLElement>('[data-active="true"]')
    current?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [active])

  return (
    <nav
      aria-label="On this page"
      className="sticky top-16 z-30 border-y border-navy-700 bg-navy-900 surface-navy"
    >
      <div className="mx-auto w-full max-w-content px-gutter">
        <ul ref={listRef} className="flex [scrollbar-width:none] gap-1 overflow-x-auto py-1">
          {sections.map((section) => {
            const isActive = section.id === active
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  data-active={isActive}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'inline-block border-b-2 px-4 py-3 font-display text-body-sm font-medium whitespace-nowrap transition-colors',
                    isActive
                      ? 'border-amber-500 text-bone'
                      : 'border-transparent text-slate-300 hover:text-bone',
                  )}
                >
                  {section.label}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
