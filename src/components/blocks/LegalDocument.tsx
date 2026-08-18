import { HeroPage } from '@/components/blocks/HeroPage'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'
import type { LegalDocument as LegalDocumentContent } from '@/seed/legal'

/**
 * The shared legal page template.
 *
 * Two things it does that a plain prose renderer would not:
 *
 * **The draft banner.** Until `approved` is true, every legal page carries a
 * visible notice that it has not been through legal review, and the page is
 * noindexed. docs/08 §6 warns that generated legal text describing practices
 * nobody follows is worse than no page; this makes "not reviewed yet" a state
 * of the site rather than a note in someone's inbox.
 *
 * **`needsDecision` markers.** Sections that depend on a decision only the
 * client can make are rendered with a distinct marker rather than blending
 * into the prose. A reader skimming for what is unfinished can find it; a
 * reviewer cannot miss it.
 *
 * Both disappear when `siteSettings.legal.approved` is set, which is a gate
 * someone has to pass through deliberately.
 */
export function LegalDocument({
  document,
  path,
  lastUpdated,
  approved,
  approvedBy,
}: {
  document: LegalDocumentContent
  path: string
  lastUpdated: string
  approved: boolean
  approvedBy?: string
}) {
  return (
    <>
      <HeroPage
        eyebrow="Legal"
        headline={document.title}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: document.title, path },
        ]}
      />

      {!approved && (
        <SectionShell canvas="bone-2" density="tight" as="div">
          <div className="max-w-measure border-2 border-dashed border-(--ink-muted) p-6 lg:p-8">
            <p className="font-mono text-label text-(--accent-text) uppercase">
              Draft — not yet reviewed by a lawyer
            </p>
            <p className="mt-4 font-display text-h3 text-(--ink)">
              This page has not been through legal review.
            </p>
            <p className="mt-3 text-body-sm">
              It was drafted from a technical audit of what this website actually does, so its
              factual statements about data handling were verified rather than assumed. That makes
              it a solid starting point and not a substitute for professional review — particularly
              the sections marked below as needing a decision.
            </p>
            <p className="mt-4 text-body-sm text-(--ink-muted)">
              While this notice is showing, the page is excluded from search engines. It disappears
              once <code>siteSettings.legal.approved</code> is set in the CMS.
            </p>
          </div>
        </SectionShell>
      )}

      <SectionShell canvas="bone">
        <div className="max-w-measure">
          <p className="font-mono text-label text-(--ink-muted) uppercase">
            Last updated {lastUpdated}
            {approved && approvedBy ? ` · Reviewed by ${approvedBy}` : ''}
          </p>

          {document.intro.map((paragraph) => (
            <p key={paragraph} className="mt-6 text-body-lg">
              {renderEmphasis(paragraph)}
            </p>
          ))}
        </div>

        <div className="mt-16 max-w-measure space-y-14">
          {document.sections.map((section, index) => (
            <section key={section.heading}>
              <Eyebrow as="p">{String(index + 1).padStart(2, '0')}</Eyebrow>
              <h2 className="mt-4 font-display text-h3 text-(--ink)">{section.heading}</h2>

              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-body">
                  {renderEmphasis(paragraph)}
                </p>
              ))}

              {section.list && (
                <ul className="mt-5 space-y-3">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-3 text-body">
                      <span
                        aria-hidden="true"
                        className="mt-2 block size-3 shrink-0 bg-amber-500 cut-slash"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.needsDecision && !approved && (
                <div className="mt-6 border-l-2 border-error pl-5">
                  <p className="font-mono text-label text-error uppercase">Needs a decision</p>
                  <p className="mt-2 text-body-sm">{section.needsDecision}</p>
                </div>
              )}
            </section>
          ))}
        </div>
      </SectionShell>
    </>
  )
}

/**
 * Renders **bold** spans. The legal copy uses emphasis in three or four places
 * where a sentence carries the weight of the section, and a full rich-text
 * pipeline for that would be more machinery than the need justifies.
 */
function renderEmphasis(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index} className="font-semibold text-(--ink)">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  )
}
