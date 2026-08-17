import config from '@payload-config'
import { getPayload } from 'payload'

import { navigationSeed } from './navigation'
import { siteSettingsSeed } from './site-settings'

/**
 * Seed the CMS from `src/seed/` — docs/02 §2 puts all copy here, and this is
 * what loads it.
 *
 *   pnpm seed
 *
 * Idempotent: globals are updated in place, so running it twice is the same as
 * running it once. It overwrites whatever is in the CMS, which makes it safe to
 * re-run during the build and unsafe once an editor has changed something by
 * hand — at that point the CMS is the source of truth and this file is history.
 *
 * Scope today is the two globals, which is what T-015 needs. Services and
 * industries are seeded at T-061 and T-064, when the full page content those
 * collections require actually exists; creating records now would mean
 * inventing `problemsSolved`, `deliverables` and a `pricingModel` to satisfy
 * required fields, which is the sort of filler CLAUDE.md rules out.
 */
export async function seed() {
  const payload = await getPayload({ config })

  payload.logger.info('Seeding `navigation` …')
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      utilityBar: {
        enabled: navigationSeed.utilityBar.enabled,
        message: navigationSeed.utilityBar.message,
        email: navigationSeed.utilityBar.email,
        whatsapp: navigationSeed.utilityBar.whatsapp,
      },
      megaMenus: navigationSeed.megaMenus.map((menu) => ({
        label: menu.label,
        href: menu.href,
        groups: menu.groups.map((group) => ({
          heading: group.heading,
          supportingCopy: group.supportingCopy,
          links: group.links.map((link) => ({
            label: link.label,
            href: link.href,
            description: link.description,
          })),
        })),
        featuredPanel: menu.featuredPanel,
      })),
      primaryLinks: navigationSeed.primaryLinks.map((link) => ({
        label: link.label,
        href: link.href,
      })),
      footerColumns: navigationSeed.footerColumns.map((column) => ({
        heading: column.heading,
        requiresFlag: column.requiresFlag,
        links: column.links.map((link) => ({ label: link.label, href: link.href })),
      })),
      stickyCta: navigationSeed.stickyCta,
    },
  })

  payload.logger.info('Seeding `siteSettings` …')
  await payload.updateGlobal({
    slug: 'siteSettings',
    data: {
      // `contact` is left untouched. Every field in it is still pending from
      // the client, and docs/08 §5 treats a placeholder in structured data as
      // incorrect markup rather than a gap — so seeding blanks is right and
      // seeding guesses would not be.
      contact: {
        addressLines: siteSettingsSeed.contact.addressLines?.map((line) => ({ line })) ?? [],
      },
      socials: siteSettingsSeed.socials,
      defaultSeo: {
        titleTemplate: siteSettingsSeed.defaultSeo.titleTemplate,
        description: siteSettingsSeed.defaultSeo.description,
      },
      featureFlags: siteSettingsSeed.featureFlags,
    },
  })

  payload.logger.info('Seed complete.')
}

/**
 * This module is an entrypoint, not a library — `payload run` imports it and
 * expects the work to happen on import. Guarding on `process.argv[1]` does not
 * work here: that is the path of the payload binary, not of this file.
 */
await seed()
process.exit(0)
