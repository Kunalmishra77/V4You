import type { ElementType, ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * ScrollReveal — docs/04 §ScrollReveal, docs/01 §5.
 *
 * Wrap a whole section, never an individual card. Revealing cards one by one is
 * the thing docs/01 §5 explicitly rules out; it turns a page into a slot
 * machine.
 *
 * This used to carry an IntersectionObserver. It no longer carries anything —
 * it is a plain server component that emits two attributes, and `MotionProvider`
 * picks every one of them up in a single `ScrollTrigger.batch`. That is a
 * better arrangement than it sounds:
 *
 *   - Sections that cross the trigger line in the same frame now animate as one
 *     group. With an observer per section they fired in whatever order the
 *     callbacks happened to queue, which on a fast scroll was visible.
 *   - A page with fourteen revealed sections used to ship fourteen client
 *     component boundaries. It now ships none.
 *   - The hidden state is still server-rendered CSS, so there is no flash of
 *     content being hidden after hydration.
 *
 * The failure mode that arrangement creates — the runtime never mounts and the
 * page stays blank below the fold — is handled by the failsafe timer in the
 * root layout, not by hoping it does not happen.
 */
export function ScrollReveal({
  children,
  as: Tag = 'div',
  className,
  /**
   * Stagger the section's contents instead of moving the section as a whole.
   *
   * The trigger is unchanged — one batch, one firing, everything committed at
   * the same instant. Children marked `data-reveal-child` then arrive a step
   * apart rather than in unison. docs/01 §5 rules out cards that wait for their
   * own scroll position, and this is not that: nothing here waits on anything
   * but the section.
   *
   * The wrapper stops moving when this is set, because a child would otherwise
   * carry both its own transform and its parent's and land twice.
   */
  stagger = false,
}: {
  children: ReactNode
  as?: ElementType
  className?: string
  stagger?: boolean
}) {
  return (
    <Tag
      data-reveal=""
      data-reveal-group={stagger ? '' : undefined}
      className={cn(className)}
    >
      {children}
    </Tag>
  )
}
