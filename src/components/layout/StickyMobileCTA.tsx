import { Button } from '@/components/shared/Button'
import type { StickyCta } from '@/types/content'

/**
 * StickyMobileCTA — docs/04 §5.
 *
 * Fixed bottom bar under 700px. The body gets matching bottom padding so the
 * bar never sits on top of the last thing on the page — the offset is applied
 * in the site layout, and the two have to move together if this height changes.
 *
 * `pb-[env(safe-area-inset-bottom)]` keeps the button clear of the iOS home
 * indicator, which otherwise overlaps the bottom ~34px in portrait.
 */
export function StickyMobileCTA({ cta }: { cta: StickyCta }) {
  if (!cta.showOnMobile) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-navy-700 bg-navy-900 pb-[env(safe-area-inset-bottom)] surface-navy max-[699px]:block min-[700px]:hidden">
      <div className="px-gutter py-3">
        <Button href={cta.href} block>
          {cta.label}
        </Button>
      </div>
    </div>
  )
}
