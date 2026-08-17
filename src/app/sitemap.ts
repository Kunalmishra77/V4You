import type { MetadataRoute } from 'next'

import { allIndexableRoutes } from '@/lib/routes'
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
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return allIndexableRoutes().map((route) => ({
    url: absoluteUrl(route),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route.split('/').length === 2 ? 0.8 : 0.6,
  }))
}
