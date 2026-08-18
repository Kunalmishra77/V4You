import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArchitectureDiagram } from '@/components/blocks/ArchitectureDiagram'
import { CTABand } from '@/components/blocks/CTABand'
import { CaseStudyRail } from '@/components/blocks/CaseStudyRail'
import { FAQAccordion } from '@/components/blocks/FAQAccordion'
import { HeroPage } from '@/components/blocks/HeroPage'
import { CutCard } from '@/components/shared/CutCard'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { JsonLd } from '@/components/shared/JsonLd'
import { SectionShell } from '@/components/shared/SectionShell'
import { INDUSTRY_LABELS, INDUSTRY_SLUGS, SERVICE_LABELS, type IndustrySlug } from '@/lib/routes'
import { breadcrumbSchema, buildMetadata, faqSchema, webPageSchema } from '@/lib/seo'
import { industryDetails } from '@/seed/industries-detail'
import { industryTabs } from '@/seed/industries'

/**
 * Industry page template — T-063, docs/05 §12–22.
 *
 * One template, eleven pages, in the eleven-block order docs/05 sets out.
 *
 * docs/05 attaches a uniqueness requirement to these pages specifically, and
 * enforces it as a Payload `beforeValidate` hook: original context, at least
 * four challenges, four use cases and four FAQs before publication. The
 * template cannot satisfy that — only the content can — but it is built so the
 * content has somewhere distinct to go, which is the half a template controls.
 *
 * Two things this page deliberately does not do. It states no ROI figure:
 * every use case names a *value area*, because blueprint §6 requires a case
 * study behind a percentage and there is none. And `regulatoryNotes` describes
 * what a regulation requires — never that V4You is compliant with it.
 */

export function generateStaticParams() {
  return INDUSTRY_SLUGS.map((slug) => ({ slug }))
}

const isIndustrySlug = (slug: string): slug is IndustrySlug =>
  (INDUSTRY_SLUGS as readonly string[]).includes(slug)

export async function generateMetadata({
  params,
}: PageProps<'/industries/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  if (!isIndustrySlug(slug)) return {}

  const detail = industryDetails[slug]
  return buildMetadata({
    title: detail.metaTitle,
    description: detail.metaDescription,
    path: `/industries/${slug}`,
  })
}

export default async function IndustryPage({ params }: PageProps<'/industries/[slug]'>) {
  const { slug } = await params
  if (!isIndustrySlug(slug)) notFound()

  const detail = industryDetails[slug]
  const tab = industryTabs.find((industry) => industry.slug === slug)!
  const label = INDUSTRY_LABELS[slug]
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Industries', path: '/industries' },
    { name: label, path: `/industries/${slug}` },
  ]

  return (
    <>
      <JsonLd
        schemas={[
          webPageSchema({
            name: detail.metaTitle,
            description: detail.metaDescription,
            path: `/industries/${slug}`,
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
        primaryCta={{ label: 'Book a transformation consultation', href: '/book-consultation' }}
        secondaryCta={{ label: 'See all industries', href: '/industries' }}
      />

      {/* 2 — Industry context */}
      <SectionShell canvas="bone" reveal>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Eyebrow>Operating reality</Eyebrow>
            <h2 className="mt-5 font-display text-h2 text-(--ink)">
              How {label.toLowerCase()} actually runs.
            </h2>
          </div>
          <p className="max-w-measure self-center text-body-lg">{tab.context}</p>
        </div>
      </SectionShell>

      {/* 3 — Challenges */}
      <SectionShell canvas="navy" reveal>
        <div className="max-w-measure">
          <Eyebrow>What we see repeatedly</Eyebrow>
          <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
            The frictions that come up in almost every conversation.
          </h2>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {tab.challenges.map((challenge, index) => (
            <CutCard as="li" key={challenge} variant="dark" className="p-6 lg:p-7">
              <p aria-hidden="true" className="font-mono text-label text-(--accent-text) uppercase">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 font-display text-h3 text-(--ink)">{challenge}</h3>
            </CutCard>
          ))}
        </ul>
      </SectionShell>

      {/* 4 — Use cases */}
      <SectionShell canvas="bone" reveal>
        <div className="max-w-measure">
          <Eyebrow>Where AI earns its place</Eyebrow>
          <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
            Applications that hold up in {label.toLowerCase()}.
          </h2>
          <p className="mt-5 text-body-lg">
            Each one names the value area it moves rather than a percentage. A number without a case
            study behind it is a claim, and we do not have the case study yet.
          </p>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {detail.useCases.map((useCase) => (
            <CutCard as="li" key={useCase.title} className="flex flex-col p-6 lg:p-7">
              <h3 className="font-display text-h3 text-(--ink)">{useCase.title}</h3>
              <p className="mt-3 text-body-sm">{useCase.body}</p>
              <p className="mt-5 border-t border-(--line) pt-4">
                <span className="block font-mono text-label text-(--accent-text) uppercase">
                  Value area
                </span>
                <span className="mt-1 block text-body-sm">{useCase.valueArea}</span>
              </p>
            </CutCard>
          ))}
        </ul>
      </SectionShell>

      {/* 5 — Where we typically start */}
      <SectionShell canvas="bone-2" reveal>
        <div className="max-w-measure">
          <Eyebrow>Sequencing</Eyebrow>
          <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
            Where we typically start.
          </h2>
          <p className="mt-5 text-body-lg">
            Not because it is the biggest opportunity, but because it is the one that makes the next
            decision better informed.
          </p>
        </div>
        <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {tab.whereWeStart.map((step) => (
            <li key={step.step}>
              <span aria-hidden="true" className="block h-0.5 w-full bg-amber-500" />
              <p className="mt-4 font-mono text-label text-(--accent-text) uppercase">
                {step.step} · {step.tag}
              </p>
              <p className="mt-3 text-body">{step.label}</p>
            </li>
          ))}
        </ol>
      </SectionShell>

      {/* 6 — Relevant services */}
      <SectionShell canvas="bone" reveal>
        <div className="max-w-measure">
          <Eyebrow>What this usually involves</Eyebrow>
          <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
            The capabilities this work draws on.
          </h2>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {detail.services.map((service) => (
            <CutCard as="li" key={service} interactive className="p-6">
              <h3 className="font-display text-h3 text-(--ink)">
                <Link
                  href={`/services/${service}`}
                  className="after:absolute after:inset-0 hover:underline hover:underline-offset-4"
                >
                  {SERVICE_LABELS[service]}
                </Link>
              </h3>
              <p aria-hidden="true" className="mt-3 text-body-sm">
                How it applies here →
              </p>
            </CutCard>
          ))}
        </ul>
      </SectionShell>

      {/* 7 — Architecture */}
      <SectionShell canvas="navy" reveal>
        <div className="max-w-measure">
          <Eyebrow>Architecture</Eyebrow>
          <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
            A representative system for {label.toLowerCase()}.
          </h2>
        </div>
        <div className="mt-12">
          <ArchitectureDiagram
            nodes={detail.architecture.nodes}
            summary={detail.architecture.summary}
            caption={detail.architecture.caption}
          />
        </div>
      </SectionShell>

      {/* 8 — Regulatory notes. Factual only. Never a compliance claim. */}
      <SectionShell canvas="bone-2" reveal>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Eyebrow>Regulatory context</Eyebrow>
            <h2 className="mt-5 font-display text-h2 text-(--ink)">What the rules require.</h2>
          </div>
          <div className="max-w-measure">
            <p className="text-body-lg">{detail.regulatoryNotes}</p>
            <p className="mt-6 border-l-2 border-amber-500 pl-5 text-body-sm">
              This describes what the regulation asks for and how a system can be built to support
              it. It is not a statement that V4You is certified, compliant or accredited under any
              of these regimes — that would need evidence we would show you rather than assert.
            </p>
          </div>
        </div>
      </SectionShell>

      {/* 9 — Case studies for this industry */}
      <SectionShell canvas="navy" reveal>
        <div className="max-w-measure">
          <Eyebrow>Evidence</Eyebrow>
          <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
            Work in {label.toLowerCase()}.
          </h2>
        </div>
        <div className="mt-10">
          <CaseStudyRail studies={[]} />
        </div>
      </SectionShell>

      {/* 10 — FAQ */}
      <FAQAccordion
        faqs={detail.faqs}
        eyebrow="Questions"
        heading={`What ${label.toLowerCase()} teams ask`}
      />

      {/* 11 — CTA */}
      <CTABand secondaryCta={{ label: 'See all industries', href: '/industries' }} />
    </>
  )
}
