import type { CollectionConfig } from 'payload'

import { seoField } from '@/collections/fields/seo'
import { slugField } from '@/collections/fields/slug'

/**
 * Services — docs/03 §1, T-024. Seven records in Phase 1.
 *
 * The `pricingModel` validator is the enforcement point for a rule the
 * blueprint states twice: no price anchoring before scope is known. It rejects
 * "starting at", "from ₹" and "from $" rather than trusting an editor to
 * remember, because the person adding a figure under deadline is exactly the
 * person who will not remember.
 */
export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', 'status'],
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
    slugField(),
    { name: 'title', type: 'text', required: true },
    {
      name: 'navLabel',
      type: 'text',
      required: true,
      admin: { description: 'The shorter label used in menus.' },
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        {
          name: 'primaryCta',
          type: 'group',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'href', type: 'text' },
          ],
        },
        {
          name: 'secondaryCta',
          type: 'group',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'href', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'outcomeStatement',
      type: 'textarea',
      required: true,
      admin: { description: 'The one-line promise. What changes for the business.' },
    },
    {
      name: 'problemsSolved',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'capabilities',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'icon', type: 'text' },
      ],
    },
    {
      name: 'deliverables',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'process',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'step', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'pricingModel',
      type: 'richText',
      required: true,
      admin: {
        description:
          'What drives cost and which engagement shapes are available. No figures — see the validation below.',
      },
      validate: (value: unknown) => {
        // richText arrives as a Lexical node tree; the cheapest reliable check
        // is against its serialised form.
        const text = value ? JSON.stringify(value) : ''
        if (/starting at|from ₹|from \$/i.test(text)) {
          return 'Remove the price anchor. docs/05 and the blueprint both forbid "starting at" or a "from" figure before scope is known — describe what drives cost and the engagement shapes instead.'
        }
        return true
      },
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
    },
    { name: 'industries', type: 'relationship', relationTo: 'industries', hasMany: true },
    // Phase 2/3 relationships. The fields exist now so nothing built today has
    // to be undone later — docs/03 §1.
    { name: 'solutions', type: 'relationship', relationTo: 'solutions', hasMany: true },
    { name: 'technologies', type: 'relationship', relationTo: 'technologies', hasMany: true },
    { name: 'caseStudies', type: 'relationship', relationTo: 'caseStudies', hasMany: true },
    seoField(),
    {
      name: 'order',
      type: 'number',
      admin: { description: 'Display order on the services hub.', position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
