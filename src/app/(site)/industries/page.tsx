import type { Metadata } from 'next'

import { PagePlaceholder } from '@/components/shared/PagePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Industry Solutions — V4You Technologies',
  description:
    'Technology shaped around how your industry actually operates — eleven sectors, each with its own operating reality, challenges and starting points.',
  path: '/industries',
})

export default function IndustriesHubPage() {
  return (
    <PagePlaceholder
      title="Technology shaped around how your industry operates."
      ticket="T-062"
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Industries', path: '/industries' },
      ]}
      summary="The finished hub is HeroPage, intro, a card grid across all eleven industries, SolutionMatrix, CaseStudyRail and CTABand."
    />
  )
}
