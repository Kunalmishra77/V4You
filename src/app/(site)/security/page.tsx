import type { Metadata } from 'next'

import { PagePlaceholder } from '@/components/shared/PagePlaceholder'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Security at V4You — V4You Technologies',
  description:
    'Environments, access control, testing, monitoring and incident handling — practices only, no certification claims.',
  path: '/security',
})

export default function Page() {
  return (
    <PagePlaceholder
      title="Security at V4You"
      ticket="T-067"
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Security', path: '/security' },
      ]}
      summary="Environments, access control, testing, monitoring and incident handling — practices only, no certification claims."
    />
  )
}
