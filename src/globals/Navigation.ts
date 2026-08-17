import type { GlobalConfig } from 'payload'

/**
 * Navigation — docs/03 §4, T-015.
 *
 * The shape mirrors `src/types/content.ts`, which is what the site reads today
 * from `src/seed/navigation.ts`. Once this is seeded, `src/lib/content.ts`
 * switches source and nothing else changes.
 */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: { group: 'Site' },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'utilityBar',
      type: 'group',
      admin: {
        description:
          'Only turn this on if it carries something useful. A decorative announcement bar competes with the main CTA — blueprint §3.1.',
      },
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false },
        { name: 'message', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'whatsapp', type: 'text' },
      ],
    },
    {
      name: 'megaMenus',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'href',
          type: 'text',
          admin: { description: 'Where the top-level item itself goes. Optional.' },
        },
        {
          name: 'groups',
          type: 'array',
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'supportingCopy', type: 'text' },
            {
              name: 'links',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href', type: 'text', required: true },
                { name: 'description', type: 'text' },
              ],
            },
          ],
        },
        {
          name: 'featuredPanel',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'heading', type: 'text' },
            { name: 'body', type: 'textarea' },
            { name: 'ctaLabel', type: 'text' },
            { name: 'ctaHref', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'primaryLinks',
      type: 'array',
      admin: { description: 'Top-level items with no mega menu, such as About.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'footerColumns',
      type: 'array',
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'requiresFlag',
          type: 'select',
          options: [
            { label: 'Case studies', value: 'showCaseStudies' },
            { label: 'Resources', value: 'showResources' },
            { label: 'Careers', value: 'showCareers' },
            { label: 'Assessment', value: 'showAssessment' },
            { label: 'Solutions', value: 'showSolutions' },
            { label: 'Technologies', value: 'showTechnologies' },
          ],
          admin: {
            description:
              'When set, this column is omitted entirely unless the flag is on. Omitted, not rendered empty — docs/04 §4.',
          },
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'stickyCta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
        { name: 'showOnMobile', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
