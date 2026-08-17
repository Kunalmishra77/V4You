import type { Metadata } from 'next'

import { HeroPrimary } from '@/components/blocks/HeroPrimary'
import { homeHero } from '@/seed/home'

export const metadata: Metadata = {
  title: 'Hero diagram — V4You',
  robots: { index: false, follow: false },
}

export default function DiagramPreview() {
  return <HeroPrimary {...homeHero} />
}
