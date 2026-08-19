'use client'

import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { Headline } from '@/components/shared/Headline'
import { SectionShell, type Canvas } from '@/components/shared/SectionShell'
import { cn } from '@/lib/utils'

/**
 * PinnedSequence — the pinned-column pattern, docs/04 (new).
 *
 * A sticky left column holding the heading and a progress rail, against a right
 * column of full-height panels that scroll past it. The rail tracks which panel
 * is in view. It is the one section on the site that uses the viewport itself
 * as a mechanism rather than as a container.
 *
 * **Sticky, not pinned.** The reference site pins with ScrollTrigger, which
 * takes the section out of flow, substitutes a spacer, and drives the content
 * from scroll position. It looks the same and it is worse in three ways that
 * matter here: the page's real height stops matching its scroll height so
 * find-in-page lands in the wrong place; anything that receives focus inside a
 * pinned region can be scrolled away from its own focus ring; and it needs
 * JavaScript before the layout is correct at all. `position: sticky` is a
 * two-line CSS equivalent that survives all three, and it works with the
 * runtime switched off.
 *
 * **No panel is dimmed.** The obvious way to show progress is to fade inactive
 * panels, and it is the wrong one — body copy at 45% opacity is body copy below
 * 4.5:1, and a visitor who is reading ahead is reading the thing we just made
 * illegible. Progress is carried by the rail and by a rule that fills amber
 * instead. Nothing that has to be read ever changes contrast.
 *
 * **The rail is not navigation.** It is `aria-hidden`, because the panels
 * beside it already carry the same six labels as an ordered list in the same
 * order. Making it a second set of links would put every stage in the tab order
 * twice to no benefit.
 *
 * Tracking is one IntersectionObserver rather than a ScrollTrigger, so this
 * component keeps working under reduced motion — where the runtime deliberately
 * does nothing — and does not pull GSAP into its chunk.
 */

export type SequenceStep = { title: string; body: string }

export function PinnedSequence({
  eyebrow,
  heading,
  body,
  steps,
  cta,
  canvas = 'navy',
}: {
  eyebrow: string
  heading: string
  body: string
  steps: SequenceStep[]
  cta?: { label: string; href: string }
  canvas?: Canvas
}) {
  const [active, setActive] = useState(0)
  const panelsRef = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const panels = panelsRef.current.filter(Boolean) as HTMLLIElement[]
    if (!panels.length || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = panels.indexOf(entry.target as HTMLLIElement)
          if (index >= 0) setActive(index)
        }
      },
      // A band across the middle of the viewport rather than the whole of it.
      // With the full viewport as the root, three panels are intersecting at
      // once on a tall screen and the rail settles on whichever fired last.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    for (const panel of panels) observer.observe(panel)
    return () => observer.disconnect()
  }, [])

  return (
    <SectionShell canvas={canvas}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-20">
        {/* The column that stays. `h-fit` is what lets sticky engage — a
            stretched grid item is already as tall as the row and has nowhere
            to stick to. */}
        <div className="lg:sticky lg:top-[calc(var(--spacing-header)+4rem)] lg:h-fit">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Headline className="mt-5">{heading}</Headline>
          <p className="mt-5 max-w-measure text-body-lg">{body}</p>

          <ol aria-hidden="true" className="mt-10 hidden lg:block">
            {steps.map((step, index) => (
              <li key={step.title} className="flex items-center gap-4 py-2">
                <span
                  className={cn(
                    'block h-px transition-all duration-(--duration-card) ease-out',
                    index === active ? 'w-10 bg-amber-500' : 'w-5 bg-(--line)',
                  )}
                />
                <span
                  className={cn(
                    'font-mono text-label uppercase transition-colors duration-(--duration-card) ease-out',
                    index === active ? 'text-(--accent-text)' : 'text-(--ink-muted)',
                  )}
                >
                  {String(index + 1).padStart(2, '0')} {step.title}
                </span>
              </li>
            ))}
          </ol>

          {cta && (
            <div className="mt-10">
              <Button href={cta.href} variant="ghost-light">
                {cta.label}
              </Button>
            </div>
          )}
        </div>

        {/* The column that moves. */}
        <ol className="flex flex-col">
          {steps.map((step, index) => (
            <li
              key={step.title}
              ref={(node) => {
                panelsRef.current[index] = node
              }}
              className="flex min-h-[44svh] flex-col justify-center border-t border-(--line) py-10 first:border-t-0 first:pt-0 lg:min-h-[50svh]"
            >
              <p
                className={cn(
                  'font-mono text-label uppercase transition-colors duration-(--duration-card) ease-out',
                  index === active ? 'text-(--accent-text)' : 'text-(--ink-muted)',
                )}
              >
                Stage {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 font-display text-h2 text-(--ink)">{step.title}</h3>
              <p className="mt-4 max-w-measure text-body-lg">{step.body}</p>
              <span
                aria-hidden="true"
                className={cn(
                  'mt-8 block h-0.5 origin-left transition-transform duration-500 ease-out',
                  index === active ? 'scale-x-100 bg-amber-500' : 'scale-x-0 bg-amber-500',
                )}
              />
            </li>
          ))}
        </ol>
      </div>
    </SectionShell>
  )
}
