import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

/**
 * Typewriter — a line that types itself out, with no client JavaScript.
 *
 * The reference site uses this exactly once, and once is right. A line that
 * types is arresting the first time and an obstacle every time after, because
 * it withholds text the reader is already trying to read. So it belongs on a
 * label, never on the headline or the body — and this component is deliberately
 * awkward to put on a paragraph, because it clips to one line.
 *
 * **Monospace only.** The reveal is a `steps()` animation on the width of a
 * clipping box, so the edge lands between characters only when every character
 * is the same width. On a proportional face it exposes half a letterform at a
 * time and reads as a rendering fault. The eyebrow is already mono, which is
 * why that is where this goes.
 *
 * **The text is never withheld from anyone but a sighted reader watching it
 * arrive.** What animates is the container's width; the text inside is ordinary
 * text from first paint, at full contrast, and a screen reader does not consult
 * the width of a box before reading its contents. There is no per-character DOM
 * churn, nothing to hydrate, and nothing that fails.
 *
 * Under reduced motion the line is simply present and the caret is removed —
 * a caret that blinks is a permanently moving element, which is the thing that
 * preference exists to stop.
 */
export function Typewriter({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn('typewriter', className)}
      // The character count drives both the duration and the step count, so it
      // has to be the real length of this string rather than an estimate — a
      // wrong value leaves the reveal stopping short of the last letter.
      style={{ '--type-chars': children.length } as CSSProperties}
    >
      {children}
    </span>
  )
}
