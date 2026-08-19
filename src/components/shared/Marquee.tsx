import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

/**
 * Marquee — the continuous rail, docs/04 §14.
 *
 * The track is duplicated once in the DOM and translated by exactly -50%, so
 * the copy lands where the original started and the loop is seamless. The copy
 * is `aria-hidden`, so a screen reader hears the list once rather than twice.
 *
 * **Speed is a prop, not a constant.** Two rails running at the same speed read
 * as one rail that wrapped; two at different speeds read as depth. The duration
 * is what changes, never the distance — a marquee's apparent speed is a
 * function of both, and varying the distance would break the -50% loop.
 *
 * **Direction is `animation-direction`, not a second keyframe set.** Both rows
 * share one animation, so they cannot drift apart over a long session.
 *
 * Pauses on hover and on focus-within, so a keyboard user tabbing to a link
 * inside it is not chasing a moving target. Stops entirely under reduced
 * motion, enforced in the a11y layer by removing the animation rather than
 * pausing it. No client JavaScript.
 */
export function Marquee({
  items,
  /** Seconds for one full pass. Higher is slower. */
  duration = 42,
  direction = 'forward',
  gap = 'gap-10',
  className,
  itemClassName,
}: {
  items: readonly string[]
  duration?: number
  direction?: 'forward' | 'reverse'
  gap?: string
  className?: string
  itemClassName?: string
}) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className={cn('flex shrink-0', gap)}>
      {items.map((item) => (
        <li key={item} className={cn('whitespace-nowrap', itemClassName)}>
          {item}
        </li>
      ))}
    </ul>
  )

  return (
    <div className={cn('marquee group relative overflow-hidden', className)}>
      <div
        className={cn('marquee-track flex w-max', gap)}
        data-direction={direction === 'reverse' ? 'reverse' : undefined}
        style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
