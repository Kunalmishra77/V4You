import type { Metadata } from 'next'

import { PagePlaceholder } from '@/components/shared/PagePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Your next step is clear — V4You Technologies',
  description: 'Confirmation, expected response window, and one relevant next read.',
  path: '/thank-you',
  noIndex: true,
})

export default function Page() {
  return (
    <PagePlaceholder
      title="Your next step is clear"
      ticket="T-056"
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Thank you', path: '/thank-you' },
      ]}
      summary="Confirmation, expected response window, and one relevant next read."
    />
  )
}
