import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { revalidatePath } from 'next/cache'

/**
 * On-demand revalidation from Payload — T-076.
 *
 * Payload runs inside this Next app rather than beside it, so a hook can call
 * `revalidatePath` directly. There is no webhook, no shared secret and no
 * network hop between the CMS saving a record and the page for it going stale
 * — which removes the failure mode where a publish succeeds and the
 * revalidation call quietly does not.
 *
 * Revalidation is deliberately narrow. Editing one service invalidates that
 * service's page, the services hub and the home page, because those three are
 * where it appears. It does not invalidate the whole site: a blunt purge on
 * every save turns a cache into a formality.
 */

const log = (paths: string[], reason: string) => {
  for (const path of paths) revalidatePath(path)
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[revalidate] ${reason} → ${paths.join(', ')}`)
  }
}

/** Pages that show a summary of every service or industry. */
const HUBS: Record<'services' | 'industries', string[]> = {
  services: ['/', '/services'],
  industries: ['/', '/industries'],
}

/** For `services` and `industries`: the record's own page plus its hubs. */
export const revalidateEntry =
  (collection: 'services' | 'industries'): CollectionAfterChangeHook =>
  ({ doc, previousDoc }) => {
    const paths = new Set(HUBS[collection])
    if (typeof doc?.slug === 'string') paths.add(`/${collection}/${doc.slug}`)
    // A renamed slug leaves the old URL cached and now wrong.
    if (typeof previousDoc?.slug === 'string' && previousDoc.slug !== doc?.slug) {
      paths.add(`/${collection}/${previousDoc.slug}`)
    }
    log([...paths], `${collection}/${doc?.slug}`)
    return doc
  }

export const revalidateEntryOnDelete =
  (collection: 'services' | 'industries'): CollectionAfterDeleteHook =>
  ({ doc }) => {
    const paths = new Set(HUBS[collection])
    if (typeof doc?.slug === 'string') paths.add(`/${collection}/${doc.slug}`)
    log([...paths], `deleted ${collection}/${doc?.slug}`)
    return doc
  }

/** Generic pages own exactly one route. */
export const revalidatePage: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  const paths = new Set<string>()
  if (typeof doc?.slug === 'string') paths.add(`/${doc.slug}`)
  if (typeof previousDoc?.slug === 'string' && previousDoc.slug !== doc?.slug) {
    paths.add(`/${previousDoc.slug}`)
  }
  if (paths.size) log([...paths], `page/${doc?.slug}`)
  return doc
}

/**
 * Navigation and siteSettings appear in the layout of every page, so a change
 * to either is the one case where invalidating everything is correct rather
 * than lazy. `layout` scope on the root path does exactly that.
 */
export const revalidateGlobal =
  (slug: string): GlobalAfterChangeHook =>
  ({ doc }) => {
    // `layout` scope on the root path invalidates every route beneath it.
    // No revalidateTag here: nothing sets cache tags, and Next 16 changed its
    // signature, so calling it would be ceremony rather than effect.
    revalidatePath('/', 'layout')
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[revalidate] ${slug} → every route (it is in the layout)`)
    }
    return doc
  }
