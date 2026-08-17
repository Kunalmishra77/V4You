import type { CollectionConfig } from 'payload'

/**
 * CalculatorRuns - schema only, T-030. Phase 4.
 *
 * Present now so nothing built today has to be undone later (docs/03), with no
 * public route and no UI. The fields here are the minimum the relationships in
 * other collections need to resolve; the full field set arrives with the phase
 * that builds the pages.
 */
export const CalculatorRuns: CollectionConfig = {
  slug: 'calculatorRuns',
  admin: { useAsTitle: 'calculatorType', group: 'Later phases' },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'calculatorType', type: 'text' },
    { name: 'inputs', type: 'json' },
    {
      name: 'assumptions',
      type: 'json',
      admin: {
        description:
          'Always rendered alongside the output. docs/04 section 34: the result is labelled an estimate, never a guarantee.',
      },
    },
    { name: 'outputs', type: 'json' },
    { name: 'lead', type: 'relationship', relationTo: 'leads' },
  ],
}
