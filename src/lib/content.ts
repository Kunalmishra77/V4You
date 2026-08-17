import { cache } from 'react'

import { navigationSeed } from '@/seed/navigation'
import { siteSettingsSeed } from '@/seed/site-settings'
import type { Navigation, SiteSettings } from '@/types/content'

/**
 * The content accessor every component reads through.
 *
 * Today it returns seed data, because T-002 is blocked on a database. When
 * Payload lands, only the bodies of these two functions change — each will try
 * the local API first and fall back to the seed if the CMS is unreachable, so a
 * database outage degrades the site to its last known-good copy instead of a
 * 500. No component knows or cares which source answered.
 *
 * This is what keeps CLAUDE.md rule 7 intact while the CMS is unavailable:
 * copy lives in `src/seed/`, exactly where docs/02 §2 puts it, and never in JSX.
 *
 * `cache()` deduplicates within a single render pass.
 */

export const getNavigation = cache(async (): Promise<Navigation> => {
  return navigationSeed
})

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  return siteSettingsSeed
})

/**
 * Footer columns the current feature flags allow. A column whose flag is off is
 * dropped entirely rather than rendered empty — docs/04 §4.
 */
export function visibleFooterColumns(navigation: Navigation, settings: SiteSettings) {
  return navigation.footerColumns.filter((column) => {
    if (column.requiresFlag && !settings.featureFlags[column.requiresFlag]) return false
    return column.links.length > 0
  })
}
