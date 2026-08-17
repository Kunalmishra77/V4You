# V4You Technologies — Website Implementation Package

This folder is the complete specification for building the V4You Technologies website.
It contains **no application code** — that is Claude Code's job. What it contains is
everything Claude Code needs in order to build the right thing.

---

## How to start

1. **Copy this whole folder** to where the project will live. It becomes the repo root.

2. **Drop your assets in.** Open `docs/08-asset-checklist.md` and fill `assets/` with what
   you have. Missing items are fine — they degrade to documented empty states.

3. **Copy the env file.**
   ```
   cp .env.example .env.local
   ```
   Fill in what you have. The rest can wait.

4. **Open Claude Code in this folder** and say:
   ```
   Read CLAUDE.md, then work through docs/07-build-backlog.md starting at T-001.
   Stop at Phase Gate 1.
   ```

5. **Review at each phase gate.** There are three. Do not skip them — they are where
   direction gets corrected cheaply.

---

## What's in here

| File | What it is |
|---|---|
| `CLAUDE.md` | The contract. Claude Code reads this first. Rules, scope, definitions of done. |
| `docs/01-design-system.md` | Colour tokens (sampled from your logo), type, the 45° signature device, contrast matrix |
| `docs/02-architecture-and-stack.md` | Stack, folder structure, conventions, performance budget |
| `docs/03-content-model.md` | 15 Payload collections + 2 globals, with relationships |
| `docs/04-component-library.md` | 28 components, each with props, empty state, a11y requirement |
| `docs/05-page-specs.md` | All 23 Phase 1 pages, block by block |
| `docs/06-seo-analytics-accessibility.md` | JSON-LD, the 20-event catalogue, WCAG 2.2 AA requirements |
| `docs/07-build-backlog.md` | 78 sequenced tickets across 7 stages, 3 phase gates |
| `docs/08-asset-checklist.md` | What you supply, where it goes, what it blocks |
| `assets/` | Your source files — logo, client logos, team photos, case studies |
| `.env.example` | Every environment variable the build needs |

---

## Scope

**Phase 1 — 23 pages:** home, about, contact, book consultation, thank you, 404, services
hub + 7 service pages, industries hub + 11 industry pages, plus legal and utility routes.

**Later phases** (solutions, technologies, case studies, resources, calculators, AI
readiness assessment) are out of scope but present in the data model as stubs, so nothing
built now has to be undone later.

---

## The three rules that matter most

1. **No invented proof.** No fabricated metrics, logos, testimonials, awards or
   certifications. Missing evidence gets a visibly labelled empty state.

2. **Every number carries its method.** Any KPI on the site states whether it is
   measured, modelled, estimated or client-reported. Enforced in the schema.

3. **Amber is never text on light backgrounds.** `#EDA11A` on `#F6F5F1` is 1.98:1 and
   fails accessibility. Use `#7A4F06` for amber-family text on light.

---

## Stack

Next.js 15 · TypeScript · Tailwind 4 · shadcn/ui · Payload CMS 3 · PostgreSQL · Resend ·
Cloudflare Turnstile + R2 · Vercel

Payload runs inside the Next.js app — one repo, one deployment, self-hosted data.

---

## Reference

Structural inspiration: appinventiv.com. Their information architecture is worth learning
from — the mega menu with a conversion panel, the industry tab switcher, the drag rail.
Their visual execution is not the target, and roughly 40% of their homepage rests on
client proof that must not be imitated.

Source of truth for content and positioning: your `v4you-technologies-website-blueprint.md`
(18 sections). Section references throughout these docs point back to it.
