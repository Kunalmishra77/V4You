import type { Metadata } from 'next'

import { PagePlaceholder } from '@/components/shared/PagePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Terms of service — V4You Technologies',
  description: 'Requires client-supplied legal copy — docs/08 §6 forbids drafting it here.',
  path: '/terms',
})

export default function Page() {
  return (
    <PagePlaceholder
      title="Terms of service"
      ticket="T-067"
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Terms', path: '/terms' },
      ]}
      summary="Requires client-supplied legal copy — docs/08 §6 forbids drafting it here."
    />
  )
}
