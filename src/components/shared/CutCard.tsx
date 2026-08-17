import type { ElementType, ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * CutCard — docs/04 §CutCard, docs/01 §2 use 1.
 *
 * The base card primitive. A 22px clipped top-right corner, a 1px edge that
 * follows the cut, and an amber triangle that fades into the notch on hover.
 *
 * Built the same way as Button, for the same reasons: the host is unclipped so
 * that a focus ring inside it is never sliced off, and the 1px edge is two
 * stacked clipped layers rather than a `border`, which a clip-path would cut
 * open along the diagonal.
 *
 * The card adopts a `surface-*` utility so everything inside it — ghost
 * buttons, eyebrows, body copy — resolves against the card's own surface rather
 * than the section behind it.
 *
 * Empty state: a card with nothing in it is a bug in the caller, not a state
 * this component handles. Components that may have no data omit the card (see
 * the empty-state policy in docs/04).
 */

const surfaces = {
  /** White on bone. The default card on a light section. */
  light: { vars: 'surface-white', fill: 'bg-white' },
  /** navy-800 on navy. */
  dark: { vars: 'surface-navy-800', fill: 'bg-navy-800' },
} as const

export function CutCard({
  children,
  variant = 'light',
  as: Tag = 'div',
  interactive = false,
  className,
  ...rest
}: {
  children: ReactNode
  variant?: keyof typeof surfaces
  as?: ElementType
  /**
   * Adds the hover lift and the notch fill. Set this when the whole card is a
   * link or a control — not on a static card, where movement without a target
   * reads as a glitch.
   */
  interactive?: boolean
  className?: string
} & Record<string, unknown>) {
  const surface = surfaces[variant]

  return (
    <Tag
      className={cn(
        'group relative isolate',
        surface.vars,
        interactive &&
          'transition-transform duration-(--duration-card) ease-out hover:-translate-y-1',
        className,
      )}
      {...rest}
    >
      {/* Edge, then fill. Both clipped, the fill inset by 1px. */}
      <span aria-hidden="true" className={cn('cut-card absolute inset-0 -z-10 bg-(--line)')}>
        <span className={cn('cut-card absolute inset-px', surface.fill)} />
      </span>

      {/* The notch. A sibling, because the card's own clip would remove it. */}
      {interactive && (
        <span
          aria-hidden="true"
          className="notch-fill absolute top-0 right-0 -z-10 size-notch bg-amber-500 opacity-0 transition-opacity duration-(--duration-card) ease-out group-hover:opacity-100"
        />
      )}

      {children}
    </Tag>
  )
}
