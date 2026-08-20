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
