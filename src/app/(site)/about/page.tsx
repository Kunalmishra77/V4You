import type { Metadata } from 'next'
import Link from 'next/link'

import { CTABand } from '@/components/blocks/CTABand'
import { HeroPage } from '@/components/blocks/HeroPage'
import { NumberedAccordion } from '@/components/blocks/NumberedAccordion'
import { AwaitingContent } from '@/components/shared/AwaitingContent'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { JsonLd } from '@/components/shared/JsonLd'
import { SectionShell } from '@/components/shared/SectionShell'
import { getSiteSettings } from '@/lib/content'
import { reportMissingAsset } from '@/lib/missing-assets'
import { buildMetadata, organizationSchema, webPageSchema } from '@/lib/seo'
import { aboutHero, deliveryModel, missionVision, qualityPractices, values } from '@/seed/about'

/**
 * About — T-065, docs/05 §2 and blueprint §10.
 *
 * Sequence: hero → mission and vision → story → values → leadership →
 * quality and security → global delivery → careers → CTA.
 *
 * Three of those cannot be written without the client, and each is handled
 * differently rather than filled in:
 *
 *   Story      renders a visibly labelled placeholder. blueprint §10 marks
 *              every milestone `[verified …]`, and a founding story is exactly
 *              the kind of thing that reads plausibly when invented.
 *   Leadership is omitted entirely, with a line pointing at /contact. docs/05
 *              §2 is explicit: no avatar placeholders, because an anonymous
 *              leadership section undercuts the page's whole purpose.
 *   Careers    is behind `showCareers`, which is off.
 *
 * The delivery section describes how we work rather than where, because
 * blueprint §10 forbids claiming offices or global presence without evidence.
 */
export const metadata: Metadata = buildMetadata({
  title: 'About V4You Technologies',
  description:
    'Strategy, design, engineering, AI, automation, cloud and growth under one accountable partner — and a plain account of how we work.',
  path: '/about',
})

export default async function AboutPage() {
  const settings = await getSiteSettings()
  const { contact, socials, featureFlags } = settings

  // No leadership records exist yet, so the team grid is omitted.
  reportMissingAsset({
    component: 'AboutPage — leadership grid',
    needs: 'teamMembers with isLeadership, plus assets/team/{name}.jpg and team.csv',
    blocks: 'the leadership section is omitted entirely — no avatar placeholders (docs/05 §2)',
  })

  reportMissingAsset({
    component: 'AboutPage — story timeline',
    needs:
      'founding year and origin, the first capability, and expansion milestones (blueprint §10)',
    blocks: 'the story section renders a visibly labelled placeholder and must not go live as is',
  })

  return (
    <>
      <JsonLd
        schemas={[
          organizationSchema({
            legalName: contact.legalEntityName ?? 'V4You Technologies',
            description: aboutHero.body,
            email: contact.email,
            telephone: contact.phone,
            addressLines: contact.addressLines,
            sameAs: socials.map((social) => social.url),
          }),
          webPageSchema({
            name: 'About V4You Technologies',
            description: aboutHero.body,
            path: '/about',
            type: 'AboutPage',
          }),
        ]}
      />

      <HeroPage
        eyebrow={aboutHero.eyebrow}
        headline={aboutHero.headline}
        body={aboutHero.body}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
        primaryCta={{ label: 'Book a transformation consultation', href: '/book-consultation' }}
        secondaryCta={{ label: 'See what we do', href: '/services' }}
      />

      {/* Mission and vision */}
      <SectionShell canvas="bone" reveal>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Mission</Eyebrow>
            <p className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
              {missionVision.mission}
            </p>
          </div>
          <div>
            <Eyebrow>Vision</Eyebrow>
            <p className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
              {missionVision.vision}
            </p>
          </div>
        </div>
        <p className="mt-12 max-w-measure text-body-lg">{missionVision.body}</p>
      </SectionShell>

      {/* Story — placeholder, deliberately unmistakable. */}
      <SectionShell canvas="navy" reveal>
        <div className="max-w-measure">
          <Eyebrow>Story</Eyebrow>
          <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
            How V4You started.
          </h2>
        </div>
        <AwaitingContent
          className="mt-10"
          what="The founding year, the problem that prompted it, the first capability, and the milestones since."
          why="blueprint §10 marks every one of these as needing verified company evidence, and a founding story is exactly the kind of detail that reads plausibly when invented and is embarrassing when someone checks it."
        />
      </SectionShell>

      {/* Values */}
      <SectionShell canvas="bone" reveal>
        <div className="max-w-measure">
          <Eyebrow>Values</Eyebrow>
          <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
            What we hold to when it costs something.
          </h2>
          <p className="mt-5 text-body-lg">
            Values are only worth publishing if they occasionally lose you work. These do.
          </p>
        </div>
        <ol className="mt-12 grid gap-px bg-(--line) sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <li key={value.title} className="bg-(--surface) p-6 lg:p-7">
              <h3 className="font-display text-h3 text-(--ink)">{value.title}</h3>
              <p className="mt-3 text-body-sm">{value.body}</p>
            </li>
          ))}
        </ol>
      </SectionShell>

      {/*
        Leadership — omitted, not stubbed. docs/05 §2 replaces the grid with a
        line directing to /contact when no photos exist.
      */}
      <SectionShell canvas="bone-2" density="tight" reveal>
        <div className="max-w-measure">
          <Eyebrow>Who you would work with</Eyebrow>
          <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
            You will know who is accountable before you commit to anything.
          </h2>
          <p className="mt-5 text-body-lg">
            Leadership profiles are not published here yet, and we would rather leave the section
            out than fill it with silhouettes. In the meantime the first call is with the person who
            would own your engagement, and you can ask them anything a profile would have told you.
          </p>
          <p className="mt-6">
            <Link
              href="/contact"
              className="font-display text-body font-medium text-(--ink) underline underline-offset-4 hover:text-amber-ink"
            >
              Start a conversation
            </Link>
          </p>
        </div>
      </SectionShell>

      {/* Quality and security */}
      <NumberedAccordion
        eyebrow="Quality and security"
        heading="How we work, in enough detail to check."
        body="Every item below is something you could ask us to demonstrate during an engagement. None of it is a certification claim — where a certification would be the honest proof, we do not have one and say so."
        panels={qualityPractices}
        canvas="navy"
        cta={{ label: 'Read the security page', href: '/security' }}
      />

      {/* Global delivery — how, not where. */}
      <SectionShell canvas="bone" reveal>
        <div className="max-w-measure">
          <Eyebrow>Working together</Eyebrow>
          <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
            {deliveryModel.heading}
          </h2>
          <p className="mt-5 text-body-lg">{deliveryModel.body}</p>
        </div>
        <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {deliveryModel.points.map((point) => (
            <li key={point.title} className="border-t border-(--line) pt-5">
              <h3 className="font-display text-h3 text-(--ink)">{point.title}</h3>
              <p className="mt-3 text-body-sm">{point.body}</p>
            </li>
          ))}
        </ul>
      </SectionShell>

      {/* Careers — behind a flag that is off. */}
      {featureFlags.showCareers && (
        <SectionShell canvas="bone-2" density="tight" reveal>
          <Eyebrow>Careers</Eyebrow>
          <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">We are hiring.</h2>
        </SectionShell>
      )}

      <CTABand secondaryCta={{ label: 'See what we do', href: '/services' }} />
    </>
  )
}
