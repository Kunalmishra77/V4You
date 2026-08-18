import type { DiagramNode } from '@/components/blocks/ArchitectureDiagram'
import type { ServiceSlug } from '@/lib/routes'
import type { Faq } from '@/lib/seo'

/**
 * Full service page content — T-061, docs/05 §4–10.
 *
 * Seven services, one template, thirteen blocks each. This file is the content;
 * the template is layout only.
 *
 * Two rules govern every word here.
 *
 * **No figures in `pricing`.** docs/05 and blueprint §5.1 both forbid price
 * anchoring before scope is known, and the `services` collection rejects
 * "starting at" strings outright. Each entry explains what drives cost and
 * which engagement shapes exist, which is the useful version of the answer.
 *
 * **Nothing asserts a result.** No timelines, no percentages, no client
 * outcomes. Where a claim would need evidence, the copy describes the method
 * instead — which is checkable in a conversation.
 */

export type ServiceDetail = {
  hero: { eyebrow: string; headline: string; body: string; primaryCta: string }
  /** Metadata title from docs/05's table of seven. */
  metaTitle: string
  metaDescription: string
  problems: { title: string; body: string }[]
  capabilities: { title: string; body: string }[]
  outcomeStatement: string
  benefits: string
  deliverables: string[]
  architecture: { caption: string; summary: string; nodes: DiagramNode[] }
  /** What drives cost, then the engagement shapes. No figures. */
  pricing: { drivers: string[]; shapes: { name: string; body: string }[] }
  industries: ServiceSlug extends never ? never : string[]
  faqs: Faq[]
}

const SHARED_SHAPES = [
  {
    name: 'Paid discovery',
    body: 'A short, fixed-price engagement that produces an architecture, a scope and a plan. You own all of it and could hand it to another supplier.',
  },
  {
    name: 'Fixed-scope pilot',
    body: 'One workflow, one measurable outcome, a defined boundary. Proves the approach before anyone commits to a programme.',
  },
  {
    name: 'Milestone build',
    body: 'Production delivery in increments, each with its own acceptance criteria, so payment tracks progress you can see.',
  },
  {
    name: 'Monthly optimisation',
    body: 'Ongoing improvement against agreed measures once the system is live.',
  },
  {
    name: 'Managed engagement',
    body: 'A standing team for organisations that need continuous capacity rather than a project.',
  },
]

export const serviceDetails: Record<ServiceSlug, ServiceDetail> = {
  'ai-automation': {
    metaTitle: 'AI Automation Services for Business — V4You',
    metaDescription:
      'AI agents, retrieval, voice and workflow automation that connect to the tools you already run — with human approval where the stakes justify it.',
    hero: {
      eyebrow: 'AI & automation',
      headline: 'Turn AI potential into operating advantage.',
      body: 'We design and deploy AI agents, assistants, voice systems, retrieval applications and workflow automation that connect to the tools your business already uses — and stop for a person wherever the stakes justify it.',
      primaryCta: 'Assess your AI opportunity',
    },
    outcomeStatement:
      'Repetitive, high-volume work handled automatically, with the exceptions routed to a person who has the context already attached.',
    benefits:
      'The value of AI in a business is rarely the model. It is the plumbing around it: knowing which work is worth automating, connecting to the systems that hold the data, deciding where a human still has to sign, and being able to prove afterwards what the system did and why. That is most of the effort and almost all of the risk.',
    problems: [
      {
        title: 'Response times that lose the enquiry',
        body: 'Enquiries arrive after hours, at weekends, and in volumes that peak unpredictably. The ones that go unanswered longest are rarely the least valuable — they are just the ones nobody got to.',
      },
      {
        title: 'Knowledge locked in documents',
        body: 'The answer exists, in a policy, a contract or a previous ticket. Finding it takes someone who knows where to look, which makes that person a bottleneck.',
      },
      {
        title: 'Support volume scaling with headcount',
        body: 'Every additional customer adds contacts, and the only lever available is hiring. Deflection needs to come from answering better, not from making it harder to reach you.',
      },
      {
        title: 'Manual data entry between systems',
        body: 'Someone reads a document and types its contents into another system. It is expensive, it is error-prone, and it is invisible in every report because nobody logs it as work.',
      },
    ],
    capabilities: [
      {
        title: 'AI agents for bounded tasks',
        body: 'An agent given a narrow job, the tools to do it, and a boundary it cannot cross. It proposes, a person approves what matters, and every step is logged.',
      },
      {
        title: 'Retrieval-augmented knowledge',
        body: 'Answers grounded in your approved documents rather than the model’s memory, with citations, so an answer can be checked rather than trusted.',
      },
      {
        title: 'Voice agents',
        body: 'Answer, qualify, schedule, route and summarise the calls that currently reach voicemail. Escalation to a person stays one step away.',
      },
      {
        title: 'Document intelligence',
        body: 'Extract structured fields from invoices, forms and contracts, with low-confidence extractions routed for review instead of guessed.',
      },
      {
        title: 'Workflow orchestration',
        body: 'Approvals, data movement, notifications and exception handling wired between the systems you already run.',
      },
      {
        title: 'Evaluation and guardrails',
        body: 'A test set before release, monitoring after it, and a defined fallback for when the model is wrong. A demo is not a production system.',
      },
    ],
    deliverables: [
      'AI opportunity map, ranked by value and feasibility',
      'Process map of the workflow as it runs today',
      'Solution architecture, including where humans stay in the loop',
      'Prompt and instruction system, version-controlled',
      'Retrieval pipeline with permissions honoured',
      'Integrations to your existing systems',
      'Evaluation suite and monitoring dashboards',
      'Deployment, training and documentation',
      'Improvement roadmap based on what production shows',
    ],
    architecture: {
      caption: 'What a bounded agent actually looks like',
      summary:
        'A trigger arrives — a message, a document, a system event. The agent retrieves only what the requester is permitted to see, and drafts an action. Anything priced, contractual or regulated stops at an approval gate for a person; everything else executes straight through into the systems of record. Every step is logged, so a decision can be reconstructed afterwards, and an evaluation suite runs continuously against a held-out test set so quality drift is noticed before a customer notices it.',
      nodes: [
        {
          id: 'trigger',
          layer: 'source',
          label: 'Trigger',
          description:
            'A message, document or system event starts the run. Every trigger is recorded with its origin.',
        },
        {
          id: 'context',
          layer: 'source',
          label: 'Business context',
          description:
            'Account history, current policy and open items — scoped to what the requester is permitted to see.',
        },
        {
          id: 'retrieval',
          layer: 'process',
          label: 'Retrieval',
          description:
            'Finds the relevant passages from approved sources and passes them with citations, so the answer can be checked.',
        },
        {
          id: 'reason',
          layer: 'process',
          label: 'Plan and draft',
          description:
            'The model proposes an action. It never acts directly — it produces something a gate can inspect.',
        },
        {
          id: 'gate',
          layer: 'process',
          label: 'Approval gate',
          description:
            'Anything priced, contractual or regulated stops here for a person. This is a design decision, not a setting.',
        },
        {
          id: 'eval',
          layer: 'process',
          label: 'Evaluation',
          description:
            'Runs against a held-out test set continuously, so quality drift is caught before a customer finds it.',
        },
        {
          id: 'systems',
          layer: 'surface',
          label: 'Systems of record',
          description: 'CRM, ERP or ticketing updated automatically once the action is approved.',
        },
        {
          id: 'human',
          layer: 'surface',
          label: 'The owner',
          description:
            'Notified with the context attached, rather than discovering it in a weekly report.',
        },
        {
          id: 'audit',
          layer: 'surface',
          label: 'Audit trail',
          description:
            'What happened, when, on whose authority — assembled as it goes, because a log written afterwards is not a log.',
        },
      ],
    },
    pricing: {
      drivers: [
        'How many decision points the workflow contains, and how many of them need a human',
        'The number of systems to integrate, and whether they have usable APIs',
        'Data readiness — whether the information the system needs is structured, permissioned and current',
        'Expected model usage, which is an ongoing cost rather than a one-off',
        'Security requirements, including data residency and audit obligations',
        'Whether people need a new interface or the work belongs inside an existing one',
      ],
      shapes: SHARED_SHAPES,
    },
    industries: ['healthcare', 'finance', 'logistics', 'retail'],
    faqs: [
      {
        question: 'How do you stop it making things up?',
        answer:
          'Retrieval grounds answers in your approved documents and returns citations, so a claim can be traced to a source. Where confidence is low the system declines and hands over rather than guessing. And an evaluation suite runs against a held-out test set continuously, so quality drift is caught by us rather than by a customer.',
      },
      {
        question: 'Which model do you use?',
        answer:
          'Whichever fits the workload, and the architecture is built so that can change. Model choice moves on a timescale of months, so anything that depends on one specific model is a maintenance problem waiting to happen.',
      },
      {
        question: 'Where does our data go?',
        answer:
          'That is an architecture decision made explicitly rather than a side effect. Depending on requirements, retrieval can run against data that never leaves your environment, and model providers can be configured not to retain inputs. We write down what leaves, where it goes and for how long.',
      },
      {
        question: 'Will this replace people?',
        answer:
          'The work we automate is the repetitive, high-volume part — the data entry, the first response, the lookup. What it frees is judgement, relationships and the exceptions, which are the parts people are better at and would rather be doing. We design for augmentation because that is what actually survives contact with a team.',
      },
      {
        question: 'How long before it does anything useful?',
        answer:
          'A bounded pilot on one workflow produces something you can judge well before a full build. We deliberately do not quote a timeline here — it depends on how many systems are involved and how ready the data is, and a number quoted before we know either is a guess dressed as a commitment.',
      },
    ],
  },

  'software-development': {
    metaTitle: 'Custom Software Development Company — V4You',
    metaDescription:
      'Product discovery, architecture, engineering and handover — software built so the first release is designed for the second one too.',
    hero: {
      eyebrow: 'Software development',
      headline: 'Build software that fits the business — not the other way around.',
      body: 'Product discovery, UX, architecture, engineering, testing and deployment in one delivery model, so the first release is designed for the release after it.',
      primaryCta: 'Start a software project',
    },
    outcomeStatement:
      'A system your team can operate, extend and explain — not one that only its authors understand.',
    benefits:
      'Most custom software fails slowly. It works at launch, then every change costs more than the last, until the sensible option is a rewrite. That is usually not a coding problem: it is decisions made early, under deadline, that nobody wrote down. We make those decisions explicit, record why, and design the first release around the constraints the second one will bring.',
    problems: [
      {
        title: 'Off-the-shelf nearly fits',
        body: 'The platform does eighty per cent of what you need, and the remaining twenty per cent is where your actual advantage lives — so it gets handled in spreadsheets alongside the system meant to replace them.',
      },
      {
        title: 'Every change costs more than the last',
        body: 'Early decisions became constraints. Nobody wrote down why they were made, so nobody can safely undo them.',
      },
      {
        title: 'The system only its authors understand',
        body: 'No architecture record, no runbook, no test suite. The knowledge lives in two people, and the risk lives with you.',
      },
      {
        title: 'Requirements that were never really agreed',
        body: 'A specification everyone signed and nobody shared a reading of. The disagreement surfaces at acceptance, when it is most expensive.',
      },
    ],
    capabilities: [
      {
        title: 'Product discovery',
        body: 'Interviews, workflow mapping and a technical audit, ending in a scope you could hand to any competent supplier.',
      },
      {
        title: 'Architecture decision records',
        body: 'Each significant choice written down with its alternatives and trade-offs, so a future team can tell a decision from an accident.',
      },
      {
        title: 'SaaS and multi-tenant products',
        body: 'Tenancy, billing, roles and onboarding designed at the start, because retrofitting tenancy is close to a rewrite.',
      },
      {
        title: 'ERP, CRM and internal platforms',
        body: 'Systems shaped around how the work actually runs rather than how a vendor assumed it does.',
      },
      {
        title: 'Legacy modernisation',
        body: 'One capability at a time behind a stable interface, so the business keeps running and each step proves itself.',
      },
      {
        title: 'Testing and observability',
        body: 'Automated tests, monitoring and alerting delivered with the system, not scheduled for afterwards.',
      },
    ],
    deliverables: [
      'Discovery report with prioritised scope',
      'Architecture decision records',
      'UX flows, wireframes and a design system',
      'Iterative build with demonstrable increments',
      'Automated test suite and CI pipeline',
      'Security review and dependency policy',
      'Monitoring, alerting and runbooks',
      'Documentation and structured handover',
      'Post-launch support arrangement',
    ],
    architecture: {
      caption: 'How a delivery is structured',
      summary:
        'Discovery produces a scope and an architecture you own. Build runs in increments, each ending in something demonstrable rather than a status report, with automated tests and a CI pipeline from the first commit rather than added later. Every significant decision is recorded with its alternatives. At launch you receive the code, the infrastructure definitions, the runbooks and the documentation — and a support arrangement whose boundaries are written down, so nobody is guessing at three in the morning whose problem it is.',
      nodes: [
        {
          id: 'discovery',
          layer: 'source',
          label: 'Discovery',
          description:
            'Interviews, workflow mapping and technical audit. Ends with a scope you own outright.',
        },
        {
          id: 'adr',
          layer: 'source',
          label: 'Decision records',
          description:
            'Each significant choice with its alternatives and trade-offs, so a future team can tell a decision from an accident.',
        },
        {
          id: 'design',
          layer: 'process',
          label: 'UX and design system',
          description:
            'Flows and components defined once, so the fifth screen costs less than the first.',
        },
        {
          id: 'build',
          layer: 'process',
          label: 'Iterative build',
          description: 'Increments that each end in something you can use and disagree with.',
        },
        {
          id: 'ci',
          layer: 'process',
          label: 'Tests and CI',
          description:
            'Automated from the first commit. A test suite added at the end tests what was built, not what was meant.',
        },
        {
          id: 'release',
          layer: 'surface',
          label: 'Release',
          description:
            'Repeatable deployment, environment separation, and a rollback that has been rehearsed.',
        },
        {
          id: 'observability',
          layer: 'surface',
          label: 'Observability',
          description: 'Monitoring and alerting, so the team knows before the customer does.',
        },
        {
          id: 'handover',
          layer: 'surface',
          label: 'Handover',
          description: 'Code, infrastructure, documentation and runbooks. You own all of it.',
        },
      ],
    },
    pricing: {
      drivers: [
        'How much of the domain is genuinely unique versus conventional',
        'Number of user roles and the permission model between them',
        'Integrations, and whether those systems expose usable APIs',
        'Compliance and audit obligations that shape the architecture',
        'Depth of design work — a tool for twenty staff is not a product for twenty thousand users',
        'Migration from whatever exists today, which is routinely underestimated',
      ],
      shapes: SHARED_SHAPES,
    },
    industries: ['manufacturing', 'healthcare', 'logistics', 'enterprise'],
    faqs: [
      {
        question: 'Should we build or buy?',
        answer:
          'Buy wherever your process is genuinely conventional — finance, payroll, email. Build where the process is your advantage, because that is the part no vendor will shape around you. We run this as an explicit analysis in discovery, and the answer is regularly "buy", which is a cheaper outcome for you and an easier conversation than discovering it in month four.',
      },
      {
        question: 'Do we own the code?',
        answer:
          'Yes — code, infrastructure definitions, data and documentation, with the scope and any exclusions written into the agreement rather than assumed. If you decide to continue with another supplier, everything needed to do that is already in your hands.',
      },
      {
        question: 'Can you work with our existing engineers?',
        answer:
          'Regularly, and it is often the better arrangement. We can take a discrete workstream, provide architecture and review, or embed alongside. The thing that matters is that decision ownership is explicit — ambiguity about who decides is what slows joint teams down, not skill differences.',
      },
      {
        question: 'What happens after launch?',
        answer:
          'A defined support arrangement: what is covered, what response looks like, and how changes are requested. Handover includes runbooks and architecture documentation, so your team can operate the system without us, which is the point of writing them.',
      },
    ],
  },

  'website-development': {
    metaTitle: 'Enterprise Website Development Services — V4You',
    metaDescription:
      'Corporate, ecommerce and headless builds measured against a quality scorecard: messaging, accessibility, Core Web Vitals and conversion paths.',
    hero: {
      eyebrow: 'Website development',
      headline: 'Websites engineered to load fast and convert.',
      body: 'Corporate, ecommerce and headless builds, measured against a scorecard rather than a screenshot: messaging, information architecture, accessibility, Core Web Vitals, technical SEO and conversion paths.',
      primaryCta: 'Request a website consultation',
    },
    outcomeStatement:
      'A site that is fast on a mid-range phone, usable with a keyboard, and honest about what it is asking a visitor to do.',
    benefits:
      'Most website projects are judged on how they look in a review meeting, on a large monitor, over office broadband. Almost none of your visitors are in that situation. We measure the things that actually decide whether a site works — how quickly it becomes usable on a mid-range phone, whether a keyboard can reach every control, and whether the path to the next step is obvious.',
    problems: [
      {
        title: 'Slow on the devices people actually use',
        body: 'A site that feels quick on a desktop can take several seconds to become usable on a mid-range Android phone on mobile data — which is most of your traffic.',
      },
      {
        title: 'Traffic that does not convert',
        body: 'Visitors arrive and leave. Usually the page never made it clear what to do next, or asked for commitment before it had earned any.',
      },
      {
        title: 'A CMS nobody wants to touch',
        body: 'Editing requires a developer, so content goes stale and the site slowly stops describing the business.',
      },
      {
        title: 'Accessibility discovered at the end',
        body: 'Treated as an audit before launch rather than a constraint during design, which makes it a retrofit — expensive, partial, and resented.',
      },
    ],
    capabilities: [
      {
        title: 'Next.js and headless architecture',
        body: 'Server-rendered pages with near-zero client JavaScript, so the content arrives before the framework does.',
      },
      {
        title: 'Editor-first CMS',
        body: 'A content model that matches how the team thinks, so publishing does not require a ticket.',
      },
      {
        title: 'Accessibility as a build constraint',
        body: 'Semantic markup, keyboard operation and contrast checked per component, not audited at the end.',
      },
      {
        title: 'Core Web Vitals budget',
        body: 'Performance budgets enforced in CI. A page that breaches them does not merge.',
      },
      {
        title: 'Technical SEO and structured data',
        body: 'Canonicals, sitemaps and schema generated from the content model rather than maintained by hand.',
      },
      {
        title: 'Conversion instrumentation',
        body: 'Events defined before the build, so the analytics answer the questions the business actually has.',
      },
    ],
    deliverables: [
      'Website quality scorecard against the current site',
      'Information architecture and content model',
      'Design system and component library',
      'Accessible, server-rendered build',
      'CMS configured for the people who will use it',
      'Structured data, sitemap and redirect map',
      'Analytics with a defined event catalogue',
      'Performance budget enforced in CI',
      'Editor documentation and training',
    ],
    architecture: {
      caption: 'What makes a page fast and findable',
      summary:
        'Content lives in a CMS with a model shaped around how editors think. Pages render on the server and ship almost no client JavaScript, so content arrives before the framework does. Structured data, canonicals and the sitemap are generated from the same content model rather than maintained separately, which is why they cannot drift out of sync. Performance budgets run in CI, so a regression fails the build instead of being discovered in a quarterly audit.',
      nodes: [
        {
          id: 'cms',
          layer: 'source',
          label: 'CMS',
          description:
            'A content model matching how the team thinks, so publishing does not need a developer.',
        },
        {
          id: 'media',
          layer: 'source',
          label: 'Media pipeline',
          description:
            'Modern formats and correct sizing, generated automatically rather than remembered.',
        },
        {
          id: 'render',
          layer: 'process',
          label: 'Server rendering',
          description:
            'Pages built on the server. The content is in the HTML, which is what crawlers and slow devices both need.',
        },
        {
          id: 'schema',
          layer: 'process',
          label: 'Structured data',
          description:
            'Generated from the same content model as the page, so markup and content cannot disagree.',
        },
        {
          id: 'budget',
          layer: 'process',
          label: 'Performance budget',
          description: 'Enforced in CI. A page that breaches it does not merge.',
        },
        {
          id: 'visitor',
          layer: 'surface',
          label: 'The visitor',
          description:
            'Content usable quickly on a mid-range phone, and reachable with a keyboard.',
        },
        {
          id: 'search',
          layer: 'surface',
          label: 'Search engines',
          description:
            'Server-rendered content, correct canonicals, and a sitemap generated from published records.',
        },
        {
          id: 'analytics',
          layer: 'surface',
          label: 'Analytics',
          description:
            'A defined event catalogue, so reports answer the questions the business actually asks.',
        },
      ],
    },
    pricing: {
      drivers: [
        'Number of unique page templates, which matters more than page count',
        'How much content needs writing rather than migrating',
        'Ecommerce, payments or gated content',
        'Integrations with CRM, marketing automation or an ERP',
        'Design depth — adapting a system versus creating one',
        'Migration and redirect mapping from the existing site',
      ],
      shapes: SHARED_SHAPES,
    },
    industries: ['retail', 'hospitality', 'education', 'startups'],
    faqs: [
      {
        question: 'Can our team edit the site without a developer?',
        answer:
          'That is the point of the content model. Editors get structured fields and a block library rather than a free-form page builder, which keeps the site consistent while removing the ticket. We train the people who will actually use it, not just the person who commissioned it.',
      },
      {
        question: 'Will it rank better?',
        answer:
          'We can fix the technical side reliably — server rendering, structured data, canonicals, performance, internal linking. Ranking also depends on content quality, competition and authority, which no supplier controls. Anyone promising a position is describing something they cannot deliver.',
      },
      {
        question: 'What about the site we already have?',
        answer:
          'We start with a scorecard of the current site so improvements are measured against a baseline rather than an impression. Existing URLs get a redirect map, because losing accumulated search equity in a redesign is both common and entirely avoidable.',
      },
      {
        question: 'How do you handle accessibility?',
        answer:
          'As a build constraint per component — semantic markup, keyboard operation, visible focus, contrast checked against a matrix. We target WCAG 2.2 AA and state known limitations publicly rather than claiming conformance we have not tested.',
      },
    ],
  },

  'mobile-app-development': {
    metaTitle: 'Mobile App Development Services — V4You',
    metaDescription:
      'Native and cross-platform apps for customers and field teams, with the platform trade-off set out as a decision rather than a preference.',
    hero: {
      eyebrow: 'Mobile app development',
      headline: 'Put your product where your users work.',
      body: 'Native and cross-platform applications for customers and for field teams — with the native-versus-cross-platform question answered by your requirements rather than by our preference.',
      primaryCta: 'Discuss your app',
    },
    outcomeStatement:
      'An app that works where it is used — including where the signal does not reach.',
    benefits:
      'Field applications fail on the same thing surprisingly often: connectivity. A warehouse, a basement, a rural delivery route, a hospital corridor. If the design assumes a network, the app is unusable exactly where the work happens. We treat offline capability and sync conflict as design questions from the start rather than as a phase two nobody budgets for.',
    problems: [
      {
        title: 'Unusable where the work happens',
        body: 'The app assumes connectivity. The warehouse, the basement and the delivery route do not have it, so the work goes back onto paper.',
      },
      {
        title: 'Two codebases drifting apart',
        body: 'iOS and Android built separately, and each release widens the gap in behaviour and in what the support team has to remember.',
      },
      {
        title: 'Store rejections nobody planned for',
        body: 'Review guidelines, privacy declarations and permission justifications treated as paperwork at the end rather than as requirements.',
      },
      {
        title: 'Built for the customer, given to staff',
        body: 'A consumer interface handed to people doing repetitive work all day, who need speed and keyboard-like efficiency rather than delight.',
      },
    ],
    capabilities: [
      {
        title: 'Native iOS and Android',
        body: 'Where platform integration, performance or hardware access genuinely justifies the cost of two codebases.',
      },
      {
        title: 'Flutter and React Native',
        body: 'Where the interface is largely shared and one team can move faster than two.',
      },
      {
        title: 'Offline-first architecture',
        body: 'Local storage, queued actions and explicit conflict resolution, so the app works where the signal does not.',
      },
      {
        title: 'Enterprise distribution',
        body: 'Device management, internal distribution and staged rollout for apps that never touch a public store.',
      },
      {
        title: 'Notifications that earn their place',
        body: 'Targeted, actionable, and rate-limited — because the alternative is being switched off and never seen again.',
      },
      {
        title: 'Release and monitoring',
        body: 'Store submission, phased rollout, crash reporting and the analytics that show whether a release helped.',
      },
    ],
    deliverables: [
      'Platform decision table with the reasoning recorded',
      'Product discovery and user flows',
      'Design system sized for touch and for one-handed use',
      'Offline and sync strategy, including conflict rules',
      'Native or cross-platform build',
      'Backend APIs and integration layer',
      'Store listing, privacy declarations and submission',
      'Crash reporting, analytics and phased rollout',
      'Maintenance plan for OS version changes',
    ],
    architecture: {
      caption: 'How an offline-capable app holds together',
      summary:
        'The app writes to a local store first and treats the network as an optimisation rather than a requirement, so the interface stays responsive with no signal. Actions taken offline queue locally and sync when connectivity returns, with conflicts resolved by rules agreed in advance rather than by whichever write happened to arrive last. The backend exposes a versioned API so an older app version on a device nobody has updated keeps working. Crash reporting and analytics show whether a release actually helped.',
      nodes: [
        {
          id: 'ui',
          layer: 'source',
          label: 'App interface',
          description:
            'Sized for touch and one-handed use, and for the environment the work happens in.',
        },
        {
          id: 'local',
          layer: 'source',
          label: 'Local store',
          description: 'Written to first. The network is an optimisation, not a requirement.',
        },
        {
          id: 'queue',
          layer: 'process',
          label: 'Sync queue',
          description: 'Actions taken offline queue locally and replay when connectivity returns.',
        },
        {
          id: 'conflict',
          layer: 'process',
          label: 'Conflict rules',
          description: 'Agreed in advance rather than resolved by whichever write arrived last.',
        },
        {
          id: 'api',
          layer: 'process',
          label: 'Versioned API',
          description:
            'Older app versions on un-updated devices keep working. Not every user updates.',
        },
        {
          id: 'backend',
          layer: 'surface',
          label: 'Backend systems',
          description: 'The systems of record the app reads from and writes to.',
        },
        {
          id: 'push',
          layer: 'surface',
          label: 'Notifications',
          description:
            'Targeted and rate-limited, because the alternative is being switched off permanently.',
        },
        {
          id: 'telemetry',
          layer: 'surface',
          label: 'Crash and analytics',
          description: 'Shows whether a release helped, and where it did not.',
        },
      ],
    },
    pricing: {
      drivers: [
        'Native versus cross-platform, and whether both platforms are needed at launch',
        'Offline capability, which changes the architecture rather than adding a feature',
        'Hardware access — camera, scanning, location, Bluetooth peripherals',
        'Backend work, if the APIs the app needs do not exist yet',
        'Store compliance, privacy declarations and enterprise distribution',
        'Ongoing maintenance for annual OS releases, which is a running cost',
      ],
      shapes: SHARED_SHAPES,
    },
    industries: ['logistics', 'healthcare', 'retail', 'manufacturing'],
    faqs: [
      {
        question: 'Native or cross-platform?',
        answer:
          'A decision, not a preference. Cross-platform suits shared interfaces and one team moving quickly. Native earns its cost where you need deep platform integration, sustained graphics performance, or hardware behaviour that changes between OS versions. We produce the comparison against your requirements and record the reasoning, so the choice can be revisited later on evidence.',
      },
      {
        question: 'Do we need an app at all?',
        answer:
          'Often not. If the value is content or an occasional transaction, a fast mobile website reaches more people with no install friction. An app earns its place when it needs offline capability, hardware access, notifications or daily repeat use. That question belongs in discovery, before anyone has committed.',
      },
      {
        question: 'What happens when iOS or Android updates?',
        answer:
          'Annual OS releases break things, and stores periodically raise minimum requirements. That is a predictable running cost, not an emergency, and we plan for it in the support arrangement rather than presenting it as a surprise each year.',
      },
      {
        question: 'Can it work without a connection?',
        answer:
          'Yes, and it is worth deciding early, because offline capability shapes the architecture rather than sitting on top of it. The real work is not local storage — it is agreeing what should happen when two people changed the same record while both were offline.',
      },
    ],
  },

  'digital-marketing': {
    metaTitle: 'Performance Marketing and Growth Services — V4You',
    metaDescription:
      'Acquisition wired into the CRM, the product and the sales process, so the number that improves is qualified pipeline rather than traffic.',
    hero: {
      eyebrow: 'Digital marketing',
      headline: 'Growth connected to product and data.',
      body: 'Acquisition wired into your CRM, your product and your sales process — so the number that improves is qualified pipeline, not traffic.',
      primaryCta: 'Request a growth audit',
    },
    outcomeStatement:
      'Fewer, better-qualified enquiries, with the path from first visit to closed deal visible end to end.',
    benefits:
      'Marketing is usually measured where it is easiest to measure — impressions, clicks, sessions — rather than where it matters. The gap between a lead and revenue is where most budget is quietly lost, and it is a data problem before it is a creative one. We start by making that path visible, because optimising toward a number that does not connect to revenue is how teams get busy without getting results.',
    problems: [
      {
        title: 'Leads that do not become customers',
        body: 'Volume is up and revenue is not. Usually the targeting optimises for the cheapest conversion rather than the most valuable one.',
      },
      {
        title: 'Attribution nobody trusts',
        body: 'Every platform claims the same conversion. Without a single source of truth the reporting becomes an argument rather than a decision.',
      },
      {
        title: 'Marketing and sales measuring different things',
        body: 'Marketing reports MQLs, sales reports pipeline, and neither number reconciles with the other.',
      },
      {
        title: 'Spend that stops working',
        body: 'A channel performs, then plateaus. Without a testing structure the only remaining lever is spending more.',
      },
    ],
    capabilities: [
      {
        title: 'Performance media',
        body: 'Google, Meta and LinkedIn, structured around qualified pipeline rather than the cheapest available click.',
      },
      {
        title: 'Technical and content SEO',
        body: 'Crawlability, structured data and internal linking, plus content that answers a real question rather than targeting a phrase.',
      },
      {
        title: 'Conversion rate optimisation',
        body: 'Structured testing on the pages that carry the most intent, with results held to a standard of evidence.',
      },
      {
        title: 'Marketing automation',
        body: 'Lifecycle sequences triggered by behaviour, connected to the CRM rather than running beside it.',
      },
      {
        title: 'Analytics and attribution',
        body: 'A defined event catalogue and one agreed source of truth, so reports settle arguments instead of starting them.',
      },
      {
        title: 'Landing page systems',
        body: 'Fast, accessible pages a marketer can build without a developer.',
      },
    ],
    deliverables: [
      'Growth audit across acquisition, conversion and retention',
      'Event catalogue and analytics implementation',
      'Attribution model agreed with sales',
      'Channel strategy with a testing structure',
      'Landing page system and component library',
      'Lifecycle automation connected to the CRM',
      'Reporting that reconciles to pipeline',
      'Documented experiment log',
    ],
    architecture: {
      caption: 'How acquisition connects to revenue',
      summary:
        'Channels drive traffic to pages instrumented against a defined event catalogue. Enquiries are written into the CRM with their source and campaign attached, so attribution survives past the first click. Lifecycle automation is triggered by behaviour rather than by a calendar. Reporting reconciles to pipeline and closed revenue rather than to platform-reported conversions, which is what lets the team see which channel produced customers rather than which channel claimed them.',
      nodes: [
        {
          id: 'channels',
          layer: 'source',
          label: 'Paid and organic',
          description:
            'Search, social and referral, each tagged consistently so its contribution can be separated later.',
        },
        {
          id: 'content',
          layer: 'source',
          label: 'Content',
          description:
            'Written to answer a question someone actually has, which is also what ranks.',
        },
        {
          id: 'pages',
          layer: 'process',
          label: 'Landing pages',
          description: 'Fast, accessible, and buildable by a marketer without a developer.',
        },
        {
          id: 'events',
          layer: 'process',
          label: 'Event layer',
          description:
            'A defined catalogue, so adding an event is a decision rather than an accident.',
        },
        {
          id: 'crm',
          layer: 'process',
          label: 'CRM',
          description:
            'Enquiries land with source and campaign attached. Attribution survives past the first click.',
        },
        {
          id: 'sales',
          layer: 'surface',
          label: 'Sales pipeline',
          description: 'Where marketing performance is finally judged.',
        },
        {
          id: 'lifecycle',
          layer: 'surface',
          label: 'Lifecycle automation',
          description: 'Triggered by behaviour rather than by a calendar.',
        },
        {
          id: 'reporting',
          layer: 'surface',
          label: 'Reporting',
          description: 'Reconciles to pipeline and revenue, not to platform-reported conversions.',
        },
      ],
    },
    pricing: {
      drivers: [
        'Number of channels and markets in scope',
        'Whether analytics and attribution already exist or need building first',
        'Content volume, and whether production is included',
        'CRM and marketing automation state — integrations are usually the hidden work',
        'Testing cadence, which is bounded by your traffic volume',
        'Whether media spend is managed by us or by your team',
      ],
      shapes: SHARED_SHAPES,
    },
    industries: ['retail', 'real-estate', 'education', 'hospitality'],
    faqs: [
      {
        question: 'Can you guarantee rankings or revenue?',
        answer:
          'No, and it is worth being direct about why. Rankings depend on competition and authority; revenue depends on your pricing, your sales process and your product. We can commit to the method, to the measurement and to what we will change if something is not working. Anyone guaranteeing an outcome they do not control is describing a sales tactic.',
      },
      {
        question: 'How soon do we see results?',
        answer:
          'Paid channels produce signal in weeks; SEO and content compound over months. We deliberately avoid quoting a figure here, because the honest answer depends on your starting point, and a timeline given before an audit is a guess with a confident tone.',
      },
      {
        question: 'Do we have to move to your tools?',
        answer:
          'No. We work with the CRM and analytics you already run wherever they are capable. Migration only comes up when a tool genuinely cannot do what is being asked, and then it is a recommendation with reasons rather than a requirement.',
      },
      {
        question: 'Why does this sit next to engineering work?',
        answer:
          'Because most conversion problems are product or data problems. A slow page, a broken form, a CRM that loses the campaign source — these are the causes of underperforming spend, and they are fixed with engineering rather than with creative.',
      },
    ],
  },

  'cloud-devops': {
    metaTitle: 'Cloud and DevOps Consulting Services — V4You',
    metaDescription:
      'Architecture, migration, CI/CD, infrastructure as code and observability — with environments, access and recovery designed in rather than added.',
    hero: {
      eyebrow: 'Cloud & DevOps',
      headline: 'Systems that stay up, stay visible, and stay ready.',
      body: 'Architecture, migration, CI/CD, infrastructure as code, observability and recovery — with environments, access and secrets handled as part of the design rather than added afterwards.',
      primaryCta: 'Discuss cloud modernization',
    },
    outcomeStatement:
      'Infrastructure your team can change confidently, and restore when something goes wrong.',
    benefits:
      'The question that matters is not whether your infrastructure works today. It is whether someone can change it on a Friday without dreading Monday, and whether you could rebuild it if the account were lost. Both come down to the same thing: infrastructure defined as code, environments that match, and a restore that has actually been rehearsed rather than assumed.',
    problems: [
      {
        title: 'Nobody wants to touch it',
        body: 'Configuration made by hand over years, undocumented, unreproducible. Every change is a risk, so changes stop happening.',
      },
      {
        title: 'Failures found by customers',
        body: 'No meaningful monitoring, so the first alert is a support ticket.',
      },
      {
        title: 'Backups nobody has restored',
        body: 'Snapshots are running. Whether they can actually be restored, and how long it would take, is unknown until the day it matters.',
      },
      {
        title: 'A cloud bill nobody can explain',
        body: 'Spend rising faster than usage, with no tagging or allocation to show which workload is responsible.',
      },
    ],
    capabilities: [
      {
        title: 'Cloud architecture',
        body: 'AWS, Azure or Google Cloud, designed around your actual load pattern rather than a reference diagram.',
      },
      {
        title: 'Infrastructure as code',
        body: 'Environments defined in version control, reviewable and reproducible, so staging genuinely resembles production.',
      },
      {
        title: 'CI/CD pipelines',
        body: 'Automated testing and deployment, with a rollback that has been rehearsed rather than assumed.',
      },
      {
        title: 'Observability',
        body: 'Logs, metrics, traces and alerts that route to someone who can act, at a volume that does not train the team to ignore them.',
      },
      {
        title: 'Backup and recovery',
        body: 'Recovery objectives agreed, then tested — because an untested backup is a hypothesis.',
      },
      {
        title: 'Cost optimisation',
        body: 'Tagging, allocation and rightsizing, so spend can be attributed to the workload that caused it.',
      },
    ],
    deliverables: [
      'Infrastructure review against your current architecture',
      'Target architecture with the trade-offs recorded',
      'Infrastructure as code for every environment',
      'CI/CD pipelines with automated testing',
      'Secrets management and access model',
      'Monitoring, alerting and on-call runbooks',
      'Backup and tested recovery procedures',
      'Cost allocation and optimisation plan',
      'Migration plan with rollback at each step',
    ],
    architecture: {
      caption: 'What "ready" actually means',
      summary:
        'Every environment is defined in version control, so staging genuinely resembles production and a change is reviewed before it is applied. Deployment runs through a pipeline with automated tests and a rehearsed rollback, which is what makes a Friday release unremarkable. Secrets are managed rather than shared, and access is granted per role. Monitoring routes alerts to someone who can act, at a volume that does not train the team to ignore them. Recovery procedures are tested on a schedule, because an untested backup is a hypothesis rather than a safeguard.',
      nodes: [
        {
          id: 'iac',
          layer: 'source',
          label: 'Infrastructure as code',
          description:
            'Environments in version control, reviewable and reproducible. Staging resembles production because both come from the same definition.',
        },
        {
          id: 'secrets',
          layer: 'source',
          label: 'Secrets management',
          description: 'Managed rather than shared, and rotatable without redeploying everything.',
        },
        {
          id: 'pipeline',
          layer: 'process',
          label: 'CI/CD pipeline',
          description:
            'Automated tests, staged deployment, and a rollback that has been rehearsed.',
        },
        {
          id: 'access',
          layer: 'process',
          label: 'Access model',
          description: 'Granted per role, reviewed periodically, and revocable in one place.',
        },
        {
          id: 'backup',
          layer: 'process',
          label: 'Backup and restore',
          description:
            'Recovery objectives agreed and then tested. An untested backup is a hypothesis.',
        },
        {
          id: 'runtime',
          layer: 'surface',
          label: 'Production',
          description:
            'Running on an architecture shaped by your load pattern, not a reference diagram.',
        },
        {
          id: 'monitoring',
          layer: 'surface',
          label: 'Monitoring and alerts',
          description:
            'Routed to someone who can act, at a volume that does not train people to ignore them.',
        },
        {
          id: 'cost',
          layer: 'surface',
          label: 'Cost visibility',
          description:
            'Tagged and allocated, so spend can be traced to the workload that caused it.',
        },
      ],
    },
    pricing: {
      drivers: [
        'Number of environments and workloads in scope',
        'Whether this is a migration, a modernisation or a greenfield build',
        'Compliance and audit obligations shaping the architecture',
        'Recovery objectives — a tighter target costs more to build and to run',
        'Whether your team will operate it afterwards or we will',
        'The state of what exists today, which usually determines the effort more than the target does',
      ],
      shapes: SHARED_SHAPES,
    },
    industries: ['finance', 'healthcare', 'enterprise', 'startups'],
    faqs: [
      {
        question: 'Which cloud should we use?',
        answer:
          'Usually the one your team already knows, unless a specific requirement points elsewhere — data residency, a managed service you depend on, or existing commercial terms. The differences between the major providers matter far less than the quality of what you build on top, and switching for its own sake is an expensive way to end up in the same place.',
      },
      {
        question: 'Can you migrate without downtime?',
        answer:
          'Often, with a phased approach and a rollback at each step. Whether the last step needs a maintenance window depends on your data volume and consistency requirements, so it is answered during the review rather than promised beforehand.',
      },
      {
        question: 'Will this reduce our cloud bill?',
        answer:
          'Frequently, because untagged and oversized resources are common. But the first outcome is visibility — knowing which workload costs what. Savings follow from decisions you can then make, and we would rather show you the allocation than quote a percentage we have not verified.',
      },
      {
        question: 'Who operates it afterwards?',
        answer:
          'Your choice, and it changes the design. If your team operates it, we build for handover — documentation, runbooks and training are deliverables. If we operate it, that is a managed engagement with agreed response expectations written down.',
      },
    ],
  },

  consulting: {
    metaTitle: 'Technology Consulting and Transformation Strategy — V4You',
    metaDescription:
      'Digital and AI readiness assessment, product discovery, build-versus-buy analysis and roadmaps — decisions made before the budget is committed.',
    hero: {
      eyebrow: 'Technology consulting',
      headline: 'Decisions before code.',
      body: 'Digital and AI readiness assessment, product discovery, build-versus-buy analysis, architecture review and a roadmap tied to measurable priorities — so the expensive commitments are made with evidence.',
      primaryCta: 'Book a discovery conversation',
    },
    outcomeStatement:
      'A decision you can defend, with the reasoning written down and the alternatives recorded.',
    benefits:
      'The most expensive technology decisions are made earliest, with the least information, usually under time pressure. Consulting is worth paying for when it changes one of those decisions — not when it produces a document. Every engagement here ends in something you own and could act on with any supplier, including the recommendation that you should not build the thing at all.',
    problems: [
      {
        title: 'A decision with no way to compare options',
        body: 'Three vendors, three demos, no shared basis for evaluation — so the choice comes down to who presented best.',
      },
      {
        title: 'AI ambition without a starting point',
        body: 'A board expectation to "do something with AI" and no assessment of which processes are ready or worth it.',
      },
      {
        title: 'A roadmap nobody believes',
        body: 'A plan built from wishes rather than capacity, which everyone privately knows will slip.',
      },
      {
        title: 'Inherited architecture nobody can assess',
        body: 'A system you now own and cannot evaluate — is it sound, is it salvageable, what does it cost to keep?',
      },
    ],
    capabilities: [
      {
        title: 'AI readiness assessment',
        body: 'Which processes are candidates, what data exists, what governance is needed, and what is genuinely worth doing first.',
      },
      {
        title: 'Product discovery',
        body: 'Interviews, workflow mapping and technical audit, ending in a scope any competent supplier could act on.',
      },
      {
        title: 'Build-versus-buy analysis',
        body: 'A structured comparison against your requirements, including total cost of ownership rather than licence price.',
      },
      {
        title: 'Architecture review',
        body: 'An assessment of what exists, what it costs to keep, and what would have to change for it to support the next stage.',
      },
      {
        title: 'Technology due diligence',
        body: 'For acquisitions and investments — code, architecture, team, security and the risks that are not on the deck.',
      },
      {
        title: 'Roadmap and business case',
        body: 'Sequenced by dependency and value, with the assumptions made explicit so they can be challenged.',
      },
    ],
    deliverables: [
      'Assessment report with findings and evidence',
      'Prioritised opportunity map',
      'Architecture recommendation with alternatives recorded',
      'Build-versus-buy comparison against your requirements',
      'Sequenced roadmap with dependencies',
      'Business case with assumptions stated',
      'Risk register',
      'A scope another supplier could act on',
    ],
    architecture: {
      caption: 'How a decision gets made',
      summary:
        'Discovery gathers evidence from three directions: what people actually do, what the systems actually hold, and what the data can support. Options are compared against requirements agreed in advance rather than against each other, which is what stops the best presentation winning. The recommendation records its alternatives and the reasoning, so it can be revisited later on evidence rather than re-argued from memory. Everything produced is yours and could be handed to another supplier — including, sometimes, the recommendation not to build.',
      nodes: [
        {
          id: 'interviews',
          layer: 'source',
          label: 'Interviews',
          description:
            'What people actually do, which is regularly not what the process document says.',
        },
        {
          id: 'systems',
          layer: 'source',
          label: 'System audit',
          description:
            'What the systems hold, what they integrate with, and what it costs to keep them.',
        },
        {
          id: 'data',
          layer: 'source',
          label: 'Data review',
          description:
            'Whether the information a proposed system would need is structured, permissioned and current.',
        },
        {
          id: 'requirements',
          layer: 'process',
          label: 'Requirements',
          description:
            'Agreed before options are compared, which is what stops the best presentation winning.',
        },
        {
          id: 'options',
          layer: 'process',
          label: 'Options analysis',
          description:
            'Build, buy or do nothing — compared on total cost of ownership rather than on licence price.',
        },
        {
          id: 'risks',
          layer: 'process',
          label: 'Risk register',
          description: 'Including the risks of doing nothing, which are usually left out.',
        },
        {
          id: 'roadmap',
          layer: 'surface',
          label: 'Sequenced roadmap',
          description:
            'Ordered by dependency and value, with assumptions stated so they can be challenged.',
        },
        {
          id: 'case',
          layer: 'surface',
          label: 'Business case',
          description: 'Something you can take to a board, with the workings visible.',
        },
        {
          id: 'scope',
          layer: 'surface',
          label: 'Actionable scope',
          description:
            'Detailed enough that any competent supplier could quote against it — including one that is not us.',
        },
      ],
    },
    pricing: {
      drivers: [
        'Scope — one process, one system, or an estate',
        'Number of stakeholders and locations to involve',
        'Depth of technical audit required',
        'Whether the output needs to support a board or investment decision',
        'How much documentation already exists versus needs reconstructing',
      ],
      shapes: SHARED_SHAPES.slice(0, 3),
    },
    industries: ['enterprise', 'startups', 'government', 'finance'],
    faqs: [
      {
        question: 'Will you recommend your own services?',
        answer:
          'Sometimes, and you should treat that with appropriate suspicion — which is why the output is written so another supplier could act on it. We have recommended buying a product, keeping an existing system, and not building at all. A consulting engagement that always concludes "hire us to build it" is a sales process with an invoice attached.',
      },
      {
        question: 'How is this different from a free consultation?',
        answer:
          'A free consultation is a conversation — genuinely useful, and we offer one. Paid discovery is evidence: interviews, system audit, data review, and a scope that has been tested against reality. The difference is what you can act on afterwards.',
      },
      {
        question: 'What do we actually receive?',
        answer:
          'Documents you own: an assessment with its evidence, an options comparison, a sequenced roadmap, a risk register and a scope detailed enough to quote against. If you take it to another supplier, it works there too. That is deliberate.',
      },
      {
        question: 'How long does an assessment take?',
        answer:
          'It depends on scope and on how many people need to be interviewed, and we would rather scope it with you than quote a duration here. What we can commit to is that it ends with a decision you can defend rather than a document that gets filed.',
      },
    ],
  },
}

/** Services hub FAQs — docs/05 §3. */
export const servicesHubFaqs: Faq[] = [
  {
    question: 'Which service do we need?',
    answer:
      'Often the honest answer is "not the one you came for". Start from the outcome — revenue, cost, visibility, risk, a new product — and the service follows. If you are not sure, the first call is the cheapest way to find out, and we will say so if the answer is that you need less than you thought.',
  },
  {
    question: 'Can we use more than one?',
    answer:
      'Most engagements do, and that is the reason they sit under one partner. Software that needs cloud foundations, AI that needs the data pipeline first, a website that needs the CRM connected. The point of one delivery model is that these are not handoffs between suppliers.',
  },
  {
    question: 'Do we have to start big?',
    answer:
      'No, and we would usually advise against it. Most engagements start with the narrowest useful piece — a paid discovery or a fixed-scope pilot — and widen once that piece has proved itself. It is easier to justify internally and easier for us to be accountable for.',
  },
  {
    question: 'What does any of this cost?',
    answer:
      'Each service page explains what drives its cost and which engagement shapes are available. We do not publish figures, because a price quoted before scope is understood is either padded to cover the unknown or about to be revised. After discovery you get a scope with a number attached to it.',
  },
]
