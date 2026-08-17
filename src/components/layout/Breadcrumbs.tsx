import Link from 'next/link'

import { JsonLd } from '@/components/shared/JsonLd'
import { breadcrumbSchema, type Breadcrumb } from '@/lib/seo'

/**
 * Breadcrumbs — docs/04 §6, docs/06 §A2.
 *
 * Used on any route deeper than one level, and emits `BreadcrumbList` JSON-LD
 * from the same array that renders the trail, so the two cannot disagree.
 *
 * The last item is the current page: rendered as text with `aria-current`
 * rather than as a link to itself, which is a well-known screen-reader
 * annoyance and adds a self-referential link to every deep page.
 */
export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  if (items.length < 2) return null

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(items)]} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-label uppercase">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li key={item.path} className="flex items-center gap-2">
                {isLast ? (
                  <span aria-current="page" className="text-(--ink-muted)">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="text-(--accent-text) transition-colors hover:underline hover:underline-offset-4"
                  >
                    {item.name}
                  </Link>
                )}
                {!isLast && (
                  <span aria-hidden="true" className="text-(--ink-muted) opacity-60">
                    /
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
