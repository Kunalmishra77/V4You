import Link from 'next/link'

import { Headline } from '@/components/shared/Headline'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { BrandFigure, type FigureName } from '@/components/shared/BrandFigure'
import { SectionShell, type Canvas } from '@/components/shared/SectionShell'
import { solutionMatrix } from '@/seed/home-proof'
import { revealChild } from '@/lib/reveal'

/**
 * SolutionMatrix — docs/04 §23, home §4.7.
 *
 * A real `<table>` with `<th scope>`, not a div grid — docs/06 §C2 is explicit
 * about that, and it is the difference between a screen reader announcing
 * "Grow revenue, row 1 of 6" and reading eighteen disconnected fragments.
 *
 * Under 760px the same markup becomes stacked cards through CSS alone. The
 * table stays a table; only its display changes, so the semantics survive the
 * breakpoint.
 */
/**
 * One figure per row for the hover card. Decoration, so it is assigned by
 * position rather than stored against the outcome.
 */
const FIGURES: FigureName[] = ['grid', 'flow', 'layers', 'signal', 'converge']

export function SolutionMatrix({ canvas = 'bone' }: { canvas?: Canvas } = {}) {
  return (
    <SectionShell canvas={canvas} reveal="stagger">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:gap-16">
        <div className="max-w-measure">
          <Eyebrow>{solutionMatrix.eyebrow}</Eyebrow>
          <Headline className="mt-5">{solutionMatrix.heading}</Headline>
          <p className="mt-5 text-body-lg">{solutionMatrix.body}</p>
        </div>
        <BrandFigure name="converge" className="max-w-[17rem] justify-self-end max-lg:hidden" />
      </div>

      <div className="mt-12 overflow-x-auto">
        <table className="w-full border-collapse text-left max-[759px]:block">
          <caption className="sr-only">
            Business outcomes, the solutions that apply to each, and where to start
          </caption>

          <thead className="max-[759px]:sr-only">
            <tr className="border-y border-(--line)">
              <th scope="col" className="py-4 pr-6 font-mono text-label uppercase">
                Outcome
              </th>
              <th scope="col" className="py-4 pr-6 font-mono text-label uppercase">
                What that usually involves
              </th>
              <th scope="col" className="py-4 font-mono text-label uppercase">
                Start with
              </th>
            </tr>
          </thead>

          <tbody className="max-[759px]:block">
            {solutionMatrix.rows.map((row, index) => (
              <tr
                key={row.outcome}
                {...revealChild(index)}
                className="matrix-row group border-b border-(--line) align-top max-[759px]:block max-[759px]:py-6"
              >
                <th
                  scope="row"
                  className="relative py-6 pr-6 pl-8 text-left font-display text-h3 font-bold text-(--ink) max-[759px]:block max-[759px]:py-0 max-[759px]:pl-0"
                >
                  {/*
                    The glyph sits in padding that is always there, so it can
                    appear without moving the row. Reserving the space is the
                    whole trick: a mark that pushes its own heading sideways on
                    hover is a mark nobody can point at.
                  */}
                  <span
                    aria-hidden="true"
                    className="matrix-glyph absolute top-8 left-0 block size-4 bg-(--accent-glyph) cut-slash max-[759px]:hidden"
                  />
                  {row.outcome}
                </th>

                <td className="py-6 pr-6 text-body-sm max-[759px]:block max-[759px]:py-3">
                  {row.solutions}
                </td>

                {/*
                  Wide enough to hold the card beside the link rather than on top
                  of it. The card is absolute, so it costs the row no height and
                  cannot shift anything when it appears.
                */}
                <td className="relative py-6 lg:min-w-[19rem] max-[759px]:block max-[759px]:py-0">
                  <Link
                    href={row.startWith.href}
                    className="font-display text-body-sm font-medium whitespace-nowrap text-(--ink) underline underline-offset-4 hover:text-amber-ink"
                  >
                    {row.startWith.label}
                  </Link>

                  {/*
                    Decorative, and `aria-hidden` for it: the label it carries is
                    the link's own, three inches to the left. Announcing it again
                    would put every service in the table twice.
                  */}
                  <span
                    aria-hidden="true"
                    className="matrix-card pointer-events-none absolute top-1/2 right-0 hidden w-40 border border-(--line) bg-(--surface) p-3 lg:block"
                  >
                    <BrandFigure
                      name={FIGURES[index % FIGURES.length]}
                      className="h-14 w-full opacity-70"
                    />
                    <span className="mt-2 block font-mono text-label text-(--accent-text) uppercase">
                      {row.startWith.label}
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*
        Named solution modules — AI CRM, ERP, HRMS and the rest — get their own
        pages in Phase 2. Until they exist they are described in the middle
        column rather than linked, because a link to nothing is worse than no
        link.
      */}
    </SectionShell>
  )
}
