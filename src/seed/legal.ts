/**
 * Legal page content — privacy, cookies and website terms.
 *
 * READ THIS BEFORE EDITING.
 *
 * docs/08 §6 says Claude Code should not draft these, and the reasoning is
 * sound: generated legal text that does not describe real practices is worse
 * than no page, because it is a stated commitment nobody is keeping.
 *
 * The client instructed otherwise, having no lawyer available. So these were
 * written under a constraint that makes them defensible: **every factual
 * statement here was verified against the codebase**, not assumed. The audit
 * that produced them established that the public site sets no cookies, loads no
 * analytics, self-hosts its fonts, and makes no third-party runtime request
 * except Cloudflare Turnstile when that is configured.
 *
 * That is what separates this from boilerplate. A generic privacy policy would
 * have claimed cookie banners and analytics partners this site does not have —
 * and each of those claims would have been a false statement about data
 * handling.
 *
 * What is still outstanding, and cannot be resolved by reading code:
 *
 *   - the legal entity name, registered address and contact route
 *   - retention periods (proposals below, each marked, all needing a decision)
 *   - governing law and jurisdiction
 *   - the limitation of liability position
 *
 * Those are marked `NEEDS DECISION` in the content and rendered distinctly on
 * the page. The pages stay noindexed and carry a visible draft banner until
 * `siteSettings.legal.approved` is set, which is a gate rather than a reminder.
 */

export type LegalSection = {
  heading: string
  /** Paragraphs. */
  body: string[]
  /** Optional bullet list rendered after the body. */
  list?: string[]
  /**
   * Marks a section as depending on a decision only the client can make.
   * Rendered with a visible marker rather than blending into the prose.
   */
  needsDecision?: string
}

export type LegalDocument = {
  title: string
  metaDescription: string
  intro: string[]
  sections: LegalSection[]
}

const LAST_UPDATED = '18 August 2026'

export const legalLastUpdated = LAST_UPDATED

// ---------------------------------------------------------------------------
// Privacy policy
// ---------------------------------------------------------------------------

export const privacyPolicy: LegalDocument = {
  title: 'Privacy policy',
  metaDescription:
    'What personal data this site collects, why, where it is stored, who it is shared with, and the rights you have over it.',
  intro: [
    'This policy describes what happens to personal data you give us through this website. It was written by auditing what the site actually does rather than from a template, so where it says the site does not do something, that has been checked in the code rather than assumed.',
    'It covers this website only. If you become a client, the handling of data inside a project we build for you is governed by the written agreement for that engagement.',
  ],
  sections: [
    {
      heading: 'Who is responsible for your data',
      body: [
        'V4You Technologies is responsible for the personal data collected through this website. Our registered legal entity name, registered address and the contact point for privacy questions are set out at the end of this policy.',
      ],
      needsDecision:
        'Legal entity name, registered address and a privacy contact address are still required. Until they are supplied this section is incomplete, and a privacy policy without an identifiable controller is not usable.',
    },
    {
      heading: 'What we collect, and when',
      body: [
        'We collect personal data in exactly two places on this site, and both are things you choose to submit. We do not collect anything from you simply for reading a page.',
        'When you submit the consultation form, we receive the fields you complete:',
      ],
      list: [
        'Your name and work email address, which are required so that we can reply',
        'Optionally: phone number, company, your role, an indicative budget range and timeline',
        'Optionally: a description of what you are trying to change, and which services you are interested in',
        'Whether you have asked for an NDA',
        'The page you submitted from, and any campaign parameters (utm_source and similar) present when you arrived',
        'The fact that you gave consent, and the time you gave it',
      ],
    },
    {
      heading: 'The newsletter',
      body: [
        'If you subscribe to our newsletter we store your email address, the time you consented, the page you subscribed from, and a token that makes one-click unsubscribe work. The consent checkbox is never pre-ticked, and subscribing is a separate action from making an enquiry.',
      ],
    },
    {
      heading: 'What we do not do',
      body: [
        'This section is unusually specific because these are the things most privacy policies quietly permit themselves. Each statement below was verified against the code that runs this site.',
      ],
      list: [
        'This website sets no cookies. Not analytics cookies, not advertising cookies, not preference cookies.',
        'No analytics or tracking script is loaded on this site. There is no Google Analytics, no advertising pixel, and no session recording.',
        'Fonts are served from our own domain. There is no request to Google Fonts when you load a page, so Google does not receive your IP address through us.',
        'We do not sell personal data, and we do not share it with advertising networks or data brokers.',
        'We do not build behavioural profiles, and we do not make automated decisions about you.',
      ],
    },
    {
      heading: 'Why we process it, and on what basis',
      body: [
        'We use what you submit to reply to your enquiry, to prepare for the conversation that follows, and to keep a record of that exchange. The basis for that processing is your consent, given by the checkbox on the form, together with our legitimate interest in responding to someone who has asked us to.',
        'For the newsletter, the basis is consent alone, and you can withdraw it at any time using the unsubscribe link in any email or by contacting us.',
        'We do not use enquiry data for unrelated marketing. If we ever want to, we will ask separately.',
      ],
    },
    {
      heading: 'Where your data is stored',
      body: [
        'Enquiries are stored in a PostgreSQL database hosted by Supabase, in Amazon Web Services’ Asia Pacific (Mumbai) region. The connection between this website and that database is encrypted, and the certificate is verified against a pinned certificate authority rather than trusted blindly.',
        'Access to that data is restricted to the people at V4You who need it in order to reply to you.',
      ],
    },
    {
      heading: 'Who else is involved',
      body: [
        'A small number of service providers process data on our behalf. Each is listed below with what it handles. Where a provider is marked as not currently enabled, no data reaches it at all today, and this policy will be updated before that changes.',
      ],
      list: [
        'Supabase — hosts the database that stores enquiries. Currently in use.',
        'Vercel — hosts and serves this website, and processes request logs including IP addresses in the ordinary course of serving pages.',
        'Resend — sends the confirmation email to you and the notification email to us. Not currently enabled; while it is not, no email is sent.',
        'Cloudflare Turnstile — checks that a form submission is not automated. Not currently enabled; when it is, Cloudflare receives your IP address and a challenge token for that check.',
        'Upstash — rate-limits form submissions using your IP address. Not currently enabled.',
        'A customer relationship management system — not currently selected or connected. No enquiry data is sent to any CRM today.',
      ],
    },
    {
      heading: 'How long we keep it',
      body: [
        'We keep enquiry records for as long as there is a reason to, and no longer. Our proposed periods are set out below.',
      ],
      list: [
        'Enquiries: retained for 24 months after our last contact with you, then deleted.',
        'Newsletter subscriptions: retained until you unsubscribe, after which we keep only the record that you unsubscribed, so we do not contact you again by mistake.',
        'Server request logs: retained for 30 days by our hosting provider.',
      ],
      needsDecision:
        'These retention periods are proposals, not existing practice. They need confirming against how V4You actually works — in particular whether 24 months matches the real sales cycle, and whether any contractual or tax obligation requires a longer period for records connected to a client engagement.',
    },
    {
      heading: 'Your rights',
      body: [
        'You can ask us for a copy of the personal data we hold about you, ask us to correct it, or ask us to delete it. You can withdraw your consent at any time, and doing so does not affect anything we did before you withdrew it.',
        'We will respond to any of these requests. If you are not satisfied with how we have handled your data, you are entitled to complain to the relevant data protection authority in your country.',
      ],
    },
    {
      heading: 'Security',
      body: [
        'Data is encrypted in transit and at rest. Access is granted by role and reviewed. Our security practices are described in more detail on the security page, including the things we do not have — we hold no security certifications, and we say so rather than implying otherwise.',
      ],
    },
    {
      heading: 'Changes to this policy',
      body: [
        'If we change how we handle personal data — including enabling any of the providers listed above as not currently in use — we will update this policy and change the date at the top. Material changes will be described rather than made quietly.',
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Cookie policy
// ---------------------------------------------------------------------------

export const cookiePolicy: LegalDocument = {
  title: 'Cookie policy',
  metaDescription:
    'This website sets no cookies. What that means, what is stored in your browser instead, and what would change if that ever does.',
  intro: [
    'This is a short policy because there is not much to describe. **This website does not set any cookies.** That was verified in the code rather than assumed, and it is why you have not been shown a cookie banner.',
  ],
  sections: [
    {
      heading: 'What a cookie policy usually covers, and why this one does not',
      body: [
        'Most websites set cookies for analytics, advertising, and remembering preferences. This one does none of those things. There is no analytics script on this site, no advertising pixel, and no third-party tag manager.',
        'Fonts are served from our own domain rather than from Google, so loading a page here does not send your IP address to a font provider. Nothing on a page you read makes a request to a third party.',
      ],
    },
    {
      heading: 'What is stored in your browser',
      body: [
        'One thing, and only in a specific circumstance. If you arrive from a campaign link carrying parameters such as utm_source, those parameters are kept in your browser’s session storage so that if you later submit the consultation form we can tell which campaign brought you.',
        'Session storage is not a cookie: it is never sent to a server automatically, it is not readable by any other site, and it is discarded the moment you close the tab. If you never submit a form, it is never used for anything.',
      ],
    },
    {
      heading: 'The staff area',
      body: [
        'The content management system at /admin sets an authentication cookie so that staff can stay signed in. That cookie is strictly necessary for the sign-in to work, it is only ever set after someone signs in, and it is never set for visitors to the public site.',
      ],
    },
    {
      heading: 'What would change if we add analytics',
      body: [
        'We may add analytics in future. If we do, it will be gated behind a consent banner that appears before anything loads — not a banner that appears while a tracker is already running, which is the common and non-compliant pattern.',
        'The site is already built for this: analytics calls are queued in memory and nothing is sent until consent is given. If consent is refused, nothing loads at all. This policy will be updated before any of that is switched on.',
      ],
    },
    {
      heading: 'The spam check',
      body: [
        'When we enable the spam protection on our forms, Cloudflare Turnstile may set a cookie in order to tell a person from an automated submission. It is used only on pages with a form, only for that purpose, and it is a strictly necessary cookie for submitting the form. It is not currently enabled.',
      ],
    },
    {
      heading: 'Controlling storage in your browser',
      body: [
        'Since we set no cookies there is nothing here to opt out of. If you want to clear the session storage described above, closing the tab does it, and your browser settings let you block or clear site storage entirely. Blocking it will not stop any part of this site from working.',
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Website terms of use
// ---------------------------------------------------------------------------

export const termsOfUse: LegalDocument = {
  title: 'Terms of use',
  metaDescription:
    'The terms that apply to using this website. Terms for engagements are separate and are agreed in writing per project.',
  intro: [
    'These terms cover **use of this website**. They are not the terms of any engagement with V4You Technologies — work we do for a client is governed by a separate written agreement covering scope, payment, intellectual property, confidentiality and liability, agreed before the work starts.',
    'That separation is deliberate. A website’s terms page is the wrong place to set commercial terms for a project, and no client should be expected to have accepted engagement terms by reading a page.',
  ],
  sections: [
    {
      heading: 'Using this site',
      body: [
        'You may read this site, share links to it, and quote from it with attribution. You may not copy it wholesale, scrape it at a volume that affects its availability for others, or attempt to gain access to systems or data you are not authorised to reach.',
      ],
    },
    {
      heading: 'What is on this site',
      body: [
        'We try to keep the content here accurate and current, and we have deliberately avoided publishing claims we cannot evidence. Even so, the pages describe general approaches rather than advice for your situation, and reading them is not a substitute for a conversation about your circumstances.',
        'Nothing on this site is a quotation, an offer, or a commitment to deliver anything. Where a page describes what drives the cost of work, that is an explanation of the variables and not a price.',
      ],
    },
    {
      heading: 'Content ownership',
      body: [
        'The text, design, code and diagrams on this site belong to V4You Technologies, except where they belong to someone else. Product and company names mentioned on this site are the trademarks of their respective owners; naming a technology we work with is not a claim of partnership, endorsement or certification.',
      ],
    },
    {
      heading: 'Enquiries you send us',
      body: [
        'When you submit the consultation form, we treat what you tell us as confidential and we do not share it outside the people who need it in order to reply. If you would like a formal non-disclosure agreement in place before discussing anything sensitive, say so on the form and we will arrange one before the conversation.',
        'Please do not send confidential material, credentials, or personal data about other people through the form. It is a starting point for a conversation, not a secure transfer channel.',
      ],
    },
    {
      heading: 'Links to other sites',
      body: [
        'Where we link to another organisation’s site, that is for reference. We do not control those sites and are not responsible for their content or their handling of your data.',
      ],
    },
    {
      heading: 'Availability',
      body: [
        'We aim to keep this site available and correct, but we do not guarantee that it will be uninterrupted or error-free. We may change or remove content without notice.',
      ],
    },
    {
      heading: 'Liability',
      body: [
        'This section limits what V4You Technologies is responsible for if something goes wrong as a result of using this website. It does not limit liability for anything that cannot lawfully be limited, such as fraud or death or personal injury caused by negligence.',
      ],
      needsDecision:
        'The limitation of liability position has to be set by a lawyer. What is written above is the shape of the clause, not the clause itself — the cap, the categories of excluded loss and the carve-outs all depend on where V4You is established, where its clients are, and what its insurance covers. This is the single clause on the site most worth an hour of professional review.',
    },
    {
      heading: 'Governing law',
      body: [
        'These terms are governed by the law of the jurisdiction in which V4You Technologies is established, and disputes will be handled by the courts of that jurisdiction.',
      ],
      needsDecision:
        'The governing law and the competent courts have to be named explicitly rather than described. This depends on where the legal entity is registered, and where the site’s visitors are expected to be — consumer protection rules in some jurisdictions override a choice of law.',
    },
    {
      heading: 'Changes to these terms',
      body: [
        'We may update these terms. The date at the top of the page shows when they last changed.',
      ],
    },
  ],
}
