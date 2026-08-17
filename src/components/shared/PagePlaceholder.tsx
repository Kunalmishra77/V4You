import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'
import type { Breadcrumb } from '@/lib/seo'

/**
 * A visibly unfinished page.
 *
 * Phase Gate 1 asks for a shell that is clickable end to end, which means every
 * route in navigation has to resolve. These are those routes before Stage 6
 * builds them.
 *
 * It says so plainly rather than showing lorem ipsum or a plausible-looking
 * draft. CLAUDE.md's first rule is about never inventing proof, and the same
 * logic applies to inventing progress: a page that looks finished and is not
 * costs a review cycle to discover.
 *
 * Every one of these is deleted as its real page lands. If any survive to
 * launch, that is a bug the ticket list will catch.
 */
export function PagePlaceholder({
  title,
  ticket,
  breadcrumbs,
  summary,
}: {
  title: string
  /** The backlog ticket that replaces this, e.g. `T-060`. */
  ticket: string
  breadcrumbs?: Breadcrumb[]
  /** What the finished page will contain, from docs/05. */
  summary?: string
}) {
  return (
    <>
      <SectionShell canvas="navy" as="div">
        {breadcrumbs && (
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <Eyebrow>In build · {ticket}</Eyebrow>
        <h1 className="mt-5 max-w-headline font-display text-h1 text-(--ink)">{title}</h1>
        <p className="mt-6 max-w-measure text-body-lg">
          This page is scaffolded, not written. It exists so the navigation shell can be reviewed
          end to end at Phase Gate 1. {summary}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/book-consultation">Book a transformation consultation</Button>
          <Button href="/services" variant="ghost-dark">
            Explore what we do
          </Button>
        </div>
      </SectionShell>
    </>
  )
}
