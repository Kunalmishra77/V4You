import { Fragment, type ElementType, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Headline — the masked line reveal, docs/01 §5.
 *
 * Every section heading on the site goes through this. At runtime SplitText
 * measures where the heading actually wraps, wraps each visual line in its own
 * clipping box, and each line climbs into it from below, staggered, when the
 * heading scrolls into view.
 *
 * This component emits almost nothing — a heading with `data-split` on it. The
 * split is deliberately not authored, because a heading's line breaks are a
 * function of its rendered width and nothing else. A break placed by hand for
 * 1440px is wrong at 380px and at every width in between, and it is wrong again
 * the moment the copy is edited in the CMS. SplitText measures instead, and
 * re-measures on resize and after the webfont lands.
 *
 * **A newline in the copy still means something.** It becomes a hard `<br>` —
 * an editorial break the author wants at every width, like separating two
 * clauses. SplitText respects it and treats each side as its own line. Use it
 * for meaning, never for fit.
 *
 * **Accessibility.** SplitText's wrappers are presentational and carry no
 * roles, so the accessible name is unchanged and a screen reader announces one
 * heading. Under reduced motion SplitText never runs at all — the heading is
 * plain text that was never touched.
 *
 * **Failure mode.** If the motion runtime never loads, the heading is ordinary
 * markup and renders normally. There is no `visibility: hidden` waiting on a
 * script, which is the usual way this effect takes a page down with it.
 */

const sizes = {
  h1: 'font-display text-h1',
  h2: 'font-display text-h2',
  h3: 'font-display text-h3',
  h4: 'font-display text-h4',
} as const

export function Headline({
  children,
  as: Tag = 'h2',
  size = 'h2',
  className,
  ...rest
}: {
  /**
   * Heading copy. A newline becomes a hard editorial break.
   *
   * Interpolated copy — a sector name spliced into a sentence — arrives as a
   * node array rather than a string and is passed through untouched. It still
   * splits, because SplitText measures the rendered result and does not care
   * how the text got there.
   */
  children: ReactNode
  as?: ElementType
  size?: keyof typeof sizes
  className?: string
} & Record<string, unknown>) {
  return (
    <Tag
      data-split=""
      className={cn('max-w-headline text-(--ink)', sizes[size], className)}
      {...rest}
    >
      {typeof children === 'string'
        ? children.split('\n').map((line, index) => (
            <Fragment key={`${index}-${line}`}>
              {index > 0 && <br />}
              {line}
            </Fragment>
          ))
        : children}
    </Tag>
  )
}
