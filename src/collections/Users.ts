import type { CollectionConfig } from 'payload'

/**
 * Admin users. Not in docs/03's fifteen — Payload needs an auth-enabled
 * collection to gate `/admin`, and there is no sensible way to omit it.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  access: {
    // Only signed-in users touch this collection. It is never public.
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
