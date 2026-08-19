# 04 — Component Library

28 components. Every page composes from these. Nothing gets bespoke layout code.

Each entry gives: what it does, its props/data source, its empty state, and its
accessibility requirement.

---

## A. Layout shell (7)

### 1. `SiteHeader`
Sticky. Transparent-to-solid is not used — the hero is navy, so the header is navy from
the start and gains a border plus shadow at 90px scroll. Height 76px → 64px on scroll.
- **Data:** `navigation` global
- **Client:** yes (scroll state)
- **A11y:** `<header>` + `<nav aria-label="Primary">`, skip-to-content link as first focusable element

### 2. `MegaMenu`
Six groups in three columns plus a featured conversion panel on the right. Opens on hover
and on click; closes on Escape, on `focusout`, and on route change.
- **Data:** `navigation.megaMenus[]`
- **A11y:** trigger is a `<button>` with `aria-expanded`. Full keyboard traversal. Never open on focus alone.

### 3. `MobileDrawer`
Full-screen, accordion groups, persistent CTA pinned at the bottom. Never a flat list of 50 links.
- **A11y:** `role="dialog"` `aria-modal="true"`, focus trapped, focus returned to the burger on close, body scroll locked

### 4. `SiteFooter`
Five columns: Company, Services, Solutions, Resources, Connect. Trust strip above the
legal line.
- **Empty state:** columns whose feature flag is off are omitted entirely, not rendered empty

### 5. `StickyMobileCTA`
Fixed bottom bar under 700px. Body gets bottom padding to compensate.

### 6. `Breadcrumbs`
Any route deeper than one level. Emits `BreadcrumbList` JSON-LD.

### 7. `SectionShell`
Wrapper enforcing section rhythm: canvas (`navy` | `navy-800` | `bone` | `bone-2` |
`white`), block padding, and max width. **Every section uses this.** It is what prevents
the padding-specificity bug described in `docs/02`.

---

## B. Hero (3)

### 8. `HeroPrimary` — home only
Two-column: copy left, orchestration diagram right. Collapses to stacked at 1000px.
- **Signature:** contains the 45°-rotated core square. Spec in `docs/01 §6`.
- **A11y:** one `role="img"` with a sentence-long `aria-label`. Sparks removed from DOM under reduced motion.

### 9. `HeroPage`
Eyebrow, H1, lede, up to two CTAs, optional breadcrumb. Used by every service and
industry page.
- **Data:** the collection's `hero` group

### 10. `HeroCaseStudy` — Phase 3
Adds at-a-glance strip: client, industry, scope, timeline, outcome.

---

## C. Proof (7)

### 11. `TrustBar`
Client logo wall.
- **Data:** `clients` where `logoUsagePermitted: true`
- **Empty state:** renders `CapabilityStrip` instead. Never an empty band, never placeholder logos.

### 12. `CapabilityStrip`
Four cells: Model / Method / Standard / Ownership. The honest substitute for a metric
strip when verified numbers do not exist. Ships in Phase 1 regardless.

### 13. `MetricStrip`
Large figures with labels. **Gated:** renders only when every metric has a `method` and an
`evidenceType`. If any is missing, the component returns `null` and logs to `MISSING-ASSETS.md`.
- No count-up animation — it implies live data the site does not have.

### 14. `LogoMarquee`
Horizontal scroll of technology ecosystem logos. Track duplicated once in the DOM,
animated with CSS `translate3d`.
- **Required label:** "Technologies we work with" — never "Our partners" unless a
  partnership is documented in `assets/`.
- **A11y:** `aria-hidden` on the duplicate track; pauses on hover and under reduced motion.

### 15. `TestimonialSlider`
- **Data:** `testimonials` where `permissionGranted: true`
- **Empty state:** section omitted entirely
- **A11y:** `<blockquote>` + `<cite>`, arrow-key navigation, no autoplay

### 16. `CaseStudyRail`
Drag-to-browse horizontal rail. Pointer events, scroll-snap, momentum.
- **Data:** `caseStudies` where `permissionStatus` in `granted | anonymised-only`
- **Empty state:** a single card explaining that studies publish on client approval
- **A11y:** the rail is also keyboard-scrollable and each card is a normal focusable link. Drag is an enhancement, never the only way through.

### 17. `KpiTable`
Metric / Before / After / Change / Method. Stacks to cards under 700px.
- **Required:** `evidenceType` badge on every row.

---

## D. Content (12)

### 18. `ProblemCards`
Four `CutCard`s with numbered eyebrows. Home §4.3.

### 19. `PillarCards`
Discover / Design / Engineer / Scale. Four cells, 1px gaps on a `line-dark` background so
the grid reads as one object.

### 19a. `StackedSlider`
The same four pillars as a stepped card stack: a vertical rail of numbered lines on the
left, one card at a time on the right, arriving out of a `perspective` container. Used on
home §4, where the order of the four is the point and a grid reads as four alternatives.
`PillarCards` remains the right block wherever the pillars are supporting detail.
- **A11y:** the ARIA tab pattern rotated vertical — real `tablist`/`tab`/`tabpanel`,
  `aria-orientation="vertical"`, Up/Down/Left/Right/Home/End, roving tabindex. The rail
  buttons carry their card's title, so each tab has an accessible name.
- **Contrast:** the panels behind the active card are empty and `aria-hidden`. Rendering
  real body copy faded back to suggest depth puts text well under 4.5:1.
- **Empty state:** renders nothing below the heading when `items` is empty.

### 20. `ServiceCardGrid`
3 × 2 on desktop. Each card: outcome headline, description, up to 4 capability chips, CTA.
- **Data:** `services`, ordered by `order`

### 21. `IndustryTabs`
Tabs on desktop, native `<select>` under 700px. Panel is two-column: body copy + a
"where we typically start" reference flow.
- **A11y:** proper `role="tablist"`/`tab`/`tabpanel`, `aria-selected`, arrow-key navigation, roving tabindex

### 22. `CapabilityTabs`
Same mechanics as `IndustryTabs`, used for the AI capability showcase. Panel right side is
a numbered reference flow with stage chips (TRIGGER / RAG / GATE / EXECUTE).

### 23. `SolutionMatrix`
Business outcome → relevant solutions. Home §4.7. Table on desktop, stacked cards on mobile.

### 24. `ProcessTimeline`
Six steps: Align, Architect, Build, Validate, Launch, Improve. Amber rule above each step.
Numbering is legitimate here — it is a real sequence.

### 25. `ArchitectureDiagram`
Interactive SVG for service and industry pages. Nodes are hoverable/focusable and reveal a
short description.
- **A11y:** each node is a `<button>` with a text alternative; the whole diagram has a text summary rendered visibly below it, not only for screen readers.

### 26. `BeforeAfterSlider`
Workflow comparison. Draggable divider.
- **A11y:** also operable as a range input with arrow keys.

### 27. `NumberedAccordion`
Used for trust/governance and the security page. `[1] [2] [3]` markers.
- **A11y:** shadcn Accordion primitive; do not hand-roll.

### 28. `FAQAccordion`
Emits `FAQPage` JSON-LD. Only for genuine FAQs — do not use it to bulk out thin pages.

### `ComparisonTable`
Responsive table → stacked cards under 760px. Real `<table>` markup with `<th scope>`,
not a div grid.

### `CutCard`
The base card primitive everything above uses. 22px clipped top-right corner, amber
triangle on hover, 1px border. Variants: `light` (white on bone), `dark` (navy-800 on navy).

---

## E. Conversion (6)

### 29. `CTABand`
Amber canvas, navy text and navy button — 7.72:1, the site's most confident element.
Appears once per page, near the end.

### 30. `ConsultationForm`
Fields: name*, work email*, phone, company, role, budget range, timeline, project brief,
services of interest, NDA requested, consent*.
- Server Action + Zod, shared schema client and server
- Turnstile + honeypot + rate limit
- **Must render** "what happens next" microcopy above the submit button — three steps,
  plus expected response time. The blueprint requires every form to explain what follows.
- **A11y:** every field labelled, errors linked with `aria-describedby`, error summary at
  the top of the form receiving focus on failed submit, `aria-live="polite"` on status

### 31. `InlineLeadForm`
Compact variant for embedding beside FAQs.

### 32. `NewsletterSignup`
Email + explicit consent checkbox. Consent is never pre-ticked.

### 33. `WhatsAppButton`
Renders only when `siteSettings.contact.whatsapp` is set.

### 34. `Calculator` / `AssessmentWizard` — Phase 4
Stubs only in Phase 1. When built: assumptions always visible, output always labelled an
estimate, never a guarantee.

---

## F. Utility

### `ScrollReveal`
IntersectionObserver wrapper. Reveals a whole section, never individual cards.
Returns children unwrapped under reduced motion.

### `Eyebrow`
Label + the 45° amber slash glyph. The slash is `aria-hidden`.

### `SwapLabel`
The masked label swap: on hover or focus the label leaves upward while an identical copy
arrives from below, both clipped by the span around them. Used by `Button`, the header
links and the mega menu. Takes a string only — duplicating arbitrary children is how a
page ends up with two of something focusable or two elements sharing an id. The copy is
`aria-hidden`, so the accessible name stays single.

### `Button`
Variants: `primary` (amber/navy), `ghost-light`, `ghost-dark`, `navy`. Two-corner clip.
Renders `<a>` when `href` is present, `<button>` otherwise — never a `<div>` with onClick.

---

## Empty-state policy

Three behaviours, chosen deliberately per component:

| Behaviour | Used by | Why |
|---|---|---|
| **Substitute** | `TrustBar` → `CapabilityStrip` | The section's job still needs doing |
| **Omit** | `TestimonialSlider`, `MetricStrip` | Better absent than hollow |
| **Explain** | `CaseStudyRail` | The absence is itself informative and honest |

Never: lorem ipsum, greyed-out fake logos, `—` in a metric slot without an explanation, or
a number with no method.
