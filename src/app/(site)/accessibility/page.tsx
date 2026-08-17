import type { Metadata } from 'next'

import { PagePlaceholder } from '@/components/shared/PagePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Accessibility — V4You Technologies',
  description:
    'The standard targeted, the date last reviewed, known limitations, and how to report an issue.',
  path: '/accessibility',
})

export default function Page() {
  return (
    <PagePlaceholder
      title="Accessibility"
      ticket="T-067"
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Accessibility', path: '/accessibility' },
      ]}
      summary="The standard targeted, the date last reviewed, known limitations, and how to report an issue."
    />
  )
}
