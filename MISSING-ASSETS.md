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
| **Payload globals** — `navigation`, `siteSettings` | T-015 | **Partially blocked by the above.** The shape is defined in `src/types/content.ts` and the content in `src/seed/`, which is where docs/02 §2 puts all copy — so the shell renders and is reviewable now. What is outstanding is the Payload collection config and admin editability, which cannot be written or verified without the database. When it lands, `payload generate:types` replaces `src/types/content.ts` and only the two function bodies in `src/lib/content.ts` change. No component is affected. |

## Blocks a section, not the build

| Item | Needed by | Empty state in use |
|---|---|---|
| **Client logos** — `assets/clients/{slug}.svg` + `permissions.csv` | `TrustBar` (T-035), home §2 | Substitute: `CapabilityStrip` renders instead. No placeholder logos, ever. |
| **Case studies** — `assets/case-studies/{slug}/` with `kpis.csv` | `CaseStudyRail` (T-043), `KpiTable` (T-044), home §10 | Explain: a single card stating that studies publish on client approval. |
| **Testimonials** with `permissionGranted` | `TestimonialSlider` (T-047), home §13 | Omit: the section is not rendered at all. |
| **Verified outcome metrics** with a `method` and `evidenceType` | `MetricStrip` (T-045) | Omit: the component returns `null`. |
| **Leadership photos and bios** — `assets/team/` + `team.csv` | About page team grid (T-065) | Omit: replaced by a line directing to `/contact`. No avatar placeholders. |
| **Legal review** — privacy policy, terms, cookie policy | T-067 | **Drafted at the client's instruction**, against the advice in `docs/08 §6`, because no lawyer was available. Every factual statement about data handling was verified against the codebase rather than assumed — the audit established the public site sets no cookies, loads no analytics and self-hosts its fonts. Four items still need a decision nobody can read out of the code: legal entity and address, retention periods, limitation of liability, and governing law. The pages carry a visible draft banner and are `noindex` until `siteSettings.legal.approved` is ticked in the CMS. **Take the drafts to a lawyer for a review rather than a drafting job — that is an hour of their time instead of a day.** |
| **Cal.com booking link** | `/book-consultation` (T-066) | Form-only variant renders. |
| **Resend** — API key + verified sending domain | T-054, the consultation form | Form works. Both emails are composed and logged to the console in development instead of sent. Nobody is notified of a new lead, and the applicant gets no confirmation — the lead is still saved. Domain verification takes ~24h, so start it early. |
| **Cloudflare Turnstile** — site key + secret | T-053 | Spam check is skipped. Honeypot and rate limiting still apply. Deliberate: a missing secret is an infrastructure gap, and refusing every enquiry until someone notices is worse than accepting a few. |
| **Upstash Redis** — REST URL + token | T-053 | Rate limiting is skipped, same reasoning as above. |
| **CRM** — provider, API key, webhook URL | T-055 | Every lead sits at `crmSyncStatus: pending`, which is distinct from `failed`. There is a difference between "the CRM refused this" and "there is no CRM yet". Confirm which CRM sales actually uses. |

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
| **Response time commitment** — "We reply within one business day" | This is on the consultation form, in the confirmation email, and on /thank-you, because docs/05 §23 lists it as required microcopy. It is also an operational promise, and blueprint §13.3 marks the response window as needing verification. **Confirm you can keep it**, or tell me the real figure and I will change all three places. A promise the site makes and the business misses costs more than a slower promise kept. |
| **Production domain** | `og-default.png` and the site footer currently use `v4you.tech`, taken from `RESEND_FROM_EMAIL` in the client's own `.env.example`. Confirm before launch — it is baked into the OG card and every canonical URL. |

---

## Resolved

| Item | Resolution |
|---|---|
| **Vectorised logo files** — `docs/08 §1` listed the raster PNG as a critical blocker | Resolved 2026-08-17. `scripts/vectorise-logo.py` traces the supplied rasters to true vector outlines; `assets/brand/` now holds `logo-full.svg`, `logo-full-light.svg`, `logo-mark.svg`, `logo-mark-light.svg` and `favicon.svg`, all with transparent backgrounds and colours snapped to the `docs/01` tokens. `scripts/generate-brand-assets.mjs` derives every raster icon and the OG card from them. |

---

## Logged automatically by components

Written by `reportMissingAsset()` when a component renders its empty state.
Entries are appended, never removed — delete a row once the asset lands.

<!-- BEGIN:auto-logged -->

| Component | Needs | Blocks |
|---|---|---|
| `TrustBar` | clients with logoUsagePermitted: true, plus assets/clients/permissions.csv | home §2 — substituting CapabilityStrip |
| `MetricStrip` | method and evidenceType on: Placeholder with no method attached | the metric strip is omitted entirely — a number without a method does not publish |
| `ContactPage` | siteSettings.contact — email, phone, address, legal entity name | the contact details column and the ContactPoint JSON-LD; the form is the only route in |
| `AboutPage — leadership grid` | teamMembers with isLeadership, plus assets/team/{name}.jpg and team.csv | the leadership section is omitted entirely — no avatar placeholders (docs/05 §2) |
| `AboutPage — story timeline` | founding year and origin, the first capability, and expansion milestones (blueprint §10) | the story section renders a visibly labelled placeholder and must not go live as is |
| `BookConsultationPage` | NEXT_PUBLIC_CAL_LINK — a Cal.com booking link and whose calendar it points at | the calendar embed; the form-only variant renders instead |
<!-- END:auto-logged -->
