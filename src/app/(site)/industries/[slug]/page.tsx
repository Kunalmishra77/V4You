import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PagePlaceholder } from '@/components/shared/PagePlaceholder'
import { INDUSTRY_LABELS, INDUSTRY_SLUGS, type IndustrySlug } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'

/**
 * One template, eleven pages — docs/05 §12–22.
 *
 * docs/05 sets a uniqueness bar these pages must clear before they can be
 * published: an original `context`, at least four distinct challenges, four use
 * cases and four unique FAQs each. That is enforced as a Payload
 * `beforeValidate` hook when the CMS lands. It is the guard against eleven
 * near-identical pages, which the blueprint explicitly forbids.
 */
export function generateStaticParams() {
  return INDUSTRY_SLUGS.map((slug) => ({ slug }))
}

const isIndustrySlug = (slug: string): slug is IndustrySlug =>
  (INDUSTRY_SLUGS as readonly string[]).includes(slug)

export async function generateMetadata({
  params,
}: PageProps<'/industries/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  if (!isIndustrySlug(slug)) return {}

  return buildMetadata({
    title: `${INDUSTRY_LABELS[slug]} technology solutions — V4You`,
    description: `How ${INDUSTRY_LABELS[slug].toLowerCase()} operations actually run, the challenges we see repeatedly, and where we typically start.`,
    path: `/industries/${slug}`,
  })
}

export default async function IndustryPage({ params }: PageProps<'/industries/[slug]'>) {
  const { slug } = await params
  if (!isIndustrySlug(slug)) notFound()

  return (
    <PagePlaceholder
      title={INDUSTRY_LABELS[slug]}
      ticket="T-063 · T-064"
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Industries', path: '/industries' },
        { name: INDUSTRY_LABELS[slug], path: `/industries/${slug}` },
      ]}
      summary="The finished page runs the eleven-block industry template from docs/05, and cannot be published until it clears the uniqueness thresholds."
    />
  )
}
