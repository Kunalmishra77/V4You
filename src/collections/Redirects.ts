import type { CollectionConfig } from 'payload'

/** Redirects - docs/03 section 2, docs/06 A1. Compiled into next.config.ts at build. */
export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: { useAsTitle: 'from', defaultColumns: ['from', 'to', 'type'], group: 'Admin' },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'from', type: 'text', required: true, unique: true },
    { name: 'to', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: '301',
      options: [
        { label: '301 - permanent', value: '301' },
        { label: '302 - temporary', value: '302' },
      ],
    },
  ],
}
