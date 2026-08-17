import type { CollectionConfig } from 'payload'

/**
 * Team members - docs/03 section 2, T-028.
 *
 * docs/05 section 2 omits the About team grid entirely when no photos exist
 * rather than showing avatar placeholders: an anonymous leadership section
 * actively undercuts the page it sits on.
 */
export const TeamMembers: CollectionConfig = {
  slug: 'teamMembers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'isLeadership', 'order'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'bio', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'linkedin', type: 'text' },
    { name: 'isLeadership', type: 'checkbox', defaultValue: false },
    { name: 'order', type: 'number', admin: { position: 'sidebar' } },
  ],
}
