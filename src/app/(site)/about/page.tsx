import type { Metadata } from 'next'

import { PagePlaceholder } from '@/components/shared/PagePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'About V4You Technologies — V4You Technologies',
  description: 'Mission, story, values, leadership, quality and security, and global delivery.',
  path: '/about',
})

export default function Page() {
  return (
    <PagePlaceholder
      title="About V4You Technologies"
      ticket="T-065"
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
      ]}
      summary="Mission, story, values, leadership, quality and security, and global delivery."
    />
  )
}
