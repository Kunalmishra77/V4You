import { cn } from '@/lib/utils'

/**
 * A visibly labelled placeholder — CLAUDE.md rule 1.
 *
 * "If evidence is missing, render a visibly labelled placeholder state — never
 * a plausible-looking stand-in."
 *
 * This is what that looks like. It is deliberately styled as an editorial note
 * rather than as page content: dashed border, monospace label, and the word
 * "placeholder" in the text. Nobody should be able to mistake it for finished
 * copy, and it should be uncomfortable enough to survive nobody's review.
 *
 * Every instance is a launch blocker. If one of these reaches production, the
 * content quality gate in docs/06 §A4 has failed rather than this component.
 */
export function AwaitingContent({
  what,
  why,
  className,
}: {
  /** What is missing, in the client's terms. */
  what: string
  /** Why it cannot be written without them. */
  why: string
  className?: string
}) {
  return (
    <div className={cn('border-2 border-dashed border-(--ink-muted) p-6 lg:p-8', className)}>
      <p className="font-mono text-label text-(--accent-text) uppercase">
        Placeholder — awaiting client content
      </p>
      <p className="mt-4 max-w-measure font-display text-h3 text-(--ink)">{what}</p>
      <p className="mt-3 max-w-measure text-body-sm">{why}</p>
      <p className="mt-5 max-w-measure text-body-sm text-(--ink-muted)">
        This block is not publishable copy and must not go live. It is here so the gap is visible in
        review rather than filled with something plausible.
      </p>
    </div>
  )
}
