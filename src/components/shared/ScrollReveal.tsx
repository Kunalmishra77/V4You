'use client'

import { useEffect, useRef, type ElementType, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * ScrollReveal — docs/04 §ScrollReveal, docs/01 §5.
 *
 * Wrap a whole section, never an individual card. Revealing cards one by one is
 * the thing docs/01 §5 explicitly rules out; it turns a page into a slot machine.
 *
 * The transition itself is CSS (see globals.css). All this component does is
 * flip one attribute when the section comes into view, which is why it ships a
 * few hundred bytes of client JavaScript rather than an animation library.
 *
 * Under `prefers-reduced-motion: reduce` the observer is never created and the
 * element is marked shown on mount — and the CSS makes it visible regardless, so
 * the outcome is correct even before hydration. Same for JavaScript being
 * unavailable: the `.no-js` rule in the root layout keeps content visible.
 */
/**
 * One observer shared by every section on the page, rather than one per
 * section.
 *
 * A page with fourteen revealed sections was creating fourteen
 * IntersectionObservers, each with its own callback and its own entry in the
 * browser's intersection bookkeeping. They do the same job with the same
 * options, so they can be the same observer — the callback already receives
 * the target element.
 *
 * Keyed by threshold, because that is the only option a caller can vary.
 */
const observers = new Map<number, IntersectionObserver>()

function getSharedObserver(threshold: number) {
  const existing = observers.get(threshold)
  if (existing) return existing

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute('data-reveal', 'shown')
        // Reveal once. Re-hiding on scroll-up is a gimmick.
        observer.unobserve(entry.target)
      }
    },
    // The bottom inset holds the reveal until the section is meaningfully in
    // view, rather than firing on the first pixel.
    { threshold, rootMargin: '0px 0px -8% 0px' },
  )

  observers.set(threshold, observer)
  return observer
}

export function ScrollReveal({
  children,
  as: Tag = 'div',
  className,
  /** Fraction of the section that must be visible before it reveals. */
  threshold = 0.12,
}: {
  children: ReactNode
  as?: ElementType
  className?: string
  threshold?: number
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = () => el.setAttribute('data-reveal', 'shown')

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      show()
      return
    }

    const observer = getSharedObserver(threshold)
    observer.observe(el)
    return () => observer.unobserve(el)
  }, [threshold])

  return (
    <Tag ref={ref} data-reveal="" className={cn(className)}>
      {children}
    </Tag>
  )
}
