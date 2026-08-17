import type { Metadata } from 'next'

/**
 * Metadata and JSON-LD factories — docs/06 §A.
 *
 * JSON-LD is never hand-written in a page. Every schema the site emits is built
 * here, typed, so a page cannot invent a property or forget a required one.
 *
 * Deliberately absent: `AggregateRating`, `Review` and `Award`. docs/06 §A2
 * rules them out and the reason is worth keeping in view — there is no verified
 * data behind them, and fabricated structured data is both a policy violation
 * and a manual-action risk. If a genuine, permissioned review ever exists, it
 * gets a factory then and not before.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
)

const DEFAULT_OG_IMAGE = '/og-default.png'

export function absoluteUrl(path: string) {
  return path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export type PageSeo = {
  title: string
  description: string
  path: string
  ogImage?: string
  noIndex?: boolean
  type?: 'website' | 'article'
}

/**
 * Every page gets a unique title and description, an absolute canonical, and an
 * OG image — docs/06 §A1 and docs/05 "metadata rules". There is no templated
 * fallback for title or description on purpose: a missing one should be a
 * visible gap in review, not silently filled with the site default.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
  type = 'website',
}: PageSeo): Metadata {
  const url = absoluteUrl(path)
  const image = absoluteUrl(ogImage ?? DEFAULT_OG_IMAGE)

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: 'V4You Technologies',
      images: [{ url: image, width: 1200, height: 630, alt: 'V4You Technologies' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

type JsonLd = Record<string, unknown>

/**
 * Organisation details come from the `siteSettings` global, not from this file.
 * Fields the client has not supplied are omitted entirely — an incorrect
 * `address` or `telephone` in structured data is worse than an absent one,
 * because it is a machine-readable claim rather than a visual gap
 * (docs/08 §5).
 */
export type OrganizationInput = {
  legalName: string
  url?: string
  logo?: string
  email?: string
  telephone?: string
  addressLines?: string[]
  sameAs?: string[]
  description?: string
}

const omitEmpty = (obj: JsonLd): JsonLd =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0),
    ),
  )

export function organizationSchema(input: OrganizationInput): JsonLd {
  return omitEmpty({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'V4You Technologies',
    legalName: input.legalName,
    url: input.url ?? SITE_URL,
    logo: absoluteUrl(input.logo ?? '/logo-mark.svg'),
    description: input.description,
    email: input.email,
    telephone: input.telephone,
    address: input.addressLines?.length
      ? { '@type': 'PostalAddress', streetAddress: input.addressLines.join(', ') }
      : undefined,
    sameAs: input.sameAs,
  })
}

export function websiteSchema(): JsonLd {
  // No `SearchAction` until site search exists — docs/06 §A2 gates it on that.
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'V4You Technologies',
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}

export function webPageSchema({
  name,
  description,
  path,
  type = 'WebPage',
}: {
  name: string
  description: string
  path: string
  type?: 'WebPage' | 'AboutPage' | 'ContactPage'
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}

export function serviceSchema({
  name,
  description,
  path,
  serviceType,
  areaServed = ['IN', 'Worldwide'],
}: {
  name: string
  description: string
  path: string
  serviceType: string
  areaServed?: string[]
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${absoluteUrl(path)}#service`,
    name,
    description,
    serviceType,
    url: absoluteUrl(path),
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed,
  }
}

export type Breadcrumb = { name: string; path: string }

export function breadcrumbSchema(items: Breadcrumb[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export type Faq = { question: string; answer: string }

/**
 * Only emitted where the FAQs are visible on the page — docs/06 §A2 and
 * docs/12.4 in the blueprint. Returns null for an empty list rather than an
 * empty `FAQPage`, which Google treats as a markup error.
 */
export function faqSchema(faqs: Faq[]): JsonLd | null {
  if (faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

export function contactPointSchema({
  email,
  telephone,
  areaServed = ['IN', 'Worldwide'],
  availableLanguage = ['en'],
}: {
  email?: string
  telephone?: string
  areaServed?: string[]
  availableLanguage?: string[]
}): JsonLd | null {
  if (!email && !telephone) return null
  return omitEmpty({
    '@type': 'ContactPoint',
    contactType: 'sales',
    email,
    telephone,
    areaServed,
    availableLanguage,
  })
}
