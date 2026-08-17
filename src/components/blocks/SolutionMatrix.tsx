import Link from 'next/link'

import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'
import { solutionMatrix } from '@/seed/home-proof'

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
export function SolutionMatrix() {
  return (
    <SectionShell canvas="bone" reveal>
      <div className="max-w-measure">
        <Eyebrow>{solutionMatrix.eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
          {solutionMatrix.heading}
        </h2>
        <p className="mt-5 text-body-lg">{solutionMatrix.body}</p>
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
            {solutionMatrix.rows.map((row) => (
              <tr
                key={row.outcome}
                className="border-b border-(--line) align-top max-[759px]:block max-[759px]:py-6"
              >
                <th
                  scope="row"
                  className="py-6 pr-6 text-left font-display text-h3 font-bold text-(--ink) max-[759px]:block max-[759px]:py-0"
                >
                  {row.outcome}
                </th>
                <td className="py-6 pr-6 text-body-sm max-[759px]:block max-[759px]:py-3">
                  {row.solutions}
                </td>
                <td className="py-6 max-[759px]:block max-[759px]:py-0">
                  <Link
                    href={row.startWith.href}
                    className="font-display text-body-sm font-medium whitespace-nowrap text-(--ink) underline underline-offset-4 hover:text-amber-ink"
                  >
                    {row.startWith.label}
                  </Link>
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
