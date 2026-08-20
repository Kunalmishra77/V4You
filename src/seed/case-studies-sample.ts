import type { CaseStudyCard } from '@/components/blocks/CaseStudyRail'

/**
 * Placeholder case studies — **not real engagements.**
 *
 * These exist so the rail can be designed, and so the drag behaviour and the
 * cursor can be tested against real card widths rather than an empty array.
 * They render only when `NEXT_PUBLIC_SAMPLE_CONTENT=1`, and every card that
 * renders from this file carries a visible sample badge.
 *
 * Three rules held while writing them.
 *
 * **No invented client.** Not a name, not a city, not a sector-plus-size
 * combination specific enough to identify anyone. Each one is a generic
 * descriptor in `confidentialityLabel`, which is the field the schema already
 * has for work that cannot be attributed. `CLAUDE.md` rule 1.
 *
 * **No invented number.** There is not a percentage or a currency figure
 * anywhere in this file. Every outcome describes what changed in the system,
 * not by how much — because "intake reads all three systems" is a claim about
 * design that a sample can honestly make, and "intake time down 43%" is a
 * measurement nobody took. It is also what makes these safe to leave in front
 * of a reviewer: a reader cannot mistake them for evidence, because they
 * contain no evidence to mistake.
 *
 * **Indian by default.** The systems named — ABDM and ABHA, the e-way bill,
 * GST e-invoicing — are the actual compliance surfaces an Indian buyer works
 * against every day, and naming them is the difference between a placeholder
 * that reads as this company's work and one lifted from an American template.
 * None of it is a claim: these are public systems, and saying a project touched
 * one describes scope, not results.
 */
export const sampleCaseStudies: CaseStudyCard[] = [
  {
    slug: 'sample-opd-intake',
    clientDisplayName: 'Sample',
    confidentialityLabel: 'Multi-speciality hospital · name withheld',
    industry: 'Healthcare',
    headline: 'OPD registration, from three systems down to one screen',
    outcome:
      'Registration, ABHA linking and past visit history were three separate logins for the same patient. One intake view now reads all three, so the front desk stops re-keying what the hospital already holds.',
  },
  {
    slug: 'sample-shift-visibility',
    clientDisplayName: 'Sample',
    confidentialityLabel: 'MSME manufacturer · name withheld',
    industry: 'Manufacturing',
    headline: 'Plan versus actual, on the shop floor instead of in tomorrow’s report',
    outcome:
      'Shift variance was found the next morning in a spreadsheet. The same comparison now runs against live line data, and an exception raises itself while the shift can still do something about it.',
  },
  {
    slug: 'sample-eway-exceptions',
    clientDisplayName: 'Sample',
    confidentialityLabel: '3PL operator · name withheld',
    industry: 'Logistics',
    headline: 'Consignment exceptions that surface before the customer calls',
    outcome:
      'Delays were discovered when someone rang to ask. E-way bill events, GPS pings and POD updates now flow into one timeline, and anything stalled past its window is flagged to the branch that can move it.',
  },
  {
    slug: 'sample-quote-approval',
    clientDisplayName: 'Sample',
    confidentialityLabel: 'B2B distributor · name withheld',
    industry: 'Retail and commerce',
    headline: 'Quoting with an approval gate that cannot be skipped',
    outcome:
      'Pricing lived in one person’s inbox and GST e-invoicing was a separate re-entry. Quotes are now assembled from the catalogue and the account terms — and anything priced or contractual still stops for a named approver before it leaves.',
  },
  {
    slug: 'sample-compliance-search',
    clientDisplayName: 'Sample',
    confidentialityLabel: 'Chartered accountancy firm · name withheld',
    industry: 'Professional services',
    headline: 'Answers drawn from the firm’s own filings, with the source attached',
    outcome:
      'Precedent lived across a decade of shared drives. Retrieval now runs over the firm’s own material and every answer cites the document it came from, so a partner can disagree with it before it reaches a client.',
  },
]
