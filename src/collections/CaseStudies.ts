import type { Access, CollectionConfig } from 'payload'

import { seoField } from '@/collections/fields/seo'
import { slugField } from '@/collections/fields/slug'

/**
 * Case studies — docs/03 §1, T-027.
 *
 * Two rules are enforced here rather than trusted.
 *
 * **Permission.** Records with `permissionStatus` of `pending` or `refused` are
 * never returned by the public API, enforced in `read` access — docs/03 says
 * explicitly "not in the query", and the reason is that a query filter has to
 * be remembered on every new component while access control does not.
 *
 * **Evidence.** Every KPI carries `method` and `evidenceType`, both required.
 * docs/03 calls `evidenceType` the single most important field in the schema
 * for a company whose positioning is evidence-led, and there is deliberately no
 * way to save a number without one.
 */
const publishableOnly: Access = ({ req }) => {
  if (req.user) return true
  return { permissionStatus: { in: ['granted', 'anonymised-only'] } }
}

export const CaseStudies: CollectionConfig = {
  slug: 'caseStudies',
  admin: {
    useAsTitle: 'clientDisplayName',
    defaultColumns: ['clientDisplayName', 'industry', 'permissionStatus', 'featured'],
    group: 'Proof',
  },
  access: {
    read: publishableOnly,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    slugField(),
    { name: 'client', type: 'relationship', relationTo: 'clients' },
    {
      name: 'clientDisplayName',
      type: 'text',
      required: true,
      admin: { description: 'May be an anonymised label, e.g. "Anonymised — logistics, India".' },
    },
    { name: 'industry', type: 'relationship', relationTo: 'industries', required: true },
    { name: 'geography', type: 'text' },
    { name: 'engagementType', type: 'text' },
    {
      name: 'permissionStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Granted', value: 'granted' },
        { label: 'Pending', value: 'pending' },
        { label: 'Anonymised only', value: 'anonymised-only' },
        { label: 'Refused', value: 'refused' },
      ],
      admin: {
        description:
          'Only "granted" and "anonymised only" are visible publicly. The other two are absent from the API entirely.',
      },
    },
    {
      name: 'confidentialityLabel',
      type: 'text',
      admin: {
        condition: (data) => data?.permissionStatus === 'anonymised-only',
        description: 'Shown in place of the client name on an anonymised study.',
      },
    },
    { name: 'challenge', type: 'richText', required: true },
    {
      name: 'successDefinition',
      type: 'richText',
      required: true,
      admin: { description: 'The KPIs agreed before delivery started, not chosen afterwards.' },
    },
    { name: 'approach', type: 'richText', required: true },
    {
      name: 'architecture',
      type: 'group',
      fields: [
        { name: 'diagram', type: 'upload', relationTo: 'media' },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'kpis',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description:
          'Every row states how it was measured. A number without a method is not publishable.',
      },
      fields: [
        { name: 'metric', type: 'text', required: true },
        { name: 'before', type: 'text', required: true },
        { name: 'after', type: 'text', required: true },
        { name: 'change', type: 'text', required: true },
        {
          name: 'method',
          type: 'text',
          required: true,
          admin: { description: 'How this was measured, over what period, from what source.' },
        },
        {
          name: 'evidenceType',
          type: 'select',
          required: true,
          options: [
            { label: 'Measured', value: 'measured' },
            { label: 'Modelled', value: 'modelled' },
            { label: 'Estimated', value: 'estimated' },
            { label: 'Client-reported', value: 'client-reported' },
          ],
          admin: {
            description:
              'Rendered as a badge beside the figure. This is what keeps the number defensible when a prospect asks where it came from.',
          },
        },
      ],
    },
    { name: 'testimonial', type: 'relationship', relationTo: 'testimonials' },
    { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true },
    { name: 'technologies', type: 'relationship', relationTo: 'technologies', hasMany: true },
    seoField(),
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
