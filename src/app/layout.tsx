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
    <html
      lang="en"
      className={`${fontVariables} no-js h-full antialiased`}
      // The script below removes `no-js` before React hydrates, so the client's
      // class list legitimately differs from the server's. Suppression applies
      // to this element's attributes only, which is exactly the scope wanted.
      suppressHydrationWarning
    >
      <head>
        {/*
          Removes `.no-js` before first paint. Sections that reveal on scroll are
          server-rendered in their hidden state so there is no flash of content
          being hidden after hydration — which means that without JavaScript they
          would stay hidden forever. This one line is the guarantee that they do
          not. It runs inline and synchronously, ahead of any stylesheet paint.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js')`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
