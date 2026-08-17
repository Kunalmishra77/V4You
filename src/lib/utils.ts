import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge has to be told about the custom theme, or it guesses wrong.
 *
 * Out of the box it assumes `text-*` is a colour unless the value matches a
 * font-size it recognises. Our type scale is named — `text-body`, `text-h2`,
 * `text-label` — so `cn('text-navy-900', 'text-body')` was treated as two
 * colours in conflict and dropped the first. That silently produced an amber
 * button with slate-300 text at roughly 1.5:1, which is exactly the class of
 * bug the contrast rules exist to prevent, arriving through a utility function
 * rather than through a styling decision.
 *
 * The namespaces below mirror the `@theme` blocks in globals.css. Anything
 * added there needs adding here.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      // --text-* (docs/01 §3)
      text: ['display', 'h1', 'h2', 'h3', 'body-lg', 'body', 'body-sm', 'label', 'metric'],
      // --spacing-* (docs/01 §4)
      spacing: ['gutter', 'section', 'notch'],
      // --container-*
      container: ['content', 'measure', 'headline'],
    },
  },
})

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
