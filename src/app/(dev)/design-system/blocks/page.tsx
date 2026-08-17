import type { Metadata } from 'next'

import { ArchitectureDiagram } from '@/components/blocks/ArchitectureDiagram'
import { CTABand } from '@/components/blocks/CTABand'
import { CapabilityTabs } from '@/components/blocks/CapabilityTabs'
import { CaseStudyRail } from '@/components/blocks/CaseStudyRail'
import { FAQAccordion } from '@/components/blocks/FAQAccordion'
import { HeroPrimary } from '@/components/blocks/HeroPrimary'
import { IndustryTabs } from '@/components/blocks/IndustryTabs'
import { LogoMarquee } from '@/components/blocks/LogoMarquee'
import { MetricStrip } from '@/components/blocks/MetricStrip'
import { NumberedAccordion } from '@/components/blocks/NumberedAccordion'
import { PillarCards } from '@/components/blocks/PillarCards'
import { ProblemCards } from '@/components/blocks/ProblemCards'
import { ProcessTimeline } from '@/components/blocks/ProcessTimeline'
import { ServiceCardGrid } from '@/components/blocks/ServiceCardGrid'
import { SolutionMatrix } from '@/components/blocks/SolutionMatrix'
import { TestimonialSlider } from '@/components/blocks/TestimonialSlider'
import { TrustBar } from '@/components/blocks/TrustBar'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'
import { homeHero } from '@/seed/home'
import { homeFaqs, trustPanels } from '@/seed/home-proof'

export const metadata: Metadata = {
  title: 'Blocks — V4You',
  robots: { index: false, follow: false },
}

/**
 * Every block built so far, in the home-page order from docs/05 §1, so the
 * section rhythm is reviewable alongside the components.
 *
 * Three blocks are showing their empty state rather than sample data, because
 * that is their real state today: CaseStudyRail explains, TestimonialSlider
 * omits itself entirely, and MetricStrip returns null.
 */
export default function BlocksPreview() {
  return (
    <>
      <HeroPrimary {...homeHero} />
      <TrustBar />
      <ProblemCards />
      <PillarCards />
      <ServiceCardGrid />
      <CapabilityTabs />
      <SolutionMatrix />
      <IndustryTabs />
      <ProcessTimeline />

      <SectionShell canvas="navy" reveal>
        <Eyebrow>Proof over promises</Eyebrow>
        <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
          Work we can point to.
        </h2>
        <div className="mt-10">
          <CaseStudyRail studies={[]} />
        </div>
      </SectionShell>

      {/* Gated: every metric is missing its method, so this renders nothing. */}
      <MetricStrip metrics={[{ value: '68%', label: 'Placeholder with no method attached' }]} />

      <LogoMarquee />

      <NumberedAccordion
        eyebrow={trustPanels.eyebrow}
        heading={trustPanels.heading}
        body={trustPanels.body}
        panels={trustPanels.panels}
        cta={trustPanels.cta}
      />

      {/* Omitted entirely: no permitted testimonials exist. */}
      <TestimonialSlider testimonials={[]} />

      <SectionShell canvas="bone-2" reveal>
        <Eyebrow>Architecture</Eyebrow>
        <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
          A representative system.
        </h2>
        <div className="mt-10">
          <ArchitectureDiagram
            caption="What this diagram says"
            summary="Enquiries arrive from the website, WhatsApp and inbound calls, and are written to one record rather than three inboxes. A retrieval layer looks up the account, its history and current policy before anything is drafted. Anything priced or contractual stops for human approval; everything else is executed straight through — the CRM is updated, a follow-up is scheduled, and the owner is notified. Every step is logged, so a decision can be reconstructed afterwards."
            nodes={[
              {
                id: 'web',
                layer: 'source',
                label: 'Website enquiry',
                description:
                  'Form submissions land as a lead record with their source and campaign attached, so attribution survives past the first click.',
              },
              {
                id: 'whatsapp',
                layer: 'source',
                label: 'WhatsApp',
                description:
                  'Conversational enquiries join the same queue as web forms rather than living in a phone nobody else can see.',
              },
              {
                id: 'calls',
                layer: 'source',
                label: 'Inbound calls',
                description:
                  'Calls outside staffed hours are answered, summarised in writing, and attached to the same record.',
              },
              {
                id: 'retrieval',
                layer: 'process',
                label: 'Retrieval',
                description:
                  'Looks up the account, its history and current policy — restricted to what the person handling it is permitted to see.',
              },
              {
                id: 'gate',
                layer: 'process',
                label: 'Approval gate',
                description:
                  'Anything priced, contractual or regulated stops here for a person. The gate is a design decision, not a setting someone can quietly switch off.',
              },
              {
                id: 'audit',
                layer: 'process',
                label: 'Audit log',
                description:
                  'Records what happened, when, and on whose authority. Assembled as it goes, because a log written afterwards is not a log.',
              },
              {
                id: 'crm',
                layer: 'surface',
                label: 'CRM',
                description:
                  'The system of record. Updated automatically so nobody has to retype what the system already knows.',
              },
              {
                id: 'dashboard',
                layer: 'surface',
                label: 'Dashboard',
                description:
                  'Response times, conversion and exception volume — the measures the workflow was built to move.',
              },
              {
                id: 'owner',
                layer: 'surface',
                label: 'The owner',
                description:
                  'A named person is notified with the context attached, rather than discovering it in a weekly report.',
              },
            ]}
          />
        </div>
      </SectionShell>

      <FAQAccordion faqs={homeFaqs} />
      <CTABand />
    </>
  )
}
