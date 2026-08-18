import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { navigationSeed } from '@/seed/navigation'
import { siteSettingsSeed } from '@/seed/site-settings'
import type { FeatureFlags, Navigation, SiteSettings } from '@/types/content'

/**
 * The content accessor every component reads through.
 *
 * It asks Payload first and falls back to `src/seed/` if the CMS is
 * unreachable. That is not belt-and-braces — Supabase's free tier pauses an
 * idle project, and a paused database should degrade the site to its last
 * known-good copy rather than return a 500 on every route. The seed is the same
 * content the CMS was loaded from, so the fallback is stale at worst, never
 * wrong in kind.
 *
 * No component knows or cares which source answered. `cache()` deduplicates
 * within a single render pass.
 */

/** Payload returns `null` for empty optional fields; the app wants `undefined`. */
const opt = <T>(value: T | null | undefined): T | undefined => value ?? undefined

let warned = false

function fallback<T>(what: string, error: unknown, seed: T): T {
  if (!warned) {
    warned = true
    console.warn(
      `[content] Could not read \`${what}\` from Payload, falling back to src/seed/. ` +
        `The site is serving its last known-good copy. Cause: ${
          error instanceof Error ? error.message : String(error)
        }`,
    )
  }
  return seed
}

export const getNavigation = cache(async (): Promise<Navigation> => {
  try {
    const payload = await getPayload({ config })
    const nav = await payload.findGlobal({ slug: 'navigation', depth: 0 })

    // An unseeded global comes back as an empty object rather than an error.
    if (!nav?.megaMenus?.length) return navigationSeed

    return {
      utilityBar: {
        enabled: Boolean(nav.utilityBar?.enabled),
        message: opt(nav.utilityBar?.message),
        email: opt(nav.utilityBar?.email),
        whatsapp: opt(nav.utilityBar?.whatsapp),
      },
      megaMenus: (nav.megaMenus ?? []).map((menu) => ({
        label: menu.label,
        href: opt(menu.href),
        groups: (menu.groups ?? []).map((group) => ({
          heading: group.heading,
          supportingCopy: opt(group.supportingCopy),
          links: (group.links ?? []).map((link) => ({
            label: link.label,
            href: link.href,
            description: opt(link.description),
          })),
        })),
        featuredPanel: menu.featuredPanel?.heading
          ? {
              eyebrow: opt(menu.featuredPanel.eyebrow),
              heading: menu.featuredPanel.heading,
              body: opt(menu.featuredPanel.body),
              ctaLabel: menu.featuredPanel.ctaLabel ?? '',
              ctaHref: menu.featuredPanel.ctaHref ?? '',
            }
          : undefined,
      })),
      primaryLinks: (nav.primaryLinks ?? []).map((link) => ({
        label: link.label,
        href: link.href,
      })),
      footerColumns: (nav.footerColumns ?? []).map((column) => ({
        heading: column.heading,
        requiresFlag: opt(column.requiresFlag) as keyof FeatureFlags | undefined,
        links: (column.links ?? []).map((link) => ({ label: link.label, href: link.href })),
      })),
      stickyCta: {
        label: nav.stickyCta?.label ?? navigationSeed.stickyCta.label,
        href: nav.stickyCta?.href ?? navigationSeed.stickyCta.href,
        showOnMobile: nav.stickyCta?.showOnMobile ?? true,
      },
    }
  } catch (error) {
    return fallback('navigation', error, navigationSeed)
  }
})

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'siteSettings', depth: 0 })

    return {
      contact: {
        // Every one of these is omitted rather than defaulted. docs/08 §5: a
        // placeholder in structured data is incorrect markup, not a gap.
        email: opt(settings.contact?.email),
        phone: opt(settings.contact?.phone),
        whatsapp: opt(settings.contact?.whatsapp),
        addressLines: settings.contact?.addressLines?.map((entry) => entry.line).filter(Boolean),
        legalEntityName: opt(settings.contact?.legalEntityName),
      },
      socials: (settings.socials ?? []).map((social) => ({
        platform: social.platform,
        url: social.url,
      })),
      defaultSeo: {
        titleTemplate:
          settings.defaultSeo?.titleTemplate ?? siteSettingsSeed.defaultSeo.titleTemplate,
        description: settings.defaultSeo?.description ?? siteSettingsSeed.defaultSeo.description,
        ogImage: siteSettingsSeed.defaultSeo.ogImage,
      },
      legal: {
        approved: Boolean(settings.legal?.approved),
        approvedBy: opt(settings.legal?.approvedBy),
        approvedOn: opt(settings.legal?.approvedOn),
      },
      featureFlags: {
        showCaseStudies: Boolean(settings.featureFlags?.showCaseStudies),
        showResources: Boolean(settings.featureFlags?.showResources),
        showCareers: Boolean(settings.featureFlags?.showCareers),
        showAssessment: Boolean(settings.featureFlags?.showAssessment),
        showSolutions: Boolean(settings.featureFlags?.showSolutions),
        showTechnologies: Boolean(settings.featureFlags?.showTechnologies),
      },
    }
  } catch (error) {
    return fallback('siteSettings', error, siteSettingsSeed)
  }
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
