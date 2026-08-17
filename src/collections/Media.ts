import type { CollectionConfig } from 'payload'

/**
 * Media — docs/03 §2, T-023.
 *
 * `alt` is required at upload. No exceptions: a decorative image gets an
 * explicit empty string, which is a decision someone made, rather than a
 * missing field, which is a decision nobody made.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Library' },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    imageSizes: [
      { name: 'thumb', width: 400, height: undefined, position: 'centre' },
      { name: 'card', width: 800, height: undefined, position: 'centre' },
      { name: 'hero', width: 1600, height: undefined, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    formatOptions: { format: 'webp', options: { quality: 82 } },
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe what the image shows and why it is here. For a purely decorative image, type a single space — that records the decision instead of leaving it unmade.',
      },
    },
    { name: 'caption', type: 'text' },
    { name: 'credit', type: 'text' },
  ],
}
