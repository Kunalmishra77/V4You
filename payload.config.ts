import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { AssessmentRuns } from '@/collections/AssessmentRuns'
import { CalculatorRuns } from '@/collections/CalculatorRuns'
import { CaseStudies } from '@/collections/CaseStudies'
import { Clients } from '@/collections/Clients'
import { Faqs } from '@/collections/Faqs'
import { Industries } from '@/collections/Industries'
import { Jobs } from '@/collections/Jobs'
import { Leads } from '@/collections/Leads'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Redirects } from '@/collections/Redirects'
import { Resources } from '@/collections/Resources'
import { Services } from '@/collections/Services'
import { Solutions } from '@/collections/Solutions'
import { Subscribers } from '@/collections/Subscribers'
import { TeamMembers } from '@/collections/TeamMembers'
import { Technologies } from '@/collections/Technologies'
import { Testimonials } from '@/collections/Testimonials'
import { Users } from '@/collections/Users'
import { Navigation } from '@/globals/Navigation'
import { SiteSettings } from '@/globals/SiteSettings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Payload runs inside the Next app — one repo, one deployment, self-hosted data
 * (docs/02 §1).
 *
 * The database is Supabase Postgres, reached through the **session** pooler on
 * port 5432 rather than the transaction pooler on 6543: Drizzle uses prepared
 * statements, which transaction mode does not support. The direct endpoint is
 * IPv6-only and does not resolve from every network, so the pooler is the
 * connection rather than a fallback.
 *
 * Payload owns the `payload` schema. Supabase keeps `public` for its own
 * objects, so nothing here collides with auth, storage or realtime.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — V4You',
    },
  },

  collections: [
    // Content
    Pages,
    Services,
    Industries,
    Faqs,
    TeamMembers,
    // Proof — all three gated on an explicit permission field
    Clients,
    Testimonials,
    CaseStudies,
    // Conversion — admin-only read
    Leads,
    Subscribers,
    // Library and admin
    Media,
    Redirects,
    Users,
    // Schema-only stubs for later phases (T-030)
    Solutions,
    Technologies,
    Resources,
    Jobs,
    AssessmentRuns,
    CalculatorRuns,
  ],

  globals: [Navigation, SiteSettings],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'src/types/payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      // Supabase terminates idle pooler connections; a small ceiling keeps the
      // dev server well inside the free tier's limit.
      max: 6,
      /**
       * Supabase signs its pooler certificate with its own root, which is in no
       * OS trust store — so node-postgres rejects it as SELF_SIGNED_CERT_IN_CHAIN.
       *
       * The usual workaround is `rejectUnauthorized: false`, which does not fix
       * the problem so much as stop asking the question: it accepts *any*
       * certificate, including one presented by something sitting between the
       * app and the database. Pinning the real root keeps verification on.
       *
       * See certs/README.md — the fingerprint should be checked against the
       * dashboard download before this is trusted in production.
       */
      ssl: {
        ca: readFileSync(path.resolve(dirname, 'certs/supabase-root-2021.pem'), 'utf8'),
        rejectUnauthorized: true,
      },
    },
    schemaName: 'payload',
  }),

  // Payload uses sharp for the image sizes declared on the media collection.
  sharp,

  graphQL: {
    // Nothing consumes GraphQL — the site uses the local API. Disabling it
    // removes a public surface rather than leaving one unattended.
    disable: true,
  },
})
