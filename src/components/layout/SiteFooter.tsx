import Link from 'next/link'

import { Logo } from '@/components/layout/Logo'
import { getNavigation, getSiteSettings, visibleFooterColumns } from '@/lib/content'

/**
 * SiteFooter — docs/04 §4.
 *
 * Columns whose feature flag is off are omitted entirely, not rendered empty.
 * In Phase 1 that removes Solutions and Resources, leaving Company, Services,
 * Industries and Trust.
 *
 * The contact block is the same story at field level. Email, phone and address
 * have not been supplied, so the whole "Connect" cluster collapses to a link to
 * /contact rather than showing labelled blanks. A legal entity line is omitted
 * for the same reason — docs/08 §5 treats a placeholder there as incorrect
 * markup, not a gap.
 */
export async function SiteFooter() {
  const [navigation, settings] = await Promise.all([getNavigation(), getSiteSettings()])
  const columns = visibleFooterColumns(navigation, settings)
  const { contact, socials } = settings
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-navy-900 surface-navy">
      <div className="mx-auto w-full max-w-content px-gutter py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Logo className="h-9 w-auto" />
            <p className="mt-5 max-w-measure text-body-sm text-slate-300">
              AI-first transformation for businesses ready to move forward. Strategy, design,
              engineering, AI, cloud and growth — connected under one accountable partner.
            </p>

            {socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-4">
                {socials.map((social) => (
                  <li key={social.url}>
                    <a
                      href={social.url}
                      rel="noopener noreferrer"
                      className="font-mono text-label text-slate-300 uppercase transition-colors hover:text-amber-500"
                    >
                      {social.platform}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => (
              <div key={column.heading}>
                <h2 className="font-mono text-label text-amber-500 uppercase">{column.heading}</h2>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      {/*
                        A rule that grows from the left rather than appearing.
                        Safe here in a way it would not be in prose: these links
                        sit in a labelled navigation list where position, not
                        appearance, identifies them as links — so an underline
                        that is only present on hover adds emphasis rather than
                        carrying the only cue.
                      */}
                      <Link
                        href={link.href}
                        className="link-wipe text-body-sm text-slate-300 transition-colors hover:text-bone"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/*
          Trust strip. blueprint §3.8 places technology ecosystem logos here, but
          only where a usage claim is accurate — that arrives with LogoMarquee
          and its "Technologies we work with" label, never "Our partners".
        */}
        <div className="mt-16 border-t border-navy-700 pt-8">
          <div className="flex flex-col gap-4 text-body-sm text-slate-300 md:flex-row md:items-center md:justify-between">
            <p>
              © {year} V4You Technologies
              {contact.legalEntityName ? ` · ${contact.legalEntityName}` : ''}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-bone">
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="transition-colors hover:text-bone"
                >
                  {contact.phone}
                </a>
              )}
              <Link href="/contact" className="transition-colors hover:text-bone">
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
