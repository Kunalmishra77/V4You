# 10 — Asset specification

**One document for the designer.** Every image, video and graphic the site
needs: where it goes, what it must show, exact dimensions, format, file size,
and what is already standing in for it.

Deliver files exactly as named. Drop them into the folder given in each row and
the site picks them up — no code change is needed for anything marked
`public/`.

---

## 0. Read this before producing anything

### The one rule

**No asset may assert a fact V4You cannot evidence.**

This is not a style preference; it is the project's first rule and it has
removed content from this site repeatedly. In practice:

| Fine | Not allowed |
|---|---|
| V4You's own office, team, workspace | Stock people implying they are the team |
| Abstract data as light, texture, flow | **Any readable number, chart, metric or KPI** |
| Screens with illegible or blurred UI | A product screen presented as V4You's work |
| Generic modern environments | A client's office, branding or logo without written permission |
| Diagrams of how a system works | A dashboard that looks like a real client's |

If an asset would make a viewer believe something specific about V4You's
clients, results, size, awards or certifications — it cannot ship until there
is evidence behind it.

### House style

Everything comes from the design system in `docs/01`:

| | |
|---|---|
| Navy | `#0A1D3E` — primary dark canvas |
| Navy elevated | `#12294F` |
| Amber | `#EDA11A` — the accent, used sparingly |
| Bone | `#F6F5F1` — light canvas, warm not white |
| Slate | `#5B6B85` on light, `#93A4BF` on dark |
| Geometry | **45° diagonals. Square corners — radius is 0 everywhere.** |
| Mood | Composed, cool, low-key. Not glossy, not neon, not playful. |

**Never** round a corner. **Never** use purple/cyan "AI" gradients. **Never**
show robots, humanoid AI, glowing brains, circuit-board motifs or neural-network
diagrams — `blueprint §15.1` rules these out by name.

### Formats and delivery

- **Photography** — JPEG (quality 80) *and* WebP. Deliver both.
- **Illustration / diagram** — SVG, outlined text, no external fonts.
- **Video** — MP4 (H.264), audio stripped, plus one JPEG poster frame.
- **Colour** — sRGB. Not Adobe RGB; it shifts in browsers.
- **Naming** — exactly the filename in each row, lowercase, hyphenated.
- Deliver a **layered source file** for anything composited, so it can be
  re-cropped later.

### Priority key

| | |
|---|---|
| **P1** | Blocks launch or replaces a visible placeholder |
| **P2** | Materially improves a page that currently works |
| **P3** | Nice to have, later phase |

---

## 1. Hero video — P1

The single highest-impact asset. **Full brief with generation prompts, negative
prompts, rejection checklist and compression commands: `docs/09-hero-video-brief.md`.**
Summary only here.

| | |
|---|---|
| **ID** | `HERO-01` |
| **Where** | Home page, hero background, full bleed behind the headline |
| **File** | `public/hero.mp4` + `public/hero-poster.jpg` |
| **Dimensions** | 1920 × 1080, 16:9 |
| **Duration** | 8–12s, seamless loop |
| **Format** | MP4 H.264, **audio removed**, `+faststart` |
| **Max size** | **3 MB** — above this it competes with the page for bandwidth |
| **Poster** | 1920 × 1080 JPEG, quality 80, under 250 KB |

**Must show:** a calm modern workspace at blue hour, or architectural glass and
steel geometry. Dark overall. Cool palette with one small warm amber accent on
the right. Camera almost still.

**Critical composition note:** the headline sits over the **left 40%** of the
frame. Keep that area dark and empty. Put all interest in the right half.

**Must not show:** any readable number or chart, identifiable faces looking at
camera, robots, holograms, floating UI, fast motion across centre frame.

**Currently:** an abstract SVG field in the brand geometry stands in. It is a
legitimate permanent answer if no video is produced.

---

## 2. Photography — P1 and P2

All photography must be **V4You's own**: your space, your people, your work.
Stock people are ruled out — a stock office photo on an About page implies it
is this company's office, which is a claim nobody can support.

### PH-01 — Team at work *(P1)*

| | |
|---|---|
| **Where** | Home page, "Growth gets harder when your systems do not work together", right column |
| **File** | `public/photos/team-working.jpg` + `.webp` |
| **Dimensions** | 1600 × 1200 minimum, **4:3 landscape** |
| **Max size** | 220 KB after compression |

**Must show:** a genuine working session — whiteboard, screens, two to four
people mid-discussion. Natural light. Candid, not posed at the camera.

**Must not show:** legible screen content, client names or logos on the
whiteboard, stock-looking poses, anyone looking at the lens.

**Currently:** an abstract "flow" figure.

### PH-02 — Leadership portraits *(P1)*

| | |
|---|---|
| **Where** | About page, leadership section — **the section does not render at all without these** |
| **File** | `public/photos/team/{firstname-lastname}.jpg` + `.webp` |
| **Dimensions** | **800 × 800 square**, one per person |
| **Max size** | 120 KB each |

**Must show:** consistent lighting, consistent background, consistent crop
across every person. Head and shoulders. Neutral or navy backdrop suits the
site best.

**Must not show:** inconsistent styles between people — mixed backgrounds look
worse than no photographs, which is why the section is currently omitted rather
than half-filled.

**Also required:** `assets/team/team.csv` with columns
`name, role, bio, linkedin, is_leadership, order`.

**Currently:** the whole section is omitted, replaced by a line pointing to
`/contact`. `docs/05 §2` forbids avatar placeholders.

### PH-03 — Workspace / delivery *(P2)*

| | |
|---|---|
| **Where** | About page, "Working together" section |
| **File** | `public/photos/workspace.jpg` + `.webp` |
| **Dimensions** | 1600 × 900, **16:9** |
| **Max size** | 200 KB |

**Must show:** the actual working environment — desks, screens, the room.
Wide, calm, low-key. Can be empty of people.

### PH-04 — Service page headers *(P2, seven files)*

| | |
|---|---|
| **Where** | Top of each `/services/*` page |
| **File** | `public/photos/services/{slug}.jpg` + `.webp` |
| **Slugs** | `ai-automation`, `software-development`, `website-development`, `mobile-app-development`, `digital-marketing`, `cloud-devops`, `consulting` |
| **Dimensions** | 1600 × 700, **wide landscape** |
| **Max size** | 200 KB each |

**Must show:** something concrete and abstract-leaning per service — a
detail shot, a texture, a piece of the working environment. They must read as a
set, so shoot them in one session with one treatment.

**Must not show:** literal clip-art metaphors (a robot for AI, a padlock for
security, a rocket for growth).

### PH-05 — Industry context *(P3, eleven files)*

| | |
|---|---|
| **Where** | Top of each `/industries/*` page |
| **File** | `public/photos/industries/{slug}.jpg` + `.webp` |
| **Slugs** | `healthcare`, `manufacturing`, `education`, `real-estate`, `retail`, `finance`, `logistics`, `hospitality`, `government`, `startups`, `enterprise` |
| **Dimensions** | 1600 × 700 |
| **Max size** | 200 KB each |

**Must show:** the operating environment of that sector, generically — a ward
corridor, a production line, a warehouse aisle.

**Must not show:** anything identifying a real organisation. **Healthcare in
particular:** no patients, no records, no screens with any personal data,
however blurred.

---

## 3. Illustration and diagrams — P2

These are **SVG**, not photography, and must match the existing diagram style
already on the site (see any `/services/*` or `/industries/*` page).

### IL-01 — Service capability icons *(P2, 28 icons)*

| | |
|---|---|
| **Where** | Capability cards on each service page — four per service |
| **File** | `public/icons/{service-slug}/{capability}.svg` |
| **Dimensions** | 48 × 48 artboard, **2px stroke**, square caps |
| **Style** | Line only. Single colour, `currentColor`. **Square corners.** |

**Must be:** geometric, built from straight lines and 45° angles. Consistent
stroke weight across all 28 — they are seen side by side.

**Must not be:** filled, rounded, multi-colour, or skeuomorphic.

### IL-02 — Section accent figures *(P2, optional)*

The site already generates these in code (`BrandFigure`) — abstract 45°
compositions. A designer may replace them with richer versions.

| | |
|---|---|
| **File** | `public/figures/{name}.svg` |
| **Names** | `grid`, `flow`, `layers`, `signal`, `converge` |
| **Dimensions** | ~320 × 320 artboard, scalable |
| **Colour** | Must use `currentColor` and inherit — they appear on navy, bone and amber canvases |

### IL-03 — Case study architecture diagrams *(P3)*

| | |
|---|---|
| **Where** | Case study pages, Phase 3 |
| **File** | `assets/case-studies/{slug}/architecture.svg` |
| **Dimensions** | 1200 × 700, scalable |

**Must show:** the real system, simplified. **Must not show:** invented
components, or a client's internal system names without written permission.

---

## 4. Social and brand — mostly done

### SO-01 — Default Open Graph card *(complete)*

`public/og-default.png`, 1200 × 630. Generated from the brand vectors. No
action needed.

### SO-02 — Per-page OG images *(P3)*

| | |
|---|---|
| **File** | `public/og/{route}.png` |
| **Dimensions** | **1200 × 630 exactly** |
| **Max size** | 300 KB |

**Must show:** the page title in Schibsted Grotesk Bold, bone on navy, the
logo, one amber rule. Text large enough to read as a thumbnail — assume it is
displayed at 300px wide.

### BR-01 — Brand files *(complete)*

Logo, favicon, PWA icons and the OG card were vectorised from the supplied
artwork and are in `public/` and `assets/brand/`. **No action needed.**

If the original `Logo.png` / `fevicon.png` still exist anywhere, drop them into
`assets/brand/source/` — the current source files there are reconstructions.

---

## 5. Client proof — blocked on permission, not on design

These are **not** a design task. They are a permissions task, and no amount of
design work substitutes.

| Asset | Needed | Gate |
|---|---|---|
| Client logos | `assets/clients/{slug}.svg` | `permissions.csv` row with `logo_permitted = yes` |
| Case study screenshots | `assets/case-studies/{slug}/screens/` | Written clearance from the client |
| Testimonial portraits | 400 × 400 square | The person's written approval of the exact quote |

**There is no override.** The site's access control returns nothing for an
unpermitted client, so an unapproved logo cannot appear even if the file is
present.

---

## 6. Complete checklist

| ID | Asset | Count | Priority | Status |
|---|---|---|---|---|
| HERO-01 | Hero video + poster | 1 | **P1** | Abstract field standing in |
| PH-01 | Team at work | 1 | **P1** | Abstract figure standing in |
| PH-02 | Leadership portraits | ? | **P1** | Section omitted entirely |
| PH-03 | Workspace | 1 | P2 | Not present |
| PH-04 | Service headers | 7 | P2 | Not present |
| PH-05 | Industry context | 11 | P3 | Not present |
| IL-01 | Capability icons | 28 | P2 | Text-only chips |
| IL-02 | Section figures | 5 | P2 | Generated in code |
| IL-03 | Case study diagrams | ? | P3 | Phase 3 |
| SO-01 | Default OG card | 1 | — | **Complete** |
| SO-02 | Per-page OG cards | ~23 | P3 | Falls back to default |
| BR-01 | Brand marks | — | — | **Complete** |

**Smallest useful delivery:** `HERO-01`, `PH-01`, `PH-02`. Those three replace
every visible placeholder on the pages a first-time visitor actually sees.

---

## 7. After delivery

Drop files into the paths above, then:

```bash
pnpm build && pnpm start
pnpm audit:images     # alt text, dimensions, size budget
pnpm a11y             # contrast still passes over new imagery
```

`pnpm audit:images` enforces a **250 KB ceiling** on anything in `public/`.
An oversized file fails the build rather than quietly slowing the site.

Every image also needs **alt text** — describing what it shows and why it is
there. Supply a one-line alt for each photograph with the files.
