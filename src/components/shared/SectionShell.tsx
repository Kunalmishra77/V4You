import type { ElementType, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { ScrollReveal } from './ScrollReveal'

/**
 * SectionShell — docs/04 §7.
 *
 * Every section on the site uses this. It owns three things and nothing else:
 * the canvas, the block padding, and the max content width.
 *
 * Owning the padding in one place is the point. docs/02 §4 names the classic
 * failure — a `.section` rule and an element rule cancelling each other out.
 * There is only one rule here, so there is nothing to cancel.
 *
 * Section rhythm (docs/01 §4): alternate canvas and density so the page
 * breathes without decoration. A high-information section is always followed by
 * a quieter one, and never two dense sections of the same canvas back to back.
 * That sequencing lives in the page, not here — this component just makes each
 * canvas available.
 */

const canvases = {
  navy: 'surface-navy bg-navy-900',
  'navy-800': 'surface-navy-800 bg-navy-800',
  bone: 'surface-bone bg-bone',
  'bone-2': 'surface-bone-2 bg-bone-2',
  white: 'surface-white bg-white',
  amber: 'surface-amber bg-amber-500',
} as const

export type Canvas = keyof typeof canvases

export function SectionShell({
  children,
  canvas = 'bone',
  as: Tag = 'section',
  density = 'default',
  bleed = false,
  reveal = false,
  className,
  innerClassName,
  ...rest
}: {
  children: ReactNode
  canvas?: Canvas
  as?: ElementType
  /** `tight` for strips and bands that sit between two full sections. */
  density?: 'default' | 'tight'
  /** Skip the centred container — for full-bleed content like a marquee. */
  bleed?: boolean
  /**
   * Reveal the section's contents on scroll (docs/01 §5).
   *
   * This lives on SectionShell rather than being left to callers because it is
   * how the "reveal whole sections, never individual cards" rule is enforced —
   * there is no ergonomic way to reveal one card from here.
   *
   * The canvas itself does not fade, only what sits on it. Fading the
   * background would put a visible seam between this section and its neighbour.
   */
  reveal?: boolean
  className?: string
  innerClassName?: string
} & Record<string, unknown>) {
  const inner = bleed ? (
    children
  ) : (
    <div className={cn('mx-auto w-full max-w-content px-gutter', innerClassName)}>{children}</div>
  )

  const content = reveal ? <ScrollReveal>{inner}</ScrollReveal> : inner

  return (
    <Tag
      className={cn(
        canvases[canvas],
        density === 'tight' ? 'py-14 md:py-20' : 'py-section',
        className,
      )}
      {...rest}
    >
      {content}
    </Tag>
  )
}
