import type { Metadata } from 'next'

import { fontVariables } from '@/lib/fonts'

import './globals.css'

export const metadata: Metadata = {
  title: 'V4You Technologies',
  description:
    'V4You helps startups, SMEs and enterprises turn complex business problems into intelligent products, connected workflows and measurable growth.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
