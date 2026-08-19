import type { Metadata } from 'next'

import { CTABand } from '@/components/blocks/CTABand'
import { CapabilityTabs } from '@/components/blocks/CapabilityTabs'
import { CaseStudyRail } from '@/components/blocks/CaseStudyRail'
import { FAQAccordion } from '@/components/blocks/FAQAccordion'
import { HeroPrimary } from '@/components/blocks/HeroPrimary'
import { OrchestrationDiagram } from '@/components/blocks/OrchestrationDiagram'
import { IndustryTabs } from '@/components/blocks/IndustryTabs'
import { LogoMarquee } from '@/components/blocks/LogoMarquee'
import { NumberedAccordion } from '@/components/blocks/NumberedAccordion'
import { PillarCards } from '@/components/blocks/PillarCards'
import { PinnedSequence } from '@/components/blocks/PinnedSequence'
import { ProblemCards } from '@/components/blocks/ProblemCards'
import { ServiceCardGrid } from '@/components/blocks/ServiceCardGrid'
import { SolutionMatrix } from '@/components/blocks/SolutionMatrix'
import { TestimonialSlider } from '@/components/blocks/TestimonialSlider'
import { TrustBar } from '@/components/blocks/TrustBar'
import { Headline } from '@/components/shared/Headline'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { JsonLd } from '@/components/shared/JsonLd'
import { SectionShell } from '@/components/shared/SectionShell'
import { getSiteSettings } from '@/lib/content'
import { buildMetadata, faqSchema, organizationSchema, websiteSchema } from '@/lib/seo'
import { homeHero } from '@/seed/home'
import { homeFaqs, processTimeline, trustPanels } from '@/seed/home-proof'

/**
 * Home — T-058, docs/05 §1.
 *
 * Fifteen blocks, in the order that document specifies. Nothing here is layout
 * code: every section is a library block, which is what CLAUDE.md rule 5 asks
 * for and what makes the sequence editable without touching a component.
 *
 * **Section rhythm.** docs/05 §1 assigns a canvas per block, and docs/01 §4
 * states a rule those assignments break in two places: "never two dense
 * sections of the same canvas back to back". As written, block 7
 * (SolutionMatrix, a dense table) sits on bone directly above block 8
 * (IndustryTabs, a dense tab panel) also on bone; blocks 11 and 12 do the same.
 *
 * Three canvases are swapped to satisfy the rule, all within the palette
 * docs/05 already uses on this page:
 *   - block 8  IndustryTabs      bone   → bone-2
 *   - block 9  ProcessTimeline   bone-2 → bone
 *   - block 12 NumberedAccordion bone   → bone-2
 *
 * The resulting sequence alternates canvas at every boundary. Raised here
 * rather than decided silently — docs/01 states its rhythm as a rule and
 * docs/05 as a table, so the rule wins, but the table is the more specific
 * document and this is worth a second opinion.
 */
export const metadata: Metadata = buildMetadata({
  title: 'V4You Technologies — AI-First Digital Transformation Company',
  description:
    'V4You helps startups, SMEs and enterprises turn complex business problems into intelligent products, connected workflows and measurable growth.',
  path: '/',
})

export default async function HomePage() {
  const settings = await getSiteSettings()
  const { contact, socials } = settings

  return (
    <>
      <JsonLd
        schemas={[
          organizationSchema({
            legalName: contact.legalEntityName ?? 'V4You Technologies',
            description:
              'AI-first digital transformation and product engineering — consulting, software, AI, automation, cloud and growth under one accountable partner.',
            email: contact.email,
            telephone: contact.phone,
            addressLines: contact.addressLines,
            sameAs: socials.map((social) => social.url),
          }),
          websiteSchema(),
          faqSchema(homeFaqs),
        ]}
      />

      {/*
        1 — navy. One viewport including the header. The background takes a
        video when one exists; until then an abstract field stands in.
      */}
      <HeroPrimary {...homeHero} />

      {/*
        1b — the orchestration diagram, immediately below the fold.
        It is the page's argument and needs room to be read, which it was not
        getting while it shared the first screen with the headline.
      */}
      <SectionShell canvas="navy-800" density="tight" reveal>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Eyebrow>How it fits together</Eyebrow>
            <h2 className="mt-5 max-w-headline font-display text-h3 text-(--ink)">
              Signals in from the business. Work back out to the people who do it.
            </h2>
            <p className="mt-4 max-w-measure text-body-sm">{homeHero.trustLine}</p>
          </div>
          <OrchestrationDiagram />
        </div>
      </SectionShell>

      {/* 2 — navy-800. Logo wall if any client permits it, capability strip otherwise. */}
      <TrustBar />

      {/* 3 — bone */}
      <ProblemCards />

      {/* 4 — navy */}
      <PillarCards />

      {/* 5 — bone */}
      <ServiceCardGrid />

      {/* 6 — navy */}
      <CapabilityTabs />

      {/* 7 — bone */}
      <SolutionMatrix />

      {/* 8 — bone-2 (docs/05 says bone; see the rhythm note above) */}
      <IndustryTabs canvas="bone-2" />

      {/*
        9 — bone (docs/05 says bone-2).

        The delivery model as a pinned sequence rather than a six-up grid. Six
        stages laid out as cards are six things to scan and nothing to read;
        given a column each, in order, against a heading that stays put, they
        are a sequence — which is what they are. ProcessTimeline still exists
        and is still the right block on the service and services pages, where
        the stages are a supporting detail rather than the argument.
      */}
      <PinnedSequence
        eyebrow={processTimeline.eyebrow}
        heading={processTimeline.heading}
        body={processTimeline.body}
        steps={processTimeline.steps}
        cta={processTimeline.cta}
        canvas="bone"
      />

      {/* 10 — navy. Explains itself while no study is cleared for publication. */}
      <SectionShell canvas="navy" reveal>
        <div className="max-w-measure">
          <Eyebrow>Evidence</Eyebrow>
          <Headline className="mt-5">Proof over promises.</Headline>
          <p className="mt-5 text-body-lg">
            The work we can point to, and how each result was measured. Every figure states whether
            it was measured, modelled, estimated or reported by the client.
          </p>
        </div>
        <div className="mt-12">
          <CaseStudyRail studies={[]} />
        </div>
      </SectionShell>

      {/* 11 — bone */}
      <LogoMarquee />

      {/* 12 — bone-2 (docs/05 says bone) */}
      <NumberedAccordion
        eyebrow={trustPanels.eyebrow}
        heading={trustPanels.heading}
        body={trustPanels.body}
        panels={trustPanels.panels}
        cta={trustPanels.cta}
        canvas="bone-2"
      />

      {/* 13 — navy. Omits itself entirely: no permitted testimonials exist. */}
      <TestimonialSlider testimonials={[]} />

      {/* 14 — bone. Eight questions, and the FAQPage JSON-LD comes from the same array. */}
      <FAQAccordion
        faqs={homeFaqs}
        eyebrow="Questions"
        heading="What people ask before they get in touch"
      />

      {/* 15 — amber. Once per page, near the end. */}
      <CTABand secondaryCta={{ label: 'Explore what we do', href: '/services' }} />
    </>
  )
}
