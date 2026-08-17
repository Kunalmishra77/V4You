# Missing assets and blocked work

Maintained by Claude Code per `CLAUDE.md`. Every entry names the missing item, the
component or ticket that needs it, and what it blocks. Nothing here is filled with a
plausible-looking substitute — each one degrades to a documented empty state instead.

Last updated: 2026-08-17

---

## Blocks the build

| Item | Needed by | Status |
|---|---|---|
| **PostgreSQL connection string** | T-002 (Payload), all of Stage 3, every page that reads CMS data | **Blocked.** A Postgres server is running on `localhost:5432` but no credentials or database were supplied. `DATABASE_URI` in `.env.local` is a placeholder. Payload will be configured in code; `/admin` cannot be verified until this lands. |

## Blocks a section, not the build

| Item | Needed by | Empty state in use |
|---|---|---|
| **Client logos** — `assets/clients/{slug}.svg` + `permissions.csv` | `TrustBar` (T-035), home §2 | Substitute: `CapabilityStrip` renders instead. No placeholder logos, ever. |
| **Case studies** — `assets/case-studies/{slug}/` with `kpis.csv` | `CaseStudyRail` (T-043), `KpiTable` (T-044), home §10 | Explain: a single card stating that studies publish on client approval. |
| **Testimonials** with `permissionGranted` | `TestimonialSlider` (T-047), home §13 | Omit: the section is not rendered at all. |
| **Verified outcome metrics** with a `method` and `evidenceType` | `MetricStrip` (T-045) | Omit: the component returns `null`. |
| **Leadership photos and bios** — `assets/team/` + `team.csv` | About page team grid (T-065) | Omit: replaced by a line directing to `/contact`. No avatar placeholders. |
| **Legal copy** — privacy policy, terms, cookie policy | T-067 | Not drafted. `docs/08 §6` forbids generating these. Pages will not be published without client-supplied text. |
| **Cal.com booking link** | `/book-consultation` (T-066) | Form-only variant renders. |

## Blocks a claim only

| Item | Needed before the claim can appear |
|---|---|
| **Certifications** — ISO 27001 / 9001, SOC 2 | No badge, no certification number, no claim anywhere on the site. |
| **Technology partnerships** — AWS / Microsoft / Google | `LogoMarquee` is labelled "Technologies we work with". It stays that way until a partnership document is filed in `assets/`. |
| **Compliance alignment** — HIPAA / GDPR / DPDP | `/security` describes practices only. No alignment language without a written description of the actual controls. |

## Company details still needed as plain text

These appear in structured data, so a placeholder produces incorrect markup rather
than a visual gap. All are currently absent.

- Legal entity name — footer, terms, `Organization` JSON-LD
- Registered address — footer, contact page
- Primary email — footer, contact, `ContactPoint` schema
- Phone with country code — contact page
- WhatsApp number — `WhatsAppButton` is hidden entirely without it
- LinkedIn and other social URLs — footer, `sameAs` in `Organization`
- Office locations and delivery hours — about, contact

## To confirm

| Item | Why it matters |
|---|---|
| **Original logo rasters** — `Logo.png`, `fevicon.png` | **Lost, please re-supply if held.** The client's two 2048px uploads were traced to vector successfully and then deleted in error on 2026-08-17 by an overly broad cleanup glob, before the repository existed to protect them. Nothing is blocked: every asset the site serves derives from the committed SVGs, which are a first-generation trace of those exact files. `assets/brand/source/` now holds reconstructions rendered back out of those vectors, so the pipeline runs from a clean checkout. If the originals still exist anywhere, drop them into `assets/brand/source/` and re-run `pnpm assets:vectorise && pnpm assets:brand`. See `assets/brand/source/README.md`. |
| **Production domain** | `og-default.png` and the site footer currently use `v4you.tech`, taken from `RESEND_FROM_EMAIL` in the client's own `.env.example`. Confirm before launch — it is baked into the OG card and every canonical URL. |

---

## Resolved

| Item | Resolution |
|---|---|
| **Vectorised logo files** — `docs/08 §1` listed the raster PNG as a critical blocker | Resolved 2026-08-17. `scripts/vectorise-logo.py` traces the supplied rasters to true vector outlines; `assets/brand/` now holds `logo-full.svg`, `logo-full-light.svg`, `logo-mark.svg`, `logo-mark-light.svg` and `favicon.svg`, all with transparent backgrounds and colours snapped to the `docs/01` tokens. `scripts/generate-brand-assets.mjs` derives every raster icon and the OG card from them. |
