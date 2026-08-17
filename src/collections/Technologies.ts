import type { CollectionConfig } from 'payload'

/**
 * Technologies - schema only, T-030. Phase 3.
 *
 * Present now so nothing built today has to be undone later (docs/03), with no
 * public route and no UI. The fields here are the minimum the relationships in
 * other collections need to resolve; the full field set arrives with the phase
 * that builds the pages.
 */
export const Technologies: CollectionConfig = {
  slug: 'technologies',
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
    {
      name: 'group',
      type: 'select',
      options: [
        { label: 'AI', value: 'ai' },
        { label: 'Cloud', value: 'cloud' },
        { label: 'Web', value: 'web' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Data', value: 'data' },
        { label: 'Agentic', value: 'agentic' },
      ],
    },
    { name: 'whatItIs', type: 'textarea' },
    { name: 'whenToUse', type: 'textarea' },
    {
      name: 'whenNotToUse',
      type: 'textarea',
      admin: {
        description:
          'Required before publication. docs/03: a technology page that cannot say when the technology is wrong is a keyword page, and the blueprint forbids those.',
      },
    },
  ],
}
