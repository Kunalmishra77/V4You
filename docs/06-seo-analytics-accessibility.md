# 06 — SEO, Analytics and Accessibility

---

## Part A — SEO

### 1. Technical baseline

| Item | Implementation |
|---|---|
| Sitemap | `src/app/sitemap.ts` — generated from published records across all collections |
| Robots | `src/app/robots.ts` — allow all; disallow `/admin`, `/api`, `/thank-you` |
| Canonicals | Every page, absolute, from `NEXT_PUBLIC_SITE_URL` |
| Redirects | `redirects` collection → `next.config.ts` at build; 301 by default |
| Trailing slash | Off. Enforce consistently — mismatches create duplicate URLs. |
| Pagination | `rel="next"`/`rel="prev"` on any listing over one page |
| Hreflang | Not in Phase 1. Do not add stubs. |

### 2. JSON-LD by page type

| Page | Schema |
|---|---|
| Home | `Organization`, `WebSite` (with `SearchAction` once search exists), `FAQPage` |
| About | `Organization`, `AboutPage` |
| Service pages | `Service` with `provider`, `areaServed`, `serviceType`; `FAQPage`; `BreadcrumbList` |
| Industry pages | `WebPage`, `FAQPage`, `BreadcrumbList` |
| Contact | `Organization` with `ContactPoint` |
| Case studies (Ph 3) | `Article` + `BreadcrumbList` |
| Resources (Ph 3) | `Article`/`BlogPosting`, `Author`, `BreadcrumbList` |

Build these in `src/lib/seo.ts` as typed factories. Never hand-write JSON-LD in a page.

**Do not emit** `AggregateRating`, `Review`, or `Award` markup. There is no verified data
behind them, and fabricated structured data is both a policy violation and a manual-action
risk.

### 3. Internal linking

The relationship graph in `docs/03` drives this automatically:

- Service page → its related industries, solutions, technologies, case studies
- Industry page → its related services and case studies
- Every page → one contextual next step in `CTABand`
- Hub pages → all children; children → back to hub via breadcrumb

Target: no published page more than three clicks from home. No orphan pages.

### 4. Content quality gate

A page cannot be set to `published` unless:
- Unique title and description
- At least 4 unique FAQs (service and industry pages)
- At least 400 words of unique body content
- At least 3 outbound internal links
- Every claim traceable to a case study, methodology, or a contact conversation

Enforce the mechanical checks in a Payload `beforeValidate` hook. The judgement calls stay
with the content owner.

---

## Part B — Analytics

### 1. The wrapper

All tracking goes through one function in `src/lib/analytics.ts`:

```
track(eventName: EventName, props?: Record<string, string | number | boolean>): void
```

It pushes to `window.dataLayer` and forwards to PostHog when configured. It no-ops
silently when no provider is set. **No component imports GA4 or PostHog directly.**
Swapping providers must never touch component code.

### 2. Event catalogue

Exactly these 20 names. `EventName` is a TypeScript union — adding an event means adding
it to the union first.

```
hero_primary_cta_click        hero_secondary_cta_click
mega_menu_open                service_card_click
industry_card_click           solution_card_click
technology_page_view          case_study_view
case_study_cta_click          assessment_start
assessment_complete           calculator_start
calculator_complete           consultation_form_start
consultation_form_submit      calendar_booking
resource_download             newsletter_signup
whatsapp_click                search_used
```

Phase 4 events (assessment, calculator) are defined now and fire never — that is fine.

### 3. Standard properties

Attach to every event: `page_path`, `page_type`, `device`, and UTM parameters when present
on the session.

### 4. Consent

No analytics script loads before consent where consent is required. The cookie banner
gates the wrapper's initialisation, not just the cookie write.

### 5. Conversion metrics to report

Qualified consultation rate · form completion rate · consultation-to-discovery ·
discovery-to-proposal · proposal-to-win · industry and service mix · resource-assisted
conversions · time from first visit to conversion · returning visitor conversion ·
case-study-assisted conversion.

---

## Part C — Accessibility

Target: **WCAG 2.2 Level AA**.

### 1. Non-negotiables

- Semantic HTML. One `<h1>` per page, heading levels never skipped.
- Skip-to-content link as the first focusable element.
- Visible focus everywhere: 2px solid `#EDA11A`, 3px offset. Never `outline: none`
  without an equivalent replacement.
- Full keyboard operation for every interactive component. Test by unplugging the mouse.
- `prefers-reduced-motion: reduce` honoured globally — reveals become instant, diagram
  sparks removed from the DOM, marquee stops.
- No information conveyed by colour alone. Status uses an icon or text alongside colour.
- All content images have descriptive `alt`; decorative images have `alt=""` and
  `aria-hidden="true"`.
- Form errors announced via `aria-live`, linked with `aria-describedby`, and summarised at
  the top of the form with focus moved there on failed submit.
- Touch targets minimum 44 × 44px.
- Text resizes to 200% without loss of content or function.

### 2. Component-specific

| Component | Requirement |
|---|---|
| `MegaMenu` | `aria-expanded` on the trigger; Escape closes; never opens on focus alone |
| `MobileDrawer` | Focus trapped, `aria-modal`, focus returned on close, body scroll locked |
| `CapabilityTabs` / `IndustryTabs` | `role="tablist"`/`tab`/`tabpanel`, arrow keys, roving tabindex |
| `CaseStudyRail` | Keyboard scrollable; cards individually focusable. Drag is enhancement only. |
| `BeforeAfterSlider` | Also operable as a range input with arrow keys |
| `ArchitectureDiagram` | Nodes are `<button>`s; a visible text summary sits below the diagram |
| `LogoMarquee` | Duplicate track `aria-hidden`; pauses on hover and under reduced motion |
| `ComparisonTable` | Real `<table>` with `<th scope>`, not a div grid |

### 3. Testing

Per component, before it is considered done:
- axe-core clean (zero violations)
- Keyboard walkthrough
- Contrast check against the matrix in `docs/01`
- Rendered at 380px and 1440px

Before each phase gate:
- Full-page axe scan on every route
- Screen reader pass on home, one service page, one industry page, and the contact form
- Lighthouse ≥ 95 on Accessibility across all routes

### 4. The accessibility statement

`/accessibility` states the standard targeted, the date last reviewed, known limitations,
and a working contact route for reporting issues. It is a real commitment, not a badge —
do not claim conformance that has not been tested.
