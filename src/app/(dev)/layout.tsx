import type { Metadata } from 'next'

import { fontVariables } from '@/lib/fonts'

import '../globals.css'

/**
 * Root layout for the build-reference routes. Separate from (site) so the
 * design system and block previews render without the header, footer and
 * sticky CTA getting in the way of what is being reviewed.
 *
 * Noindexed at the page level and excluded from the sitemap.
 */
export const metadata: Metadata = {
  title: 'Build reference — V4You',
  robots: { index: false, follow: false },
}

export default function DevLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
