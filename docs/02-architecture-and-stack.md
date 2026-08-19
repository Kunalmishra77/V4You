# 02 — Architecture, Stack and Conventions

---

## 1. Stack

| Layer | Choice | Version | Why |
|---|---|---|---|
| Framework | Next.js, App Router | 15.x | SSR/ISR across 23→90 pages, RSC keeps client JS near zero |
| Language | TypeScript, `strict: true` | 5.x | — |
| Styling | Tailwind CSS | 4.x | Consumes CSS custom properties from the token layer |
| UI primitives | shadcn/ui (Radix) | latest | Accessible tabs, accordion, dialog, dropdown out of the box |
| Motion | `motion` (framer-motion) | 11.x | Scroll reveals only; diagram uses native SMIL |
| CMS | **Payload CMS** | 3.x | Runs inside the Next app — one repo, one deploy, self-hosted |
| Database | **PostgreSQL** | 16 | Relational graph powers automatic cross-linking |
| ORM | Drizzle (via Payload's Postgres adapter) | — | Do not add a second ORM |
| Forms | Server Actions + Zod | — | Progressive enhancement, validation shared client/server |
| Email | Resend | — | Transactional + confirmation |
| Spam | Cloudflare Turnstile + honeypot + Upstash rate limit | — | No maths captchas — they fail accessibility |
| Analytics | GA4 + PostHog behind a `track()` wrapper | — | See `docs/06` |
| Media | Cloudflare R2 via Payload storage adapter | — | AVIF/WebP through `next/image` |
| Hosting | Vercel | — | Native ISR + on-demand revalidation |

**Do not add** without asking: a component library beyond shadcn, a state manager, a CSS-in-JS
runtime, a second ORM, an animation library beyond `motion`, or a headless UI kit.

---

## 2. Folder structure

```
V4You/                             # repo root — renamed from v4you-website/
│                                  # at the client's request, 2026-08-18
├── CLAUDE.md
├── MISSING-ASSETS.md              # you create and maintain this
├── .env.example
├── .env.local                     # gitignored
├── next.config.ts
├── tailwind.config.ts
├── payload.config.ts
├── docs/                          # the specs — read-only reference
├── assets/                        # client-supplied source files
│   ├── brand/                     # logo SVG/PNG, favicon source
│   ├── clients/                   # client logos (permission-gated)
│   ├── team/                      # leadership photos
│   └── case-studies/              # screenshots, diagrams
└── src/
    ├── app/
    │   ├── (site)/                # public marketing routes
    │   │   ├── layout.tsx         # header, footer, skip link
    │   │   ├── page.tsx           # /
    │   │   ├── about/
    │   │   ├── contact/
    │   │   ├── book-consultation/
    │   │   ├── thank-you/
    │   │   ├── services/
    │   │   │   ├── page.tsx       # hub
    │   │   │   └── [slug]/        # 7 service pages
    │   │   ├── industries/
    │   │   │   ├── page.tsx       # hub
    │   │   │   └── [slug]/        # 11 industry pages
    │   │   ├── privacy-policy/  terms/  cookie-policy/
    │   │   ├── security/  accessibility/
    │   │   └── not-found.tsx
    │   ├── (payload)/admin/       # Payload admin UI
    │   ├── api/                   # route handlers (revalidate, forms webhook)
    │   ├── sitemap.ts
    │   ├── robots.ts
    │   └── globals.css            # token layer lives here
    ├── blocks/                    # CMS-driven layout blocks (see docs/04)
    ├── components/
    │   ├── layout/                # Header, MegaMenu, Drawer, Footer, StickyCTA
    │   ├── ui/                    # shadcn primitives
    │   └── shared/                # Button, Eyebrow, CutCard, SectionShell
    ├── collections/               # Payload collection configs (see docs/03)
    ├── globals/                   # Payload globals: Navigation, SiteSettings
    ├── lib/
    │   ├── analytics.ts           # the track() wrapper
    │   ├── seo.ts                 # metadata + JSON-LD builders
    │   ├── payload.ts             # typed local API client
    │   └── utils.ts
    ├── seed/                      # seed scripts — all copy lives here, not in JSX
    └── types/                     # generated from Payload
```

---

## 3. Rendering strategy

| Route type | Strategy | Revalidation |
|---|---|---|
| Home, About, hubs | Static + ISR | On-demand via Payload `afterChange` hook → `/api/revalidate` |
| `/services/[slug]`, `/industries/[slug]` | `generateStaticParams` + ISR | Same |
| Legal pages | Static | On publish |
| Contact / Book Consultation | Static shell, Server Action for submit | — |
| Payload admin | Dynamic | — |

Every collection with a `slug` gets an `afterChange` hook that calls
`revalidatePath()` for its own route and any hub that lists it.

---

## 4. Conventions

**Naming.** Components `PascalCase.tsx`. Blocks `PascalCase/index.tsx` with a colocated
`config.ts` for the Payload block definition. Utilities `camelCase.ts`. Collections
`camelCase.ts` matching the Payload slug.

**Server vs client.** Server Component is the default. `'use client'` is permitted only in:
`MegaMenu`, `MobileDrawer`, `CapabilityTabs`, `IndustryTabs`, `CaseStudyRail`,
`ConsultationForm`, `FAQAccordion`, `ScrollReveal`, `Header` (scroll state).
Anything else needs a stated reason.

**Types.** Run `payload generate:types` after every collection change. Import from
`src/types/payload-types.ts`. Never hand-write a type that Payload already generates.

**Styling.** Tailwind utilities against the token layer. No arbitrary hex values in JSX —
if you need a colour that is not a token, the token set is wrong; raise it.
No `!important`. Watch selector specificity on section padding — the classic failure is a
`.section` rule and an element rule cancelling each other out.

**Images.** `next/image` everywhere, explicit `width`/`height` or `fill` with a sized
parent. Descriptive `alt` on every content image; `alt=""` plus `aria-hidden` on
decorative ones. AVIF first, WebP fallback.

**Commits.** `[T-###] Short imperative summary`. One backlog ticket per commit.

---

## 5. Environment

See `.env.example`. Required before first run:

- `DATABASE_URI` — Postgres connection string
- `PAYLOAD_SECRET` — 32+ random chars
- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`
- `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
- `R2_*` storage credentials
- `REVALIDATE_SECRET`

Analytics and CRM keys are optional in development — the `track()` wrapper and CRM sync
both no-op cleanly when unset.

---

## 6. Performance budget

Enforced in CI. A page that breaches these does not merge.

| Metric | Target |
|---|---|
| LCP | < 2.0s (mobile, 4G throttle) |
| CLS | < 0.05 |
| INP | < 200ms |
| Client JS, marketing pages | < 90KB gzipped |
| Lighthouse Performance / A11y / Best Practices / SEO | ≥ 95 each |
| Total page weight, home | < 1.2MB |

Fonts subset and self-hosted. No third-party script loads before user interaction —
analytics included.
