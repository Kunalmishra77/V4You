import type { Metadata } from 'next'

import { PagePlaceholder } from '@/components/shared/PagePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Digital Transformation Services — V4You',
  description:
    'Consulting, product engineering, AI and automation, cloud and growth — seven capabilities under one accountable partner.',
  path: '/services',
})

export default function ServicesHubPage() {
  return (
    <PagePlaceholder
      title="Choose the capability you need today."
      ticket="T-059"
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
      ]}
      summary="The finished hub is HeroPage, intro, ServiceCardGrid across all seven services, ProcessTimeline, SolutionMatrix, FAQAccordion and CTABand."
    />
  )
}
