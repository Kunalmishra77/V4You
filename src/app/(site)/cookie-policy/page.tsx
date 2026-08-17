import type { Metadata } from 'next'

import { PagePlaceholder } from '@/components/shared/PagePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Cookie policy — V4You Technologies',
  description: 'Requires client-supplied legal copy, and must match what actually loads.',
  path: '/cookie-policy',
})

export default function Page() {
  return (
    <PagePlaceholder
      title="Cookie policy"
      ticket="T-067"
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Cookie policy', path: '/cookie-policy' },
      ]}
      summary="Requires client-supplied legal copy, and must match what actually loads."
    />
  )
}
