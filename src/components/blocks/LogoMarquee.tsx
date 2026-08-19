import { Headline } from '@/components/shared/Headline'
import { Marquee } from '@/components/shared/Marquee'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell, type Canvas } from '@/components/shared/SectionShell'
import { technologyEcosystem } from '@/seed/home-proof'

/**
 * LogoMarquee — docs/04 §14.
 *
 * Two things are non-negotiable here and both are about honesty rather than
 * craft:
 *
 * The label is **"Technologies we work with"**. Never "Our partners", and never
 * "Certified in", unless a partnership document exists in assets/ — docs/04 §14
 * and docs/08 §7. A logo wall is the easiest place on a website to imply a
 * relationship that does not exist.
 *
 * These are **wordmarks, not logo images**. No logo files were supplied, and a
 * third-party logo is a trademark with usage terms attached, not an asset to
 * approximate. The names carry the same information and make no implied claim.
 *
 * Mechanics live in Marquee. Two rails rather than one, travelling in opposite
 * directions at different speeds: one rail reads as a list that happens to be
 * moving, two read as a system with depth. The split is by ecosystem group
 * rather than by halving the array, so each rail is a coherent set — languages
 * and frameworks above, platforms and tooling below — instead of an arbitrary
 * cut through the middle of one.
 */
export function LogoMarquee({ canvas = 'bone' }: { canvas?: Canvas } = {}) {
  // Split by group, not down the middle of the flattened list, so each rail is
  // a coherent set rather than an arbitrary cut through one.
  const half = Math.ceil(technologyEcosystem.groups.length / 2)
  const topRail = technologyEcosystem.groups.slice(0, half).flatMap((group) => group.items)
  const bottomRail = technologyEcosystem.groups.slice(half).flatMap((group) => group.items)

  return (
    <SectionShell canvas={canvas} reveal>
      <div className="max-w-measure">
        <Eyebrow>{technologyEcosystem.eyebrow}</Eyebrow>
        <Headline className="mt-5">{technologyEcosystem.heading}</Headline>
        <p className="mt-5 text-body-lg">{technologyEcosystem.body}</p>
      </div>

      <p className="mt-10 font-mono text-label text-(--accent-text) uppercase">
        {technologyEcosystem.label}
      </p>

      <div className="mt-6 border-y border-(--line)">
        <Marquee
          items={topRail}
          duration={46}
          className="py-5"
          itemClassName="font-display text-h3 text-(--ink-muted)"
        />
        <Marquee
          items={bottomRail}
          duration={38}
          direction="reverse"
          className="border-t border-(--line) py-5"
          itemClassName="font-display text-h3 text-(--ink-muted)"
        />
      </div>

      {/* The grouping is the useful information; the marquee is the texture. */}
      <dl className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {technologyEcosystem.groups.map((group) => (
          <div key={group.name}>
            <dt className="font-mono text-label text-(--ink-muted) uppercase">{group.name}</dt>
            <dd className="mt-2 text-body-sm">{group.items.join(' · ')}</dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  )
}
