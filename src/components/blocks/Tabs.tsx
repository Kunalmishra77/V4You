'use client'

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * The tab mechanics shared by CapabilityTabs and IndustryTabs — docs/04 §21–22,
 * docs/06 §C2.
 *
 * The full ARIA tab pattern: `role="tablist"` / `tab` / `tabpanel`,
 * `aria-selected`, arrow-key navigation and a roving tabindex. Roving tabindex
 * is the part people skip — without it, Tab walks through every tab in the list
 * before reaching the panel, which for eleven industries means eleven stops to
 * get to the content.
 *
 * Home and End jump to the ends, and the list wraps, both of which the WAI-ARIA
 * authoring practices specify and which cost nothing to honour.
 *
 * Below 700px docs/04 §21 replaces the tablist with a native `<select>`. That
 * is not a downgrade — on a phone a native picker is a better control than a
 * horizontally scrolling strip of eleven tabs, and it comes with the platform's
 * own accessibility for free.
 */

export type TabItem = {
  id: string
  label: string
  panel: ReactNode
}

export function Tabs({
  items,
  selectLabel,
  className,
}: {
  items: TabItem[]
  /** The accessible label for the mobile `<select>`. */
  selectLabel: string
  className?: string
}) {
  const [active, setActive] = useState(0)
  const baseId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const tabId = (index: number) => `${baseId}-tab-${items[index].id}`
  const panelId = (index: number) => `${baseId}-panel-${items[index].id}`

  const focusTab = (index: number) => {
    const next = (index + items.length) % items.length
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        focusTab(index + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        focusTab(index - 1)
        break
      case 'Home':
        event.preventDefault()
        focusTab(0)
        break
      case 'End':
        event.preventDefault()
        focusTab(items.length - 1)
        break
    }
  }

  return (
    <div className={cn(className)}>
      {/* Mobile: a native picker. */}
      <div className="min-[700px]:hidden">
        <label htmlFor={`${baseId}-select`} className="sr-only">
          {selectLabel}
        </label>
        <select
          id={`${baseId}-select`}
          value={items[active].id}
          onChange={(event) => setActive(items.findIndex((item) => item.id === event.target.value))}
          className="w-full border border-(--line) bg-(--surface) px-4 py-3 font-display text-body font-medium text-(--ink)"
        >
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop: the tab pattern. */}
      <div
        role="tablist"
        aria-label={selectLabel}
        className="flex flex-wrap gap-x-1 gap-y-2 border-b border-(--line) max-[699px]:hidden"
      >
        {items.map((item, index) => {
          const selected = index === active
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              type="button"
              role="tab"
              id={tabId(index)}
              aria-selected={selected}
              aria-controls={panelId(index)}
              // Roving tabindex: only the active tab is in the tab order.
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                'relative -mb-px min-h-11 border-b-2 px-4 py-3 font-display text-body-sm font-medium transition-colors',
                selected
                  ? 'border-amber-500 text-(--ink)'
                  : 'border-transparent text-(--ink-muted) hover:text-(--ink)',
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {items.map((item, index) => (
        <div
          key={item.id}
          role="tabpanel"
          id={panelId(index)}
          aria-labelledby={tabId(index)}
          hidden={index !== active}
          // Panels are focusable so that Tab from the active tab lands on the
          // content rather than skipping past it to the next control.
          tabIndex={0}
          className="pt-10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500"
        >
          {item.panel}
        </div>
      ))}
    </div>
  )
}
