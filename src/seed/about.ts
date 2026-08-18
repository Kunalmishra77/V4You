/**
 * About page content — T-065, blueprint §10.
 *
 * Three sections of this page cannot be written without the client, and each is
 * handled differently rather than filled in:
 *
 *   Story    — blueprint §10 marks every milestone `[verified year and origin]`
 *              and similar. A founding story is exactly the kind of thing that
 *              reads plausibly when invented and is embarrassing when checked,
 *              so the section renders a visibly labelled placeholder.
 *   Leadership — omitted entirely. docs/05 §2: no avatar placeholders, because
 *              an anonymous leadership section undercuts the page it sits on.
 *   Offices  — blueprint §10 says do not claim offices or global presence
 *              without evidence. The delivery section describes how we work,
 *              which is true, rather than where, which is unverified.
 */

export const aboutHero = {
  eyebrow: 'About V4You',
  headline: 'Technology should make progress easier to see.',
  body: 'V4You Technologies brings together strategy, design, engineering, AI, automation, cloud and growth to help organisations build better systems and make better decisions.',
}

export const missionVision = {
  mission:
    'Make advanced technology practical, responsible and valuable for the organisations using it.',
  vision:
    'A world where businesses can turn complexity into clarity, and ambition into systems that scale.',
  body: 'Both of those are easy to write and hard to hold to. What they mean in practice is that we would rather tell you a project is smaller than you thought, or that the tool you already own can do it, than take the larger engagement. That is a commercial cost we accept, because the alternative compounds.',
}

/** blueprint §10 — six values. */
export const values = [
  {
    title: 'Outcomes over output',
    body: 'We measure what changed, not what shipped. A release that nobody adopted is not a delivery, however complete the feature list.',
  },
  {
    title: 'Clarity over complexity',
    body: 'Good technology makes the important work easier to understand. If an explanation needs our vocabulary, the explanation is wrong.',
  },
  {
    title: 'Ownership over handoffs',
    body: 'We stay accountable across the lifecycle. The moments where projects fail are usually the moments they change hands.',
  },
  {
    title: 'Evidence over hype',
    body: 'Claims should be explainable and testable. Anything on this site that we cannot show you, we have removed.',
  },
  {
    title: 'People in the loop',
    body: 'Responsible automation respects judgement, context and control. Where a decision matters, a person makes it.',
  },
  {
    title: 'Learning over ego',
    body: 'We improve through feedback, measurement and iteration — including when the feedback is that we got it wrong.',
  },
]

/**
 * blueprint §10, "Quality and security" — describe actual practices.
 * Every item here is something a client could ask us to demonstrate.
 */
export const qualityPractices = [
  {
    title: 'Code review and version control',
    body: 'Every change is reviewed before it merges, and the history of why something changed is kept alongside the change itself. Nothing reaches production through a route that skips this.',
  },
  {
    title: 'Automated testing',
    body: 'Test suites run in CI on every change. Coverage targets are agreed per project rather than claimed universally — the useful question is which paths are covered, not what percentage is.',
  },
  {
    title: 'Environment separation',
    body: 'Development, staging and production are separate, with separate credentials. Production data is not copied into development environments; where realistic data is needed, it is generated or anonymised.',
  },
  {
    title: 'Access control and secrets',
    body: 'Access is granted per role and reviewed. Secrets are managed rather than shared, and are rotatable without redeploying everything that uses them.',
  },
  {
    title: 'Monitoring and incident response',
    body: 'Systems we operate have monitoring and alerting that routes to a person, with an agreed response expectation written down rather than assumed.',
  },
  {
    title: 'Documentation and handover',
    body: 'Architecture decisions, runbooks and operational documentation are deliverables. The test is whether your team could operate the system without us — because that is the point of writing them.',
  },
  {
    title: 'Responsible AI evaluation',
    body: 'AI features are evaluated against a test set before release and monitored after it, with a defined fallback for when the model is wrong.',
  },
]

/**
 * blueprint §10, "Global delivery" — explain how we work, not where.
 * No office claims, no headcount, no time-zone coverage we cannot evidence.
 */
export const deliveryModel = {
  heading: 'How working together actually runs.',
  body: 'Distributed delivery works when the communication is deliberate and fails when it is assumed. These are the arrangements we agree at the start of an engagement rather than discover during one.',
  points: [
    {
      title: 'Agreed overlap hours',
      body: 'A window each working day when both sides are available, set against your working hours rather than ours.',
    },
    {
      title: 'A fixed communication cadence',
      body: 'A regular written update and a scheduled call, so progress is visible without anyone having to ask for it.',
    },
    {
      title: 'Shared tooling',
      body: 'You get access to the same board, repository and environments we use. There is no internal view of the project that you cannot see.',
    },
    {
      title: 'A named escalation route',
      body: 'One person accountable for the engagement, and an agreed path when something needs to move faster than the cadence allows.',
    },
    {
      title: 'Documented decisions',
      body: 'Choices made in a call are written down afterwards. A decision that exists only in someone’s memory is a decision that will be re-argued.',
    },
    {
      title: 'English as the working language',
      body: 'Written communication, documentation and code comments in English by default, with client-facing material in whatever language your users need.',
    },
  ],
}
