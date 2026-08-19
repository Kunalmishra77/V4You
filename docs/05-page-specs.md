# 05 — Page Specifications (Phase 1: 23 pages)

Every page below lists its route, block sequence, primary CTA, and metadata. Blocks are
named exactly as in `docs/04`.

---

## 1. Home — `/`

**Meta title:** V4You Technologies — AI-First Digital Transformation Company
**Description:** V4You helps startups, SMEs and enterprises turn complex business problems
into intelligent products, connected workflows and measurable growth.
**Primary CTA:** Book a transformation consultation · **Secondary:** Explore what we do

| # | Block | Canvas | Content |
|---|---|---|---|
| 1 | `HeroPrimary` | navy | Eyebrow "AI-first digital transformation". H1 "Build what's next. Automate what slows you down." — *slows you down* in amber. Lede from blueprint §4.1. Orchestration diagram. |
| 2 | `TrustBar` → `CapabilityStrip` | navy-800 | Heading "Built for ambition. Designed for the real world." Logo wall if permitted logos exist; capability strip otherwise. |
| 3 | `ProblemCards` | bone | "Growth gets harder when your systems do not work together." Four cards: Disconnected systems / Manual operations / Slow decisions / Products that do not scale. CTA "Find your highest-value opportunity". |
| 4 | `StackedSlider` | navy | "One partner from opportunity to operating impact." Discover / Design / Engineer / Scale, one card at a time. Changed from `PillarCards` — the four are a sequence, and a four-up grid presents them as alternatives read in any order. |
| 5 | `ServiceCardGrid` | bone | "Choose the capability you need today." Six services. |
| 6 | `CapabilityTabs` | navy | "AI that works inside the business." Tabs: Agents, Voice, Knowledge, Automation, Analytics, Product intelligence. CTA "Assess your AI readiness" → disabled until Phase 4; links to `/contact` meanwhile. |
| 7 | `SolutionMatrix` | bone | "Start with the business problem." Six outcome rows from blueprint §4.7. |
| 8 | `IndustryTabs` | bone | "Technology shaped around how your industry operates." 11 industries. |
| 9 | `ProcessTimeline` | bone-2 | "The V4You delivery model." Six steps. |
| 10 | `CaseStudyRail` | navy | "Proof over promises." Featured studies. |
| 11 | `LogoMarquee` | bone | "The right technology for the job." Label: *Technologies we work with*. |
| 12 | `NumberedAccordion` | bone | "Built to earn confidence." Seven trust panels from blueprint §4.12. |
| 13 | `TestimonialSlider` | navy | Omitted if no permitted testimonials. |
| 14 | `FAQAccordion` | bone | 8 questions max. `FAQPage` JSON-LD. |
| 15 | `CTABand` | amber | "Tell us what you are trying to change." |

**JSON-LD:** `Organization`, `WebSite`, `FAQPage`

---

## 2. About — `/about`

Built from `pages` collection with blocks.

Sequence: `HeroPage` → mission/vision prose → story timeline → `PillarCards` (values) →
team grid (`teamMembers` where `isLeadership`) → `NumberedAccordion` (quality & security) →
global delivery → careers teaser → `CTABand`.

**Empty state:** if no team photos supplied, the team grid is omitted and a line
directing to `/contact` replaces it. Do not use avatar placeholders — an anonymous
leadership section undercuts the page's entire purpose.

**JSON-LD:** `Organization`, `AboutPage`

---

## 3. Services hub — `/services`

`HeroPage` → intro → `ServiceCardGrid` (all 7) → `ProcessTimeline` → `SolutionMatrix` →
`FAQAccordion` → `CTABand`

**Meta title:** Digital Transformation Services — V4You

---

## 4–10. Service pages — `/services/[slug]`

Seven pages, one template, driven by the `services` collection. Blueprint §5 sequence:

| # | Block | Source field |
|---|---|---|
| 1 | `HeroPage` | `hero` |
| 2 | Problem framing | `problemsSolved[]` |
| 3 | Capability modules (`CutCard` grid) | `capabilities[]` |
| 4 | Business benefits | `outcomeStatement` + prose |
| 5 | What we deliver | `deliverables[]` |
| 6 | `ProcessTimeline` | `process[]` |
| 7 | `LogoMarquee` + `ArchitectureDiagram` | technologies |
| 8 | `NumberedAccordion` | security & quality |
| 9 | Relevant industries | `→ industries[]` |
| 10 | `CaseStudyRail` | `→ caseStudies[]` |
| 11 | Pricing model prose | `pricingModel` |
| 12 | `FAQAccordion` | `→ faqs[]` |
| 13 | `CTABand` | — |

Also: `StickyContextualNav` — a sub-navigation that appears after the hero and tracks
scroll position through the sections above. Service pages are long; this is required.

**The seven:**

| Slug | H1 | Primary CTA | Meta title |
|---|---|---|---|
| `ai-automation` | Turn AI potential into operating advantage. | Assess your AI opportunity | AI Automation Services for Business |
| `software-development` | Build software that fits the business — not the other way around. | Start a software project | Custom Software Development Company |
| `website-development` | Websites engineered to load fast and convert. | Request a website consultation | Enterprise Website Development Services |
| `mobile-app-development` | Put your product where your users work. | Discuss your app | Mobile App Development Services |
| `digital-marketing` | Growth connected to product and data. | Request a growth audit | Performance Marketing and Growth Services |
| `cloud-devops` | Systems that stay up, stay visible, and stay ready. | Discuss cloud modernization | Cloud and DevOps Consulting Services |
| `consulting` | Decisions before code. | Book a discovery conversation | Technology Consulting and Transformation Strategy |

**Pricing section rule:** explains what drives cost (workflow complexity, integrations,
data readiness, model usage, security requirements, support) and lists engagement shapes
(paid discovery, fixed-scope pilot, milestone build, monthly optimisation, managed
engagement). **No figures.**

---

## 11. Industries hub — `/industries`

`HeroPage` → intro → industry card grid (11) → `SolutionMatrix` → `CaseStudyRail` →
`CTABand`

---

## 12–22. Industry pages — `/industries/[slug]`

Eleven pages, one template, driven by `industries`:

1. `HeroPage`
2. Industry context prose (`context`)
3. `ProblemCards` from `challenges[]`
4. Use cases grid from `useCases[]`
5. "Where we typically start" — 4-step reference flow from `whereWeStart[]`
6. Relevant services (`→ services[]`)
7. `ArchitectureDiagram` — a representative system for this industry
8. Regulatory notes (`regulatoryNotes`) — factual only, no compliance claims
9. `CaseStudyRail` filtered to this industry
10. `FAQAccordion`
11. `CTABand`

**The eleven:** healthcare, manufacturing, education, real-estate, retail, finance,
logistics, hospitality, government, startups, enterprise.

**Uniqueness requirement.** Each industry page must have its own `context`, at least 4
distinct `challenges`, at least 4 `useCases`, and at least 4 unique FAQs before it can be
set to published. Enforce as a Payload `beforeValidate` hook. This is the guard against
11 near-identical pages, which the blueprint explicitly forbids.

---

## 23. Contact — `/contact`

`HeroPage` → two-column: `ConsultationForm` left, contact details + what-happens-next
right → `WhatsAppButton` → office locations → `FAQAccordion` (about working together)

**Required microcopy** beside the form:
1. We reply within one business day.
2. First call is 30 minutes — we come with questions, not a pitch.
3. You leave with a suggested next step, even if it is not us.

Plus: "Your project details stay confidential." and "Need an NDA? Mention it in the form."

**JSON-LD:** `Organization` with `ContactPoint`

---

## Additional Phase 1 routes

| Route | Notes |
|---|---|
| `/book-consultation` | Focused conversion page. Form only, no navigation distractions. Cal.com embed if calendar is supplied; form-only otherwise. |
| `/thank-you` | Confirms what happens next, names the person who will reply if known, offers one relevant next read. `noindex`. |
| `/privacy-policy`, `/terms`, `/cookie-policy` | From `pages`. **Requires client-supplied legal copy** — do not draft these. |
| `/security` | `NumberedAccordion`. Describes practices precisely. **No certification claims** unless evidence is in `assets/`. |
| `/accessibility` | States the standard targeted (WCAG 2.2 AA), known limitations, and a contact route for issues. |
| `/404` | Search-oriented: top services, top industries, contact. Not a joke page. |

---

## Metadata rules

- Titles under ~60 characters where practical, one primary keyword, one clear promise
- Descriptions 150–160 characters, benefit-led
- Every page has a unique title and description — no templated duplicates
- `og:image` per page; falls back to `siteSettings.defaultSeo.ogImage`
- Canonical on every page
- `noindex` on `/thank-you` and any gated confirmation route
