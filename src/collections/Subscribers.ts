import type { CollectionConfig } from 'payload'

/**
 * Subscribers - docs/03 section 3, T-029. Admin-only read, same reasoning as
 * Leads.
 *
 * `unsubscribeToken` is required: an email list without a working one-click
 * unsubscribe is a compliance problem, not a missing feature.
 */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'consentAt'],
    group: 'Conversion',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'consentAt', type: 'date', required: true },
    { name: 'source', type: 'text' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
    },
    { name: 'unsubscribeToken', type: 'text', required: true, index: true },
  ],
}
