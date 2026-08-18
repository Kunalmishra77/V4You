import type { Metadata } from 'next'

import { CTABand } from '@/components/blocks/CTABand'
import { FAQAccordion } from '@/components/blocks/FAQAccordion'
import { ProcessTimeline } from '@/components/blocks/ProcessTimeline'
import { ServiceCardGrid } from '@/components/blocks/ServiceCardGrid'
import { SolutionMatrix } from '@/components/blocks/SolutionMatrix'
import { HeroPage } from '@/components/blocks/HeroPage'
import { JsonLd } from '@/components/shared/JsonLd'
import { buildMetadata, faqSchema, webPageSchema } from '@/lib/seo'
import { servicesHubFaqs } from '@/seed/services-detail'

/**
 * Services hub — T-059, docs/05 §3.
 *
 * HeroPage → ServiceCardGrid (all seven) → ProcessTimeline → SolutionMatrix →
 * FAQAccordion → CTABand.
 *
 * The intro docs/05 asks for lives in the hero's body rather than as a separate
 * prose block: a paragraph of scene-setting between a headline and the thing it
 * introduces is a step the reader has to climb over.
 */
export const metadata: Metadata = buildMetadata({
  title: 'Digital Transformation Services — V4You',
  description:
    'Consulting, product engineering, AI and automation, cloud and growth — seven capabilities under one accountable partner, each able to start narrow.',
  path: '/services',
})

export default function ServicesHubPage() {
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ]

  return (
    <>
      <JsonLd
        schemas={[
          webPageSchema({
            name: 'Digital Transformation Services',
            description:
              'Seven capabilities under one accountable partner: AI and automation, software, websites, mobile, growth, cloud and consulting.',
            path: '/services',
          }),
          faqSchema(servicesHubFaqs),
        ]}
      />

      <HeroPage
        eyebrow="What we do"
        headline="Choose the capability you need today."
        body="Seven services, one delivery model. Most engagements start with the narrowest useful piece and widen once that piece has proved itself — which is easier to justify internally than a transformation programme, and easier for us to be accountable for."
        breadcrumbs={breadcrumbs}
        primaryCta={{ label: 'Book a transformation consultation', href: '/book-consultation' }}
        secondaryCta={{ label: 'Find your industry', href: '/industries' }}
      />

      <ServiceCardGrid
        eyebrow="The seven"
        heading="Start where the problem is."
        body="Each page sets out what the service solves, what you get, how the engagement runs, and what drives the cost."
      />

      <ProcessTimeline canvas="navy" />

      <SolutionMatrix />

      <FAQAccordion
        faqs={servicesHubFaqs}
        eyebrow="Working together"
        heading="What people ask before choosing a service"
        canvas="bone-2"
      />

      <CTABand secondaryCta={{ label: 'Find your industry', href: '/industries' }} />
    </>
  )
}
