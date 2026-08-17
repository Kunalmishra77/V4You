import type { Metadata } from 'next'

import { PagePlaceholder } from '@/components/shared/PagePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'V4You Technologies — AI-First Digital Transformation Company',
  description:
    'V4You helps startups, SMEs and enterprises turn complex business problems into intelligent products, connected workflows and measurable growth.',
  path: '/',
})

export default function HomePage() {
  return (
    <PagePlaceholder
      title="Build what’s next. Automate what slows you down."
      ticket="T-058"
      summary="The finished home page is the fifteen-block sequence in docs/05 §1, opening with HeroPrimary and its orchestration diagram."
    />
  )
}
