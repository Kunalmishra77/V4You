import type { Field } from 'payload'

/** The unique, indexed slug every routed collection shares — docs/03. */
export const slugField = (): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'The URL segment. Lowercase, hyphenated, and stable once published.',
  },
  validate: (value: unknown) => {
    if (typeof value !== 'string' || value.length === 0) return 'A slug is required.'
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      return 'Use lowercase letters, numbers and single hyphens only.'
    }
    return true
  },
})
