# 01 — Design System

Everything here is derived from the V4You logo. Nothing is arbitrary.

---

## 1. Colour

Values sampled directly from the logo file — these are exact, not approximations.

| Token | Hex | Source / role |
|---|---|---|
| `--navy-900` | `#0A1D3E` | Logo wordmark. Primary ink, dark canvas, headings. |
| `--navy-800` | `#12294F` | Elevated surface on dark sections, card backgrounds |
| `--navy-700` | `#1C3A66` | Borders and dividers on dark |
| `--navy-600` | `#2A4C7D` | Hover borders, secondary strokes on dark |
| `--amber-500` | `#EDA11A` | Logo mark. The accent. Used sparingly. |
| `--amber-600` | `#C98611` | Amber hover/pressed state |
| `--amber-ink` | `#7A4F06` | Amber-family **text on light backgrounds only** |
| `--bone` | `#F6F5F1` | Logo background. Light canvas — warm, not clinical white. |
| `--bone-2` | `#EEEDE7` | Alternate light section, input fills |
| `--white` | `#FFFFFF` | Card surfaces on bone |
| `--slate-500` | `#5B6B85` | Body text on light |
| `--slate-300` | `#93A4BF` | Body text on dark |
| `--line-light` | `#DEDCD4` | Borders on light |
| `--line-dark` | `#1F3A63` | Borders on dark |

### Semantic tokens

| Token | Value | Use |
|---|---|---|
| `--success` | `#1B7F5A` | Form success, positive delta |
| `--warning` | `#8A5A08` | Caution states (amber family, contrast-safe) |
| `--error` | `#B0281F` | Form errors, destructive |
| `--focus` | `#EDA11A` | Focus ring — 2px solid, 3px offset |

### Contrast matrix — verified, not assumed

| Foreground | Background | Ratio | Verdict |
|---|---|---:|---|
| `#0A1D3E` navy | `#F6F5F1` bone | **15.30** | ✅ AAA. The workhorse pairing. |
| `#F6F5F1` bone | `#0A1D3E` navy | **15.30** | ✅ AAA |
| `#EDA11A` amber | `#0A1D3E` navy | **7.72** | ✅ AAA. Strongest brand pairing. |
| `#EDA11A` amber | `#12294F` navy-800 | **6.67** | ✅ AA all sizes |
| `#7A4F06` amber-ink | `#F6F5F1` bone | **6.53** | ✅ AA all sizes |
| `#5B6B85` slate | `#F6F5F1` bone | **4.95** | ✅ AA body text |
| `#93A4BF` slate-300 | `#0A1D3E` navy | **6.60** | ✅ AA body text |
| `#EDA11A` amber | `#FFFFFF` white | 2.16 | ❌ **Never for text** |
| `#EDA11A` amber | `#F6F5F1` bone | 1.98 | ❌ **Never for text** |

**The rule that follows:** on light backgrounds, amber is a *fill* (button background,
icon shape, rule, notch). It is never a *typeface* colour. On navy it is both.

Button consequence: the primary CTA is amber fill with `#0A1D3E` navy label — 7.72:1,
which is why that combination is the site's most confident element.

---

## 2. The signature device — the 45° cut

The logomark is an amber square sliced by a 45° diagonal that forms the "4". That
diagonal is the one genuinely ownable geometric idea in the brand. It appears in exactly
four places and nowhere else:

1. **Card corners.** Primary cards clip their top-right corner at 22px via `clip-path`.
   On hover, an amber triangle fills the notch.
   `clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)`

2. **Buttons.** Two opposite corners clipped at 14px — top-right and bottom-left, so the
   shape reads as a parallelogram hint rather than a chamfered box.
   `clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))`

3. **Eyebrow glyph.** Section eyebrows are preceded by a 16px amber slash, not a bullet.
   `clip-path: polygon(0 100%, 100% 0, 100% 34%, 34% 100%)`

4. **The hero core.** The orchestration diagram's centre node is a square rotated 45° —
   a direct restatement of the logomark at the heart of the page's main visual.

**Restraint clause:** the cut does not appear on inputs, footers, tables, images, or
navigation. Overuse turns a signature into a texture. If you are unsure, leave it off.

---

## 3. Typography

Three faces, three jobs. All available on Google Fonts with open licences.

| Role | Face | Weights | Use |
|---|---|---|---|
| Display | **Schibsted Grotesk** | 400–800 | H1–H3, buttons, card titles, nav |
| Body | **Inter Tight** | 400, 500, 600 | Paragraphs, lists, long-form |
| Utility | **IBM Plex Mono** | 400, 500 | Eyebrows, metrics, KPI tables, diagram labels, step numbers |

Load via `next/font/google` with `display: 'swap'` and subset `latin`. Self-host the
subset in production.

### Type scale

Fluid via `clamp()`. Base 17px.

| Token | Size | Line height | Tracking | Face |
|---|---|---|---|---|
| `display` | `clamp(38px, 5.6vw, 70px)` | 1.06 | -0.032em | Schibsted 800 |
| `h1` | `clamp(34px, 4.6vw, 56px)` | 1.08 | -0.028em | Schibsted 700 |
| `h2` | `clamp(30px, 4.1vw, 52px)` | 1.10 | -0.022em | Schibsted 700 |
| `h3` | `clamp(19px, 1.8vw, 24px)` | 1.28 | -0.015em | Schibsted 700 |
| `body-lg` | `clamp(16.5px, 1.35vw, 19px)` | 1.60 | 0 | Inter Tight 400 |
| `body` | `17px` | 1.62 | 0 | Inter Tight 400 |
| `body-sm` | `14.5px` | 1.60 | 0 | Inter Tight 400 |
| `label` | `11.5px` | 1.4 | 0.16em, uppercase | Plex Mono 500 |
| `metric` | `clamp(28px, 3vw, 44px)` | 1.0 | -0.03em | Schibsted 700 |

Max reading measure for long-form: **68ch**. Headings cap at **20ch**.

---

## 4. Layout

- 12-column grid, gutter `clamp(20px, 4vw, 48px)`
- Max content width **1320px**
- Spacing base **8px**; section padding `clamp(76px, 9vw, 132px)` block
- Radius: **0 everywhere.** The brand's geometry is the cut, not the curve. Inputs and
  images are square-cornered.

### Section rhythm

Alternate density and canvas so the page breathes without decoration:

```
navy hero  →  navy-800 strip  →  bone (dense)  →  navy (quiet)
→  bone (dense)  →  navy (dense)  →  bone (quiet)  →  bone-2
→  navy (dense)  →  amber CTA band  →  navy footer
```

A high-information section is always followed by a quieter one. Never two dense sections
of the same canvas back to back.

---

## 5. Motion

| Where | What | Duration | Easing |
|---|---|---|---|
| Scroll reveal | opacity 0→1, translateY 22px→0 | 600ms | `cubic-bezier(.2,.7,.3,1)` |
| Card hover | translateY -4px, notch fade in | 220ms | ease |
| Button hover | translateY -2px, bg lighten | 200ms | ease |
| Mega menu | opacity + translateY 10px | 200ms | ease |
| Diagram sparks | dots along SVG paths, staggered | 3.6–5.0s loop | linear |
| Header shrink | height 76px→64px at 90px scroll | 250ms | ease |

**Rules.** Reveal whole sections, not each card independently. No parallax. No counters
that imply live data. Everything above disabled under `prefers-reduced-motion: reduce` —
including the diagram sparks, which are removed from the DOM rather than paused.

---

## 6. The hero visual — orchestration diagram

Specified because it is the page's thesis, and getting it wrong makes the whole site
generic. Build as inline SVG, no library.

**Structure.** Four input nodes on the left (Customers, Operations, Data, Teams) → curved
bezier paths → a 45°-rotated square core labelled "Intelligence Layer" → four output
nodes on the right (Products, Agents, Dashboards, People).

**Motion.** Small amber circles travel the paths on staggered loops via `animateMotion`
with `<mpath>`. Eight paths, eight sparks, durations 3.6s–5.0s, begins 0s–3.2s.

**Accessibility.** Single `role="img"` with an `aria-label` describing the flow in a
sentence. Do not label individual nodes for screen readers — it produces noise.

**What it must not be.** Not a robot. Not a neural-network cliché. Not a floating
gradient orb. It is an architecture diagram, and it should be legible as one.
