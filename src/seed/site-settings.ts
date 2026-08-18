import type { SiteSettings } from '@/types/content'

/**
 * Seed content for the `siteSettings` global — docs/03 §4.
 *
 * The `contact` group is deliberately almost empty. docs/08 §5 is unambiguous:
 * these values appear in structured data, so a placeholder produces incorrect
 * machine-readable markup rather than a visual gap. Every consumer treats an
 * absent field as "omit the whole element" — the footer drops the contact line,
 * `WhatsAppButton` does not render at all, and `organizationSchema` leaves the
 * property out. They are logged in MISSING-ASSETS.md.
 *
 * Feature flags let Phase 2+ sections stay dark in production without a code
 * change, which is exactly what they are for (docs/03 §4).
 */
export const siteSettingsSeed: SiteSettings = {
  contact: {
    // email, phone, whatsapp, addressLines and legalEntityName are all pending
    // client supply. See MISSING-ASSETS.md → "Company details still needed".
  },

  socials: [],

  defaultSeo: {
    titleTemplate: '%s — V4You Technologies',
    description:
      'V4You helps startups, SMEs and enterprises turn complex business problems into intelligent products, connected workflows and measurable growth.',
    ogImage: '/og-default.png',
  },

  legal: {
    // Off until someone qualified has read the drafts. See src/seed/legal.ts.
    approved: false,
  },

  featureFlags: {
    showCaseStudies: false,
    showResources: false,
    showCareers: false,
    showAssessment: false,
    showSolutions: false,
    showTechnologies: false,
  },
}
