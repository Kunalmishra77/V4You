import type { Metadata } from 'next'

import { PagePlaceholder } from '@/components/shared/PagePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy policy — V4You Technologies',
  description: 'Requires client-supplied legal copy — docs/08 §6 forbids drafting it here.',
  path: '/privacy-policy',
})

export default function Page() {
  return (
    <PagePlaceholder
      title="Privacy policy"
      ticket="T-067"
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Privacy policy', path: '/privacy-policy' },
      ]}
      summary="Requires client-supplied legal copy — docs/08 §6 forbids drafting it here."
    />
  )
}
