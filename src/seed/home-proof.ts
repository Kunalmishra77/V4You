/**
 * The lower half of the home page — blueprint §4.7, §4.9, §4.11, §4.12, §4.15.
 *
 * Read the solution matrix note before editing it: the solution names are text,
 * not links, because /solutions is Phase 2. Every row instead offers the
 * service that actually exists, so no row is a dead end.
 */

/** blueprint §4.7 — start with the business problem, not the product. */
export const solutionMatrix = {
  eyebrow: 'By outcome',
  heading: 'Start with the business problem.',
  body: 'Most technology conversations begin with a product name. These begin with what you are trying to change, which is the only end of the conversation that can be measured.',
  rows: [
    {
      outcome: 'Grow revenue',
      solutions: 'AI CRM, lead qualification, sales automation, ecommerce, marketing automation',
      startWith: { label: 'Digital marketing', href: '/services/digital-marketing' },
    },
    {
      outcome: 'Reduce operational effort',
      solutions: 'Workflow automation, internal portals, ERP, HRMS, document intelligence',
      startWith: { label: 'AI & automation', href: '/services/ai-automation' },
    },
    {
      outcome: 'Improve customer experience',
      solutions: 'Chatbots, voice agents, support systems, mobile apps, personalisation',
      startWith: { label: 'Mobile app development', href: '/services/mobile-app-development' },
    },
    {
      outcome: 'Increase visibility',
      solutions: 'AI dashboards, data platforms, BI, forecasting, executive reporting',
      startWith: { label: 'AI & automation', href: '/services/ai-automation' },
    },
    {
      outcome: 'Modernise core systems',
      solutions: 'Custom software, cloud migration, API integration, legacy modernisation',
      startWith: { label: 'Cloud & DevOps', href: '/services/cloud-devops' },
    },
    {
      outcome: 'Launch a new digital business',
      solutions: 'SaaS product development, websites, mobile apps, product strategy',
      startWith: { label: 'Technology consulting', href: '/services/consulting' },
    },
  ],
}

/** blueprint §4.9 — the delivery model. A real sequence, so it is numbered. */
export const processTimeline = {
  eyebrow: 'How we deliver',
  heading: 'The V4You delivery model.',
  body: 'Six stages. Each one ends with something you can look at and disagree with, which is the point — the expensive misunderstandings are the ones that survive to launch.',
  cta: { label: 'See how we work', href: '/services' },
  steps: [
    {
      title: 'Align',
      body: 'Goals, users, workflows, constraints and the measures that will say whether this worked.',
    },
    {
      title: 'Architect',
      body: 'Product, AI, data, integration, security and cloud design — with the trade-offs written down, not just the choices.',
    },
    {
      title: 'Build',
      body: 'Iterative engineering with visible milestones. You see working software early and often, not a status report.',
    },
    {
      title: 'Validate',
      body: 'QA, usability, performance, security and stakeholder acceptance, against the measures agreed at Align.',
    },
    {
      title: 'Launch',
      body: 'Release planning, training, documentation and handover. Adoption is part of the delivery, not a follow-on project.',
    },
    {
      title: 'Improve',
      body: 'Analytics, support, optimisation and roadmap. What actually happened feeds the next decision.',
    },
  ],
}

/**
 * blueprint §4.11 — the technology ecosystem.
 *
 * Rendered as wordmarks rather than logo images: no logo files have been
 * supplied, and a third-party logo is a trademark that needs its owner's usage
 * terms honoured, not an asset to approximate. Names carry the same
 * information and make no implied claim.
 *
 * The label is fixed at "Technologies we work with" — never "Our partners" —
 * until a partnership document exists in assets/. docs/04 §14 and docs/08 §7.
 */
export const technologyEcosystem = {
  eyebrow: 'Ecosystem',
  heading: 'The right technology for the job.',
  body: 'A technology logo is not a certification and not a partnership. These are the tools we work with, chosen per project against the requirement rather than the trend.',
  label: 'Technologies we work with',
  groups: [
    { name: 'AI and models', items: ['OpenAI', 'Claude', 'Gemini', 'Open-source models'] },
    { name: 'Cloud', items: ['AWS', 'Azure', 'Google Cloud'] },
    {
      name: 'Application',
      items: ['React', 'Next.js', 'Node.js', 'Python', 'Flutter', 'React Native'],
    },
    {
      name: 'Data and retrieval',
      items: ['PostgreSQL', 'Vector databases', 'RAG', 'Data pipelines'],
    },
    { name: 'Orchestration', items: ['LangChain', 'MCP', 'Workflow platforms', 'Event systems'] },
  ],
}

/** blueprint §4.12 — trust and governance. Seven panels. */
export const trustPanels = {
  eyebrow: 'Governance',
  heading: 'Built to earn confidence.',
  body: 'Every item below describes something we do, not something we are certified in. Where a certification would be the honest proof, we say so rather than implying it.',
  cta: { label: 'Discuss your security requirements', href: '/contact' },
  panels: [
    {
      title: 'Security by design',
      body: 'Environments are separated, secrets are managed rather than shared, and access is granted per role. Security decisions are made during architecture, where they are cheap, instead of during hardening, where they are not.',
    },
    {
      title: 'Human oversight for consequential workflows',
      body: 'Anything that spends money, makes a commitment or affects a person’s care, credit or case goes to a human before it takes effect. Automation handles the ordinary path and hands over the rest with its context attached.',
    },
    {
      title: 'Role-based access and auditability',
      body: 'Who can see what is a design decision, and every consequential action leaves a record of what happened, when, and on whose authority. An audit trail assembled after the fact is not an audit trail.',
    },
    {
      title: 'Data minimisation and retention',
      body: 'We ask which data a workflow genuinely needs and how long it needs it. Collecting less is the only data protection measure that cannot fail.',
    },
    {
      title: 'Testing and observability',
      body: 'Automated tests, monitoring and alerting ship with the system rather than after it. A system nobody can see inside is a system nobody can operate.',
    },
    {
      title: 'Documentation and ownership',
      body: 'Architecture decisions, runbooks and handover notes are deliverables. You own the code, the infrastructure and the data, with the scope and the exclusions written down.',
    },
    {
      title: 'Responsible AI evaluation',
      body: 'AI features are evaluated against a test set before release and monitored after it, with fallbacks for when the model is wrong. We do not confuse a convincing demo with a production system.',
    },
  ],
}

/** blueprint §4.15, capped at eight for the home page — docs/05 §1 block 14. */
export const homeFaqs = [
  {
    question: 'What does V4You Technologies do?',
    answer:
      'We help organisations turn business problems into working systems — combining consulting, product design, engineering, AI, automation, cloud and growth under one accountable partner. In practice that usually starts with identifying where technology would create the most value, then building and operating it.',
  },
  {
    question: 'Do you work with startups as well as enterprises?',
    answer:
      'Yes, though the work differs. A startup usually needs to find out whether the idea holds before committing to an architecture. An enterprise usually needs to modernise without pausing the business. Both are sequencing problems more than technology problems.',
  },
  {
    question: 'Can you work with our existing technology team?',
    answer:
      'Often that is the better arrangement. We can take a discrete workstream, provide architecture and review, or embed alongside your engineers. What matters is that ownership is explicit — ambiguity about who decides is what slows joint teams down.',
  },
  {
    question: 'Can you modernise a legacy system?',
    answer:
      'Yes. The usual approach is to replace one capability at a time behind a stable interface rather than attempt a single cutover, so the business keeps running and each step can be proven before the next begins.',
  },
  {
    question: 'How do you identify good AI use cases?',
    answer:
      'We look for work that is repetitive, high-volume, bounded, and measurable today. If a process has no current measure, the first task is usually to instrument it — otherwise there is no way to tell afterwards whether the AI helped.',
  },
  {
    question: 'How do you handle data security?',
    answer:
      'Separated environments, managed secrets, role-based access, audit logging, encryption in transit and at rest, and data minimisation by default. We describe practices rather than claim certifications — see the security page for the detail.',
  },
  {
    question: 'How do engagements start?',
    answer:
      'With a 30-minute conversation, then usually a paid discovery. Discovery produces an architecture, a scope and a plan you own outright and could hand to another supplier if you chose to.',
  },
  {
    question: 'How do you estimate scope and cost?',
    answer:
      'From workflow complexity, integrations, data readiness, model usage, security requirements and support needs. We do not publish "starting at" figures, because a price quoted before scope is understood is either padded or about to be revised.',
  },
]
