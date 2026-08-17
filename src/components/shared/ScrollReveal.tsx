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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        show()
        observer.disconnect() // Reveal once. Re-hiding on scroll-up is a gimmick.
      },
      // The bottom inset holds the reveal until the section is meaningfully in
      // view, rather than firing on the first pixel.
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <Tag ref={ref} data-reveal="" className={cn(className)}>
      {children}
    </Tag>
  )
}
