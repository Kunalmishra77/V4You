import type { Metadata } from 'next'

import { CapabilityTabs } from '@/components/blocks/CapabilityTabs'
import { HeroPrimary } from '@/components/blocks/HeroPrimary'
import { IndustryTabs } from '@/components/blocks/IndustryTabs'
import { PillarCards } from '@/components/blocks/PillarCards'
import { ProblemCards } from '@/components/blocks/ProblemCards'
import { ServiceCardGrid } from '@/components/blocks/ServiceCardGrid'
import { TrustBar } from '@/components/blocks/TrustBar'
import { homeHero } from '@/seed/home'

export const metadata: Metadata = {
  title: 'Blocks — V4You',
  robots: { index: false, follow: false },
}

/**
 * The blocks built so far, in the home-page order from docs/05 §1, so the
 * section rhythm can be checked as well as the components themselves.
 */
export default function BlocksPreview() {
  return (
    <>
      <HeroPrimary {...homeHero} />
      <TrustBar />
      <ProblemCards />
      <PillarCards />
      <ServiceCardGrid />
      <CapabilityTabs />
      <IndustryTabs />
    </>
  )
}
