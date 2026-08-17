/**
 * The Phase 1 route table — docs/05.
 *
 * One list, consumed by `sitemap.ts` and by the stub pages, so a route cannot
 * exist in navigation and be missing from the sitemap. When the CMS is live
 * this is generated from published records instead; the shape stays the same.
 */

export const SERVICE_SLUGS = [
  'ai-automation',
  'software-development',
  'website-development',
  'mobile-app-development',
  'digital-marketing',
  'cloud-devops',
  'consulting',
] as const

export const INDUSTRY_SLUGS = [
  'healthcare',
  'manufacturing',
  'education',
  'real-estate',
  'retail',
  'finance',
  'logistics',
  'hospitality',
  'government',
  'startups',
  'enterprise',
] as const

export type ServiceSlug = (typeof SERVICE_SLUGS)[number]
export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number]

/** Human labels for breadcrumbs and stub headings, until the CMS supplies them. */
export const SERVICE_LABELS: Record<ServiceSlug, string> = {
  'ai-automation': 'AI & automation',
  'software-development': 'Software development',
  'website-development': 'Website development',
  'mobile-app-development': 'Mobile app development',
  'digital-marketing': 'Digital marketing',
  'cloud-devops': 'Cloud & DevOps',
  consulting: 'Technology consulting',
}

export const INDUSTRY_LABELS: Record<IndustrySlug, string> = {
  healthcare: 'Healthcare',
  manufacturing: 'Manufacturing',
  education: 'Education',
  'real-estate': 'Real estate',
  retail: 'Retail and ecommerce',
  finance: 'Finance',
  logistics: 'Logistics',
  hospitality: 'Hospitality',
  government: 'Government',
  startups: 'Startups',
  enterprise: 'Enterprise',
}

/** Routes that exist but must never be indexed — docs/06 §A1. */
export const NOINDEX_ROUTES = ['/thank-you', '/design-system'] as const

export const STATIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/book-consultation',
  '/services',
  '/industries',
  '/security',
  '/accessibility',
  '/privacy-policy',
  '/terms',
  '/cookie-policy',
] as const

/** Every indexable route, for the sitemap. */
export function allIndexableRoutes(): string[] {
  return [
    ...STATIC_ROUTES,
    ...SERVICE_SLUGS.map((slug) => `/services/${slug}`),
    ...INDUSTRY_SLUGS.map((slug) => `/industries/${slug}`),
  ]
}
