import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArchitectureDiagram } from '@/components/blocks/ArchitectureDiagram'
import { CTABand } from '@/components/blocks/CTABand'
import { CaseStudyRail } from '@/components/blocks/CaseStudyRail'
import { FAQAccordion } from '@/components/blocks/FAQAccordion'
import { HeroPage } from '@/components/blocks/HeroPage'
import { LogoMarquee } from '@/components/blocks/LogoMarquee'
import { NumberedAccordion } from '@/components/blocks/NumberedAccordion'
import { ProcessTimeline } from '@/components/blocks/ProcessTimeline'
import { StickyContextualNav } from '@/components/blocks/StickyContextualNav'
import { Headline } from '@/components/shared/Headline'
import { CutCard } from '@/components/shared/CutCard'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { JsonLd } from '@/components/shared/JsonLd'
import { SectionShell } from '@/components/shared/SectionShell'
import {
  INDUSTRY_LABELS,
  SERVICE_LABELS,
  SERVICE_SLUGS,
  type IndustrySlug,
  type ServiceSlug,
} from '@/lib/routes'
import { breadcrumbSchema, buildMetadata, faqSchema, serviceSchema } from '@/lib/seo'
import { serviceDetails } from '@/seed/services-detail'
import { serviceCards } from '@/seed/services'
import { trustPanels } from '@/seed/home-proof'

/**
 * Service page template — T-060, docs/05 §4–10.
 *
 * One template, seven pages, thirteen blocks in the order docs/05 sets out.
 * Nothing here is bespoke to a single service: the differences are entirely in
 * `src/seed/services-detail.ts`, which is what stops seven pages drifting into
 * seven layouts.
 *
 * `StickyContextualNav` is required by docs/05 for exactly this template — the
 * page is long, and a reader who wants the pricing section should not have to
 * scroll past nine blocks hoping it exists.
 *
 * Each section carries the `id` the nav targets, and `scroll-mt` clears the
 * sticky header plus the nav itself so an anchored heading is not hidden under
 * them.
 */

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }))
}

const isServiceSlug = (slug: string): slug is ServiceSlug =>
  (SERVICE_SLUGS as readonly string[]).includes(slug)

export async function generateMetadata({
  params,
}: PageProps<'/services/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  if (!isServiceSlug(slug)) return {}

  const detail = serviceDetails[slug]
  return buildMetadata({
    title: detail.metaTitle,
    description: detail.metaDescription,
    path: `/services/${slug}`,
  })
}

const SECTIONS = [
  { id: 'problems', label: 'The problem' },
  { id: 'capabilities', label: 'What we build' },
  { id: 'deliverables', label: 'What you get' },
  { id: 'process', label: 'How it runs' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'governance', label: 'Security' },
  { id: 'industries', label: 'Industries' },
  { id: 'pricing', label: 'What it costs' },
  { id: 'faqs', label: 'Questions' },
]

/** Clears the sticky header (64px) and the contextual nav (~50px). */
const ANCHOR = 'scroll-mt-32'

export default async function ServicePage({ params }: PageProps<'/services/[slug]'>) {
  const { slug } = await params
  if (!isServiceSlug(slug)) notFound()

  const detail = serviceDetails[slug]
  const card = serviceCards.find((service) => service.slug === slug)!
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: SERVICE_LABELS[slug], path: `/services/${slug}` },
  ]

  return (
    <>
      <JsonLd
        schemas={[
          serviceSchema({
            name: SERVICE_LABELS[slug],
            description: detail.metaDescription,
            path: `/services/${slug}`,
            serviceType: SERVICE_LABELS[slug],
          }),
          breadcrumbSchema(breadcrumbs),
          faqSchema(detail.faqs),
        ]}
      />

      {/* 1 — Hero */}
      <HeroPage
        eyebrow={detail.hero.eyebrow}
        headline={detail.hero.headline}
        body={detail.hero.body}
        breadcrumbs={breadcrumbs}
        primaryCta={{ label: detail.hero.primaryCta, href: '/book-consultation' }}
        secondaryCta={{ label: 'See how we work', href: '#process' }}
      />

      <StickyContextualNav sections={SECTIONS} />

      {/* 2 — Problem framing */}
      <SectionShell canvas="bone" reveal id="problems" className={ANCHOR}>
        <div className="max-w-measure">
          <Eyebrow>What this solves</Eyebrow>
          <Headline className="mt-5">What usually brings people here.</Headline>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {detail.problems.map((problem, index) => (
            <CutCard as="li" key={problem.title} className="p-6 lg:p-7">
              <p aria-hidden="true" className="font-mono text-label text-(--accent-text) uppercase">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 font-display text-h3 text-(--ink)">{problem.title}</h3>
              <p className="mt-3 text-body-sm">{problem.body}</p>
            </CutCard>
          ))}
        </ul>
      </SectionShell>

      {/* 3 — Capability modules */}
      <SectionShell canvas="navy" reveal id="capabilities" className={ANCHOR}>
        <div className="max-w-measure">
          <Eyebrow>Capabilities</Eyebrow>
          <Headline className="mt-5">What we build.</Headline>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {detail.capabilities.map((capability) => (
            <CutCard as="li" key={capability.title} variant="dark" className="p-6 lg:p-7">
              <h3 className="font-display text-h3 text-(--ink)">{capability.title}</h3>
              <p className="mt-3 text-body-sm">{capability.body}</p>
            </CutCard>
          ))}
        </ul>
      </SectionShell>

      {/* 4 — Business benefits */}
      <SectionShell canvas="bone" reveal>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Eyebrow>Why it matters</Eyebrow>
            <Headline className="mt-5">{detail.outcomeStatement}</Headline>
          </div>
          <p className="self-end text-body-lg">{detail.benefits}</p>
        </div>
      </SectionShell>

      {/* 5 — What we deliver */}
      <SectionShell canvas="bone-2" reveal id="deliverables" className={ANCHOR}>
        <div className="max-w-measure">
          <Eyebrow>Deliverables</Eyebrow>
          <Headline className="mt-5">What you actually receive.</Headline>
          <p className="mt-5 text-body-lg">
            Everything below is yours, including the parts that would let another supplier continue
            the work.
          </p>
        </div>
        <ul className="mt-12 grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {detail.deliverables.map((item) => (
            <li key={item} className="flex gap-3 border-b border-(--line) pb-4 text-body">
              <span
                aria-hidden="true"
                className="mt-2 block size-3 shrink-0 bg-amber-500 cut-slash"
              />
              {item}
            </li>
          ))}
        </ul>
      </SectionShell>

      {/* 6 — Engagement process */}
      <div id="process" className={ANCHOR}>
        <ProcessTimeline canvas="navy" />
      </div>

      {/* 7 — Technology and architecture */}
      <LogoMarquee />

      <SectionShell canvas="bone-2" reveal id="architecture" className={ANCHOR}>
        <div className="max-w-measure">
          <Eyebrow>Architecture</Eyebrow>
          <Headline className="mt-5">A representative system.</Headline>
          <p className="mt-5 text-body-lg">
            One shape this work takes. Yours will differ — the point is that the shape is decided
            deliberately and written down.
          </p>
        </div>
        <div className="mt-12">
          <ArchitectureDiagram
            nodes={detail.architecture.nodes}
            summary={detail.architecture.summary}
            caption={detail.architecture.caption}
          />
        </div>
      </SectionShell>

      {/* 8 — Security and quality */}
      <div id="governance" className={ANCHOR}>
        <NumberedAccordion
          eyebrow="Security and quality"
          heading="How we keep this defensible."
          body={trustPanels.body}
          panels={trustPanels.panels}
          canvas="navy"
        />
      </div>

      {/* 9 — Relevant industries */}
      <SectionShell canvas="bone" reveal id="industries" className={ANCHOR}>
        <div className="max-w-measure">
          <Eyebrow>Where this applies</Eyebrow>
          <Headline className="mt-5">Industries where this comes up most.</Headline>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(detail.industries as IndustrySlug[]).map((industry) => (
            <CutCard as="li" key={industry} interactive className="p-6">
              <h3 className="font-display text-h3 text-(--ink)">
                <Link
                  href={`/industries/${industry}`}
                  className="after:absolute after:inset-0 hover:underline hover:underline-offset-4"
                >
                  {INDUSTRY_LABELS[industry]}
                </Link>
              </h3>
              <p aria-hidden="true" className="mt-3 text-body-sm">
                How it applies here →
              </p>
            </CutCard>
          ))}
        </ul>
      </SectionShell>

      {/* 10 — Case studies */}
      <SectionShell canvas="navy" reveal>
        <div className="max-w-measure">
          <Eyebrow>Evidence</Eyebrow>
          <Headline className="mt-5">Work we can point to.</Headline>
        </div>
        <div className="mt-10">
          <CaseStudyRail studies={[]} />
        </div>
      </SectionShell>

      {/* 11 — Pricing model. No figures — docs/05's pricing section rule. */}
      <SectionShell canvas="bone" reveal id="pricing" className={ANCHOR}>
        <div className="max-w-measure">
          <Eyebrow>Commercials</Eyebrow>
          <Headline className="mt-5">What drives the cost.</Headline>
          <p className="mt-5 text-body-lg">
            We do not publish a starting figure. A price quoted before scope is understood is either
            padded to cover the unknown or about to be revised — neither helps you plan. Here is
            what actually moves it.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h3 className="font-mono text-label text-(--accent-text) uppercase">
              What changes the number
            </h3>
            <ul className="mt-5 space-y-3">
              {detail.pricing.drivers.map((driver) => (
                <li key={driver} className="flex gap-3 text-body-sm">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 block size-3 shrink-0 bg-amber-500 cut-slash"
                  />
                  {driver}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-label text-(--accent-text) uppercase">
              How engagements are shaped
            </h3>
            <dl className="mt-5 space-y-5">
              {detail.pricing.shapes.map((shape) => (
                <div key={shape.name} className="border-t border-(--line) pt-4">
                  <dt className="font-display text-body font-semibold text-(--ink)">
                    {shape.name}
                  </dt>
                  <dd className="mt-1 text-body-sm">{shape.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </SectionShell>

      {/* 12 — FAQ */}
      <div id="faqs" className={ANCHOR}>
        <FAQAccordion
          faqs={detail.faqs}
          eyebrow="Questions"
          heading={`What people ask about ${card.title.toLowerCase()}`}
          canvas="bone-2"
        />
      </div>

      {/* 13 — CTA */}
      <CTABand
        heading="Tell us what you are trying to change."
        secondaryCta={{ label: 'See all services', href: '/services' }}
      />
    </>
  )
}
