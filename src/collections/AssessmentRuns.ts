import type { CollectionConfig } from 'payload'

/**
 * AssessmentRuns - schema only, T-030. Phase 4.
 *
 * Present now so nothing built today has to be undone later (docs/03), with no
 * public route and no UI. The fields here are the minimum the relationships in
 * other collections need to resolve; the full field set arrives with the phase
 * that builds the pages.
 */
export const AssessmentRuns: CollectionConfig = {
  slug: 'assessmentRuns',
  admin: { useAsTitle: 'maturityBand', group: 'Later phases' },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'maturityBand', type: 'text' },
    { name: 'answers', type: 'json' },
    { name: 'scores', type: 'json' },
    { name: 'lead', type: 'relationship', relationTo: 'leads' },
    { name: 'completedAt', type: 'date' },
  ],
}
