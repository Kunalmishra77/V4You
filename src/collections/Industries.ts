import type { CollectionConfig } from 'payload'

import { seoField } from '@/collections/fields/seo'
import { slugField } from '@/collections/fields/slug'

/**
 * Industries — docs/03 §1 and docs/05 §12–22, T-025. Eleven records in Phase 1.
 *
 * The `beforeValidate` hook below is the guard against eleven near-identical
 * pages, which the blueprint explicitly forbids. It only bites on publish:
 * drafts can be as thin as an editor needs while they work.
 *
 * These thresholds are mechanical on purpose. They cannot tell whether four
 * challenges are genuinely distinct — that judgement stays with the content
 * owner, per docs/06 §A4. What they can do is make it impossible to publish a
 * page that has not even been attempted.
 */
export const Industries: CollectionConfig = {
  slug: 'industries',
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
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data || data.status !== 'published') return data

        const shortfalls: string[] = []
        const context = typeof data.context === 'string' ? data.context.trim() : ''

        if (context.length < 200) {
          shortfalls.push(
            'a substantive `context` describing how the industry actually operates (at least 200 characters)',
          )
        }
        if (!Array.isArray(data.challenges) || data.challenges.length < 4) {
          shortfalls.push('at least 4 distinct challenges')
        }
        if (!Array.isArray(data.useCases) || data.useCases.length < 4) {
          shortfalls.push('at least 4 use cases')
        }
        if (!Array.isArray(data.faqs) || data.faqs.length < 4) {
          shortfalls.push('at least 4 FAQs')
        }

        if (shortfalls.length > 0) {
          throw new Error(
            `This industry page cannot be published yet. It still needs ${shortfalls.join(', ')}. ` +
              'docs/05 sets these thresholds so that eleven industry pages do not become eleven ' +
              'copies of one. Save it as a draft and come back to it.',
          )
        }

        return data
      },
    ],
  },
  fields: [
    slugField(),
    { name: 'title', type: 'text', required: true },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
      ],
    },
    {
      name: 'context',
      type: 'textarea',
      required: true,
      admin: { description: 'How this industry actually operates. Original to this page.' },
    },
    {
      name: 'challenges',
      type: 'array',
      required: true,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'useCases',
      type: 'array',
      required: true,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'outcome',
          type: 'text',
          admin: {
            description:
              'A value area, not a figure. No ROI percentage without a case study behind it.',
          },
        },
      ],
    },
    {
      name: 'whereWeStart',
      type: 'array',
      required: true,
      admin: { description: 'The four-step reference flow shown beside the industry copy.' },
      fields: [
        { name: 'step', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'tag', type: 'text' },
      ],
    },
    {
      name: 'regulatoryNotes',
      type: 'richText',
      admin: {
        description:
          'Factual only. Describe what the regulation requires — never claim compliance or certification.',
      },
    },
    { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true },
    { name: 'solutions', type: 'relationship', relationTo: 'solutions', hasMany: true },
    { name: 'caseStudies', type: 'relationship', relationTo: 'caseStudies', hasMany: true },
    { name: 'faqs', type: 'relationship', relationTo: 'faqs', hasMany: true },
    seoField(),
    { name: 'order', type: 'number', admin: { position: 'sidebar' } },
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
