import type { CollectionConfig } from 'payload'

/**
 * Solutions - schema only, T-030. Phase 2.
 *
 * Present now so nothing built today has to be undone later (docs/03), with no
 * public route and no UI. The fields here are the minimum the relationships in
 * other collections need to resolve; the full field set arrives with the phase
 * that builds the pages.
 */
export const Solutions: CollectionConfig = {
  slug: 'solutions',
  admin: { useAsTitle: 'title', group: 'Later phases' },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'order', type: 'number' },
  ],
}
