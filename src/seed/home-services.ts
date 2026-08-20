import type { ServiceSlug } from '@/lib/routes'
import { serviceCards } from '@/seed/services'

/**
 * The four disciplines shown directly below the hero.
 *
 * Four rather than all seven, and these four rather than any others, because
 * they are the ones that answer "what kind of company is this" in one screen:
 * a decision, a system, the intelligence in it, and the platform it runs on.
 * The remaining three are a click away and the section says so.
 *
 * The cards read from `serviceCards`, so a wording change in the CMS reaches
 * this section and the services page together — the order here is a selection,
 * not a second copy of the content.
 */
const featured: ServiceSlug[] = [
  'consulting',
  'software-development',
  'ai-automation',
  'cloud-devops',
]

export const homeServices = {
  eyebrow: 'What we do',
  // Deliberately terse. The first version ran to three lines of heading and a
  // forty-word paragraph, which is a brief rather than a statement — nobody
  // reads that on the second screen of a home page. The newline is an editorial
  // break, held at every width.
  heading: 'Four disciplines.\nOne accountable team.',
  body: 'One conversation, not three.',
  cta: { label: 'Explore what we do', href: '/services' },
  cards: featured.map((slug) => {
    const card = serviceCards.find((service) => service.slug === slug)
    if (!card) throw new Error(`homeServices: no service seeded for "${slug}"`)
    return card
  }),
}
