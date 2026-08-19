'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'

import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import type { MegaMenu as MegaMenuData } from '@/types/content'

/**
 * MegaMenu — docs/04 §2, docs/06 §C2.
 *
 * Opens on hover and on click; closes on Escape, on focusout, and on route
 * change. It never opens on focus alone — a keyboard user tabbing along the
 * header would otherwise have a panel thrown open at them on every stop, which
 * is why docs/04 calls that out specifically.
 *
 * The trigger is a real `<button>` with `aria-expanded`, and the panel is a
 * plain list of links. There is no `role="menu"`: that role implies an
 * application menu with arrow-key-only navigation, and this is a set of page
 * links where Tab is the behaviour people expect.
 */
export function MegaMenu({ menu, condensed }: { menu: MegaMenuData; condensed: boolean }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const panelId = useId()
  const pathname = usePathname()

  // Close on route change. Without this the panel survives the navigation it
  // just triggered.
  //
  // Adjusted during render rather than in an effect: React re-renders
  // immediately without painting the stale state, so the panel never flashes
  // open on the new route. An effect would run after paint, and React 19's
  // hooks lint rightly flags the cascading render it causes.
  const [renderedPath, setRenderedPath] = useState(pathname)
  if (renderedPath !== pathname) {
    setRenderedPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      // Escape returns focus to the trigger, not to nowhere.
      containerRef.current?.querySelector('button')?.focus()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const openMenu = () => {
    clearTimeout(closeTimer.current)
    if (!open) track('mega_menu_open', { menu: menu.label })
    setOpen(true)
  }

  // A short grace period on pointer-out, so crossing the gap between the
  // trigger and the panel does not close it.
  const scheduleClose = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  return (
    <div
      ref={containerRef}
      className="static"
      onPointerEnter={openMenu}
      onPointerLeave={scheduleClose}
      // Focus moving into the panel cancels a close scheduled by the pointer
      // leaving the trigger.
      onFocusCapture={() => clearTimeout(closeTimer.current)}
      onBlur={(event) => {
        // Close once focus leaves the trigger and the whole panel.
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? setOpen(false) : openMenu())}
        className={cn(
          'inline-flex items-center gap-1.5 py-2 font-display text-body-sm font-medium',
          'transition-colors duration-(--duration-menu)',
          open ? 'text-amber-500' : 'text-bone hover:text-amber-500',
        )}
      >
        {menu.label}
        <span
          aria-hidden="true"
          className={cn(
            'mt-px block size-1.5 border-r border-b border-current transition-transform duration-(--duration-menu)',
            open ? '-translate-y-px rotate-225' : 'rotate-45',
          )}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className={cn(
          'menu-panel absolute inset-x-0 z-40 border-t border-navy-700 bg-navy-800 shadow-2xl',
          condensed ? 'top-16' : 'top-19',
        )}
      >
        <div className="mx-auto grid w-full max-w-content gap-10 px-gutter py-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <div className="grid gap-10 sm:grid-cols-3">
            {menu.groups.map((group, index) => (
              <div
                key={group.heading}
                data-menu-column=""
                style={{ '--reveal-index': index } as CSSProperties}
              >
                <h3 className="font-mono text-label text-amber-500 uppercase">{group.heading}</h3>
                {group.supportingCopy && (
                  <p className="mt-2 text-body-sm text-slate-300">{group.supportingCopy}</p>
                )}
                <ul className="mt-5 space-y-4">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group/link block font-display text-body-sm font-medium text-bone transition-colors hover:text-amber-500"
                      >
                        {link.label}
                        {link.description && (
                          <span className="mt-1 block font-body font-normal text-slate-300">
                            {link.description}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {menu.featuredPanel && (
            <div
              data-menu-column=""
              style={{ '--reveal-index': menu.groups.length } as CSSProperties}
              className="border-t border-navy-700 pt-8 surface-navy lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12"
            >
              {menu.featuredPanel.eyebrow && <Eyebrow>{menu.featuredPanel.eyebrow}</Eyebrow>}
              <p className="mt-4 font-display text-h3 text-bone">{menu.featuredPanel.heading}</p>
              {menu.featuredPanel.body && (
                <p className="mt-3 text-body-sm text-slate-300">{menu.featuredPanel.body}</p>
              )}
              <Button href={menu.featuredPanel.ctaHref} className="mt-6">
                {menu.featuredPanel.ctaLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
