import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'
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
 * Mechanics: the track is duplicated once in the DOM and the copy is
 * `aria-hidden`, so a screen reader hears the list once. It pauses on hover and
 * stops entirely under reduced motion — CSS only, no client JavaScript.
 */
export function LogoMarquee() {
  const items = technologyEcosystem.groups.flatMap((group) => group.items)

  return (
    <SectionShell canvas="bone" reveal>
      <div className="max-w-measure">
        <Eyebrow>{technologyEcosystem.eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-headline font-display text-h2 text-(--ink)">
          {technologyEcosystem.heading}
        </h2>
        <p className="mt-5 text-body-lg">{technologyEcosystem.body}</p>
      </div>

      <p className="mt-10 font-mono text-label text-(--accent-text) uppercase">
        {technologyEcosystem.label}
      </p>

      <div className="marquee group relative mt-6 overflow-hidden border-y border-(--line) py-6">
        <div className="marquee-track flex w-max gap-10">
          <ul className="flex shrink-0 gap-10">
            {items.map((item) => (
              <li key={item} className="font-display text-h3 whitespace-nowrap text-(--ink-muted)">
                {item}
              </li>
            ))}
          </ul>
          {/* The duplicate exists only to make the loop seamless. */}
          <ul aria-hidden="true" className="flex shrink-0 gap-10">
            {items.map((item) => (
              <li key={item} className="font-display text-h3 whitespace-nowrap text-(--ink-muted)">
                {item}
              </li>
            ))}
          </ul>
        </div>
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
