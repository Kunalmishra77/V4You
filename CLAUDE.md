# CLAUDE.md — V4You Technologies Website

You are building the production website for **V4You Technologies**, an AI-first digital
transformation and product engineering company.

Read this file first. It is the contract for the whole project. The `docs/` folder holds
the detailed specifications; this file tells you how to work and what the rules are.

---

## Read order

Before writing any code, read in this order:

1. `CLAUDE.md` (this file)
2. `docs/01-design-system.md` — tokens, type, the signature device, contrast rules
3. `docs/02-architecture-and-stack.md` — stack, folder structure, conventions
4. `docs/03-content-model.md` — Payload collections and relationships
5. `docs/04-component-library.md` — the 28 blocks every page is built from
6. `docs/05-page-specs.md` — the 23 Phase 1 pages, section by section
7. `docs/07-build-backlog.md` — the ordered ticket list. Work through it in sequence.

`docs/06-seo-analytics-accessibility.md` and `docs/08-asset-checklist.md` are reference —
consult them when the backlog ticket calls for it.

---

## Project scope

**Phase 1 = 23 pages.** Core site plus all industry pages:

- Home, About, Contact, Book Consultation, Thank You, 404
- Services hub + 7 service pages
- Industries hub + 11 industry pages

Phases 2–5 (solutions, technologies, case studies, resources, calculators, assessment)
are out of scope for now but the data model and components must not preclude them.
Where a Phase 2+ concept appears in the schema, stub it — do not build the UI.

---

## Non-negotiable rules

These come from the client's content blueprint. Violating them is a build failure, not a
style disagreement.

### 1. Never invent proof
No fabricated metrics, client names, testimonials, awards, certifications, employee
counts, ROI figures, delivery timelines, or security attestations. If evidence is missing,
render a visibly labelled placeholder state — never a plausible-looking stand-in.
The client has real client logos and case studies; see `docs/08-asset-checklist.md`.
Use only what is in `assets/` and only where `permissionGranted` is true.

### 2. Every number carries its method
Any KPI rendered anywhere must state whether it is *measured, modelled, estimated, or
client-reported*. This is enforced as a required field in the CMS. Do not add a UI path
that can display a number without its method.

### 3. Amber is never text on light backgrounds
`#EDA11A` on `#F6F5F1` is 1.98:1. It fails WCAG badly. On light surfaces amber is a fill,
rule, or icon colour only. For amber-family text on light, use `#7A4F06` (6.53:1).
Full contrast matrix in `docs/01-design-system.md`.

### 4. Accessibility is a build requirement, not a pass at the end
Semantic HTML, visible focus, keyboard operation for every interactive component,
`prefers-reduced-motion` honoured, no information conveyed by colour alone, form errors
announced. Every component ships accessible or it does not ship.

### 5. No page gets bespoke layout code
Every page composes from the blocks in `docs/04-component-library.md`. If a page needs
something the library does not have, add it to the library first, then use it.

### 6. Minimal client JavaScript
Server Components by default. `'use client'` only where interaction genuinely requires it
(tabs, drawer, mega menu, drag rail, forms). Marketing pages should ship almost no JS.

### 7. Content lives in the CMS, not in JSX
No hardcoded copy in components. Everything renders from Payload. Seed data goes in
`src/seed/`, not inline.

---

## How to work

- **Follow the backlog in order.** `docs/07-build-backlog.md` is sequenced deliberately —
  tokens before components, components before pages, pages before SEO.
- **One ticket per commit.** Commit message: `[T-012] Build MegaMenu component`.
- **Ask before deviating.** If a spec seems wrong, say so and propose the alternative
  rather than silently choosing differently.
- **Stop at phase gates.** The backlog has three checkpoints. At each one, stop and
  summarise what shipped before continuing.
- **Verify as you go.** After each component: keyboard-walk it, check contrast, check it
  at 380px and 1440px.

---

## Definition of done for any component

- [ ] Renders from CMS data, no hardcoded copy
- [ ] TypeScript types derived from the Payload collection
- [ ] Documented empty state
- [ ] Keyboard operable, visible focus, correct ARIA
- [ ] Responsive 380px → 1920px
- [ ] Honours `prefers-reduced-motion`
- [ ] No contrast pair below 4.5:1 for body text, 3:1 for large text and UI borders

---

## Definition of done for any page

- [ ] Composed only from library blocks
- [ ] Unique `<title>` and meta description
- [ ] Canonical URL, Open Graph, JSON-LD as specified in `docs/06`
- [ ] Breadcrumbs where depth > 1
- [ ] One clear primary CTA and one relevant next step
- [ ] Every CTA has a working destination
- [ ] Lighthouse ≥ 95 across all four categories

---

## What to do when something is missing

The client has not supplied everything yet. When you hit a gap:

1. Check `docs/08-asset-checklist.md` — it lists what is expected and where it goes.
2. If absent, render the documented placeholder state for that component.
3. Add a line to `MISSING-ASSETS.md` at the repo root (create it if needed) naming the
   file, the component that needs it, and the page it blocks.

Do not guess. Do not fill the gap with something reasonable-looking.

---

## Tone of the copy you write

Where you draft microcopy (button labels, empty states, form help, error messages):

- Lead with the client's problem, not the technology
- Active voice, sentence case, plain verbs
- Say "can", "designed to", or "helps" unless a result is verified
- Explain technical terms at first use
- Errors state what happened and how to fix it — no apologising, no vagueness
- Never "cutting-edge", "revolutionary", "world-class", "seamless", "leverage"

Primary CTA wording is fixed across the site: **Book a transformation consultation**
