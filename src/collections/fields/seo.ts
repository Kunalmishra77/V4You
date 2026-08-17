import type { Field } from 'payload'

/**
 * The shared SEO group — docs/03.
 *
 * Title and description have no default. docs/05's metadata rules require every
 * page to carry a unique pair, and a templated fallback is how duplicates get
 * shipped without anyone noticing.
 */
export const seoField = (): Field => ({
  name: 'seo',
  type: 'group',
  admin: { description: 'Unique per page. No templated duplicates — docs/05.' },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Under about 60 characters. One keyword, one clear promise.' },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Roughly 150–160 characters, benefit-led.' },
    },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Excludes the page from search engines and the sitemap.' },
    },
  ],
})
