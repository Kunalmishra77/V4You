import 'server-only'

/**
 * Whether placeholder content may render.
 *
 * The site has sections that are built and waiting on evidence — case studies,
 * client logos, testimonials. Designing those sections against an empty array
 * is guesswork, so there is sample data to design against. Shipping that sample
 * data would be publishing proof V4You does not have, which `CLAUDE.md` rule 1
 * forbids and which the site's own `/security` page contradicts in writing.
 *
 * So it is a flag, and the flag defaults to **off**. Turning it on is a
 * deliberate act in `.env.local`, it is never set in a deployment, and every
 * component that reads it also renders a visible label saying the content is a
 * sample. Three independent things would have to go wrong at once for a
 * fabricated case study to reach a visitor.
 *
 * When real studies arrive they replace the seed and the flag stops mattering.
 */
export function sampleContentEnabled() {
  return process.env.NEXT_PUBLIC_SAMPLE_CONTENT === '1'
}
