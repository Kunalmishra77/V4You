import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { StickyMobileCTA } from '@/components/layout/StickyMobileCTA'
import { getNavigation } from '@/lib/content'

/**
 * The public marketing shell — docs/02 §2.
 *
 * `pb-20` under 700px is the counterweight to StickyMobileCTA's fixed bar. The
 * two have to change together; if the bar grows, this grows.
 *
 * `#main` is the skip link's target and carries `tabIndex={-1}` so that
 * following the link actually moves focus rather than only scrolling — without
 * it, the next Tab press returns to the top of the header.
 */
export default async function SiteLayout({ children }: LayoutProps<'/'>) {
  const navigation = await getNavigation()

  return (
    <>
      <SiteHeader navigation={navigation} />
      <main id="main" tabIndex={-1} className="flex-1 pb-20 min-[700px]:pb-0">
        {children}
      </main>
      <SiteFooter />
      <StickyMobileCTA cta={navigation.stickyCta} />
    </>
  )
}
