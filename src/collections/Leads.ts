import type { CollectionConfig } from 'payload'

/**
 * Leads — docs/03 §3, T-029.
 *
 * Admin-only read, and never exposed on any public endpoint. `read` returns
 * false for anonymous requests rather than filtering, so the collection is
 * invisible to REST and GraphQL alike, not merely empty.
 *
 * `create` is open because the consultation form's Server Action writes here on
 * behalf of an anonymous visitor. That is the one operation the public needs,
 * and it is the reason read has to be locked separately rather than relying on
 * a single access rule for the collection.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'company', 'crmSyncStatus', 'createdAt'],
    group: 'Conversion',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'company', type: 'text' },
    { name: 'role', type: 'text' },
    {
      name: 'budgetRange',
      type: 'select',
      options: [
        { label: 'Still evaluating', value: 'evaluating' },
        { label: 'Under ₹5L', value: '<5L' },
        { label: '₹5L – ₹25L', value: '5-25L' },
        { label: '₹25L – ₹1Cr', value: '25L-1Cr' },
        { label: 'Over ₹1Cr', value: '>1Cr' },
      ],
    },
    {
      name: 'timeline',
      type: 'select',
      options: [
        { label: 'Now', value: 'now' },
        { label: '1–3 months', value: '1-3mo' },
        { label: '3–6 months', value: '3-6mo' },
        { label: 'Exploring', value: 'exploring' },
      ],
    },
    { name: 'projectBrief', type: 'textarea' },
    { name: 'servicesInterested', type: 'relationship', relationTo: 'services', hasMany: true },
    { name: 'ndaRequested', type: 'checkbox', defaultValue: false },
    {
      name: 'source',
      type: 'text',
      required: true,
      admin: { description: 'The page path the enquiry came from.' },
    },
    {
      name: 'utm',
      type: 'group',
      fields: [
        { name: 'source', type: 'text' },
        { name: 'medium', type: 'text' },
        { name: 'campaign', type: 'text' },
        { name: 'term', type: 'text' },
        { name: 'content', type: 'text' },
      ],
    },
    {
      name: 'consentAt',
      type: 'date',
      required: true,
      admin: { description: 'When this person agreed to be contacted. Never back-filled.' },
    },
    {
      name: 'crmSyncStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Synced', value: 'synced' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        position: 'sidebar',
        description: 'A failed sync is recorded here rather than swallowed — docs/07 T-055.',
      },
    },
    { name: 'crmRecordId', type: 'text', admin: { position: 'sidebar' } },
  ],
}
