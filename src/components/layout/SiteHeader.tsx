'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Logo } from '@/components/layout/Logo'
import { MegaMenu } from '@/components/layout/MegaMenu'
import { MobileDrawer } from '@/components/layout/MobileDrawer'
import { Button } from '@/components/shared/Button'
import { cn } from '@/lib/utils'
import type { Navigation } from '@/types/content'
import { SwapLabel } from '@/components/shared/SwapLabel'

/**
 * SiteHeader — docs/04 §1, docs/01 §5.
 *
 * Navy from the first pixel. docs/04 is explicit that transparent-to-solid is
 * not used here: the hero is navy, so a transparent header would be a
 * transition between two identical states, and the border would appear from
 * nowhere. Instead the header gains a border and shadow at 90px, and shrinks
 * from 76px to 64px.
 *
 * The skip link is the first focusable element in the document — docs/06 §C1.
 */
export function SiteHeader({ navigation }: { navigation: Navigation }) {
  const [condensed, setCondensed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 90)
    onScroll() // A reload part-way down the page should start condensed.
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      className={cn(
        'sticky top-0 z-40 bg-navy-900 surface-navy',
        'transition-[height,box-shadow,border-color] duration-(--duration-header) ease-out',
        condensed ? 'border-b border-navy-700 shadow-lg' : 'border-b border-transparent',
      )}
    >
      <a
        href="#main"
        className="sr-only z-50 bg-amber-500 px-4 py-3 font-display text-body-sm font-semibold text-navy-900 focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to content
      </a>

      <div
        className={cn(
          'mx-auto flex w-full max-w-content items-center gap-8 px-gutter',
          'transition-[height] duration-(--duration-header) ease-out',
          condensed ? 'h-16' : 'h-19',
        )}
      >
        <Logo
          priority
          responsive
          className={cn(
            'w-auto transition-[height] duration-(--duration-header) ease-out',
            condensed ? 'h-8' : 'h-10',
          )}
          markClassName={cn(
            'w-auto transition-[height] duration-(--duration-header) ease-out',
            condensed ? 'h-8' : 'h-9',
          )}
        />

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-8 lg:flex">
          {navigation.megaMenus.map((menu) => (
            <MegaMenu key={menu.label} menu={menu} condensed={condensed} />
          ))}

          {navigation.primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(link.href) ? 'page' : undefined}
              className={cn(
                'py-2 font-display text-body-sm font-medium transition-colors duration-(--duration-menu)',
                isCurrent(link.href) ? 'text-amber-500' : 'text-bone hover:text-amber-500',
              )}
            >
              <SwapLabel>{link.label}</SwapLabel>
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden lg:ml-0 lg:block">
          <Button href={navigation.stickyCta.href}>{navigation.stickyCta.label}</Button>
        </div>

        <div className="ml-auto lg:hidden">
          <MobileDrawer navigation={navigation} />
        </div>
      </div>
    </header>
  )
}
