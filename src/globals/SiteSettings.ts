import type { GlobalConfig } from 'payload'

/**
 * Site settings — docs/03 §4, T-015.
 *
 * The `contact` fields are optional in the schema even though the site needs
 * them, and that is deliberate. docs/08 §5 treats a placeholder in structured
 * data as incorrect markup rather than a gap, so every consumer is written to
 * omit the element when the field is empty. Making them required would force
 * an editor to invent something to get past validation, which is the exact
 * failure the rule exists to prevent.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  admin: { group: 'Site' },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'brand',
      type: 'group',
      fields: [
        { name: 'logo', type: 'upload', relationTo: 'media' },
        { name: 'logoMark', type: 'upload', relationTo: 'media' },
        { name: 'favicon', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      admin: {
        description:
          'These appear in structured data. Leave a field blank rather than approximating it — the consumer omits the whole element, which is correct. A guess would be a machine-readable claim.',
      },
      fields: [
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text', admin: { description: 'Include the country code.' } },
        {
          name: 'whatsapp',
          type: 'text',
          admin: {
            description:
              'Full international format, no plus. WhatsAppButton does not render at all without this.',
          },
        },
        {
          name: 'addressLines',
          type: 'array',
          fields: [{ name: 'line', type: 'text', required: true }],
        },
        {
          name: 'legalEntityName',
          type: 'text',
          admin: {
            description: 'The registered name, for the footer, terms and Organization JSON-LD.',
          },
        },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'defaultSeo',
      type: 'group',
      fields: [
        { name: 'titleTemplate', type: 'text', defaultValue: '%s — V4You Technologies' },
        { name: 'description', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'legal',
      type: 'group',
      admin: {
        description:
          'The legal pages are drafts until this is approved. While unapproved they carry a visible draft banner and are excluded from search engines. Tick it only once someone qualified has actually read them.',
      },
      fields: [
        {
          name: 'approved',
          type: 'checkbox',
          defaultValue: false,
          label: 'Legal pages reviewed and approved for publication',
        },
        {
          name: 'approvedBy',
          type: 'text',
          admin: {
            description:
              'Who reviewed them. A name here is the accountability the checkbox implies.',
            condition: (data) => Boolean(data?.legal?.approved),
          },
        },
        {
          name: 'approvedOn',
          type: 'date',
          admin: { condition: (data) => Boolean(data?.legal?.approved) },
        },
      ],
    },
    {
      name: 'featureFlags',
      type: 'group',
      admin: {
        description:
          'Lets Phase 2+ sections stay dark in production without a code change — docs/03 §4.',
      },
      fields: [
        { name: 'showCaseStudies', type: 'checkbox', defaultValue: false },
        { name: 'showResources', type: 'checkbox', defaultValue: false },
        { name: 'showCareers', type: 'checkbox', defaultValue: false },
        { name: 'showAssessment', type: 'checkbox', defaultValue: false },
        { name: 'showSolutions', type: 'checkbox', defaultValue: false },
        { name: 'showTechnologies', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}
