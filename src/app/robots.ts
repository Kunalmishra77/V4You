import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo'

/** docs/06 §A1: allow all; disallow /admin, /api and /thank-you. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/thank-you', '/design-system'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
