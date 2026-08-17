import type { ServiceSlug } from '@/lib/routes'

/**
 * Card-level service copy — blueprint §4.5 and §5.
 *
 * This is the summary each service needs on the home page and the services hub.
 * The full thirteen-block page content arrives with T-061, from the `services`
 * collection.
 *
 * Every outcome line describes what the work is for, not what it is made of.
 * None asserts a result: docs/01 tone rules say "can", "designed to" or "helps"
 * unless a result is verified, and nothing here is verified yet.
 */

export type ServiceCard = {
  slug: ServiceSlug
  title: string
  /** The one-line promise — what changes for the business. */
  outcome: string
  body: string
  /** Up to four, per docs/04 §20. */
  capabilities: string[]
}

export const serviceCards: ServiceCard[] = [
  {
    slug: 'ai-automation',
    title: 'AI & automation',
    outcome: 'Turn AI potential into operating advantage.',
    body: 'Agents, assistants, voice systems and retrieval that connect to the tools your business already runs on — with human approval where the stakes justify it.',
    capabilities: ['Agents & copilots', 'RAG & knowledge', 'Voice & chat', 'Document intelligence'],
  },
  {
    slug: 'software-development',
    title: 'Software development',
    outcome: 'Build software that fits the business — not the other way around.',
    body: 'Product discovery, UX, architecture, engineering, testing and deployment, so the first release is designed for the next release too.',
    capabilities: ['SaaS products', 'ERP & CRM', 'Internal portals', 'Legacy modernisation'],
  },
  {
    slug: 'website-development',
    title: 'Website development',
    outcome: 'Websites engineered to load fast and convert.',
    body: 'Corporate, ecommerce and headless builds measured against a quality scorecard: messaging, information architecture, accessibility, Core Web Vitals and conversion paths.',
    capabilities: ['Next.js & headless', 'Ecommerce', 'Accessibility', 'CRO & analytics'],
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile app development',
    outcome: 'Put your product where your users work.',
    body: 'Native and cross-platform applications for customers and for field teams, with the native-versus-cross-platform trade-off set out as a decision rather than a preference.',
    capabilities: [
      'iOS & Android',
      'Flutter & React Native',
      'Offline capability',
      'Store release',
    ],
  },
  {
    slug: 'digital-marketing',
    title: 'Digital marketing',
    outcome: 'Growth connected to product and data.',
    body: 'Acquisition wired into the CRM, the product and the sales process, so the number that improves is qualified pipeline rather than traffic.',
    capabilities: ['Performance media', 'SEO', 'Marketing automation', 'CRO'],
  },
  {
    slug: 'cloud-devops',
    title: 'Cloud & DevOps',
    outcome: 'Systems that stay up, stay visible, and stay ready.',
    body: 'Architecture, migration, CI/CD, infrastructure as code, observability and recovery — with environments, access and secrets handled as part of the design.',
    capabilities: ['AWS, Azure, GCP', 'CI/CD & IaC', 'Observability', 'Cost optimisation'],
  },
  {
    slug: 'consulting',
    title: 'Technology consulting',
    outcome: 'Decisions before code.',
    body: 'Digital and AI readiness assessment, product discovery, build-versus-buy analysis, architecture and a roadmap tied to measurable priorities.',
    capabilities: ['AI readiness', 'Product discovery', 'Build vs buy', 'Architecture review'],
  },
]
