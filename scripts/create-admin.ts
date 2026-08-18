import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Create the first admin user.
 *
 *   SEED_ADMIN_EMAIL=… SEED_ADMIN_PASSWORD=… pnpm exec payload run scripts/create-admin.ts
 *
 * The credentials come from the environment rather than being written here, so
 * a password never lands in the repository or in shell history via a literal.
 *
 * Idempotent: if the address already exists it does nothing rather than
 * resetting the password of a live account.
 */

const email = process.env.SEED_ADMIN_EMAIL
const password = process.env.SEED_ADMIN_PASSWORD
const name = process.env.SEED_ADMIN_NAME ?? 'Admin'

if (!email || !password) {
  console.error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD before running this.')
  process.exit(1)
}

const payload = await getPayload({ config })

const existing = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
  overrideAccess: true,
})

if (existing.docs.length > 0) {
  payload.logger.info(`User already exists: ${email} — nothing to do.`)
} else {
  await payload.create({
    collection: 'users',
    data: { email, password, name },
    overrideAccess: true,
  })
  payload.logger.info(`Created admin user: ${email}`)
}

process.exit(0)
