import type { ElementType, ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Eyebrow — docs/04 §Utility, docs/01 §2 use 3.
 *
 * A section label preceded by the 16px amber slash glyph, never a bullet. The
 * glyph is `aria-hidden`; it carries no meaning a screen reader needs.
 *
 * The label colour comes from `--accent-text`, which each surface defines. That
 * is what makes rule 3 in CLAUDE.md structural rather than a convention: on a
 * light canvas the token resolves to amber-ink (#7A4F06, 6.53:1), never to
 * amber-500, which is 1.98:1 on bone.
 *
 * The glyph reads `--accent-glyph` instead, because docs/01 §1 permits amber as
 * a *shape* on light canvases even where it is banned as text. The two are only
 * different on the amber CTA band, where an amber glyph would vanish.
 */
export function Eyebrow({
  children,
  as: Tag = 'p',
  className,
  ...rest
}: {
  children: ReactNode
  as?: ElementType
  className?: string
} & Record<string, unknown>) {
  return (
    <Tag
      className={cn('flex items-center gap-3 font-mono text-label uppercase', className)}
      {...rest}
    >
      <span aria-hidden="true" className="block size-4 shrink-0 bg-(--accent-glyph) cut-slash" />
      <span className="text-(--accent-text)">{children}</span>
    </Tag>
  )
}
