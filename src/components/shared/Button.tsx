import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Button — docs/04 §Utility, docs/01 §2 and §5.
 *
 * Three structural decisions worth understanding before editing this file.
 *
 * 1. The clip lives on a child, never on the host. `clip-path` clips the focus
 *    outline along with everything else, so a clipped host would have its ring
 *    sliced off at both cut corners. The host stays a plain box and owns the
 *    ring; a positioned child carries the shape.
 *
 * 2. The 1px edge is two stacked clipped layers, not a `border`. A border on a
 *    clipped element is cut away along the diagonals, leaving the shape open at
 *    exactly the two corners the brand is built around. Instead an outer layer
 *    paints the line colour and an inner layer, inset by 1px, paints the
 *    surface — so the edge follows the 45° cut the whole way round.
 *
 * 3. Ghost variants are canvas-driven. They read `--surface`, `--ink` and
 *    `--ink-muted` from the enclosing canvas (globals.css), so the same button
 *    is correct on bone, on white and on navy without being told where it is.
 *    That also keeps the outline at or above the 3:1 required of a UI border:
 *    slate-500 on bone is 4.95:1, slate-300 on navy is 6.60:1. The canvas
 *    `--line` token is deliberately *not* used here — #DEDCD4 on bone is
 *    roughly 1.15:1, which is fine for a divider and far too weak for a control.
 */

const button = cva(
  [
    'group relative isolate inline-flex min-h-11 items-center justify-center gap-2',
    'px-6 py-3 text-center font-display text-body-sm font-semibold',
    'transition-[transform,color] duration-(--duration-button) ease-out',
    'hover:-translate-y-0.5 active:translate-y-0',
    'disabled:pointer-events-none disabled:opacity-55',
  ],
  {
    variants: {
      variant: {
        /** Amber fill, navy label — 7.72:1, the strongest pairing in the brand. */
        primary: 'text-navy-900',
        /** Navy fill, bone label — 15.30:1. Also the CTA band's button on amber. */
        navy: 'text-bone',
        /**
         * Outlined. `ghost-light` and `ghost-dark` are kept as separate names
         * because docs/04 lists both, but they share one canvas-driven
         * implementation — the canvas already knows which it is.
         */
        'ghost-light': 'text-(--ink) hover:text-(--surface)',
        'ghost-dark': 'text-(--ink) hover:text-(--surface)',
      },
      size: {
        md: '',
        lg: 'min-h-13 px-8 py-4 text-body',
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md', block: false },
  },
)

type Variant = NonNullable<VariantProps<typeof button>['variant']>

/** The filled shape behind the label, one entry per variant. */
const fills: Record<Variant, string> = {
  primary: 'bg-amber-500 group-hover:bg-amber-600',
  navy: 'bg-navy-900 group-hover:bg-navy-800',
  'ghost-light': 'bg-(--ink-muted) group-hover:bg-(--ink)',
  'ghost-dark': 'bg-(--ink-muted) group-hover:bg-(--ink)',
}

const isGhost = (variant: Variant) => variant === 'ghost-light' || variant === 'ghost-dark'

type ButtonBaseProps = VariantProps<typeof button> & {
  children: ReactNode
  className?: string
  /** Rendered before the label. Decorative — keep it `aria-hidden`. */
  icon?: ReactNode
}

type ButtonAsLink = ButtonBaseProps & {
  href: string
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'color'>

type ButtonAsButton = ButtonBaseProps & {
  href?: undefined
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>

export type ButtonProps = ButtonAsLink | ButtonAsButton

function Shape({ variant }: { variant: Variant }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'cut-button absolute inset-0 -z-10 transition-colors duration-(--duration-button) ease-out',
        fills[variant],
      )}
    >
      {isGhost(variant) && (
        <span className="cut-button absolute inset-px bg-(--surface) transition-opacity duration-(--duration-button) ease-out group-hover:opacity-0" />
      )}
    </span>
  )
}

/**
 * Renders an `<a>` when `href` is present and a `<button>` otherwise — never a
 * `<div>` with an onClick. Internal hrefs route through `next/link`.
 */
export function Button(props: ButtonProps) {
  const { variant, size, block, className, children, icon, ...rest } = props
  const resolved: Variant = variant ?? 'primary'
  const classes = cn(button({ variant: resolved, size, block }), className)
  const content = (
    <>
      <Shape variant={resolved} />
      {icon}
      <span>{children}</span>
    </>
  )

  if ('href' in rest && typeof rest.href === 'string') {
    const { href, ...anchorProps } = rest as ButtonAsLink
    const isInternal = href.startsWith('/') || href.startsWith('#')

    if (isInternal) {
      return (
        <Link href={href} className={classes} {...anchorProps}>
          {content}
        </Link>
      )
    }

    return (
      <a href={href} className={classes} rel="noopener noreferrer" {...anchorProps}>
        {content}
      </a>
    )
  }

  const { type = 'button', ...buttonProps } = rest as ButtonAsButton
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  )
}
