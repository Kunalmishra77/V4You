# 07 — Build Backlog

Work these in order. One ticket per commit: `[T-###] Short imperative summary`.
Three phase gates — stop at each, summarise, wait for confirmation.

---

## Stage 1 — Foundations (T-001 → T-014)

| ID | Ticket | Done when |
|---|---|---|
| T-001 | Initialise Next.js 15 + TypeScript strict + Tailwind 4 | `pnpm dev` serves a blank page, no type errors |
| T-002 | Install and configure Payload 3 with the Postgres adapter | `/admin` loads, first user can be created |
| T-003 | Build the token layer in `globals.css` | Every token from `docs/01 §1` present as a CSS custom property |
| T-004 | Wire tokens into `tailwind.config.ts` | `bg-navy-900`, `text-amber-ink` etc. resolve |
| T-005 | Configure fonts via `next/font/google` | Schibsted Grotesk, Inter Tight, IBM Plex Mono loading with `swap` |
| T-006 | Implement the type scale as Tailwind utilities | All 9 scale steps from `docs/01 §3` available |
| T-007 | Build `Button` with all 4 variants + the two-corner clip | Renders `<a>` or `<button>` correctly; focus ring visible |
| T-008 | Build `Eyebrow` and `CutCard` primitives | 45° glyph and 22px notch match `docs/01 §2` |
| T-009 | Build `SectionShell` with all 5 canvas variants | Section padding applies once, no specificity conflict |
| T-010 | Build `ScrollReveal` | Reveals whole sections; returns children unwrapped under reduced motion |
| T-011 | Build `src/lib/analytics.ts` with the 20-event union | `track()` no-ops cleanly with no provider configured |
| T-012 | Build `src/lib/seo.ts` metadata + JSON-LD factories | Typed factories for every schema in `docs/06 §A2` |
| T-013 | Set up ESLint, Prettier, and a CI job running lint + typecheck + build | CI green on an empty PR |
| T-014 | Add `MISSING-ASSETS.md` and the logging helper components use | A component with no data can record what it needs |

---

## Stage 2 — Shell and navigation (T-015 → T-022)

| ID | Ticket | Done when |
|---|---|---|
| T-015 | `navigation` and `siteSettings` Payload globals | Editable in admin, typed |
| T-016 | `SiteHeader` with scroll state | 76→64px at 90px scroll; skip link is first focusable |
| T-017 | `MegaMenu` | Keyboard traversable, Escape closes, `aria-expanded` correct |
| T-018 | `MobileDrawer` | Focus trapped, returned on close, accordion groups work |
| T-019 | `SiteFooter` with feature-flag-aware columns | Flagged-off columns omitted, not empty |
| T-020 | `StickyMobileCTA` + body offset | No content obscured at 380px |
| T-021 | `Breadcrumbs` + `BreadcrumbList` JSON-LD | Valid in Google's Rich Results Test |
| T-022 | Root layout, `robots.ts`, `sitemap.ts` | Sitemap generates from published records |

> **⛔ PHASE GATE 1** — Stop. Summarise. A navigable shell should be clickable end to end.

---

## Stage 3 — Content model (T-023 → T-031)

| ID | Ticket | Done when |
|---|---|---|
| T-023 | `media` collection with sizes and required `alt` | Upload rejected without alt |
| T-024 | `services` collection incl. the `pricingModel` validator | "starting at" strings rejected |
| T-025 | `industries` collection incl. the uniqueness `beforeValidate` hook | Publish blocked below the thresholds in `docs/05` |
| T-026 | `clients`, `testimonials` with permission access control | Unpermitted records absent from the public API — verify by direct query |
| T-027 | `caseStudies` with the KPI array and `evidenceType` | Cannot save a KPI without a method |
| T-028 | `faqs`, `teamMembers`, `redirects` | — |
| T-029 | `leads` + `subscribers`, admin-only read | Public query returns nothing |
| T-030 | Schema-only stubs: `solutions`, `technologies`, `resources`, `jobs`, `assessmentRuns`, `calculatorRuns` | Collections exist, no public routes |
| T-031 | `pages` collection with the block library registered | Blocks selectable in admin |

---

## Stage 4 — Components (T-032 → T-050)

Build in this order — later ones depend on earlier ones.

| ID | Ticket |
|---|---|
| T-032 | `HeroPage` |
| T-033 | `HeroPrimary` + the orchestration diagram (spec: `docs/01 §6`) |
| T-034 | `CapabilityStrip` |
| T-035 | `TrustBar` with substitution fallback to `CapabilityStrip` |
| T-036 | `ProblemCards` |
| T-037 | `PillarCards` |
| T-038 | `ServiceCardGrid` |
| T-039 | `CapabilityTabs` (full ARIA tab pattern) |
| T-040 | `IndustryTabs` (tabs desktop, `<select>` mobile) |
| T-041 | `SolutionMatrix` |
| T-042 | `ProcessTimeline` |
| T-043 | `CaseStudyRail` with drag + keyboard parity |
| T-044 | `KpiTable` with `evidenceType` badges |
| T-045 | `MetricStrip` (gated — returns null without methods) |
| T-046 | `LogoMarquee` |
| T-047 | `TestimonialSlider` (omit-when-empty) |
| T-048 | `NumberedAccordion` + `FAQAccordion` + `FAQPage` JSON-LD |
| T-049 | `ArchitectureDiagram` with visible text summary |
| T-050 | `CTABand` |

> **⛔ PHASE GATE 2** — Stop. Summarise. Every component should exist in isolation with a
> documented empty state, keyboard-tested.

---

## Stage 5 — Forms and integrations (T-051 → T-057)

| ID | Ticket | Done when |
|---|---|---|
| T-051 | Zod schema shared client/server for the consultation form | One schema, two consumers |
| T-052 | `ConsultationForm` + Server Action | Works with JS disabled |
| T-053 | Turnstile + honeypot + Upstash rate limiting | Verified server-side, not just client |
| T-054 | Resend: internal notification + applicant confirmation | Both templates plain-text-safe |
| T-055 | CRM webhook with retry and `crmSyncStatus` tracking | Failure is recorded, never silent |
| T-056 | `/thank-you` with next-steps content, `noindex` | — |
| T-057 | `NewsletterSignup` + `WhatsAppButton` (conditional render) | Consent never pre-ticked |

---

## Stage 6 — Pages (T-058 → T-068)

| ID | Ticket |
|---|---|
| T-058 | Home — all 15 blocks per `docs/05 §1` |
| T-059 | Services hub |
| T-060 | Service page template + `StickyContextualNav` |
| T-061 | Seed all 7 services from `src/seed/` |
| T-062 | Industries hub |
| T-063 | Industry page template |
| T-064 | Seed all 11 industries |
| T-065 | About page |
| T-066 | Contact + `/book-consultation` |
| T-067 | Legal pages, `/security`, `/accessibility` (client copy required) |
| T-068 | `/404` |

---

## Stage 7 — Hardening (T-069 → T-078)

| ID | Ticket | Done when |
|---|---|---|
| T-069 | Full axe-core scan across all 23 routes | Zero violations |
| T-070 | Keyboard walkthrough of every route | No trap, no unreachable control |
| T-071 | Screen reader pass: home, one service, one industry, contact form | — |
| T-072 | Lighthouse ≥ 95 × 4 on all routes | Recorded in a results table |
| T-073 | Performance budget enforcement in CI | Budget breach fails the build |
| T-074 | Image pipeline audit — AVIF/WebP, sizes, lazy loading | No layout shift |
| T-075 | JSON-LD validation on every page type | Passes Rich Results Test |
| T-076 | On-demand revalidation from Payload hooks | Publishing updates the live route |
| T-077 | Redirect map + 404 handling | No broken internal link, verified by crawl |
| T-078 | Content quality gate audit against `docs/06 §A4` | Every published page passes |

> **⛔ PHASE GATE 3** — Stop. Full summary, Lighthouse table, and the current
> `MISSING-ASSETS.md` before any launch discussion.

---

## Working notes

- If a ticket is blocked on a missing client asset, log it in `MISSING-ASSETS.md`, build
  the documented empty state, and continue. Do not stall the sequence.
- If a spec appears wrong, say so and propose an alternative — do not silently deviate.
- Stage 4 is the longest. Consider a short summary after T-040 as an informal checkpoint.
