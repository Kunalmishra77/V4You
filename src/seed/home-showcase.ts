/**
 * Copy for the work showcase directly below the four disciplines.
 *
 * The heading is deliberately not a claim about delivery. "What this looks like
 * in practice" is true whether the stage is carrying real studies or the
 * labelled placeholders, which matters because the placeholders are what it
 * carries today — and a heading that says "the work we have delivered" over
 * sample cards would be the exact failure `CLAUDE.md` rule 1 describes, banner
 * or no banner.
 */
export const homeShowcase = {
  eyebrow: 'Selected work',
  heading: 'What this looks like\nin practice.',
  body: 'Drag, or pick a sector.',

  /**
   * The band between the wheel and the rail.
   *
   * The reference's version here names three clients and quotes two figures.
   * This one names nobody and quotes nothing, because there is nobody to name
   * and nothing measured to quote — it asks for the problem instead, which is
   * the thing V4You can actually offer at this stage.
   */
  cta: {
    heading: 'Bring us the problem\nyou have not solved yet.',
    body: 'Thirty minutes. We come with questions, not a pitch — and you leave with a suggested next step, even if it is not us.',
    label: 'Book a transformation consultation',
    href: '/book-consultation',
  },

  marqueeLabel: 'Sectors we work in',
  /**
   * The rail below the arc.
   *
   * The reference puts award counts, years in business and headcount here.
   * These are the eleven sectors that already have a page on this site — real,
   * checkable, and claiming nothing beyond "we work here", which the pages
   * themselves back up.
   */
  sectors: [
    'Healthcare',
    'Manufacturing',
    'Education',
    'Real estate',
    'Retail and ecommerce',
    'Finance',
    'Logistics',
    'Hospitality',
    'Government',
    'Startups',
    'Enterprise',
  ] as const,
}
