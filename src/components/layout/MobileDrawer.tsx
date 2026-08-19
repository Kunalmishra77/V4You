'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/shared/Button'
import type { Navigation } from '@/types/content'
import { lockScroll, unlockScroll } from '@/lib/lenis'

/**
 * MobileDrawer — docs/04 §3, docs/06 §C2.
 *
 * Full-screen, accordion groups, one persistent CTA pinned at the bottom.
 * Never a flat list of fifty links, which is the failure blueprint §3.6 names.
 *
 * Accessibility contract, all verified by keyboard:
 *   - `role="dialog"` with `aria-modal="true"`
 *   - focus trapped inside while open
 *   - focus returned to the burger on close
 *   - body scroll locked, without the layout shift that hiding the scrollbar
 *     normally causes
 *   - Escape closes
 *
 * Uses `<details>`/`<summary>` for the groups rather than a hand-rolled
 * accordion: it is keyboard-operable and screen-reader-announced natively, and
 * it still works before hydration.
 */
export function MobileDrawer({ navigation }: { navigation: Navigation }) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  /**
   * Closing always returns focus to the burger. Every close path has to go
   * through here — Escape, the X button and a click on a link all leave focus
   * on a removed node otherwise, which drops the caret to <body> and sends the
   * next Tab back to the top of the document.
   *
   * Route changes are the exception: the browser moves focus itself, so
   * grabbing it back would fight the navigation.
   */
  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  // Close on route change, adjusted during render rather than in an effect so
  // the drawer never paints over the page it has just navigated to.
  const [renderedPath, setRenderedPath] = useState(pathname)
  if (renderedPath !== pathname) {
    setRenderedPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return

    // Lock scroll. Compensating for the scrollbar width stops the page behind
    // the drawer jumping sideways as it disappears.
    const { body, documentElement } = document
    const scrollbar = window.innerWidth - documentElement.clientWidth
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    // `overflow: hidden` stops the browser scrolling the document. It does not
    // stop Lenis, which drives scrollTop itself on a rAF loop and will keep
    // sliding the page along behind this panel. Both are needed.
    lockScroll()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), summary, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    // Move focus in, so the first Tab lands inside the drawer rather than
    // behind it.
    panelRef.current?.querySelector<HTMLElement>('button, a[href]')?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
      unlockScroll()
    }
  }, [open, close])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Open menu"
        className="-mr-2 inline-flex size-11 items-center justify-center text-bone lg:hidden"
      >
        <span aria-hidden="true" className="relative block h-3.5 w-6">
          <span className="absolute inset-x-0 top-0 h-0.5 bg-current" />
          <span className="absolute inset-x-0 top-1.5 h-0.5 bg-current" />
          <span className="absolute inset-x-0 top-3 h-0.5 bg-current" />
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 flex flex-col bg-navy-900 surface-navy lg:hidden"
        >
          <div ref={panelRef} className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-navy-700 px-gutter py-4">
              <Logo className="h-7 w-auto" />
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="-mr-2 inline-flex size-11 items-center justify-center text-bone"
              >
                <span aria-hidden="true" className="relative block size-5">
                  <span className="absolute top-1/2 left-0 h-0.5 w-full rotate-45 bg-current" />
                  <span className="absolute top-1/2 left-0 h-0.5 w-full -rotate-45 bg-current" />
                </span>
              </button>
            </div>

            <nav aria-label="Mobile" className="min-h-0 flex-1 overflow-y-auto px-gutter py-6">
              <ul className="divide-y divide-navy-700 border-b border-navy-700">
                {navigation.megaMenus.map((menu) => (
                  <li key={menu.label}>
                    <details className="group py-1">
                      <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-display text-h3 text-bone [&::-webkit-details-marker]:hidden">
                        {menu.label}
                        <span
                          aria-hidden="true"
                          className="block size-2.5 rotate-45 border-r-2 border-b-2 border-amber-500 transition-transform group-open:-translate-y-1 group-open:rotate-225"
                        />
                      </summary>

                      <div className="pb-5">
                        {menu.groups.map((group) => (
                          <div key={group.heading} className="mt-4 first:mt-0">
                            <p className="font-mono text-label text-amber-500 uppercase">
                              {group.heading}
                            </p>
                            <ul className="mt-3 space-y-1">
                              {group.links.map((link) => (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    className="block py-2 text-body text-slate-300 hover:text-bone"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        {menu.href && (
                          <Link
                            href={menu.href}
                            className="mt-5 inline-block font-display text-body-sm font-medium text-amber-500 underline underline-offset-4"
                          >
                            All {menu.label.toLowerCase()}
                          </Link>
                        )}
                      </div>
                    </details>
                  </li>
                ))}

                {navigation.primaryLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block py-5 font-display text-h3 text-bone hover:text-amber-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-navy-700 px-gutter py-5">
              <Button href={navigation.stickyCta.href} block size="lg">
                Book a transformation consultation
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
