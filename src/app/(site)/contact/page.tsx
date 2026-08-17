import type { Metadata } from 'next'

import { PagePlaceholder } from '@/components/shared/PagePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Contact V4You Technologies — V4You Technologies',
  description: 'The consultation form, what happens after you submit, and office details.',
  path: '/contact',
})

export default function Page() {
  return (
    <PagePlaceholder
      title="Contact V4You Technologies"
      ticket="T-066"
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
      ]}
      summary="The consultation form, what happens after you submit, and office details."
    />
  )
}
