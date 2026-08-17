import type { CollectionConfig } from 'payload'

/** FAQs — docs/03 §2, T-028. Attached to a service, industry or the site. */
export const Faqs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'scope', 'order'],
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
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'richText', required: true },
    {
      name: 'scope',
      type: 'select',
      required: true,
      defaultValue: 'global',
      options: [
        { label: 'Global', value: 'global' },
        { label: 'Service', value: 'service' },
        { label: 'Industry', value: 'industry' },
        { label: 'Solution', value: 'solution' },
        { label: 'Technology', value: 'technology' },
      ],
    },
    { name: 'order', type: 'number', admin: { position: 'sidebar' } },
  ],
}
