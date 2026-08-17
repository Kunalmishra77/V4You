import type { Access, CollectionConfig } from 'payload'

/**
 * Clients — docs/03 §2, T-026.
 *
 * `logoUsagePermitted` is the quality gate, and it is enforced in `read` access
 * rather than in the query. That distinction is the whole point: a filter in a
 * query is a thing a developer can forget on the next component, while access
 * control is a thing the API will not do regardless of what is asked for.
 *
 * The result is that there is no code path — no page, no REST call, no GraphQL
 * query — that returns an unpermitted logo to the public.
 */
const permittedOnly: Access = ({ req }) => {
  if (req.user) return true // Editors see everything, including the unpermitted.
  return { logoUsagePermitted: { equals: true } }
}

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'logoUsagePermitted', 'displayOrder'],
    group: 'Proof',
  },
  access: {
    read: permittedOnly,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: 'displayOrder',
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'SVG preferred. PNG with transparency is acceptable.' },
    },
    {
      name: 'logoUsagePermitted',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: {
        description:
          'Off until written permission exists. While this is off the logo is invisible to the public API — not merely hidden in the UI.',
      },
    },
    {
      name: 'permissionEvidence',
      type: 'text',
      admin: { description: 'Who granted it, when, and where the evidence is filed.' },
    },
    { name: 'displayOrder', type: 'number', admin: { position: 'sidebar' } },
  ],
}
