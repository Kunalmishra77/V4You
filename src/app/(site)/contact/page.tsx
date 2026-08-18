import type { Metadata } from 'next'

import { FAQAccordion } from '@/components/blocks/FAQAccordion'
import { ConsultationForm } from '@/components/forms/ConsultationForm'
import { WhatsAppButton } from '@/components/forms/WhatsAppButton'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { JsonLd } from '@/components/shared/JsonLd'
import { SectionShell } from '@/components/shared/SectionShell'
import { getSiteSettings } from '@/lib/content'
import { buildMetadata, contactPointSchema, organizationSchema, webPageSchema } from '@/lib/seo'
import { reportMissingAsset } from '@/lib/missing-assets'
import { contactFaqs } from '@/seed/contact'

/**
 * Contact — docs/05 §23.
 *
 * Two columns: the form on the left, contact details and what-happens-next on
 * the right.
 *
 * The right column is mostly absent today, and visibly so. Email, phone and
 * address have not been supplied, and docs/08 §5 treats a placeholder in
 * structured data as incorrect markup rather than a gap — so `ContactPoint`
 * omits itself entirely rather than emitting a made-up address.
 */
export const metadata: Metadata = buildMetadata({
  title: 'Contact V4You Technologies',
  description:
    'Tell us what you are trying to change. We reply within one business day, and the first call is 30 minutes of questions rather than a pitch.',
  path: '/contact',
})

export default async function ContactPage() {
  const settings = await getSiteSettings()
  const { contact } = settings

  const hasDirectContact = Boolean(contact.email || contact.phone || contact.addressLines?.length)
  if (!hasDirectContact) {
    reportMissingAsset({
      component: 'ContactPage',
      needs: 'siteSettings.contact — email, phone, address, legal entity name',
      blocks:
        'the contact details column and the ContactPoint JSON-LD; the form is the only route in',
    })
  }

  const contactPoint = contactPointSchema({ email: contact.email, telephone: contact.phone })

  return (
    <>
      <JsonLd
        schemas={[
          webPageSchema({
            name: 'Contact V4You Technologies',
            description: 'Start a conversation about what you are trying to change.',
            path: '/contact',
            type: 'ContactPage',
          }),
          contactPoint
            ? {
                ...organizationSchema({
                  legalName: contact.legalEntityName ?? 'V4You Technologies',
                }),
                contactPoint: [contactPoint],
              }
            : null,
        ]}
      />

      <SectionShell canvas="navy" as="div">
        <div className="mb-10">
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: 'Contact', path: '/contact' },
            ]}
          />
        </div>
        <Eyebrow>Start here</Eyebrow>
        <h1 className="mt-5 max-w-headline font-display text-h1 text-(--ink)">
          Tell us what you are trying to change.
        </h1>
        <p className="mt-6 max-w-measure text-body-lg">
          No hard sell, and no discovery call that turns out to be a demo. Share as much or as
          little as you know — we will come prepared with questions.
        </p>
      </SectionShell>

      <SectionShell canvas="bone">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,20rem)] lg:gap-16">
          <div>
            <h2 className="sr-only">Consultation enquiry form</h2>
            <ConsultationForm source="/contact" />
          </div>

          <aside className="border-t border-(--line) pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
            <h2 className="font-mono text-label text-(--accent-text) uppercase">
              Before you send it
            </h2>
            <ul className="mt-5 space-y-4 text-body-sm">
              <li>Your project details stay confidential.</li>
              <li>Need an NDA? Mention it in the form and we will bring one.</li>
              <li>We will suggest the most practical next step, even if it is not us.</li>
            </ul>

            {(contact.email || contact.phone || contact.whatsapp) && (
              <>
                <h2 className="mt-10 font-mono text-label text-(--accent-text) uppercase">
                  Prefer another way
                </h2>
                <ul className="mt-5 space-y-3 text-body-sm">
                  {contact.email && (
                    <li>
                      <a
                        href={`mailto:${contact.email}`}
                        className="underline underline-offset-4 hover:text-(--ink)"
                      >
                        {contact.email}
                      </a>
                    </li>
                  )}
                  {contact.phone && (
                    <li>
                      <a
                        href={`tel:${contact.phone.replace(/\s/g, '')}`}
                        className="underline underline-offset-4 hover:text-(--ink)"
                      >
                        {contact.phone}
                      </a>
                    </li>
                  )}
                </ul>
                <div className="mt-6">
                  <WhatsAppButton number={contact.whatsapp} />
                </div>
              </>
            )}

            {contact.addressLines?.length ? (
              <>
                <h2 className="mt-10 font-mono text-label text-(--accent-text) uppercase">
                  Where we are
                </h2>
                <address className="mt-5 text-body-sm not-italic">
                  {contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </>
            ) : null}
          </aside>
        </div>
      </SectionShell>

      <FAQAccordion
        faqs={contactFaqs}
        eyebrow="Working together"
        heading="What people ask before getting in touch"
        canvas="bone-2"
      />
    </>
  )
}
