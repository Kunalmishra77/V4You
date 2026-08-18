/**
 * Provisional content types.
 *
 * These mirror the `navigation` and `siteSettings` globals in docs/03 §4 field
 * for field. They are hand-written only because Payload is not installed yet —
 * T-002 is blocked on a database. When it lands, `payload generate:types` emits
 * the real definitions in `payload-types.ts` and this file is deleted, not
 * merged. CLAUDE.md is explicit that a type Payload generates is never
 * hand-written; this is a placeholder with an expiry date, not an exception.
 */

export type NavLink = {
  label: string
  href: string
  /** Shown under the label in a mega menu column. Optional everywhere else. */
  description?: string
}

export type MegaMenuGroup = {
  heading: string
  supportingCopy?: string
  links: NavLink[]
}

export type FeaturedPanel = {
  eyebrow?: string
  heading: string
  body?: string
  ctaLabel: string
  ctaHref: string
}

export type MegaMenu = {
  label: string
  /** Where the top-level item itself goes. A menu without one is a button only. */
  href?: string
  groups: MegaMenuGroup[]
  featuredPanel?: FeaturedPanel
}

export type UtilityBar = {
  enabled: boolean
  message?: string
  email?: string
  whatsapp?: string
}

export type FooterColumn = {
  heading: string
  links: NavLink[]
  /**
   * Omit this column entirely when the flag is off — docs/04 §4. An empty
   * column is worse than an absent one; it advertises something that is not
   * there.
   */
  requiresFlag?: keyof FeatureFlags
}

export type StickyCta = {
  label: string
  href: string
  showOnMobile: boolean
}

export type Navigation = {
  utilityBar: UtilityBar
  megaMenus: MegaMenu[]
  /** Top-level items with no mega menu, e.g. About. */
  primaryLinks: NavLink[]
  footerColumns: FooterColumn[]
  stickyCta: StickyCta
}

export type FeatureFlags = {
  showCaseStudies: boolean
  showResources: boolean
  showCareers: boolean
  showAssessment: boolean
  showSolutions: boolean
  showTechnologies: boolean
}

export type SiteSettings = {
  contact: {
    /** Absent until the client supplies it. Never a placeholder — docs/08 §5. */
    email?: string
    phone?: string
    whatsapp?: string
    addressLines?: string[]
    legalEntityName?: string
  }
  socials: { platform: string; url: string }[]
  defaultSeo: {
    titleTemplate: string
    description: string
    ogImage: string
  }
  featureFlags: FeatureFlags
  /**
   * The legal pages stay in draft — banner shown, noindexed — until this is
   * approved. A gate rather than a reminder.
   */
  legal: {
    approved: boolean
    approvedBy?: string
    approvedOn?: string
  }
}
