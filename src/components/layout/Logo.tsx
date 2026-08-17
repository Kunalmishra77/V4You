import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

/**
 * The brand lockup. Vector, so it stays crisp at the 34px header mark that
 * docs/08 §1 flagged the supplied raster could not serve.
 *
 * `light` is for navy canvases — the header, the drawer and the footer all are.
 *
 * On small screens the header shows the mark alone rather than the lockup, per
 * docs/08 §1. The full lockup is 3.45:1, so at a height that fits a 64px header
 * the "TECHNOLOGIES" line falls below legible size — it reads as a smudge
 * rather than as type.
 */

const LOCKUP_RATIO = { width: 1706, height: 495 }
const MARK_RATIO = { width: 1069, height: 1069 }

export function Logo({
  variant = 'light',
  className,
  markClassName,
  priority = false,
  href = '/',
  /** Show the mark instead of the lockup below this breakpoint. */
  responsive = false,
}: {
  variant?: 'light' | 'dark'
  className?: string
  markClassName?: string
  priority?: boolean
  href?: string | null
  responsive?: boolean
}) {
  const lockupSrc = variant === 'light' ? '/logo-full-light.svg' : '/logo-full.svg'
  const markSrc = variant === 'light' ? '/logo-mark-light.svg' : '/logo-mark.svg'

  const content = (
    <>
      {responsive && (
        <Image
          src={markSrc}
          {...MARK_RATIO}
          priority={priority}
          alt=""
          aria-hidden="true"
          className={cn('sm:hidden', markClassName)}
        />
      )}
      <Image
        src={lockupSrc}
        {...LOCKUP_RATIO}
        priority={priority}
        // The link already carries the accessible name. Labelling the image too
        // would announce "V4You Technologies" twice.
        alt={href ? '' : 'V4You Technologies'}
        aria-hidden={href ? 'true' : undefined}
        className={cn(responsive && 'max-sm:hidden', className)}
      />
    </>
  )

  if (!href) return content

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center"
      aria-label="V4You Technologies — home"
    >
      {content}
    </Link>
  )
}
