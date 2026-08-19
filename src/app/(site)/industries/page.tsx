import type { Metadata } from 'next'
import Link from 'next/link'

import { CTABand } from '@/components/blocks/CTABand'
import { CaseStudyRail } from '@/components/blocks/CaseStudyRail'
import { HeroPage } from '@/components/blocks/HeroPage'
import { SolutionMatrix } from '@/components/blocks/SolutionMatrix'
import { Headline } from '@/components/shared/Headline'
import { CutCard } from '@/components/shared/CutCard'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { JsonLd } from '@/components/shared/JsonLd'
import { SectionShell } from '@/components/shared/SectionShell'
import { buildMetadata, webPageSchema } from '@/lib/seo'
import { industryTabs } from '@/seed/industries'

/**
 * Industries hub — T-062, docs/05 §11.
 *
 * HeroPage → intro → the eleven industry cards → SolutionMatrix →
 * CaseStudyRail → CTABand.
 *
 * Each card leads with the friction rather than the sector name, because the
 * person scanning this page is looking for their problem, not their label.
 */
export const metadata: Metadata = buildMetadata({
  title: 'Industry Solutions — V4You Technologies',
  description:
    'Eleven sectors, each with its own operating reality, its own frictions, and its own sensible first step. Technology shaped around how the work actually runs.',
  path: '/industries',
})

export default function IndustriesHubPage() {
  return (
    <>
      <JsonLd
        schemas={[
          webPageSchema({
            name: 'Industry Solutions',
            description:
              'Eleven sectors, each with its own operating reality, frictions and starting point.',
            path: '/industries',
          }),
        ]}
      />

      <HeroPage
        eyebrow="Industries"
        headline="Technology shaped around how your industry operates."
        body="Every sector has a constraint that decides what is worth building first — a regulator, a margin, a shift pattern, a response time. These pages start there rather than with a product list."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Industries', path: '/industries' },
        ]}
        primaryCta={{ label: 'Book a transformation consultation', href: '/book-consultation' }}
        secondaryCta={{ label: 'See what we do', href: '/services' }}
      />

      <SectionShell canvas="bone" reveal>
        <div className="max-w-measure">
          <Eyebrow>Find yours</Eyebrow>
          <Headline className="mt-5">Eleven sectors, eleven different first steps.</Headline>
          <p className="mt-5 text-body-lg">
            Each page sets out how that industry actually operates, the frictions we see repeatedly,
            where AI genuinely earns its place, and where we would start.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {industryTabs.map((industry) => (
            <CutCard as="li" key={industry.slug} interactive className="flex flex-col p-6 lg:p-7">
              <h3 className="font-display text-h3 text-(--ink)">
                <Link
                  href={`/industries/${industry.slug}`}
                  className="after:absolute after:inset-0 hover:underline hover:underline-offset-4"
                >
                  {industry.label}
                </Link>
              </h3>

              {/* The first challenge, which is the fastest way to recognise your own situation. */}
              <p className="mt-4 text-body-sm">{industry.challenges[0]}</p>

              <p className="mt-6 border-t border-(--line) pt-4">
                <span className="block font-mono text-label text-(--accent-text) uppercase">
                  We usually start by
                </span>
                <span className="mt-1 block text-body-sm">
                  {industry.whereWeStart[0].label.toLowerCase()}
                </span>
              </p>
            </CutCard>
          ))}
        </ul>
      </SectionShell>

      <SolutionMatrix canvas="bone-2" />

      <SectionShell canvas="navy" reveal>
        <div className="max-w-measure">
          <Eyebrow>Evidence</Eyebrow>
          <Headline className="mt-5">Work we can point to.</Headline>
        </div>
        <div className="mt-10">
          <CaseStudyRail studies={[]} />
        </div>
      </SectionShell>

      <CTABand secondaryCta={{ label: 'See what we do', href: '/services' }} />
    </>
  )
}
