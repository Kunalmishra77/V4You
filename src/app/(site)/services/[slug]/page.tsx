import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PagePlaceholder } from '@/components/shared/PagePlaceholder'
import { SERVICE_LABELS, SERVICE_SLUGS, type ServiceSlug } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'

/**
 * One template, seven pages — docs/05 §4–10. Statically generated from the
 * route table; anything outside it is a genuine 404 rather than an empty page.
 */
export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }))
}

const isServiceSlug = (slug: string): slug is ServiceSlug =>
  (SERVICE_SLUGS as readonly string[]).includes(slug)

export async function generateMetadata({
  params,
}: PageProps<'/services/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  if (!isServiceSlug(slug)) return {}

  return buildMetadata({
    title: `${SERVICE_LABELS[slug]} — V4You Technologies`,
    description: `${SERVICE_LABELS[slug]} at V4You: the problems it solves, what we deliver, how engagements run, and what drives cost.`,
    path: `/services/${slug}`,
  })
}

export default async function ServicePage({ params }: PageProps<'/services/[slug]'>) {
  const { slug } = await params
  if (!isServiceSlug(slug)) notFound()

  return (
    <PagePlaceholder
      title={SERVICE_LABELS[slug]}
      ticket="T-060 · T-061"
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: SERVICE_LABELS[slug], path: `/services/${slug}` },
      ]}
      summary="The finished page runs the thirteen-block service template from docs/05, with a sticky contextual sub-navigation tracking scroll position through it."
    />
  )
}
