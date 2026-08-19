import type { MetadataRoute } from 'next'

import { getSiteSettings } from '@/lib/content'
import { LEGAL_ROUTES, allIndexableRoutes } from '@/lib/routes'
import { absoluteUrl } from '@/lib/seo'

/**
 * docs/06 §A1 — generated from published records across all collections.
 *
 * Until the CMS is live it reads the Phase 1 route table, which is the same
 * list navigation is built from, so a route cannot be linked and missing here.
 * Noindexed routes are excluded by construction rather than filtered out.
 *
 * `lastModified` is deliberately absent. Next would otherwise stamp build time
 * on every URL, which tells crawlers the whole site changed on each deploy —
 * a signal worth more when it is true. It returns with the CMS's `publishedAt`.
 *
 * The legal pages are excluded while they are unapproved, because each one
 * serves a `noindex` meta tag until then. Listing a URL in the sitemap says
 * "index this" while the page itself says "do not" — a crawler resolves that
 * contradiction by trusting neither. Found by the link crawl, which noticed
 * /cookie-policy was in the sitemap and reachable from nowhere.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings()
  const routes = allIndexableRoutes().filter(
    (route) =>
      settings.legal.approved || !LEGAL_ROUTES.includes(route as (typeof LEGAL_ROUTES)[number]),
  )

  return routes.map((route) => ({
    url: absoluteUrl(route),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route.split('/').length === 2 ? 0.8 : 0.6,
  }))
}
