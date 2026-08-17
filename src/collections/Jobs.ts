import type { CollectionConfig } from 'payload'

/**
 * Jobs - schema only, T-030. Phase 4.
 *
 * Present now so nothing built today has to be undone later (docs/03), with no
 * public route and no UI. The fields here are the minimum the relationships in
 * other collections need to resolve; the full field set arrives with the phase
 * that builds the pages.
 */
export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: { useAsTitle: 'title', group: 'Later phases' },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'department', type: 'text' },
    { name: 'location', type: 'text' },
    { name: 'employmentType', type: 'text' },
    { name: 'description', type: 'richText' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    { name: 'postedAt', type: 'date' },
  ],
}
