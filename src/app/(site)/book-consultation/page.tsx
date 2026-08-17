import type { Metadata } from 'next'

import { PagePlaceholder } from '@/components/shared/PagePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Book a transformation consultation — V4You Technologies',
  description: 'A focused conversion page: the form, with no navigation competing for attention.',
  path: '/book-consultation',
})

export default function Page() {
  return (
    <PagePlaceholder
      title="Book a transformation consultation"
      ticket="T-066"
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Book a consultation', path: '/book-consultation' },
      ]}
      summary="A focused conversion page: the form, with no navigation competing for attention."
    />
  )
}
