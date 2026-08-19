import type { CollectionConfig } from 'payload'

import { revalidatePage } from '@/lib/revalidate'

import { seoField } from '@/collections/fields/seo'
import { slugField } from '@/collections/fields/slug'

/**
 * Pages — docs/03 §1, T-031.
 *
 * The generic composable page: About, the legal routes, and anything not
 * covered by a typed collection. `layout` is a blocks field, which is what
 * makes rule 5 in CLAUDE.md real — a page is assembled from the library rather
 * than given bespoke layout code.
 *
 * The block list starts deliberately short. A block is registered here once its
 * component exists and has been reviewed; registering the full library in
 * advance would put choices in the admin UI that render nothing.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'publishedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: { afterChange: [revalidatePage] },
  fields: [
    slugField(),
    { name: 'title', type: 'text', required: true },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      minRows: 1,
      admin: { description: 'Composed from the block library. No page gets bespoke layout code.' },
      blocks: [
        {
          slug: 'heroPage',
          labels: { singular: 'Hero', plural: 'Heroes' },
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
          slug: 'prose',
          labels: { singular: 'Prose', plural: 'Prose blocks' },
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'heading', type: 'text' },
            { name: 'body', type: 'richText', required: true },
            {
              name: 'canvas',
              type: 'select',
              defaultValue: 'bone',
              options: [
                { label: 'Bone', value: 'bone' },
                { label: 'Bone 2', value: 'bone-2' },
                { label: 'White', value: 'white' },
                { label: 'Navy', value: 'navy' },
              ],
            },
          ],
        },
        {
          slug: 'numberedAccordion',
          labels: { singular: 'Numbered accordion', plural: 'Numbered accordions' },
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'heading', type: 'text' },
            {
              name: 'panels',
              type: 'array',
              minRows: 1,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'richText', required: true },
              ],
            },
          ],
        },
        {
          slug: 'ctaBand',
          labels: { singular: 'CTA band', plural: 'CTA bands' },
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'heading', type: 'text', required: true },
            { name: 'body', type: 'textarea' },
            { name: 'ctaLabel', type: 'text', required: true },
            { name: 'ctaHref', type: 'text', required: true },
          ],
        },
      ],
    },
    seoField(),
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
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
  ],
}
