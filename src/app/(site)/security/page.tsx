import type { Metadata } from 'next'

import { CTABand } from '@/components/blocks/CTABand'
import { HeroPage } from '@/components/blocks/HeroPage'
import { NumberedAccordion } from '@/components/blocks/NumberedAccordion'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { JsonLd } from '@/components/shared/JsonLd'
import { SectionShell } from '@/components/shared/SectionShell'
import { getSiteSettings } from '@/lib/content'
import { buildMetadata, webPageSchema } from '@/lib/seo'

/**
 * /security — T-067, docs/05 and blueprint §14.
 *
 * This page is the clearest test of CLAUDE.md rule 1 on the whole site,
 * because a security page is where the temptation to imply certification is
 * strongest and where the consequence of doing so is worst.
 *
 * So: it describes practices, precisely, in language a client could hold us to.
 * It names no standard we are certified against, because we are not certified
 * against any. blueprint §14 is explicit — never claim ISO, SOC, GDPR, DPDP,
 * HIPAA or PCI without a legal and technical basis, and use "aligned with" or
 * "supports" only when accurate.
 *
 * The section that says what we do *not* have is deliberate. A security page
 * that lists only strengths tells a reviewer nothing, because every security
 * page lists only strengths. Saying what is absent is the part that is worth
 * reading.
 */
export const metadata: Metadata = buildMetadata({
  title: 'Security at V4You Technologies',
  description:
    'How we handle environments, access, secrets, testing, monitoring and incidents — described precisely, with no certification claims.',
  path: '/security',
})

const PRACTICES = [
  {
    title: 'Security decisions during architecture',
    body: 'The cheap moment to decide where data sits, who may read it and what gets logged is during design. The expensive moment is during a security review before launch. We make those decisions early and record them, so a reviewer can see the reasoning rather than infer it.',
  },
  {
    title: 'Environment separation',
    body: 'Development, staging and production are separate environments with separate credentials. Production data is not copied into development; where realistic data is needed for testing, it is generated or anonymised. A developer laptop never holds production access.',
  },
  {
    title: 'Access management',
    body: 'Access is granted per role rather than per person, reviewed periodically, and revocable from one place. Joiners get the access their role needs and leavers lose all of it — which is a process rather than a good intention.',
  },
  {
    title: 'Secrets management',
    body: 'Credentials and keys are held in a managed secret store, injected at runtime, and rotatable without redeploying everything that uses them. They are not in the repository, not in a shared document, and not in a message thread.',
  },
  {
    title: 'Encryption',
    body: 'Data is encrypted in transit using current TLS, and at rest by the platform or database layer. Where a connection uses a private certificate authority, we pin it rather than disabling verification — turning verification off is the common shortcut and it removes the protection entirely.',
  },
  {
    title: 'Logging and monitoring',
    body: 'Systems we operate emit logs, metrics and alerts that route to a person who can act. Consequential actions are logged with who did them and when. Alert volume is kept low enough that alerts are still read.',
  },
  {
    title: 'Backup and recovery',
    body: 'Recovery point and recovery time objectives are agreed per system, and the restore procedure is tested on a schedule. An untested backup is a hypothesis, and the day you discover it did not work is the worst possible day to find out.',
  },
  {
    title: 'Secure development lifecycle',
    body: 'Every change is reviewed before it merges. Dependencies are monitored for known vulnerabilities and updated on a defined cadence rather than when something breaks. Automated tests run in CI on every change.',
  },
  {
    title: 'Incident response',
    body: 'For systems we operate, there is an agreed severity scale, a named contact, and a response expectation written into the engagement rather than assumed. After a significant incident you get a written account of what happened and what changed.',
  },
  {
    title: 'AI-specific controls',
    body: 'Where a system uses a model: what data leaves your environment is written down, providers are configured not to retain inputs where that option exists, retrieval honours the requesting user’s permissions, and consequential actions stop at a human approval gate. Model outputs are evaluated against a test set before release and monitored after it.',
  },
  {
    title: 'Vendors and subprocessors',
    body: 'We tell you which third parties are involved in a system we build for you and what each one processes. If that list changes during an engagement, you hear about it before the change ships.',
  },
  {
    title: 'Data residency',
    body: 'Where your obligations require data to stay in a jurisdiction, that constrains hosting and model choice from the start rather than being configured afterwards. It narrows the options, which is better known during design.',
  },
]

export default async function SecurityPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <JsonLd
        schemas={[
          webPageSchema({
            name: 'Security at V4You Technologies',
            description:
              'Environments, access, secrets, encryption, monitoring, recovery and incident handling — practices rather than certifications.',
            path: '/security',
          }),
        ]}
      />

      <HeroPage
        eyebrow="Security"
        headline="What we actually do, in enough detail to check."
        body="This page describes practices rather than badges. Every item is something you can ask us to demonstrate during an engagement — and the section on what we do not have is as important as the rest."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Security', path: '/security' },
        ]}
        primaryCta={{ label: 'Discuss your security requirements', href: '/contact' }}
      />

      <NumberedAccordion
        eyebrow="Practices"
        heading="How systems we build are secured."
        body="Written to be specific enough that you could hold us to it, and general enough to be true across engagements. Where a requirement of yours is stricter, it becomes part of the architecture rather than an exception to it."
        panels={PRACTICES}
        canvas="bone"
      />

      {/*
        The honest half. blueprint §14: never claim ISO, SOC, GDPR, DPDP, HIPAA
        or PCI without a legal and technical basis.
      */}
      <SectionShell canvas="navy" reveal>
        <div className="max-w-measure">
          <Eyebrow>What we do not claim</Eyebrow>
          <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
            The part most security pages leave out.
          </h2>
          <p className="mt-5 text-body-lg">
            A security page listing only strengths tells you very little, because every security
            page lists only strengths. Here is what we are not.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            {
              title: 'We hold no security certifications',
              body: 'No ISO 27001, no SOC 2, no equivalent. If a certification is a requirement for your procurement, we are not currently the right supplier for that requirement, and we would rather tell you now than during a questionnaire.',
            },
            {
              title: 'We are not a compliance guarantor',
              body: 'We can build systems that support obligations under HIPAA, GDPR, DPDP or PCI, and document how. Whether your overall operation complies is a determination for your legal and compliance functions — a supplier cannot make it for you.',
            },
            {
              title: 'We claim no partnerships or accreditations',
              body: 'Technology logos on this site are labelled "technologies we work with", never "partners". A logo is not a partnership and we will not imply otherwise.',
            },
            {
              title: 'We have not published a pen test',
              body: 'Where an engagement warrants independent testing, we will arrange or support it and share the result with you. We are not going to reference a test we have not had done.',
            },
          ].map((item) => (
            <li key={item.title} className="border-t border-(--line) pt-5">
              <h3 className="font-display text-h3 text-(--ink)">{item.title}</h3>
              <p className="mt-3 text-body-sm">{item.body}</p>
            </li>
          ))}
        </ul>
      </SectionShell>

      {/* Client responsibilities and how to reach us about security. */}
      <SectionShell canvas="bone-2" reveal>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Shared responsibility</Eyebrow>
            <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
              What stays with you.
            </h2>
            <ul className="mt-8 space-y-3 text-body-sm">
              <li>
                Deciding who in your organisation should have access, and telling us when that
                changes.
              </li>
              <li>
                The security of your own accounts and devices, including the ones that reach systems
                we build.
              </li>
              <li>Determining which regulatory obligations apply to your business and data.</li>
              <li>Approving what data may be processed, retained and shared, and for how long.</li>
              <li>Operational security of systems we hand over and you then run.</li>
            </ul>
          </div>

          <div>
            <Eyebrow>Security questions</Eyebrow>
            <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
              Send us the questionnaire.
            </h2>
            <p className="mt-5 max-w-measure text-body">
              If your procurement has a security questionnaire, send it. We will answer it honestly,
              including the questions where the answer is no. A supplier who answers yes to
              everything has either not read it or is not telling you the truth.
            </p>
            <p className="mt-6 text-body-sm">
              {settings.contact.email ? (
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="font-display font-medium text-(--ink) underline underline-offset-4"
                >
                  {settings.contact.email}
                </a>
              ) : (
                <a
                  href="/contact"
                  className="font-display font-medium text-(--ink) underline underline-offset-4"
                >
                  Get in touch
                </a>
              )}
            </p>
          </div>
        </div>
      </SectionShell>

      <CTABand
        heading="Bring us the security requirements first."
        body="If security constraints will shape the architecture — and they usually should — the cheapest time to discuss them is before anything is designed."
        primaryCta={{ label: 'Discuss your requirements', href: '/contact' }}
      />
    </>
  )
}
