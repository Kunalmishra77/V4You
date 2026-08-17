import type { Access, CollectionConfig } from 'payload'

/**
 * Testimonials — docs/03 §2, T-026.
 *
 * Same access rule as Clients, for the same reason: `permissionGranted` is
 * enforced in `read`, so an unpermitted quote is absent from the public API
 * rather than merely filtered out of one component's query.
 */
const permittedOnly: Access = ({ req }) => {
  if (req.user) return true
  return { permissionGranted: { equals: true } }
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'company', 'permissionGranted', 'featured'],
    group: 'Proof',
  },
  access: {
    read: permittedOnly,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'authorName', type: 'text', required: true },
    { name: 'authorRole', type: 'text', required: true },
    { name: 'company', type: 'text', required: true },
    { name: 'authorPhoto', type: 'upload', relationTo: 'media' },
    {
      name: 'permissionGranted',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: {
        description:
          'Off until the person quoted has approved this exact wording. While off, the quote is invisible to the public API.',
      },
    },
    { name: 'caseStudy', type: 'relationship', relationTo: 'caseStudies' },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
