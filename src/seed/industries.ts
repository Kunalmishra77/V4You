import type { IndustrySlug } from '@/lib/routes'

/**
 * Tab-level industry copy — blueprint §6, home §4.8.
 *
 * `context` is how the sector actually operates; `challenges` are the frictions
 * we see repeatedly; `whereWeStart` is the four-step reference flow docs/04 §21
 * puts on the right of each tab panel.
 *
 * docs/05 sets a uniqueness bar for the full industry pages — original context,
 * four distinct challenges, four use cases and four unique FAQs each, enforced
 * by a Payload hook. This file is the summary layer, and it is written to the
 * same standard: no two entries here are a find-and-replace of another.
 *
 * Nothing states an ROI figure. blueprint §6 is explicit that exact percentages
 * need a case study behind them, and there is none yet.
 */

export type IndustryTab = {
  slug: IndustrySlug
  label: string
  context: string
  challenges: string[]
  whereWeStart: { step: string; label: string; tag: string }[]
}

export const industryTabs: IndustryTab[] = [
  {
    slug: 'healthcare',
    label: 'Healthcare',
    context:
      'Care runs on coordination. Most of the delay patients feel is administrative — registration, records, billing and follow-up — not clinical. Automation belongs firmly on that side of the line, with clinical decision support treated as a separate question under separate governance.',
    challenges: [
      'Appointment no-shows and unfilled slots',
      'Manual records and duplicate data entry',
      'Billing and revenue-cycle complexity',
      'Patient communication after hours',
    ],
    whereWeStart: [
      { step: '01', label: 'Map the patient journey end to end', tag: 'Discover' },
      { step: '02', label: 'Automate registration and reminders', tag: 'Administrative' },
      { step: '03', label: 'Add access control and audit logging', tag: 'Governance' },
      { step: '04', label: 'Report on cycle time and no-shows', tag: 'Measure' },
    ],
  },
  {
    slug: 'manufacturing',
    label: 'Manufacturing',
    context:
      'The plant usually knows what happened. The problem is that it knows late, and in a format nobody outside the floor can act on. Visibility across production, maintenance, quality and inventory is worth more than any single automation.',
    challenges: [
      'Production visibility across shifts and sites',
      'Unplanned downtime and reactive maintenance',
      'Quality inspection that depends on one expert',
      'Procurement and vendor coordination by email',
    ],
    whereWeStart: [
      { step: '01', label: 'Instrument one line and one shift', tag: 'Discover' },
      { step: '02', label: 'Surface downtime and yield live', tag: 'Visibility' },
      { step: '03', label: 'Forecast demand and maintenance windows', tag: 'Predict' },
      { step: '04', label: 'Extend to the remaining lines', tag: 'Scale' },
    ],
  },
  {
    slug: 'education',
    label: 'Education',
    context:
      'Admissions is a response-time business, and student outcomes are a communication business. Both fail quietly — an enquiry unanswered for two days and a parent who stopped reading updates look identical in the system until the term ends.',
    challenges: [
      'Admissions enquiries answered too slowly',
      'Fee collection and reminder chasing',
      'Parent communication across languages',
      'Faculty time lost to administration',
    ],
    whereWeStart: [
      { step: '01', label: 'Measure enquiry-to-response time', tag: 'Discover' },
      { step: '02', label: 'Automate admissions triage and replies', tag: 'Respond' },
      { step: '03', label: 'Add multilingual parent messaging', tag: 'Engage' },
      { step: '04', label: 'Report on cohort engagement', tag: 'Measure' },
    ],
  },
  {
    slug: 'real-estate',
    label: 'Real estate',
    context:
      'Lead value decays in minutes, not days. Most of the loss happens between the portal enquiry and the first human conversation, in a gap no CRM report shows because the record was never created.',
    challenges: [
      'Slow first response to portal enquiries',
      'Qualification quality varying by agent',
      'Site-visit scheduling and no-shows',
      'Document workflows after the sale',
    ],
    whereWeStart: [
      { step: '01', label: 'Instrument first-response time by source', tag: 'Discover' },
      { step: '02', label: 'Qualify and route on arrival', tag: 'Respond' },
      { step: '03', label: 'Automate follow-up on the channel they used', tag: 'Nurture' },
      { step: '04', label: 'Track enquiry to site visit to close', tag: 'Measure' },
    ],
  },
  {
    slug: 'retail',
    label: 'Retail and ecommerce',
    context:
      'Acquisition cost keeps rising and support volume scales with orders, so margin gets squeezed from both ends. The work is usually in the middle: fewer avoidable contacts, better inventory decisions, and a returns process that does not cost more than the item.',
    challenges: [
      'Support volume growing faster than the team',
      'Abandoned carts and weak win-back',
      'Inventory and demand forecasting',
      'Returns triage and its true cost',
    ],
    whereWeStart: [
      { step: '01', label: 'Classify contact reasons for one month', tag: 'Discover' },
      { step: '02', label: 'Deflect the top three with self-service', tag: 'Automate' },
      { step: '03', label: 'Forecast demand on the moving lines', tag: 'Predict' },
      { step: '04', label: 'Report contacts per order and margin', tag: 'Measure' },
    ],
  },
  {
    slug: 'finance',
    label: 'Finance',
    context:
      'Regulated decisions stay with people. What can move is everything around them — onboarding, document verification, reconciliation and the reporting that currently consumes analyst time. Every automated step needs to be explainable after the fact.',
    challenges: [
      'Onboarding and document verification effort',
      'Reconciliation across systems',
      'Compliance workflows and evidence trails',
      'Reporting assembled by hand',
    ],
    whereWeStart: [
      { step: '01', label: 'Map one process and its evidence needs', tag: 'Discover' },
      { step: '02', label: 'Extract and validate documents', tag: 'Automate' },
      { step: '03', label: 'Human approval on every regulated decision', tag: 'Control' },
      { step: '04', label: 'Log every step for audit', tag: 'Assure' },
    ],
  },
  {
    slug: 'logistics',
    label: 'Logistics',
    context:
      'Customers do not call to ask where a shipment is because they are curious — they call because the system did not tell them. Most support load in logistics is a visibility problem wearing a customer-service costume.',
    challenges: [
      'Shipment status enquiries absorbing the team',
      'Dispatch and route planning by experience',
      'Proof-of-delivery captured on paper',
      'Invoice reconciliation and disputes',
    ],
    whereWeStart: [
      { step: '01', label: 'Trace one lane end to end', tag: 'Discover' },
      { step: '02', label: 'Push status before the customer asks', tag: 'Communicate' },
      { step: '03', label: 'Flag exceptions to a person early', tag: 'Exceptions' },
      { step: '04', label: 'Report cost per shipment and on-time rate', tag: 'Measure' },
    ],
  },
  {
    slug: 'hospitality',
    label: 'Hospitality',
    context:
      'Every booking through an aggregator is margin handed away, and every unanswered enquiry is a booking handed away. The lever is responsiveness on the direct channel, in the guest’s language, at the hour they actually ask.',
    challenges: [
      'Direct bookings losing to aggregators',
      'Guest enquiries outside staffed hours',
      'Review response falling behind',
      'Upsell opportunities missed at check-in',
    ],
    whereWeStart: [
      { step: '01', label: 'Compare direct and channel economics', tag: 'Discover' },
      { step: '02', label: 'Answer enquiries instantly, in language', tag: 'Respond' },
      { step: '03', label: 'Personalise pre-arrival and upsell', tag: 'Convert' },
      { step: '04', label: 'Report direct share and guest sentiment', tag: 'Measure' },
    ],
  },
  {
    slug: 'government',
    label: 'Government',
    context:
      'Citizen services are judged on access, not on architecture. Accessibility, language coverage, auditability and data residency are requirements rather than preferences, and a human escalation route is part of the service, not a fallback.',
    challenges: [
      'Citizen access across languages and abilities',
      'Case management and service-request routing',
      'Document processing volume',
      'Legacy systems that cannot be replaced at once',
    ],
    whereWeStart: [
      { step: '01', label: 'Audit access and language coverage', tag: 'Discover' },
      { step: '02', label: 'Route requests to the right desk', tag: 'Route' },
      { step: '03', label: 'Keep a human escalation path visible', tag: 'Escalate' },
      { step: '04', label: 'Publish service performance', tag: 'Transparency' },
    ],
  },
  {
    slug: 'startups',
    label: 'Startups',
    context:
      'The expensive mistake is rarely building badly. It is building the wrong thing well, then discovering the architecture assumed a model that did not survive contact with customers.',
    challenges: [
      'Validating before committing the budget',
      'An MVP that survives its own success',
      'Founder time consumed by operations',
      'Architecture decisions made too early',
    ],
    whereWeStart: [
      { step: '01', label: 'Product discovery against real users', tag: 'Discover' },
      { step: '02', label: 'Ship the smallest testable slice', tag: 'Validate' },
      { step: '03', label: 'Instrument what proves the model', tag: 'Measure' },
      { step: '04', label: 'Harden only what traction justifies', tag: 'Scale' },
    ],
  },
  {
    slug: 'enterprise',
    label: 'Enterprise',
    context:
      'Modernisation fails on sequencing more often than on technology. The constraint is doing it without a freeze on the business, which means integration and governance are the first design problems rather than the last.',
    challenges: [
      'Legacy systems the business cannot pause',
      'Integration across acquired estates',
      'Data spread across incompatible sources',
      'Governance and change control at scale',
    ],
    whereWeStart: [
      { step: '01', label: 'Map dependencies and the real critical path', tag: 'Discover' },
      { step: '02', label: 'Strangle one capability at a time', tag: 'Sequence' },
      { step: '03', label: 'Integrate rather than replace, where sound', tag: 'Integrate' },
      { step: '04', label: 'Prove each step before the next', tag: 'Assure' },
    ],
  },
]
