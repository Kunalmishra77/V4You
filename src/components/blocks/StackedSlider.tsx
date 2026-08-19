'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'

import { Eyebrow } from '@/components/shared/Eyebrow'
import { Headline } from '@/components/shared/Headline'
import { SectionShell, type Canvas } from '@/components/shared/SectionShell'
import { cn } from '@/lib/utils'

/**
 * StackedSlider — the 3D card stack, modelled on the reference site's
 * `vertical-slider`.
 *
 * A rail of short lines on the left steps through a stack of cards on the
 * right. The active card arrives out of a `perspective` container, tipped back
 * and lifted, and settles flat. Two empty panels sit behind it so the stack
 * reads as a stack rather than a single panel.
 *
 * **It is the ARIA tab pattern, vertically.** The reference does this with
 * `opacity: 0` buttons stacked over the card — invisible hit regions with no
 * accessible name, which is unusable by keyboard and silent to a screen reader.
 * The visual is worth copying; that part is not. Here the rail is a real
 * `tablist` with `aria-orientation="vertical"`, the lines are real buttons
 * named by their card's title, Up and Down move between them, and a roving
 * tabindex means Tab reaches the card rather than walking every line first.
 *
 * **The panels behind carry no text.** The obvious way to build a stack is to
 * render every card and fade the inactive ones back, and it puts real body copy
 * on screen at 25% opacity — well under 4.5:1, and read by nobody. The depth
 * panels are empty and `aria-hidden`; only the active card has content, and it
 * is at full contrast.
 *
 * Under reduced motion the entrance is removed by the a11y layer and the card
 * simply appears — the stack is still a stack, it just does not travel.
 */

export type StackedItem = { title: string; body: string }

export function StackedSlider({
  eyebrow,
  heading,
  body,
  items,
  canvas = 'navy',
}: {
  eyebrow: string
  heading: string
  body: string
  items: StackedItem[]
  canvas?: Canvas
}) {
  const [active, setActive] = useState(0)
  const baseId = useId()
  const cardSurface =
    canvas === 'navy' || canvas === 'navy-800'
      ? 'surface-navy-800 bg-navy-800'
      : 'surface-white bg-white'

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const move = (index: number) => {
    const next = (index + items.length) % items.length
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        move(index + 1)
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        move(index - 1)
        break
      case 'Home':
        event.preventDefault()
        move(0)
        break
      case 'End':
        event.preventDefault()
        move(items.length - 1)
        break
    }
  }

  // Empty state: heading and body, and nothing else. The depth panels are
  // decoration for a card — on their own they are two empty boxes suggesting
  // content that is not coming.
  if (items.length === 0) {
    return (
      <SectionShell canvas={canvas} reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Headline className="mt-5">{heading}</Headline>
        <p className="mt-5 max-w-measure text-body-lg">{body}</p>
      </SectionShell>
    )
  }

  return (
    <SectionShell canvas={canvas} reveal>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <Headline className="mt-5">{heading}</Headline>
          <p className="mt-5 max-w-measure text-body-lg">{body}</p>

          {/* The rail. The reference uses bare 4px lines that scale to show
              position; each line here carries its number and title too. A line
              on its own is a fine progress cue and a poor control — nothing
              tells you where it goes until you have already pressed it, and it
              leaves the tab with no accessible name. */}
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label={heading}
            className="mt-10 flex flex-col gap-1"
          >
            {items.map((item, index) => {
              const selected = index === active
              return (
                <button
                  key={item.title}
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${index}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${index}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className="group flex min-h-11 items-center gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'block h-0.5 shrink-0 transition-all duration-(--duration-card) ease-out',
                      selected
                        ? 'w-10 bg-amber-500'
                        : 'w-5 bg-(--line) group-hover:bg-(--ink-muted)',
                    )}
                  />
                  <span
                    className={cn(
                      'font-mono text-label uppercase transition-colors duration-(--duration-card) ease-out',
                      selected
                        ? 'text-(--accent-text)'
                        : 'text-(--ink-muted) group-hover:text-(--ink)',
                    )}
                  >
                    {String(index + 1).padStart(2, '0')} {item.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* The stack. `perspective` lives here rather than on the card, so the
            vanishing point is the container's centre and every card tips toward
            the same point. */}
        <div className="stack relative min-h-[19rem] lg:min-h-[21rem]">
          {/* Depth. Two empty panels, narrower than the card and extending
              below it, so their bottom edges are what shows. Sitting them at
              the same size as the card hides them behind it entirely, which is
              a stack nobody can see. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-9 top-0 -bottom-7 border border-(--line) opacity-40"
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-4.5 top-0 -bottom-3.5 border border-(--line) opacity-70"
          />

          {items.map((item, index) => (
            <div
              key={item.title}
              role="tabpanel"
              id={`${baseId}-panel-${index}`}
              aria-labelledby={`${baseId}-tab-${index}`}
              hidden={index !== active}
              tabIndex={0}
              className={cn(
                'stack-card relative flex h-full flex-col justify-center border border-(--line) p-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500 lg:p-12',
                // A raised surface, not the canvas. `bg-(--surface)` resolves to
                // the section's own colour, which leaves the card the same shade
                // as everything behind it — the depth panels then have nothing
                // to be behind and the whole stack flattens into a rectangle.
                cardSurface,
              )}
            >
              <p className="font-mono text-label text-(--accent-text) uppercase">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-5 font-display text-h2 text-(--ink)">{item.title}</h3>
              <p className="mt-4 max-w-measure text-body-lg">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
