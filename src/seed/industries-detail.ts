import type { DiagramNode } from '@/components/blocks/ArchitectureDiagram'
import type { IndustrySlug, ServiceSlug } from '@/lib/routes'
import type { Faq } from '@/lib/seo'

/**
 * Full industry page content — T-064, docs/05 §12–22.
 *
 * docs/05 sets a uniqueness bar for these eleven pages and enforces it as a
 * Payload `beforeValidate` hook: an original `context`, at least four distinct
 * challenges, four use cases and four unique FAQs before a page can publish.
 * It exists because eleven near-identical industry pages is the specific
 * failure the blueprint forbids, and it is an easy failure to fall into.
 *
 * The `context` and `challenges` for each industry live in `industries.ts`,
 * which the home page tabs also read. This file adds what the full page needs.
 *
 * Two constraints on every word here:
 *
 * **No ROI figures.** blueprint §6 is explicit — exact percentages need a case
 * study behind them, and there is none. Use cases state a *value area*: the
 * thing that would improve, not a number claiming by how much.
 *
 * **No compliance claims.** `regulatoryNotes` describes what a regulation
 * requires and how a system can be built to support it. It never says V4You is
 * compliant, certified, or aligned — docs/08 §7 requires evidence for that, and
 * the evidence does not exist.
 */

export type IndustryDetail = {
  metaTitle: string
  metaDescription: string
  hero: { eyebrow: string; headline: string; body: string }
  useCases: { title: string; body: string; valueArea: string }[]
  /** Factual description only. Never a compliance or certification claim. */
  regulatoryNotes: string
  services: ServiceSlug[]
  architecture: { caption: string; summary: string; nodes: DiagramNode[] }
  faqs: Faq[]
}

export const industryDetails: Record<IndustrySlug, IndustryDetail> = {
  healthcare: {
    metaTitle: 'Healthcare technology solutions — V4You',
    metaDescription:
      'Administrative automation, patient communication and operational visibility for healthcare teams — with clinical judgement left firmly with clinicians.',
    hero: {
      eyebrow: 'Healthcare',
      headline: 'Connected systems that give teams more time for care.',
      body: 'Most of the delay a patient feels is administrative, not clinical. That is where automation belongs — and where the line between the two has to be drawn deliberately rather than discovered later.',
    },
    useCases: [
      {
        title: 'Voice appointment agent',
        body: 'Answers the calls that currently reach voicemail — after hours, at peak, on the lines nobody has time to staff. Books, reschedules, and sends written confirmation.',
        valueArea: 'Fewer unfilled slots and fewer abandoned calls',
      },
      {
        title: 'Registration and records automation',
        body: 'Extracts structured data from referral letters, insurance forms and identity documents, routing anything low-confidence to a person rather than guessing.',
        valueArea: 'Shorter registration time and less duplicate entry',
      },
      {
        title: 'Patient follow-up and reminders',
        body: 'Multi-channel reminders timed against the appointment and the patient’s history, with the reply routed back into the same record.',
        valueArea: 'Fewer no-shows and better continuity of care',
      },
      {
        title: 'Operational dashboards',
        body: 'Wait times, throughput, cancellations and administrative cycle time, current rather than reported monthly.',
        valueArea: 'Decisions made on this week rather than last month',
      },
    ],
    regulatoryNotes:
      'Healthcare data carries obligations that shape architecture rather than sit on top of it: access restricted by role, an audit trail for every read and write, retention limits, and a clear boundary between administrative automation and anything that could be read as clinical decision support. We build systems that support these requirements and document how — but we make no compliance or certification claim, and any statement about HIPAA, DPDP or equivalent alignment needs your legal and clinical governance behind it rather than ours.',
    services: ['ai-automation', 'software-development', 'cloud-devops', 'mobile-app-development'],
    architecture: {
      caption: 'Where the administrative boundary sits',
      summary:
        'Patient contact arrives by phone, web and messaging, and lands in one record rather than three inboxes. Automation handles scheduling, reminders, document extraction and billing preparation. Anything that touches clinical judgement stops — it is routed to a clinician with the context attached rather than drafted for them. Access is granted by role and every read and write is logged, because in healthcare the audit trail is part of the system rather than a report generated from it.',
      nodes: [
        {
          id: 'calls',
          layer: 'source',
          label: 'Calls and messages',
          description:
            'Answered including out of hours, summarised in writing, attached to the patient record.',
        },
        {
          id: 'forms',
          layer: 'source',
          label: 'Referrals and forms',
          description:
            'Extracted into structured fields, with low-confidence extractions routed for human review.',
        },
        {
          id: 'records',
          layer: 'source',
          label: 'Existing systems',
          description:
            'The EMR, PAS or practice system stays the system of record. We integrate rather than replace.',
        },
        {
          id: 'schedule',
          layer: 'process',
          label: 'Scheduling',
          description:
            'Books, reschedules and fills cancellations against real availability rules.',
        },
        {
          id: 'boundary',
          layer: 'process',
          label: 'Clinical boundary',
          description:
            'Anything touching clinical judgement stops here and goes to a clinician with context attached. Drawn deliberately, not discovered later.',
        },
        {
          id: 'audit',
          layer: 'process',
          label: 'Access and audit',
          description:
            'Role-based access, and every read and write logged. In healthcare the audit trail is part of the system.',
        },
        {
          id: 'patient',
          layer: 'surface',
          label: 'The patient',
          description: 'Confirmations, reminders and answers on the channel they used.',
        },
        {
          id: 'clinician',
          layer: 'surface',
          label: 'Clinical team',
          description: 'Fewer interruptions for administrative questions the system can answer.',
        },
        {
          id: 'ops',
          layer: 'surface',
          label: 'Operations',
          description: 'Wait times, throughput and cycle time, current rather than monthly.',
        },
      ],
    },
    faqs: [
      {
        question: 'Will AI be making clinical decisions?',
        answer:
          'No, and the boundary is a design decision made at the start rather than a policy written afterwards. Automation handles scheduling, records, reminders, billing preparation and operational reporting. Anything that could be read as clinical judgement routes to a clinician with the context attached. Where that line sits is agreed with your clinical governance, not by us.',
      },
      {
        question: 'How is patient data protected?',
        answer:
          'Access granted by role and reviewed, encryption in transit and at rest, audit logging on every read and write, retention limits set deliberately, and data minimisation — the system is given only the fields it needs. Where data residency is required, that shapes the hosting decision from the start.',
      },
      {
        question: 'Do we have to replace our existing system?',
        answer:
          'Usually not, and usually you should not. The EMR or practice management system stays the system of record; we integrate around it. Replacing a working clinical system to improve administrative workflow is a large risk taken for a small reason.',
      },
      {
        question: 'What if the voice agent gets something wrong?',
        answer:
          'It is scoped to bookings and general information, with escalation to a person one step away and no ability to give clinical advice. Every call is transcribed and attached to the record, so a mistake is visible and correctable rather than invisible. If confidence is low it hands over rather than guessing.',
      },
    ],
  },

  manufacturing: {
    metaTitle: 'Manufacturing technology solutions — V4You',
    metaDescription:
      'Production visibility, predictive maintenance, quality inspection and inventory systems — instrumented on one line first, then extended.',
    hero: {
      eyebrow: 'Manufacturing',
      headline: 'The plant knows what happened. The problem is knowing it in time.',
      body: 'Visibility across production, maintenance, quality and inventory is worth more than any single automation — because until you can see the pattern, you are optimising the part you happen to be looking at.',
    },
    useCases: [
      {
        title: 'Live production visibility',
        body: 'Output, downtime and yield per line and per shift, visible while the shift is running rather than in a report the following week.',
        valueArea: 'Problems caught during the shift they occur in',
      },
      {
        title: 'Predictive maintenance',
        body: 'Sensor and maintenance history used to flag machines drifting toward failure, so intervention is scheduled rather than reactive.',
        valueArea: 'Less unplanned downtime, better-planned maintenance windows',
      },
      {
        title: 'Visual quality inspection',
        body: 'Image-based defect detection on the line, catching the classes of defect a tired inspector at the end of a shift misses.',
        valueArea: 'More consistent inspection and earlier defect detection',
      },
      {
        title: 'Procurement and inventory intelligence',
        body: 'Demand signals joined to stock positions and lead times, so reorder points reflect what is actually happening.',
        valueArea: 'Less stockout and less capital sitting in inventory',
      },
    ],
    regulatoryNotes:
      'Manufacturing carries traceability obligations that vary by sector — batch and lot tracking, material certificates, safety incident records, and in regulated products a documented change-control process. These shape what a system must record and how long it must keep it. We build to the requirements you specify and document how they are met; the determination of which regime applies to your products is yours.',
    services: ['software-development', 'ai-automation', 'cloud-devops', 'consulting'],
    architecture: {
      caption: 'Instrument one line before instrumenting the plant',
      summary:
        'Machine signals, operator input and the existing ERP feed a single view of what is happening now. Downtime and yield are visible during the shift rather than in a weekly report. Maintenance and demand models run on the same data, so a prediction can be traced back to the readings behind it. The pattern is deliberate: instrument one line, prove the numbers against what the shift supervisor already knows, then extend — because a plant-wide rollout that nobody trusts is worse than no rollout.',
      nodes: [
        {
          id: 'machines',
          layer: 'source',
          label: 'Machine signals',
          description:
            'From PLCs, sensors or existing SCADA. Read-only where safety systems are involved.',
        },
        {
          id: 'operators',
          layer: 'source',
          label: 'Operator input',
          description:
            'Reason codes and observations, captured on a device that works with gloves on.',
        },
        {
          id: 'erp',
          layer: 'source',
          label: 'ERP and orders',
          description: 'What was meant to be produced, against which actual output is compared.',
        },
        {
          id: 'normalise',
          layer: 'process',
          label: 'Normalisation',
          description:
            'Different machines report differently. This is most of the work and none of the glamour.',
        },
        {
          id: 'models',
          layer: 'process',
          label: 'Maintenance and demand models',
          description: 'Traceable to the readings behind them, so a prediction can be questioned.',
        },
        {
          id: 'quality',
          layer: 'process',
          label: 'Inspection',
          description: 'Image-based defect detection, with uncertain cases routed to a person.',
        },
        {
          id: 'floor',
          layer: 'surface',
          label: 'Shop floor display',
          description:
            'Readable at a distance, showing the current shift rather than a historical average.',
        },
        {
          id: 'planning',
          layer: 'surface',
          label: 'Planning',
          description:
            'Reorder points and maintenance windows based on what is actually happening.',
        },
        {
          id: 'exec',
          layer: 'surface',
          label: 'Management view',
          description: 'Yield, downtime and cost per unit across lines and sites.',
        },
      ],
    },
    faqs: [
      {
        question: 'Do we need to replace our machines?',
        answer:
          'Rarely. Most machines already emit more data than anyone reads, and where they do not, retrofit sensors are usually cheaper than replacement by an order of magnitude. Where a machine is genuinely silent, operator input on a rugged device fills the gap and still beats a clipboard.',
      },
      {
        question: 'Will this touch our safety systems?',
        answer:
          'No. Safety instrumented systems are read-only from our side, and any integration is designed so that a failure in our system cannot affect them. That separation is architectural, not a configuration setting someone could change.',
      },
      {
        question: 'What if the plant loses connectivity?',
        answer:
          'Floor systems buffer locally and sync when the connection returns, so the line does not stop because a network switch did. Anything that must not depend on connectivity is identified during discovery and designed accordingly.',
      },
      {
        question: 'How do we know the numbers are right?',
        answer:
          'You check them against what your shift supervisor already knows. We instrument one line first for exactly this reason — the first output is not a dashboard, it is a comparison between what the system says and what the people on the floor say. Where they disagree, the system is wrong until proven otherwise.',
      },
    ],
  },

  education: {
    metaTitle: 'Education technology solutions — V4You',
    metaDescription:
      'Admissions response, fee collection, parent communication and learning platforms — built around how institutions actually operate.',
    hero: {
      eyebrow: 'Education',
      headline: 'Admissions is a response-time business.',
      body: 'An enquiry unanswered for two days and a parent who stopped reading updates look identical in the system — until the term ends and the numbers explain themselves.',
    },
    useCases: [
      {
        title: 'Admissions assistant',
        body: 'Answers enquiries in the parent’s language, at the hour they ask, and routes anything requiring judgement to the admissions team with the conversation attached.',
        valueArea: 'Faster first response and fewer enquiries lost to delay',
      },
      {
        title: 'Fee reminders and reconciliation',
        body: 'Reminders timed against the fee schedule, with payments reconciled automatically and exceptions surfaced rather than chased.',
        valueArea: 'Less manual chasing and clearer collection visibility',
      },
      {
        title: 'Multilingual parent communication',
        body: 'Announcements, attendance and progress updates in the language the family reads, on the channel they use.',
        valueArea: 'Higher engagement and fewer repeat calls to the office',
      },
      {
        title: 'Student engagement signals',
        body: 'Attendance, submission and participation patterns surfaced to faculty early, with the judgement about what to do left to them.',
        valueArea: 'Earlier intervention, decided by a teacher',
      },
    ],
    regulatoryNotes:
      'Education systems hold data about minors, which raises the bar on consent, retention and who may access what. Parental consent, restricted access by role, retention limits tied to enrolment, and clear rules for third-party sharing all shape the architecture. Where a student-risk signal is produced, it goes to a person to interpret rather than triggering an action — the governance around that is yours to set, and we build to it.',
    services: ['software-development', 'website-development', 'ai-automation', 'digital-marketing'],
    architecture: {
      caption: 'From enquiry to enrolled, without the gaps',
      summary:
        'Enquiries from the website, phone and messaging land in one place with their source attached. An assistant answers routine questions immediately and in the family’s language; anything needing judgement routes to a person with the whole conversation. Once enrolled, the same channels carry fees, attendance and progress, so a family is not asked to learn three systems. Signals about student engagement go to faculty as information rather than as an automated action, because the intervention is a teaching decision.',
      nodes: [
        {
          id: 'enquiry',
          layer: 'source',
          label: 'Enquiries',
          description: 'Web, phone and messaging, landing in one record with the source attached.',
        },
        {
          id: 'sis',
          layer: 'source',
          label: 'Student system',
          description: 'Stays the system of record for enrolment, attendance and results.',
        },
        {
          id: 'assistant',
          layer: 'process',
          label: 'Admissions assistant',
          description: 'Answers routine questions immediately, in the language the family uses.',
        },
        {
          id: 'handoff',
          layer: 'process',
          label: 'Human handoff',
          description:
            'Anything needing judgement routes to a person with the whole conversation attached.',
        },
        {
          id: 'fees',
          layer: 'process',
          label: 'Fees and reconciliation',
          description:
            'Reminders on schedule, payments matched automatically, exceptions surfaced.',
        },
        {
          id: 'signals',
          layer: 'process',
          label: 'Engagement signals',
          description:
            'Attendance and submission patterns surfaced as information, not as an automated action.',
        },
        {
          id: 'family',
          layer: 'surface',
          label: 'Families',
          description: 'One channel for enquiries, fees, attendance and progress.',
        },
        {
          id: 'faculty',
          layer: 'surface',
          label: 'Faculty',
          description: 'Early visibility, with the intervention decision left where it belongs.',
        },
        {
          id: 'admin',
          layer: 'surface',
          label: 'Administration',
          description:
            'Funnel, collection and engagement visible without assembling a spreadsheet.',
        },
      ],
    },
    faqs: [
      {
        question: 'Can it handle multiple languages?',
        answer:
          'Yes, and for most institutions it is the point rather than a feature. The assistant answers in the language the family writes in, and outbound communication follows the preference on the record. Where translation quality matters — legal notices, fee terms — those stay human-written and are simply delivered in the right language.',
      },
      {
        question: 'Is student data safe?',
        answer:
          'Data about minors raises the bar. Access is granted by role and reviewed, retention is tied to enrolment rather than left indefinite, consent is recorded, and third-party sharing is explicit. Any model use is configured so student data is not retained by the provider.',
      },
      {
        question: 'Will this replace our student information system?',
        answer:
          'No. Your SIS stays the system of record. What we build sits around it — the enquiry funnel, the communication layer, the fee workflow — because those are usually where the effort actually goes, and replacing a working SIS mid-year is a risk with no matching reward.',
      },
      {
        question: 'What about student-risk predictions?',
        answer:
          'We surface patterns — attendance, submissions, participation — and stop there. The system does not score a student or trigger an action. Interpretation and intervention are teaching decisions, and a model that automates them is making a judgement it is not qualified to make and cannot be held accountable for.',
      },
    ],
  },

  'real-estate': {
    metaTitle: 'Real estate technology solutions — V4You',
    metaDescription:
      'Lead response, qualification, site-visit scheduling and document workflows — instrumented where the value actually leaks.',
    hero: {
      eyebrow: 'Real estate',
      headline: 'Lead value decays in minutes, not days.',
      body: 'Most of the loss happens between the portal enquiry and the first human conversation — in a gap no CRM report shows, because the record was never created.',
    },
    useCases: [
      {
        title: 'Instant first response',
        body: 'Every enquiry answered on arrival, on the channel it came from, with the basic qualifying questions asked while interest is still live.',
        valueArea: 'Shorter first-response time across every source',
      },
      {
        title: 'Qualification and routing',
        body: 'Budget, location, timeline and financing captured conversationally, then routed to the agent who handles that segment.',
        valueArea: 'Agent time spent on enquiries that fit',
      },
      {
        title: 'Site-visit scheduling and reminders',
        body: 'Booking against real availability, with reminders and rescheduling handled on WhatsApp rather than by phone tag.',
        valueArea: 'Fewer no-shows and less coordination effort',
      },
      {
        title: 'Post-sale document workflow',
        body: 'Agreement, payment schedule and registration documents tracked with their deadlines, so nothing waits on someone remembering.',
        valueArea: 'Fewer stalled files after the sale',
      },
    ],
    regulatoryNotes:
      'Property transactions generate records with statutory retention requirements, and marketing communication is subject to consent rules that vary by channel and jurisdiction. Payment collection and escrow arrangements carry their own obligations. We build systems that record consent explicitly, keep documents with their retention rules attached, and log the trail a dispute would need — but which regime applies to your transactions is a determination for your legal advisers.',
    services: [
      'ai-automation',
      'digital-marketing',
      'software-development',
      'mobile-app-development',
    ],
    architecture: {
      caption: 'Closing the gap between enquiry and conversation',
      summary:
        'Enquiries from portals, the website and WhatsApp are answered on arrival rather than queued for the next available agent. Qualification happens conversationally while interest is live, and the record is created immediately — which is what makes the funnel measurable at all. Routing sends the enquiry to the agent who handles that segment. Site visits are booked against real availability, and reminders go out on the channel the buyer already uses. After the sale, documents carry their own deadlines.',
      nodes: [
        {
          id: 'portals',
          layer: 'source',
          label: 'Portal enquiries',
          description:
            'Where most volume arrives, and where most of it is currently lost to delay.',
        },
        {
          id: 'whatsapp',
          layer: 'source',
          label: 'WhatsApp and calls',
          description: 'Answered on arrival, including outside office hours.',
        },
        {
          id: 'site',
          layer: 'source',
          label: 'Website',
          description: 'Instrumented so the source survives into the CRM record.',
        },
        {
          id: 'qualify',
          layer: 'process',
          label: 'Qualification',
          description: 'Budget, location, timeline and financing captured while interest is live.',
        },
        {
          id: 'route',
          layer: 'process',
          label: 'Routing',
          description: 'To the agent who handles that segment, with the conversation attached.',
        },
        {
          id: 'nurture',
          layer: 'process',
          label: 'Follow-up',
          description: 'On the channel the buyer used, at a cadence that stops when they say so.',
        },
        {
          id: 'crm',
          layer: 'surface',
          label: 'CRM',
          description: 'A record created at first contact rather than at first agent response.',
        },
        {
          id: 'agent',
          layer: 'surface',
          label: 'Agents',
          description: 'Fewer, better-qualified conversations rather than a longer list.',
        },
        {
          id: 'reporting',
          layer: 'surface',
          label: 'Reporting',
          description:
            'Enquiry to site visit to close, by source — measurable because the record exists.',
        },
      ],
    },
    faqs: [
      {
        question: 'Will buyers know they are talking to a system?',
        answer:
          'Yes, and it should say so. Pretending otherwise damages trust the moment someone works it out, which they usually do. What matters is that it answers immediately, asks sensible questions, and hands over to a person quickly — most buyers prefer a fast honest answer to a slow human one.',
      },
      {
        question: 'How does this work with our CRM?',
        answer:
          'It writes into it. The point is that a record exists from first contact with its source attached, which is what makes the funnel measurable. We work with the CRM you have wherever it can accept the data; where it cannot, that is a finding worth knowing.',
      },
      {
        question: 'Can it handle WhatsApp?',
        answer:
          'Yes, through the official Business API, which requires a verified business and has rules about message templates and opt-in. Those constraints shape what is possible, and we design within them rather than around them — an account that gets restricted for template abuse is an expensive shortcut.',
      },
      {
        question: 'What stops agents ignoring it?',
        answer:
          'Usually the fact that it hands them better enquiries. Adoption fails when a system adds a step without removing one, so the design starts from what agents currently do manually — qualifying, chasing, rescheduling — and takes those away rather than adding a screen.',
      },
    ],
  },

  retail: {
    metaTitle: 'Retail and ecommerce technology solutions — V4You',
    metaDescription:
      'Support deflection, demand forecasting, returns triage and commerce platforms — built around margin rather than around traffic.',
    hero: {
      eyebrow: 'Retail and ecommerce',
      headline: 'Margin gets squeezed from both ends.',
      body: 'Acquisition costs rise and support volume scales with orders. The work is usually in the middle — fewer avoidable contacts, better inventory decisions, and a returns process that costs less than the item.',
    },
    useCases: [
      {
        title: 'Support deflection that is not obstruction',
        body: 'The top contact reasons answered instantly and accurately — order status, returns, sizing — with a person one step away rather than three menus away.',
        valueArea: 'Fewer contacts per order without hiding the contact route',
      },
      {
        title: 'Product assistant',
        body: 'Answers the specific questions that stop a purchase — fit, compatibility, delivery timing — using your catalogue data rather than generic text.',
        valueArea: 'Fewer abandoned baskets caused by an unanswered question',
      },
      {
        title: 'Demand forecasting',
        body: 'Sales history, seasonality and lead times joined so reorder points reflect what is moving rather than what moved last quarter.',
        valueArea: 'Less stockout on movers, less capital in slow lines',
      },
      {
        title: 'Returns triage',
        body: 'Reason captured at initiation and routed by disposition, so restockable items return to sale quickly and the reason data reaches merchandising.',
        valueArea: 'Faster restock and clearer signal on why items come back',
      },
    ],
    regulatoryNotes:
      'Ecommerce carries consumer protection obligations around pricing display, return rights and delivery expectations, and payment handling brings PCI requirements that shape where card data may go. Marketing communication requires recorded consent per channel. We design so that card data never touches systems that do not need it and consent is recorded rather than assumed — but which consumer regime applies to your markets is a determination for your legal advisers.',
    services: ['website-development', 'ai-automation', 'digital-marketing', 'software-development'],
    architecture: {
      caption: 'Where margin actually leaks',
      summary:
        'Contacts arrive across chat, email and social, and are classified by reason before anything else happens — because you cannot deflect what you have not measured. The top reasons are answered from live order and catalogue data rather than from a static help page, with a person one step away. Returns capture their reason at initiation, which is what makes the data useful to merchandising. Demand signals join sales history to stock and lead times, so reordering reflects what is moving now.',
      nodes: [
        {
          id: 'contacts',
          layer: 'source',
          label: 'Customer contacts',
          description: 'Chat, email and social, classified by reason before anything is answered.',
        },
        {
          id: 'catalogue',
          layer: 'source',
          label: 'Catalogue and orders',
          description: 'Live data, so answers about stock and delivery are true when given.',
        },
        {
          id: 'returns',
          layer: 'source',
          label: 'Returns',
          description:
            'Reason captured at initiation, which is the only moment the customer knows it.',
        },
        {
          id: 'answer',
          layer: 'process',
          label: 'Answering',
          description:
            'Top reasons handled from live data, with a person one step away rather than three menus away.',
        },
        {
          id: 'forecast',
          layer: 'process',
          label: 'Demand model',
          description:
            'Sales history, seasonality and lead times joined so reorder points reflect reality.',
        },
        {
          id: 'disposition',
          layer: 'process',
          label: 'Returns disposition',
          description: 'Routed by condition, so restockable items get back to sale quickly.',
        },
        {
          id: 'customer',
          layer: 'surface',
          label: 'The customer',
          description: 'A fast accurate answer, and an obvious route to a person.',
        },
        {
          id: 'merch',
          layer: 'surface',
          label: 'Merchandising',
          description: 'Return reasons and unanswered questions, which are product feedback.',
        },
        {
          id: 'ops',
          layer: 'surface',
          label: 'Operations',
          description: 'Contacts per order, restock time and stock position in one view.',
        },
      ],
    },
    faqs: [
      {
        question: 'Will automating support annoy customers?',
        answer:
          'It does when deflection means obstruction — hiding the contact route, looping people through menus. It does not when the answer is instant and correct and a person is one step away. We measure resolution and escalation rate rather than deflection rate, because deflection alone can be improved by making you harder to reach.',
      },
      {
        question: 'Does this work with Shopify or WooCommerce?',
        answer:
          'Yes. Both expose the order, catalogue and customer data this needs. The integration work is usually less than the work of deciding what should happen — which contacts to automate, where the handover sits, what the system should refuse to answer.',
      },
      {
        question: 'How accurate is demand forecasting?',
        answer:
          'It depends on your history and how stable demand is, and anyone quoting an accuracy figure before seeing your data is guessing. What we can commit to is showing the forecast alongside what actually happened, so accuracy is visible and improving rather than asserted.',
      },
      {
        question: 'What about peak season?',
        answer:
          'Peak is when this pays for itself and also when it must not fall over. Load testing against realistic peaks is part of delivery, not something discovered in November, and the automation is designed to degrade to a human queue rather than to an error page.',
      },
    ],
  },

  finance: {
    metaTitle: 'Finance technology solutions — V4You',
    metaDescription:
      'Document intelligence, reconciliation support, onboarding and analyst tooling — with every regulated decision left to a person and every step logged.',
    hero: {
      eyebrow: 'Finance',
      headline: 'Regulated decisions stay with people.',
      body: 'What can move is everything around them — onboarding, verification, reconciliation, and the reporting that currently consumes analyst time. Every automated step has to be explainable afterwards.',
    },
    useCases: [
      {
        title: 'Onboarding document intelligence',
        body: 'Identity and income documents read into structured fields with a confidence score, and anything uncertain routed for review rather than accepted.',
        valueArea: 'Shorter onboarding cycle without lowering the check',
      },
      {
        title: 'Reconciliation assistance',
        body: 'Matches proposed across statements and ledgers, with the unmatched remainder surfaced as the work rather than buried in the matched majority.',
        valueArea: 'Analyst time on exceptions rather than on matching',
      },
      {
        title: 'Knowledge retrieval for advisers',
        body: 'Answers drawn from current product terms and policy with citations, so an adviser can verify before relying on it.',
        valueArea: 'Faster answers that can be checked',
      },
      {
        title: 'Analyst reporting',
        body: 'Recurring reports assembled automatically with their assumptions stated, leaving the interpretation to the analyst.',
        valueArea: 'Less assembly, more analysis',
      },
    ],
    regulatoryNotes:
      'Financial services carry obligations that constrain architecture directly: an auditable trail for decisions affecting a customer, explainability where an automated process contributes to a credit or risk outcome, data residency in some jurisdictions, and retention periods set by regulation rather than preference. We design so that automated steps are logged and reconstructable and regulated decisions remain with an accountable person — but which obligations apply to your business is a determination for your compliance function, and nothing here is a claim of regulatory approval.',
    services: ['ai-automation', 'software-development', 'cloud-devops', 'consulting'],
    architecture: {
      caption: 'Automation up to the decision, never through it',
      summary:
        'Documents and transactions are read into structured data with a confidence score attached, and anything uncertain is routed for review rather than accepted quietly. Retrieval answers policy questions from current terms with citations. Every regulated decision — credit, risk, eligibility, anything affecting a customer’s standing — stops for an accountable person, and the system records what it proposed, what evidence it used and who decided. That record is the point: an automated step that cannot be reconstructed afterwards is a liability regardless of how well it performs.',
      nodes: [
        {
          id: 'docs',
          layer: 'source',
          label: 'Documents',
          description:
            'Identity, income and supporting evidence, read into structured fields with a confidence score.',
        },
        {
          id: 'txn',
          layer: 'source',
          label: 'Transactions',
          description: 'Statements and ledgers, ingested for matching rather than for judgement.',
        },
        {
          id: 'policy',
          layer: 'source',
          label: 'Policy and terms',
          description:
            'Current product terms, which is what makes a retrieved answer safe to rely on.',
        },
        {
          id: 'extract',
          layer: 'process',
          label: 'Extraction',
          description: 'Low-confidence extractions routed for review rather than accepted quietly.',
        },
        {
          id: 'match',
          layer: 'process',
          label: 'Matching',
          description: 'Proposes matches; the unmatched remainder is surfaced as the actual work.',
        },
        {
          id: 'decision',
          layer: 'process',
          label: 'Human decision',
          description:
            'Every regulated decision stops here. The system proposes and records; a person decides.',
        },
        {
          id: 'log',
          layer: 'process',
          label: 'Decision record',
          description:
            'What was proposed, on what evidence, and who decided. Reconstructable afterwards.',
        },
        {
          id: 'analyst',
          layer: 'surface',
          label: 'Analysts',
          description: 'Time on exceptions and interpretation rather than on assembly.',
        },
        {
          id: 'customer',
          layer: 'surface',
          label: 'The customer',
          description: 'A faster process, with the same check applied.',
        },
      ],
    },
    faqs: [
      {
        question: 'Can AI make credit or risk decisions?',
        answer:
          'Not in anything we build. It can extract, match, retrieve and prepare — and it stops at the decision. Beyond the regulatory position, an automated decision you cannot explain to a regulator or a customer is a liability that outlasts whatever efficiency it bought.',
      },
      {
        question: 'How do you handle explainability?',
        answer:
          'Every automated step records its inputs, its output and its confidence, and retrieval returns citations to the source it used. The point is that a decision can be reconstructed months later from the record rather than from someone’s memory of how the system behaved.',
      },
      {
        question: 'Where does our data sit?',
        answer:
          'Wherever your obligations require, and that shapes the architecture from the start rather than being configured at the end. Where data cannot leave a jurisdiction or an environment, retrieval and processing are designed to run inside it.',
      },
      {
        question: 'What about existing core banking or ledger systems?',
        answer:
          'They stay. Core systems are replaced on a decade timescale for good reasons. What we build sits around them — the document flow, the reconciliation support, the analyst tooling — which is where the effort actually goes.',
      },
    ],
  },

  logistics: {
    metaTitle: 'Logistics technology solutions — V4You',
    metaDescription:
      'Shipment visibility, dispatch support, proof of delivery and exception handling — because most support load in logistics is a visibility problem.',
    hero: {
      eyebrow: 'Logistics',
      headline: 'Nobody calls to ask where a shipment is out of curiosity.',
      body: 'They call because the system did not tell them. Most support load in logistics is a visibility problem wearing a customer-service costume.',
    },
    useCases: [
      {
        title: 'Proactive status communication',
        body: 'Customers told when something changes — dispatch, delay, delivery window — before they think to ask.',
        valueArea: 'Fewer status enquiries reaching the team at all',
      },
      {
        title: 'Exception detection',
        body: 'Shipments drifting off plan flagged early to a person with the context attached, rather than surfacing as a complaint.',
        valueArea: 'Exceptions handled before the customer notices',
      },
      {
        title: 'Proof-of-delivery capture',
        body: 'Signature, photo and condition captured on a device that works without signal and syncs when it returns.',
        valueArea: 'Fewer disputes and faster invoice resolution',
      },
      {
        title: 'Dispatch and route support',
        body: 'Route and load suggestions that account for real constraints — vehicle, driver hours, access windows — with the dispatcher deciding.',
        valueArea: 'Better-utilised vehicles, decided by a dispatcher',
      },
    ],
    regulatoryNotes:
      'Logistics operations carry obligations around driver hours, vehicle records, dangerous goods documentation and, for cross-border movement, customs records with defined retention. Proof of delivery has evidentiary weight in a dispute, which raises the bar on how it is captured and stored. We build so records are captured at source with their timestamps intact and retained as required; which regimes apply to your routes and cargo is yours to determine.',
    services: ['software-development', 'mobile-app-development', 'ai-automation', 'cloud-devops'],
    architecture: {
      caption: 'Tell them before they ask',
      summary:
        'Vehicle position, driver input and the transport management system feed one view of where each shipment actually is against where it should be. Divergence triggers two things: the customer is told, and a person is alerted with the context attached. Proof of delivery is captured on a device that works without signal and syncs later, because the places deliveries happen are frequently the places coverage does not. The measure that matters is enquiries per shipment, which falls when visibility improves.',
      nodes: [
        {
          id: 'telematics',
          layer: 'source',
          label: 'Vehicle position',
          description:
            'From telematics or the driver device. Position is only useful against a plan.',
        },
        {
          id: 'driver',
          layer: 'source',
          label: 'Driver input',
          description: 'Captured on a device that works with no signal and syncs when it returns.',
        },
        {
          id: 'tms',
          layer: 'source',
          label: 'Transport system',
          description: 'The plan: what should be where, and when.',
        },
        {
          id: 'compare',
          layer: 'process',
          label: 'Plan versus actual',
          description: 'Divergence is the signal. Everything else is noise.',
        },
        {
          id: 'exception',
          layer: 'process',
          label: 'Exception routing',
          description:
            'A person alerted early with the context attached, rather than a complaint arriving later.',
        },
        {
          id: 'pod',
          layer: 'process',
          label: 'Proof of delivery',
          description:
            'Signature, photo and condition, timestamped at capture rather than at sync.',
        },
        {
          id: 'customer',
          layer: 'surface',
          label: 'The customer',
          description: 'Told when something changes, before they think to ask.',
        },
        {
          id: 'ops',
          layer: 'surface',
          label: 'Operations',
          description: 'Enquiries per shipment, on-time rate and cost per drop.',
        },
        {
          id: 'billing',
          layer: 'surface',
          label: 'Billing',
          description:
            'Delivery evidence attached to the invoice, so a dispute resolves rather than lingers.',
        },
      ],
    },
    faqs: [
      {
        question: 'What if drivers have no signal?',
        answer:
          'Assumed rather than hoped for. The driver app writes locally and queues, syncing when connectivity returns, with timestamps recorded at capture rather than at sync — which matters when proof of delivery is evidence in a dispute.',
      },
      {
        question: 'Do we need to replace our TMS?',
        answer:
          'Usually not. The TMS holds the plan; what is typically missing is the comparison between plan and actual, and the communication that should follow from it. That sits alongside rather than replacing.',
      },
      {
        question: 'Will drivers actually use it?',
        answer:
          'Only if it takes work away rather than adding it. That means large touch targets, works with gloves, functions offline, and no data entry that the system could have captured itself. Where a driver app fails adoption it is almost always because it was designed for the office.',
      },
      {
        question: 'How do we measure whether it worked?',
        answer:
          'Enquiries per shipment is the honest measure, and it needs a baseline before anything changes. We instrument first for that reason — a support volume reduction you cannot compare to anything is a claim rather than a result.',
      },
    ],
  },

  hospitality: {
    metaTitle: 'Hospitality technology solutions — V4You',
    metaDescription:
      'Direct booking, guest communication, review response and revenue visibility — because every aggregator booking is margin handed away.',
    hero: {
      eyebrow: 'Hospitality',
      headline: 'Every aggregator booking is margin handed away.',
      body: 'And every unanswered enquiry is a booking handed away. The lever is responsiveness on the direct channel, in the guest’s language, at the hour they actually ask.',
    },
    useCases: [
      {
        title: 'Direct booking assistant',
        body: 'Answers availability, rate and policy questions instantly on the direct channel, at the moment a guest is comparing it against an aggregator.',
        valueArea: 'A larger share of bookings taken directly',
      },
      {
        title: 'Pre-arrival personalisation',
        body: 'Timed messages that confirm details, offer relevant upgrades and collect preferences before arrival rather than at the desk.',
        valueArea: 'Upsell taken earlier and a smoother check-in',
      },
      {
        title: 'Concierge and in-stay requests',
        body: 'Requests answered in the guest’s language at any hour, routed to the right department with the room and context attached.',
        valueArea: 'Faster resolution and fewer repeat requests',
      },
      {
        title: 'Review response support',
        body: 'Draft responses prepared from the stay record for a person to edit and send, so responses stay timely and specific.',
        valueArea: 'Consistent, timely review responses',
      },
    ],
    regulatoryNotes:
      'Hospitality holds guest identity data and, in many jurisdictions, is required to record and sometimes report guest registration details. Payment handling brings PCI requirements, and marketing to past guests requires recorded consent. We design so identity documents are retained only as long as required and card data stays within systems built for it; which registration and reporting obligations apply to your properties is a local determination.',
    services: [
      'website-development',
      'ai-automation',
      'digital-marketing',
      'mobile-app-development',
    ],
    architecture: {
      caption: 'Winning the direct channel',
      summary:
        'Enquiries arrive on the website, WhatsApp and phone, and are answered immediately in the guest’s language — which is what decides a comparison against an aggregator, because the aggregator answers instantly too. Availability and rate come from the property management system, so an answer is true when given. In-stay requests route to the right department with the room and context attached. Review responses are drafted from the stay record for a person to edit, which keeps them timely without making them generic.',
      nodes: [
        {
          id: 'web',
          layer: 'source',
          label: 'Direct channel',
          description: 'Where the margin is, and where response speed decides the comparison.',
        },
        {
          id: 'messaging',
          layer: 'source',
          label: 'WhatsApp and calls',
          description: 'Answered at the hour guests actually ask, in the language they use.',
        },
        {
          id: 'pms',
          layer: 'source',
          label: 'Property system',
          description: 'Availability and rate, so an answer is true when it is given.',
        },
        {
          id: 'respond',
          layer: 'process',
          label: 'Instant response',
          description: 'Availability, rate and policy answered while the guest is still comparing.',
        },
        {
          id: 'prearrival',
          layer: 'process',
          label: 'Pre-arrival',
          description:
            'Confirmation, preferences and relevant upgrades before arrival rather than at the desk.',
        },
        {
          id: 'requests',
          layer: 'process',
          label: 'Request routing',
          description: 'To the right department, with the room and context attached.',
        },
        {
          id: 'guest',
          layer: 'surface',
          label: 'The guest',
          description: 'An immediate answer on the channel they chose.',
        },
        {
          id: 'staff',
          layer: 'surface',
          label: 'Staff',
          description: 'Requests arriving with context rather than as a note to chase.',
        },
        {
          id: 'revenue',
          layer: 'surface',
          label: 'Revenue view',
          description: 'Direct share, upsell take-up and guest sentiment together.',
        },
      ],
    },
    faqs: [
      {
        question: 'Can it check real availability?',
        answer:
          'Yes, through your property management system — and it has to, because an assistant quoting availability it cannot see creates a worse problem than the one it solved. Where a PMS has no usable API, that is a finding worth knowing early.',
      },
      {
        question: 'Which languages?',
        answer:
          'Whichever your guests actually use, which is worth checking against booking data rather than assuming. The assistant replies in the language it is written to, and staff-facing summaries stay in your operating language so nobody is translating internally.',
      },
      {
        question: 'Will this feel impersonal?',
        answer:
          'It depends entirely on what it is used for. Answering "is parking included" at 11pm is a service. Auto-responding to a complaint about a room is not, and we do not build that — anything with sentiment attached routes to a person.',
      },
      {
        question: 'What about the aggregators?',
        answer:
          'They are not going away, and treating them as the enemy is usually the wrong frame. The goal is that a guest who found you there and is now comparing directly gets a faster, better answer on your own channel — which is where the margin difference is decided.',
      },
    ],
  },

  government: {
    metaTitle: 'Government technology solutions — V4You',
    metaDescription:
      'Citizen access, service request routing, document processing and transparency — with accessibility and human escalation as requirements rather than preferences.',
    hero: {
      eyebrow: 'Government',
      headline: 'Citizen services are judged on access, not on architecture.',
      body: 'Accessibility, language coverage, auditability and data residency are requirements rather than preferences — and a human escalation route is part of the service, not a fallback.',
    },
    useCases: [
      {
        title: 'Public information assistant',
        body: 'Answers questions about services, eligibility and process from current published information, with citations, in the languages the population actually uses.',
        valueArea: 'Faster answers and fewer repeat calls on the same questions',
      },
      {
        title: 'Service request routing',
        body: 'Requests classified and routed to the responsible department with a reference the citizen can track.',
        valueArea: 'Fewer requests lost between departments',
      },
      {
        title: 'Document processing',
        body: 'Applications and supporting documents read into structured fields, with uncertain extractions routed for review rather than assumed.',
        valueArea: 'Shorter processing queues without lowering the check',
      },
      {
        title: 'Service performance transparency',
        body: 'Volumes, processing times and outcomes published, so performance is visible to the public rather than only internally.',
        valueArea: 'Accountability that does not depend on a request',
      },
    ],
    regulatoryNotes:
      'Public sector systems carry obligations that are usually stricter than commercial equivalents: accessibility standards that are legally mandated rather than advisory, procurement rules governing how systems are bought and who may hold the data, data residency requirements, auditability of decisions affecting a citizen, and language access provisions. We build to the standards specified in your procurement and document how each is met; we make no claim of certification against any public sector framework.',
    services: ['software-development', 'ai-automation', 'website-development', 'consulting'],
    architecture: {
      caption: 'Access first, everything else second',
      summary:
        'Citizens reach the service through the web, phone and in person, and all three produce the same record with the same reference. An assistant answers from current published information with citations, in the languages the population uses, and a human route stays visible at every step rather than being buried after a failed attempt. Requests route to the responsible department with a trackable reference. Decisions affecting a citizen are logged so they can be reconstructed, and service performance is published rather than held internally.',
      nodes: [
        {
          id: 'web',
          layer: 'source',
          label: 'Web',
          description:
            'Built to the mandated accessibility standard, which is a legal requirement here rather than a preference.',
        },
        {
          id: 'phone',
          layer: 'source',
          label: 'Phone and in person',
          description: 'Produce the same record and the same reference as an online request.',
        },
        {
          id: 'published',
          layer: 'source',
          label: 'Published information',
          description:
            'The source an assistant answers from, with citations, so an answer is checkable.',
        },
        {
          id: 'classify',
          layer: 'process',
          label: 'Classification',
          description:
            'Requests routed to the responsible department with a reference the citizen can track.',
        },
        {
          id: 'escalate',
          layer: 'process',
          label: 'Human route',
          description: 'Visible at every step, not buried after a failed self-service attempt.',
        },
        {
          id: 'audit',
          layer: 'process',
          label: 'Decision log',
          description:
            'Decisions affecting a citizen recorded so they can be reconstructed and reviewed.',
        },
        {
          id: 'citizen',
          layer: 'surface',
          label: 'The citizen',
          description: 'An answer in a language they read, on a service they can reach.',
        },
        {
          id: 'dept',
          layer: 'surface',
          label: 'Departments',
          description: 'Requests arriving classified rather than as undifferentiated volume.',
        },
        {
          id: 'public',
          layer: 'surface',
          label: 'Published performance',
          description: 'Volumes, processing times and outcomes visible without a request.',
        },
      ],
    },
    faqs: [
      {
        question: 'How do you handle accessibility?',
        answer:
          'As a build constraint per component rather than an audit before launch — semantic markup, keyboard operation, visible focus, contrast against a matrix, and testing at realistic text sizes. We target WCAG 2.2 AA, state known limitations publicly, and provide a working route to report problems. We do not claim conformance we have not tested.',
      },
      {
        question: 'Where is the data held?',
        answer:
          'Wherever your residency requirements specify, and that decision shapes the architecture from the start. Where processing cannot leave a jurisdiction, retrieval and model use are designed to run inside it, which constrains the options and is better known early.',
      },
      {
        question: 'Can a citizen always reach a person?',
        answer:
          'Yes, and the route stays visible rather than appearing only after a self-service attempt fails. Automation that makes a public service harder to reach is a reduction in access however efficient it looks in a report.',
      },
      {
        question: 'How does this work with procurement?',
        answer:
          'We build to the standards a procurement specifies and document how each is met, which is what an evaluation panel needs. Where a requirement is ambiguous we raise it during clarification rather than interpreting it favourably and defending that later.',
      },
    ],
  },

  startups: {
    metaTitle: 'Technology partner for startups — V4You',
    metaDescription:
      'Product discovery, MVP delivery and architecture that survives traction — without building the wrong thing well.',
    hero: {
      eyebrow: 'Startups',
      headline: 'Move from idea to traction without building the wrong thing.',
      body: 'The expensive mistake is rarely building badly. It is building the wrong thing well, then finding the architecture assumed a model that did not survive contact with customers.',
    },
    useCases: [
      {
        title: 'Product discovery before commitment',
        body: 'Interviews and workflow mapping that test whether the problem is real and worth paying for, before an architecture assumes an answer.',
        valueArea: 'A validated direction rather than a validated opinion',
      },
      {
        title: 'MVP that survives its own success',
        body: 'The smallest testable slice, built so the parts likely to change are the parts that can — rather than a prototype that has to be thrown away.',
        valueArea: 'A first release that can become the second',
      },
      {
        title: 'Instrumentation that proves the model',
        body: 'The three or four events that actually indicate the thing is working, defined before launch rather than reconstructed afterwards.',
        valueArea: 'Evidence for the next funding conversation',
      },
      {
        title: 'Fractional product engineering',
        body: 'Senior capacity without a permanent hire, for teams that need the decision made well more than they need another pair of hands.',
        valueArea: 'Access to judgement at a stage that cannot support a full team',
      },
    ],
    regulatoryNotes:
      'Startups usually meet regulation later than they should. Handling personal data brings obligations from the first user, payment handling brings PCI scope, and selling into regulated buyers brings their requirements into your architecture. The cheap moment to accommodate these is at design; the expensive moment is during an enterprise security review. We flag what applies during discovery — the determination remains yours.',
    services: ['software-development', 'consulting', 'website-development', 'cloud-devops'],
    architecture: {
      caption: 'Building for the next decision, not the next decade',
      summary:
        'Discovery tests whether the problem is worth solving before an architecture assumes an answer. The first build is the smallest slice that can be judged, structured so the parts most likely to change are the parts that can change cheaply. Instrumentation is defined before launch rather than reconstructed for a board deck. Infrastructure is deliberately modest — the cost of over-engineering early is not the bill, it is the time spent on scale that has not arrived. Hardening follows traction rather than anticipating it.',
      nodes: [
        {
          id: 'users',
          layer: 'source',
          label: 'Customer interviews',
          description:
            'Whether the problem is real and worth paying for. Tested before an architecture assumes it.',
        },
        {
          id: 'market',
          layer: 'source',
          label: 'Existing alternatives',
          description:
            'Including spreadsheets and doing nothing, which are the real competitors early on.',
        },
        {
          id: 'slice',
          layer: 'process',
          label: 'Smallest testable slice',
          description: 'Small enough to ship, complete enough to judge.',
        },
        {
          id: 'seams',
          layer: 'process',
          label: 'Seams for change',
          description: 'The parts most likely to change built so they can, cheaply.',
        },
        {
          id: 'events',
          layer: 'process',
          label: 'Instrumentation',
          description:
            'The three or four events that indicate it is working, defined before launch.',
        },
        {
          id: 'product',
          layer: 'surface',
          label: 'The product',
          description: 'In front of real users early enough for their reaction to still change it.',
        },
        {
          id: 'evidence',
          layer: 'surface',
          label: 'Evidence',
          description: 'What actually happened, which is what the next funding conversation needs.',
        },
        {
          id: 'scale',
          layer: 'surface',
          label: 'Hardening',
          description:
            'Follows traction rather than anticipating it. Over-engineering early costs time, not money.',
        },
      ],
    },
    faqs: [
      {
        question: 'Can you build our MVP?',
        answer:
          'Yes, though the more useful question is usually which MVP. A great deal of startup spend goes into building the second or third version of an idea before the first has been tested. Discovery is short and cheap relative to a build, and it regularly changes what gets built.',
      },
      {
        question: 'We have no technical co-founder. Is that a problem?',
        answer:
          'It changes what you need from a partner. You need decisions explained rather than made behind a curtain, documentation you could hand to a future hire, and no dependency on us that you did not choose. We work that way regardless, but it matters more here.',
      },
      {
        question: 'Will it scale?',
        answer:
          'To the next stage, deliberately — and not further, also deliberately. Building for a scale you have not reached costs time you do not have. What we do commit to is that the parts most likely to need replacing are the parts that can be replaced without a rewrite.',
      },
      {
        question: 'What if we raise and want to build a team?',
        answer:
          'That is a good outcome and the handover is designed for it. Architecture records, runbooks and documentation exist from the start, so a new team inherits reasoning rather than archaeology. We have handed projects over entirely and that is a success rather than a loss.',
      },
    ],
  },

  enterprise: {
    metaTitle: 'Enterprise modernisation — V4You',
    metaDescription:
      'Legacy modernisation, integration and governance — sequenced so the business keeps running and each step proves itself before the next.',
    hero: {
      eyebrow: 'Enterprise',
      headline: 'Modernise without pausing the business.',
      body: 'Modernisation fails on sequencing more often than on technology. The constraint is doing it while the business runs, which makes integration and governance the first design problems rather than the last.',
    },
    useCases: [
      {
        title: 'Strangler-pattern modernisation',
        body: 'One capability replaced at a time behind a stable interface, so the legacy system keeps serving everything not yet moved.',
        valueArea: 'Progress without a cutover event',
      },
      {
        title: 'Integration across acquired estates',
        body: 'Systems inherited through acquisition connected through a deliberate integration layer rather than through point-to-point links nobody can map.',
        valueArea: 'One view across estates that were never designed to meet',
      },
      {
        title: 'Internal platforms and portals',
        body: 'One place for the workflows currently spread across five systems and a shared mailbox, with permissions and audit built in.',
        valueArea: 'Less switching, clearer ownership of each step',
      },
      {
        title: 'Governed AI adoption',
        body: 'A path from pilot to production with the evaluation, access control and audit that a risk function will actually accept.',
        valueArea: 'AI that survives a security review',
      },
    ],
    regulatoryNotes:
      'Enterprise environments usually carry accumulated obligations — sector regulation, contractual commitments to customers, internal audit standards, and data protection requirements across multiple jurisdictions. These constrain where data may sit, who may access it and what must be logged. We design to the requirements your risk and compliance functions specify and document how each is met; determining which apply is theirs rather than ours.',
    services: ['consulting', 'software-development', 'cloud-devops', 'ai-automation'],
    architecture: {
      caption: 'Replace one capability at a time',
      summary:
        'A stable interface is placed in front of the legacy system, and traffic for one capability is routed to a new implementation behind it. The legacy system keeps serving everything not yet moved, so there is no cutover event to fail. Each capability is proven in production before the next begins. Integration runs through a deliberate layer rather than point-to-point links, because an estate connected point-to-point becomes unmappable long before it becomes unmanageable. Governance — access, audit, data residency — is designed in at the interface rather than added per service.',
      nodes: [
        {
          id: 'legacy',
          layer: 'source',
          label: 'Legacy systems',
          description:
            'Kept running. Everything not yet moved still works, which is what removes the cutover risk.',
        },
        {
          id: 'acquired',
          layer: 'source',
          label: 'Acquired estates',
          description:
            'Systems that were never designed to meet, connected deliberately rather than opportunistically.',
        },
        {
          id: 'facade',
          layer: 'process',
          label: 'Stable interface',
          description:
            'Consumers talk to this, not to what is behind it — which is what lets the behind change.',
        },
        {
          id: 'strangle',
          layer: 'process',
          label: 'Capability by capability',
          description: 'One at a time, proven in production before the next begins.',
        },
        {
          id: 'integration',
          layer: 'process',
          label: 'Integration layer',
          description:
            'Deliberate rather than point-to-point. An estate wired point-to-point becomes unmappable.',
        },
        {
          id: 'governance',
          layer: 'process',
          label: 'Access and audit',
          description: 'Designed in at the interface rather than added per service afterwards.',
        },
        {
          id: 'users',
          layer: 'surface',
          label: 'Business users',
          description: 'Who should notice the improvement and not the migration.',
        },
        {
          id: 'platform',
          layer: 'surface',
          label: 'Internal platform',
          description:
            'One place for workflows currently spread across five systems and a mailbox.',
        },
        {
          id: 'risk',
          layer: 'surface',
          label: 'Risk and audit',
          description:
            'Given the evidence they need as a product of the system rather than a report about it.',
        },
      ],
    },
    faqs: [
      {
        question: 'Can you work inside our governance model?',
        answer:
          'Yes, and it shapes the design rather than being satisfied afterwards. Change advisory boards, security review, architecture standards and procurement all have lead times, and a plan that ignores them is a plan that slips. We would rather build the review cycles into the schedule than discover them.',
      },
      {
        question: 'What about our existing suppliers?',
        answer:
          'We work alongside them regularly. What matters is that ownership of each decision and each interface is explicit — most multi-supplier friction comes from ambiguity about who decides, not from technical disagreement.',
      },
      {
        question: 'How do you avoid a big-bang cutover?',
        answer:
          'By not having one. A stable interface goes in front of the legacy system and capabilities move behind it one at a time, each proven in production before the next. It takes longer in elapsed time and removes the single event where everything can fail simultaneously.',
      },
      {
        question: 'Can AI pass our security review?',
        answer:
          'It can, if it was designed for that from the start. What reviews ask for is where data goes, what is retained, who can access it, what is logged, and what happens when the model is wrong. Retrofitting those answers onto a pilot built without them is usually more work than rebuilding it.',
      },
    ],
  },
}
