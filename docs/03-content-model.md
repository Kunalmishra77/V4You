# 03 — Content Model (Payload CMS)

15 collections, 2 globals. The relationships matter as much as the fields — they generate
cross-linking automatically instead of editors maintaining it by hand.

Legend: `→` = relationship, `[]` = array/hasMany, `*` = required.

---

## 1. Core content collections

### `pages`
Generic composable page. Used for About, legal pages, and anything not covered by a
typed collection.
```
slug*            text, unique, indexed
title*           text
layout*          blocks[]        # from the block library, docs/04
seo              group  { title, description, ogImage, noIndex }
status*          select  draft | published
publishedAt      date
```

### `services` — 7 records in Phase 1
```
slug*            text, unique
title*           text
navLabel*        text            # shorter label for menus
hero*            group  { eyebrow, headline, body, primaryCta, secondaryCta }
outcomeStatement* textarea       # the one-line promise
problemsSolved*  array  { title, description }
capabilities*    array  { title, description, icon }
deliverables*    array  { item }
process*         array  { step, title, description }
pricingModel*    richText        # never a "starting at" figure — see rule below
faqs             → faqs[]
→ industries[]   relationship, hasMany
→ solutions[]    relationship, hasMany   # Phase 2, field exists now
→ technologies[] relationship, hasMany   # Phase 3, field exists now
→ caseStudies[]  relationship, hasMany
seo              group
order            number          # hub display order
```
**Validation:** `pricingModel` rejects any string matching `/starting at|from ₹|from \$/i`.
The blueprint forbids price anchoring before scope is known.

### `industries` — 11 records in Phase 1
```
slug*            text, unique
title*           text
hero*            group  { eyebrow, headline, body }
context*         textarea        # how this industry actually operates
challenges*      array  { title, description }
useCases*        array  { title, description, outcome }
whereWeStart*    array  { step, label, tag }   # the 4-step reference flow
regulatoryNotes  richText        # HIPAA/DPDP etc. — factual only, no compliance claims
→ services[]     relationship, hasMany
→ solutions[]    relationship, hasMany
→ caseStudies[]  relationship, hasMany
seo              group
order            number
```

### `solutions` — Phase 2, schema only
```
slug*, title*, hero, modules[], architecture, integrations[],
→ services[], → industries[], → technologies[], seo, order
```

### `technologies` — Phase 3, schema only
```
slug*, title*, group (ai|cloud|web|mobile|data|agentic),
whatItIs*, whenToUse*, whenNotToUse*, referenceArchitecture,
tradeoffs[], securityNotes, → services[], → industries[], seo
```
**Validation:** `whenNotToUse` is required. A technology page that cannot say when the
technology is wrong is a keyword page, and the blueprint forbids those.

### `caseStudies`
```
slug*            text, unique
client           → clients
clientDisplayName* text          # may be "Anonymised — logistics, India"
industry*        → industries
geography        text
engagementType   select
permissionStatus* select  granted | pending | anonymised-only | refused
confidentialityLabel text        # shown when permissionStatus = anonymised-only
challenge*       richText
successDefinition* richText      # KPIs agreed before delivery
approach*        richText
architecture     group { diagram: → media, description }
kpis*            array {
                   metric*        text
                   before*        text
                   after*         text
                   change*        text
                   method*        text
                   evidenceType*  select  measured | modelled | estimated | client-reported
                 }
testimonial      → testimonials
→ services[], → technologies[]
seo, featured    checkbox
```
**Access control:** records with `permissionStatus` of `pending` or `refused` are never
returned by the public API. Enforce in the collection's `read` access function, not in
the query.

### `resources` — Phase 3, schema only
```
slug*, title*, type (blog|whitepaper|guide|ebook|report|template|checklist|webinar|video|podcast),
excerpt*, body, gated (checkbox), heroImage, readingTime,
→ author, → categories[], → relatedServices[], publishedAt, seo
```

---

## 2. Supporting collections

### `clients`
```
name*                text
logo*                → media       # SVG preferred
logoUsagePermitted*  checkbox, default false
permissionEvidence   text          # who granted it, when, where it's filed
displayOrder         number
```
**Rule:** the logo wall query filters on `logoUsagePermitted: true`. There is no UI path
that renders an unpermitted logo.

### `testimonials`
```
quote*, authorName*, authorRole*, company*,
authorPhoto → media,
permissionGranted* checkbox, default false
→ caseStudy, featured
```
Same access rule as clients.

### `teamMembers`
```
name*, role*, bio, photo → media, linkedin, order, isLeadership checkbox
```

### `faqs`
```
question*, answer* richText,
scope* select  global | service | industry | solution | technology
attachTo         relationship (polymorphic), hasMany
order
```

### `jobs` — Phase 4, schema only
```
title*, department, location, employmentType, description, status, postedAt
```

### `media`
```
file*, alt*, caption, credit
imageSizes: thumb 400 | card 800 | hero 1600 | og 1200x630
formats: avif, webp
```
`alt` is required at upload. No exceptions — a decorative image gets `alt: ""` explicitly.

### `redirects`
```
from*, to*, type select 301 | 302
```

---

## 3. Lead and conversion collections

### `leads`
```
name*, email*, phone, company, role,
budgetRange   select  evaluating | <5L | 5-25L | 25L-1Cr | >1Cr
timeline      select  now | 1-3mo | 3-6mo | exploring
projectBrief  textarea
servicesInterested → services[]
ndaRequested  checkbox
source*       text          # page path
utm           group { source, medium, campaign, term, content }
consentAt*    date
crmSyncStatus select  pending | synced | failed
crmRecordId   text
createdAt
```
**Access:** admin-only read. Never exposed on any public endpoint.

### `subscribers`
```
email*, consentAt*, source, status (active|unsubscribed), unsubscribeToken*
```

### `assessmentRuns` / `calculatorRuns` — Phase 4, schema only
```
assessmentRuns:  answers[], scores, maturityBand, recommendations[], → lead, completedAt
calculatorRuns:  calculatorType, inputs, assumptions, outputs, → lead, createdAt
```

---

## 4. Globals

### `navigation`
```
utilityBar      group { enabled, message, email, whatsapp }
megaMenus       array {
                  label*, href,
                  groups[] { heading*, supportingCopy, links[] { label*, href* } },
                  featuredPanel { eyebrow, heading, body, ctaLabel, ctaHref }
                }
footerColumns   array { heading*, links[] { label*, href* } }
stickyCta       group { label, href, showOnMobile }
```

### `siteSettings`
```
brand           group { logo, logoMark, favicon }
contact         group { email*, phone, whatsapp, addressLines[], legalEntityName* }
socials         array { platform, url }
defaultSeo      group { titleTemplate, description, ogImage }
featureFlags    group { showCaseStudies, showResources, showCareers, showAssessment }
```
Feature flags let Phase 2+ sections stay dark in production without a code change.

---

## 5. Two schema decisions worth understanding

**Permission booleans are the quality gate.** `logoUsagePermitted`, `permissionGranted`
and `permissionStatus` mean nothing publishes without explicit sign-off. The blueprint's
pre-launch checklist becomes a database constraint instead of a checklist someone forgets
the week of launch.

**`evidenceType` on every KPI.** Every number the site displays is labelled *measured,
modelled, estimated, or client-reported*. There is deliberately no way to render a metric
without one. This is the single most important field in the schema for a company whose
positioning is "evidence-led".
