import { cn } from '@/lib/utils'

/**
 * SwapLabel — the masked label swap, docs/01 §5.
 *
 * On hover or focus the label leaves upward while an identical copy arrives
 * from below, both clipped by the span around them. It is the single most
 * repeated interaction on the reference site, and the reason its navigation
 * feels considered where a colour change alone does not.
 *
 * The copy is `aria-hidden`, so the accessible name stays single — the whole
 * effect is one string rendered twice and one of them hidden from the
 * accessibility tree.
 *
 * **Strings only, deliberately.** Duplicating arbitrary children is how a page
 * ends up with two of something focusable, or two elements sharing an id. The
 * type enforces it rather than leaving it to whoever uses this next.
 *
 * The mechanics live in globals.css, keyed off `.swap`, so the parent only has
 * to be an `a`, a `button`, or anything carrying `.group`. Under reduced motion
 * the a11y layer removes the incoming copy from the box entirely, rather than
 * leaving it stacked on the real label with no transition to move it away.
 */
export function SwapLabel({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn('swap', className)}>
      <span data-swap-out="">{children}</span>
      <span data-swap-in="" aria-hidden="true">
        {children}
      </span>
    </span>
  )
}
