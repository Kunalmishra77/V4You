# 08 — Asset Checklist

What the client supplies, where it goes, and what it blocks if missing.

Drop files into `assets/`. Claude Code reads from there and logs anything absent into
`MISSING-ASSETS.md` at the repo root.

---

## 1. Brand — `assets/brand/`

| File | Format | Blocks if missing |
|---|---|---|
| `logo-full.svg` | SVG, navy + amber on transparent | Header, footer |
| `logo-full-light.svg` | SVG, for navy backgrounds | Header (site header is navy) |
| `logo-mark.svg` | SVG, the "4" mark alone | Favicon, mobile header, OG image |
| `favicon.svg` + `favicon.png` (512px) | — | Browser tab |
| `og-default.png` | 1200 × 630 | Every page's social preview |

**Priority: critical.** Nothing ships without these. The supplied logo is currently a
raster PNG — it needs vectorising before build. A 2048px PNG will not scale cleanly to a
34px header mark or a print asset.

---

## 2. Client proof — `assets/clients/`

You confirmed you have publishable logos and case studies. For each client:

| Item | Format | Notes |
|---|---|---|
| `{client-slug}.svg` | SVG preferred, PNG with transparency acceptable | Monochrome version too if available |
| `permissions.csv` | — | See required columns below |

**`permissions.csv` columns — required:**
```
client_slug, client_name, logo_permitted (yes/no), case_study_permitted (yes/no),
testimonial_permitted (yes/no), granted_by, granted_date, evidence_location
```

Anything without `logo_permitted = yes` does not render. This maps directly to the
`logoUsagePermitted` field in `docs/03`.

**Priority: high.** Missing → `TrustBar` falls back to `CapabilityStrip`. The site still
works, but you lose your strongest differentiator against a generic agency site.

---

## 3. Case studies — `assets/case-studies/`

One folder per study: `assets/case-studies/{slug}/`

| Item | Notes |
|---|---|
| `content.md` | Challenge, success definition, approach, results |
| `kpis.csv` | `metric, before, after, change, method, evidence_type` |
| `screens/` | Product screenshots — must be cleared for publication |
| `architecture.svg` or `.png` | System diagram if shareable |

**`evidence_type` must be one of:** `measured`, `modelled`, `estimated`, `client-reported`.
The CMS will not accept a KPI without it. This is the field that keeps your numbers
defensible if a prospect asks where they came from.

**Priority: high.** Missing → `CaseStudyRail` renders its explanatory empty state.

---

## 4. Team — `assets/team/`

| Item | Format | Notes |
|---|---|---|
| `{name-slug}.jpg` | 800 × 800 min, consistent lighting and crop | Leadership at minimum |
| `team.csv` | `name, role, bio, linkedin, is_leadership, order` | — |

**Priority: high.** Your blueprint says a visible point of contact beats an anonymous
form, and it is right. Missing → the About team section is omitted entirely. No avatar
placeholders — an anonymous leadership section actively undercuts the page.

---

## 5. Company details — needed as plain text

| Item | Blocks if missing |
|---|---|
| Legal entity name | Footer, terms, Organization JSON-LD |
| Registered address | Footer, contact page, LocalBusiness data |
| Primary email | Footer, contact, ContactPoint schema |
| Phone (with country code) | Contact page |
| WhatsApp number | `WhatsAppButton` — component hidden entirely without it |
| LinkedIn and other social URLs | Footer, `sameAs` in Organization schema |
| Office locations / delivery hours | About, contact |

**Priority: critical.** These appear in structured data, so placeholders create
incorrect markup, not just visual gaps.

---

## 6. Legal copy — plain text or `.docx`

| Document | Notes |
|---|---|
| Privacy policy | Must reflect actual data handling, including form data and analytics |
| Terms of service | — |
| Cookie policy | Must match what actually loads |
| Refund policy | If applicable |

**Do not have Claude Code draft these.** Generated legal text that does not describe your
real practices is worse than no page — it is a stated commitment you are not keeping.
Have a lawyer review before publication.

---

## 7. Security and compliance — evidence required

| Claim | Evidence needed before it can appear |
|---|---|
| ISO 27001 / 9001 | Certificate scan + certificate number |
| SOC 2 | Report or attestation letter |
| HIPAA / GDPR / DPDP alignment | Written description of actual controls |
| Technology partnerships (AWS, Microsoft, Google) | Partner portal confirmation |

**No evidence, no claim.** The `/security` page describes practices you genuinely follow —
environments, access control, testing, monitoring, documentation, incident handling. That
is credible and honest. A certification badge you cannot produce on request is neither.

Technology logos on the site carry the label **"Technologies we work with"** — never
"Our partners" — unless a partnership document exists in `assets/`.

---

## 8. Integration credentials

| Service | Needed | Notes |
|---|---|---|
| PostgreSQL | Connection string | Neon or Supabase both fine |
| Resend | API key + verified sending domain | Domain verification takes ~24h — start early |
| Cloudflare Turnstile | Site key + secret | Free |
| Cloudflare R2 | Access key, secret, bucket, public URL | Media storage |
| CRM | API key + which CRM | HubSpot or Zoho — confirm what sales actually uses |
| Cal.com | Booking link + whose calendar | For `/book-consultation` |
| GA4 | Measurement ID | Optional in development |
| PostHog | Project key | Optional in development |

---

## Priority summary

**Blocks the build entirely:** vectorised logo files, company details, database
credentials.

**Blocks a section but not the build:** client logos, case studies, team photos, legal
copy, calendar link.

**Blocks a claim only:** certifications, partnership documentation.

Everything in the middle tier degrades to a documented empty state. The site will look
finished and honest without them — it will just be less persuasive than it could be, which
is the correct trade rather than the alternative.
