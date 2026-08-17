/**
 * Home page copy — blueprint §4, sequenced per docs/05 §1.
 *
 * Every line here is either verbatim from the approved blueprint or a direct
 * rewrite of it. Nothing asserts a result, a client, a metric or a timeline.
 * Where the blueprint offers a claim that would need evidence, the capability
 * statement is used instead — see §4.2, which says exactly that.
 */

export const homeHero = {
  eyebrow: 'AI-first digital transformation',
  // docs/05 §1 block 1 puts *slows you down* in amber — those three words only.
  // Accenting the whole second sentence turns the accent into the body colour
  // and leaves the amber core with nothing to be the exception to.
  headline: { lead: 'Build what’s next. Automate what', accent: 'slows you down.' },
  body: 'V4You Technologies helps startups, SMEs and enterprises turn complex business challenges into intelligent products, connected workflows and measurable growth.',
  trustLine:
    'Strategy, design, engineering, AI, cloud and growth — connected under one accountable partner.',
  primaryCta: { label: 'Book a transformation consultation', href: '/book-consultation' },
  secondaryCta: { label: 'Explore what we do', href: '/services' },
}

/**
 * The four cells of `CapabilityStrip` — docs/04 §12.
 *
 * This is the honest substitute for a metric strip while no verified numbers
 * exist. It ships in Phase 1 regardless of whether client logos arrive, because
 * the section's job still needs doing.
 */
export const capabilityStrip = {
  heading: 'Built for ambition. Designed for the real world.',
  body: 'Built with modern AI, cloud, data and product engineering practices.',
  cells: [
    {
      label: 'Model',
      title: 'One accountable partner',
      body: 'Consulting, product, engineering, AI, cloud and growth in one delivery model — fewer handoffs, clearer ownership.',
    },
    {
      label: 'Method',
      title: 'Outcome before stack',
      body: 'We identify the business outcome and the current friction before recommending a technology.',
    },
    {
      label: 'Standard',
      title: 'Built to be operated',
      body: 'Testing, observability, documentation and handover are part of the build, not a phase after it.',
    },
    {
      label: 'Ownership',
      title: 'You own what we build',
      body: 'Code, infrastructure, data and documentation are yours, with the scope and exclusions written down.',
    },
  ],
}

/** blueprint §4.3 */
export const problemSection = {
  eyebrow: 'The problem',
  heading: 'Growth gets harder when your systems do not work together.',
  body: 'Leads live in one tool. Operations run on spreadsheets. Customer questions arrive after hours. Reports arrive too late. Teams spend their best energy moving information between systems.',
  cta: { label: 'Find your highest-value opportunity', href: '/contact' },
  cards: [
    {
      title: 'Disconnected systems',
      body: 'Important data is trapped across tools, so nobody sees the whole picture without rebuilding it by hand.',
    },
    {
      title: 'Manual operations',
      body: 'Repetitive work absorbs expensive human time that could go to judgement, relationships and design.',
    },
    {
      title: 'Slow decisions',
      body: 'Leaders lack current, trustworthy visibility, so decisions wait for a report or get made on instinct.',
    },
    {
      title: 'Products that do not scale',
      body: 'Early decisions become later constraints, and every new requirement costs more than the last.',
    },
  ],
}

/** blueprint §4.4 */
export const pillarSection = {
  eyebrow: 'How we work',
  heading: 'One partner from opportunity to operating impact.',
  body: 'V4You brings consulting, product thinking, engineering, AI, automation, cloud and growth into one connected delivery model. That means fewer handoffs, clearer accountability, and a system designed around the outcome — not the tool.',
  pillars: [
    {
      title: 'Discover the opportunity',
      body: 'Understand the business model, operating reality, users, data, systems, constraints and measurable goals.',
    },
    {
      title: 'Design the experience',
      body: 'Create the product, service, workflow and architecture required to solve the real problem.',
    },
    {
      title: 'Engineer the system',
      body: 'Build reliable software, AI systems, integrations, cloud infrastructure and data foundations.',
    },
    {
      title: 'Scale the outcome',
      body: 'Optimise adoption, automation, performance, security and operating outcomes after launch.',
    },
  ],
}

/** blueprint §4.6 — the AI capability showcase. */
export const capabilityShowcase = {
  eyebrow: 'AI in practice',
  heading: 'AI that works inside the business.',
  body: 'AI becomes valuable when it understands your data, follows your rules, connects to your systems, and supports measurable work.',
  // Phase 4 gates the assessment, so this points at /contact meanwhile —
  // docs/05 §1, block 6.
  cta: { label: 'Assess your AI readiness', href: '/contact' },
  tabs: [
    {
      id: 'agents',
      label: 'Agents',
      title: 'Plan and execute bounded tasks, with human controls.',
      body: 'An agent is given a narrow job, the tools to do it, and a boundary it cannot cross. It proposes, a person approves what matters, and every step is logged.',
      flow: [
        { stage: 'Trigger', label: 'A new enquiry arrives from any channel' },
        { stage: 'RAG', label: 'Retrieve the account, history and current policy' },
        { stage: 'Gate', label: 'Human approval on anything priced or contractual' },
        { stage: 'Execute', label: 'Update the CRM, schedule follow-up, notify the owner' },
      ],
    },
    {
      id: 'voice',
      label: 'Voice',
      title: 'Answer, qualify, schedule, route and summarise conversations.',
      body: 'Voice systems handle the calls that currently go to voicemail — after hours, at peak, or on the lines nobody has time to staff. Escalation to a person stays one step away.',
      flow: [
        { stage: 'Trigger', label: 'Inbound call outside staffed hours' },
        { stage: 'RAG', label: 'Look up the caller and their open items' },
        { stage: 'Gate', label: 'Escalate anything clinical, legal or contested' },
        { stage: 'Execute', label: 'Book the slot and send a written summary' },
      ],
    },
    {
      id: 'knowledge',
      label: 'Knowledge',
      title: 'Retrieve grounded answers from approved information.',
      body: 'Retrieval-augmented generation answers from your documents rather than from the model’s memory, and cites what it used, so an answer can be checked rather than trusted.',
      flow: [
        { stage: 'Trigger', label: 'A question from a customer or a colleague' },
        { stage: 'RAG', label: 'Search only sources that person is permitted to see' },
        { stage: 'Gate', label: 'No confident answer means no answer, and a handoff' },
        { stage: 'Execute', label: 'Reply with citations back to the source' },
      ],
    },
    {
      id: 'automation',
      label: 'Automation',
      title: 'Orchestrate approvals, data movement, notifications and exceptions.',
      body: 'Most operational cost sits in the handoffs between tools. Automation makes the path explicit, handles the ordinary case, and routes the exception to a person with the context attached.',
      flow: [
        { stage: 'Trigger', label: 'A document, form or system event' },
        { stage: 'RAG', label: 'Extract the fields and match them to a record' },
        { stage: 'Gate', label: 'Route low-confidence extractions for review' },
        { stage: 'Execute', label: 'Post to the system of record and notify' },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      title: 'Identify patterns, forecast, summarise and alert.',
      body: 'Reporting that arrives after the decision is documentation, not intelligence. The useful version watches continuously and tells someone when something has changed.',
      flow: [
        { stage: 'Trigger', label: 'Scheduled run, or a threshold crossed' },
        { stage: 'RAG', label: 'Join operational, financial and customer data' },
        { stage: 'Gate', label: 'Assumptions and method shown with every figure' },
        { stage: 'Execute', label: 'Alert the owner with the change and its likely cause' },
      ],
    },
    {
      id: 'product-intelligence',
      label: 'Product intelligence',
      title: 'Embed AI into the software customers and teams already use.',
      body: 'The strongest AI features are invisible: a better default, a drafted reply, a ranked list. They belong inside the product rather than beside it in a chat window.',
      flow: [
        { stage: 'Trigger', label: 'A user reaches a decision point in the product' },
        { stage: 'RAG', label: 'Use their own history and permitted context' },
        { stage: 'Gate', label: 'Always editable, never auto-applied silently' },
        { stage: 'Execute', label: 'Suggest, then learn from what they chose' },
      ],
    },
  ],
}
