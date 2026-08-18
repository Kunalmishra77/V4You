import type { Metadata } from 'next'

import { LegalDocument } from '@/components/blocks/LegalDocument'
import { getSiteSettings } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { legalLastUpdated, cookiePolicy } from '@/seed/legal'

/**
 * Cookie policy — T-067.
 *
 * Drafted from a technical audit of what this site actually does, at the
 * client's instruction and against the advice in docs/08 §6. It stays
 * noindexed and carries a visible draft banner until `siteSettings.legal
 * .approved` is set — see src/seed/legal.ts for what that decision involves.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return buildMetadata({
    title: 'Cookie policy — V4You Technologies',
    description: cookiePolicy.metaDescription,
    path: '/cookie-policy',
    // An unreviewed legal page should not be indexed. It is still reachable
    // and linked, so it can be reviewed; it simply is not advertised.
    noIndex: !settings.legal.approved,
  })
}

export default async function Page() {
  const settings = await getSiteSettings()

  return (
    <LegalDocument
      document={cookiePolicy}
      path="/cookie-policy"
      lastUpdated={legalLastUpdated}
      approved={settings.legal.approved}
      approvedBy={settings.legal.approvedBy}
    />
  )
}
