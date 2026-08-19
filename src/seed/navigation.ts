import type { Navigation } from '@/types/content'

/**
 * Seed content for the `navigation` global — docs/02 §2 puts all copy here
 * rather than in JSX, and this is what will be loaded into Payload once T-002
 * unblocks.
 *
 * Two Phase 1 decisions worth reading before editing.
 *
 * **Every href resolves.** docs/05 and CLAUDE.md both require a working
 * destination behind every link, so nothing here points at Solutions,
 * Technologies, Case Studies or Resources. Those are Phase 2+ and are gated
 * behind feature flags in `siteSettings`, not linked and hidden.
 *
 * **Three groups in the What We Do menu, not six.** docs/04 §2 specifies six
 * groups in three columns, and blueprint §3.2 lists them: AI & Automation,
 * Product Engineering, Digital Experiences, Mobile, Growth, Cloud & DevOps.
 * Each of those groups is meant to hold four to seven links to Solutions and
 * Technologies pages. In Phase 1 those pages do not exist, so six groups could
 * only be filled by pointing several labels at the same service page — a dead
 * end dressed up as a menu. Three groups carry all seven services with one
 * destination each and no duplicate hrefs. The six-group structure returns in
 * Phase 2 when there is something behind it.
 */
export const navigationSeed: Navigation = {
  utilityBar: {
    // Off until there is something useful to put in it. blueprint §3.1 warns
    // against a decorative bar competing with the main CTA, and the two things
    // that would earn the space — email and phone — have not been supplied.
    enabled: false,
  },

  megaMenus: [
    {
      label: 'What we do',
      href: '/services',
      groups: [
        {
          heading: 'Build',
          supportingCopy: 'Turn complex requirements into reliable products.',
          links: [
            {
              label: 'Software development',
              href: '/services/software-development',
              description: 'SaaS, enterprise systems, portals and custom platforms',
            },
            {
              label: 'Website development',
              href: '/services/website-development',
              description: 'Corporate, ecommerce and headless, engineered to convert',
            },
            {
              label: 'Mobile app development',
              href: '/services/mobile-app-development',
              description: 'Native and cross-platform, for customers and for teams',
            },
          ],
        },
        {
          heading: 'Automate',
          supportingCopy: 'Build intelligent systems that act on business context.',
          links: [
            {
              label: 'AI & automation',
              href: '/services/ai-automation',
              description: 'Agents, RAG, voice, document intelligence and workflows',
            },
            {
              label: 'Cloud & DevOps',
              href: '/services/cloud-devops',
              description: 'Architecture, migration, CI/CD, observability and support',
            },
          ],
        },
        {
          heading: 'Advise and grow',
          supportingCopy: 'Decisions before code. Measurement after launch.',
          links: [
            {
              label: 'Technology consulting',
              href: '/services/consulting',
              description: 'Discovery, architecture, build-versus-buy and roadmaps',
            },
            {
              label: 'Digital marketing',
              href: '/services/digital-marketing',
              description: 'Performance, SEO, CRO and lifecycle, connected to the product',
            },
          ],
        },
      ],
      featuredPanel: {
        eyebrow: 'Not sure where to start?',
        heading: 'Bring us the challenge.',
        body: 'Thirty minutes. We come with questions, not a pitch, and you leave with a suggested next step — even if it is not us.',
        ctaLabel: 'Book a transformation consultation',
        ctaHref: '/book-consultation',
      },
    },

    {
      label: 'Industries',
      href: '/industries',
      groups: [
        {
          heading: 'Regulated sectors',
          supportingCopy: 'Where governance and auditability shape every decision.',
          links: [
            { label: 'Healthcare', href: '/industries/healthcare' },
            { label: 'Finance', href: '/industries/finance' },
            { label: 'Government', href: '/industries/government' },
            { label: 'Education', href: '/industries/education' },
          ],
        },
        {
          heading: 'Operations and supply',
          supportingCopy: 'Where visibility across sites and partners is the constraint.',
          links: [
            { label: 'Manufacturing', href: '/industries/manufacturing' },
            { label: 'Logistics', href: '/industries/logistics' },
            { label: 'Retail and ecommerce', href: '/industries/retail' },
            { label: 'Hospitality', href: '/industries/hospitality' },
          ],
        },
        {
          heading: 'Growth and scale',
          supportingCopy: 'Where the question is what to build next, and how fast.',
          links: [
            { label: 'Startups', href: '/industries/startups' },
            { label: 'Enterprise', href: '/industries/enterprise' },
            { label: 'Real estate', href: '/industries/real-estate' },
          ],
        },
      ],
      featuredPanel: {
        eyebrow: 'Every industry page',
        heading: 'Written for how the work actually runs.',
        body: 'Each page sets out the operating reality, the challenges we see repeatedly, and where we typically start.',
        ctaLabel: 'See all industries',
        ctaHref: '/industries',
      },
    },
  ],

  primaryLinks: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],

  footerColumns: [
    {
      heading: 'Company',
      links: [
        { label: 'About V4You', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Book a consultation', href: '/book-consultation' },
      ],
    },
    {
      heading: 'Services',
      links: [
        { label: 'AI & automation', href: '/services/ai-automation' },
        { label: 'Software development', href: '/services/software-development' },
        { label: 'Website development', href: '/services/website-development' },
        { label: 'Mobile app development', href: '/services/mobile-app-development' },
        { label: 'Digital marketing', href: '/services/digital-marketing' },
        { label: 'Cloud & DevOps', href: '/services/cloud-devops' },
        { label: 'Consulting', href: '/services/consulting' },
      ],
    },
    {
      heading: 'Industries',
      links: [
        { label: 'Healthcare', href: '/industries/healthcare' },
        { label: 'Manufacturing', href: '/industries/manufacturing' },
        { label: 'Finance', href: '/industries/finance' },
        { label: 'Logistics', href: '/industries/logistics' },
        { label: 'Retail and ecommerce', href: '/industries/retail' },
        { label: 'All industries', href: '/industries' },
      ],
    },
    // Gated columns. blueprint §3.8 lists Solutions and Resources; both are
    // Phase 2+, so both are omitted entirely rather than rendered empty.
    {
      heading: 'Solutions',
      requiresFlag: 'showSolutions',
      links: [],
    },
    {
      heading: 'Resources',
      requiresFlag: 'showResources',
      links: [],
    },
    {
      heading: 'Trust',
      links: [
        { label: 'Security', href: '/security' },
        { label: 'Accessibility', href: '/accessibility' },
        { label: 'Privacy policy', href: '/privacy-policy' },
        { label: 'Cookie policy', href: '/cookie-policy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
  ],

  stickyCta: {
    label: 'Book a consultation',
    href: '/book-consultation',
    showOnMobile: true,
  },
}
