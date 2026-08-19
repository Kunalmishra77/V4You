# 10 — Asset specification

**One document for the designer.** Every image, video and graphic the site
needs — now and across every future phase: where it goes, what it must show,
exact dimensions, format, file size, and what is standing in for it today.

The full sitemap in `blueprint §2.1` is **102 routes** across four phases.
Phase 1 (23 routes) is built. Everything else is specified here so the visual
system is decided once rather than reinvented per phase.

Deliver files exactly as named, into the folder given in each row. Anything
under `public/` is picked up with no code change.

---

## 0. Read this before producing anything

### The one rule

**No asset may assert a fact V4You cannot evidence.**

This is the project's first rule, not a style preference, and it has already
removed content from this site repeatedly.

| Fine | Not allowed |
|---|---|
| V4You's own office, team, workspace | Stock people implying they are the team |
| Abstract data as light, texture, flow | **Any readable number, chart, metric or KPI** |
| Screens with illegible or blurred UI | A product screen presented as V4You's work |
| Generic modern environments | A client's office, branding or logo without written permission |
| Diagrams of how a system works | A dashboard that looks like a real client's |

If an asset would make a viewer believe something specific about V4You's
clients, results, size, awards or certifications, it cannot ship until there is
evidence behind it.

### House style

From `docs/01`:

| | |
|---|---|
| Navy | `#0A1D3E` — primary dark canvas |
| Navy elevated | `#12294F` |
| Amber | `#EDA11A` — the accent, used sparingly |
| Bone | `#F6F5F1` — light canvas, warm not white |
| Slate | `#5B6B85` on light, `#93A4BF` on dark |
| Geometry | **45° diagonals. Square corners — radius is 0 everywhere.** |
| Type | Schibsted Grotesk (display), Inter Tight (body), IBM Plex Mono (labels) |
| Mood | Composed, cool, low-key. Not glossy, not neon, not playful. |

**Never** round a corner. **Never** use purple/cyan "AI" gradients. **Never**
show robots, humanoid AI, glowing brains, circuit-board motifs or
neural-network diagrams — `blueprint §15.1` rules these out by name.

### Formats, sizes and delivery

- **Photography** — JPEG (quality 80) *and* WebP. Deliver both.
- **Illustration / diagram / icon** — SVG, outlined text, no external fonts.
- **Video** — MP4 (H.264), audio stripped, plus one JPEG poster frame.
- **Colour** — sRGB. Not Adobe RGB; it shifts in browsers.
- **Naming** — exactly the filename in each row, lowercase, hyphenated.
- **Source files** — deliver layered originals for anything composited.
- **Alt text** — one line per photograph, describing what it shows and why.

`pnpm audit:images` enforces a **250 KB ceiling** on anything in `public/`. An
oversized file fails the build rather than quietly slowing the site.

### Priority key

| | |
|---|---|
| **P1** | Blocks launch or replaces a visible placeholder |
| **P2** | Materially improves a page that already works |
| **P3** | Needed when that phase is built |

---

# PHASE 1 — live now (23 routes)

## 1.1 Hero video

Highest-impact single asset. **Full brief with generation prompts, negative
prompts, rejection checklist and compression commands:
`docs/09-hero-video-brief.md`.**

| | |
|---|---|
| **ID** | `HERO-01` · **P1** |
| **Where** | Home, hero background, full bleed behind the headline |
| **File** | `public/hero.mp4` + `public/hero-poster.jpg` |
| **Size** | 1920 × 1080, 16:9 · 8–12s seamless loop |
| **Format** | MP4 H.264, **audio removed**, `+faststart` |
| **Max** | **3 MB** video · 250 KB poster |

**Composition:** the headline sits over the **left 40%**. Keep it dark and
empty; all interest in the right half.

**Currently:** an abstract SVG field stands in — a legitimate permanent answer.

## 1.2 Photography

All photography must be **V4You's own**: your space, your people, your work.
Stock people are ruled out — a stock office photo on an About page implies it
is this company's office.

| ID | Where | File | Size | Max | Priority |
|---|---|---|---|---|---|
| `PH-01` | Home — "Growth gets harder…" right column | `public/photos/team-working.jpg` | 1600 × 1200 (4:3) | 220 KB | **P1** |
| `PH-02` | About — leadership grid | `public/photos/team/{name}.jpg` | **800 × 800** each | 120 KB | **P1** |
| `PH-03` | About — "Working together" | `public/photos/workspace.jpg` | 1600 × 900 (16:9) | 200 KB | P2 |
| `PH-04` | Service page headers (**7**) | `public/photos/services/{slug}.jpg` | 1600 × 700 | 200 KB | P2 |
| `PH-05` | Industry page headers (**11**) | `public/photos/industries/{slug}.jpg` | 1600 × 700 | 200 KB | P3 |
| `PH-06` | Contact — office / reception | `public/photos/office.jpg` | 1600 × 900 | 200 KB | P3 |

**`PH-01`** — a genuine working session: whiteboard, screens, two to four
people mid-discussion. Candid, natural light. No legible screens, no client
names on the whiteboard, nobody looking at the lens.

**`PH-02`** — consistent lighting, background and crop across **every** person.
Head and shoulders, neutral or navy backdrop. Mixed styles look worse than no
photographs, which is why the section is currently omitted rather than
half-filled. Also needs `assets/team/team.csv`
(`name, role, bio, linkedin, is_leadership, order`).

**`PH-04` service slugs:** `ai-automation`, `software-development`,
`website-development`, `mobile-app-development`, `digital-marketing`,
`cloud-devops`, `consulting`. Shoot as one set, one session, one treatment —
they are seen together. No literal metaphors (robot for AI, padlock for
security, rocket for growth).

**`PH-05` industry slugs:** `healthcare`, `manufacturing`, `education`,
`real-estate`, `retail`, `finance`, `logistics`, `hospitality`, `government`,
`startups`, `enterprise`. Generic environments only — nothing identifying a
real organisation. **Healthcare especially:** no patients, no records, no
screens with personal data however blurred.

## 1.3 Illustration

| ID | What | Count | File | Size | Priority |
|---|---|---|---|---|---|
| `IL-01` | Service capability icons | **28** (7 × 4) | `public/icons/services/{slug}/{capability}.svg` | 48 × 48, 2px stroke | P2 |
| `IL-02` | Section accent figures | 5 | `public/figures/{name}.svg` | ~320 × 320 | P2 |
| `IL-03` | Service architecture diagrams | 7 | `public/diagrams/services/{slug}.svg` | 1200 × 700 | P3 |
| `IL-04` | Industry architecture diagrams | 11 | `public/diagrams/industries/{slug}.svg` | 1200 × 700 | P3 |

**`IL-01`** — line only, single colour via `currentColor`, square caps,
**square corners**. Consistent stroke weight across all 28; they sit side by
side. Not filled, not rounded, not multi-colour.

**`IL-02` names:** `grid`, `flow`, `layers`, `signal`, `converge`. Must use
`currentColor` — they appear on navy, bone and amber canvases.

**`IL-03` / `IL-04`** — the site already generates these in code and they work.
A designer version is an upgrade, not a gap.

---

# PHASE 2 — Solutions (12 routes)

Eleven solution pages: AI CRM, hospital management, ERP, HRMS, inventory,
warehouse, ecommerce, LMS, custom software, internal portals, business
automation.

| ID | What | Count | File | Size | Priority |
|---|---|---|---|---|---|
| `SOL-01` | Solution page headers | 11 | `public/photos/solutions/{slug}.jpg` | 1600 × 700 | P3 |
| `SOL-02` | Module icons (shared set) | ~40 | `public/icons/modules/{name}.svg` | 48 × 48 | P3 |
| `SOL-03` | Solution architecture diagrams | 11 | `public/diagrams/solutions/{slug}.svg` | 1200 × 700 | P3 |
| `SOL-04` | Solution OG cards | 11 | `public/og/solutions/{slug}.png` | 1200 × 630 | P3 |

**`SOL-02`** — one shared set covering the modules named in `blueprint §7`:
lead capture, scoring, routing, pipeline, forecasting, registration,
appointments, billing, pharmacy, lab, inventory, procurement, payroll,
attendance, picking, packing, dispatch, catalogue, checkout, fulfilment,
courses, assessments, approvals, notifications, audit trails and similar.
Build the set, not eleven bespoke sets — most modules recur across solutions.

**`SOL-01`** — abstract or environmental, matching `PH-04`'s treatment.
**Never a fabricated product screenshot.** A "screenshot" of an ERP V4You has
not built for a named client is invented proof.

---

# PHASE 3 — Technologies, case studies, resources (≈40+ routes)

## 3.1 Technologies (18 routes)

Seventeen technology pages: OpenAI, Claude, Gemini, AWS, Azure, Google Cloud,
Node.js, React, Next.js, Flutter, Python, LangChain, vector databases, RAG,
prompt engineering, MCP, agentic AI.

| ID | What | Count | File | Size | Priority |
|---|---|---|---|---|---|
| `TEC-01` | Reference architecture diagrams | 17 | `public/diagrams/technologies/{slug}.svg` | 1200 × 700 | P3 |
| `TEC-02` | Technology page OG cards | 17 | `public/og/technologies/{slug}.png` | 1200 × 630 | P3 |

**No vendor logos.** `docs/08 §7` and `docs/04 §14` are explicit: a technology
logo is a trademark, and using it implies a partnership V4You does not have.
The site uses **wordmarks set in Schibsted Grotesk**, under the fixed label
"Technologies we work with" — never "our partners". Do not source vendor logo
files.

## 3.2 Case studies — permission-gated

Per published study. Counts depend on how many are cleared.

| ID | What | Per study | File | Size | Priority |
|---|---|---|---|---|---|
| `CS-01` | Case study hero | 1 | `assets/case-studies/{slug}/hero.jpg` | 1600 × 900 | P3 |
| `CS-02` | Product screenshots | 3–6 | `assets/case-studies/{slug}/screens/*.png` | 1440 wide | P3 |
| `CS-03` | Architecture diagram | 1 | `assets/case-studies/{slug}/architecture.svg` | 1200 × 700 | P3 |
| `CS-04` | Client logo | 1 | `assets/clients/{slug}.svg` | vector | P3 |
| `CS-05` | Testimonial portrait | 1 | `assets/testimonials/{name}.jpg` | 400 × 400 | P3 |
| `CS-06` | Case study OG card | 1 | `public/og/case-studies/{slug}.png` | 1200 × 630 | P3 |

**Every one of these is blocked on written permission, not on design.**
`CS-02` screenshots must be of real delivered work, cleared for publication.
Numbers visible in a screenshot must be real or redacted — a mocked-up
dashboard with invented figures is the exact failure the first rule exists to
prevent.

## 3.3 Resources (12 routes, then per item)

Eleven resource types in `blueprint §11`: blogs, whitepapers, ebooks, guides,
AI reports, templates, checklists, webinars, videos, podcasts, downloads.

| ID | What | Count | File | Size | Priority |
|---|---|---|---|---|---|
| `RES-01` | Blog / article card images | per post | `public/resources/{slug}/card.jpg` | 1200 × 675 (16:9) | P3 |
| `RES-02` | Gated asset covers | per asset | `public/resources/{slug}/cover.jpg` | 1240 × 1754 (A4 portrait) | P3 |
| `RES-03` | Video thumbnails | per video | `public/resources/{slug}/thumb.jpg` | 1280 × 720 | P3 |
| `RES-04` | Podcast cover art | 1 | `public/resources/podcast-cover.jpg` | **3000 × 3000 square** | P3 |
| `RES-05` | Webinar stills | per webinar | `public/resources/{slug}/still.jpg` | 1600 × 900 | P3 |
| `RES-06` | Resource type icons | 11 | `public/icons/resources/{type}.svg` | 48 × 48 | P3 |
| `RES-07` | Resource OG cards | per item | `public/og/resources/{slug}.png` | 1200 × 630 | P3 |

**`RES-02`** — whitepaper and ebook covers are the asset a visitor trades an
email address for, so they carry real weight. Navy cover, title in Schibsted
Grotesk, one amber rule, the mark. **3000 × 3000** for `RES-04` is the podcast
platform requirement (Apple/Spotify), not a preference.

---

# PHASE 4 — Careers, calculators, assessment (≈8 routes)

| ID | What | Count | File | Size | Priority |
|---|---|---|---|---|---|
| `CAR-01` | Careers hero | 1 | `public/photos/careers/hero.jpg` | 1600 × 900 | P3 |
| `CAR-02` | Culture / office candids | 6–8 | `public/photos/careers/{n}.jpg` | 1200 × 900 | P3 |
| `CAR-03` | Hiring process diagram | 1 | `public/diagrams/hiring-process.svg` | 1200 × 500 | P3 |
| `CAL-01` | Calculator explainer diagrams | 3 | `public/diagrams/calculators/{name}.svg` | 1000 × 600 | P3 |
| `ASM-01` | Assessment maturity-band graphic | 1 | `public/diagrams/maturity-bands.svg` | 1200 × 400 | P3 |

**`CAR-02`** — real people at V4You, genuinely at work. This is the section
where stock imagery is most tempting and most damaging: a candidate who
recognises a stock photo on a careers page stops believing the rest of it.

**`CAL-01` / `ASM-01`** — must never show an output that looks like a
guaranteed figure. `docs/04 §34`: the result is labelled an estimate, always,
with assumptions visible.

---

# CROSS-CUTTING

## Social cards

| ID | What | Count | File | Size | Priority |
|---|---|---|---|---|---|
| `SO-01` | Default OG card | 1 | `public/og-default.png` | 1200 × 630 | **done** |
| `SO-02` | Phase 1 per-page OG | 23 | `public/og/{route}.png` | 1200 × 630 | P3 |
| `SO-03` | Full-sitemap per-page OG | ~102 total | `public/og/{route}.png` | 1200 × 630 | P3 |

Title in Schibsted Grotesk Bold, bone on navy, the mark, one amber rule. Text
large enough to read as a thumbnail — assume 300px wide. Max 300 KB.

These can be **generated programmatically** from the page title rather than
designed one by one. At 102 routes that is the sensible route; say the word and
I will build the generator instead of putting 102 rows on a designer.

## Video library

| ID | What | Count | Length | Priority |
|---|---|---|---|---|
| `VID-01` | Hero background | 1 | 8–12s loop | **P1** |
| `VID-02` | Service explainers | 7 | 45–90s | P3 |
| `VID-03` | Case study walkthroughs | per study | 2–3 min | P3 |
| `VID-04` | Client testimonial films | per client | 60–90s | P3 |
| `VID-05` | Architecture / process motion | 3–5 | 15–30s loop | P3 |

All video: MP4 H.264, poster frame, captions file (`.vtt`) for anything with
speech — `docs/06 §C` requires captions and transcripts for media. `VID-04` is
permission-gated exactly like a written testimonial.

## Email

| ID | What | File | Size |
|---|---|---|---|
| `EM-01` | Email header mark | `public/email/logo.png` | 400 × 116, PNG on transparent |

Raster, not SVG — most email clients do not render SVG.

## Brand — complete

Logo, favicon, PWA icons and the default OG card were vectorised from the
supplied artwork and live in `public/` and `assets/brand/`. **No action needed.**

If the original `Logo.png` / `fevicon.png` still exist anywhere, drop them into
`assets/brand/source/` — what is there now are reconstructions.

---

# Totals

| Phase | Images | Videos | Notes |
|---|---:|---:|---|
| **Phase 1** — live | **~75** + portraits | 1 | 28 of those are icons |
| **Phase 2** — Solutions | ~73 | 0 | 40 shared module icons |
| **Phase 3** — Tech / cases / resources | ~90 + per-item | per study | Grows with content volume |
| **Phase 4** — Careers etc. | ~14 | 0 | |
| **Cross-cutting** | ~102 OG cards | 4 video families | OG cards better generated |

**Roughly 250 static assets** for the full 102-route sitemap, plus one video
family. That is the honest scale of what the reference site carries.

## Delivery order

Do not commission all of it. In order of return:

1. **`HERO-01`, `PH-01`, `PH-02`** — replaces every visible placeholder on the
   pages a first-time visitor actually sees. Three assets.
2. **`PH-03`, `PH-04`, `IL-01`** — makes the seven service pages feel finished.
   36 assets, one photo session plus an icon set.
3. **Client proof** (`CS-04`, `CS-05`) — not design work. Permission work. The
   highest-value thing on this whole list and it needs signatures, not a
   designer.
4. **`PH-05`, `SO-02`** — industry pages and social cards.
5. Everything else, **only as its phase is built.** Assets produced for pages
   that do not exist get lost, go stale, or lock in a style decision before the
   page is designed.

---

## After delivery

```bash
pnpm build && pnpm start
pnpm audit:images     # alt text, dimensions, 250 KB ceiling
pnpm a11y             # contrast still passes over new imagery
```
