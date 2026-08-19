# 11 — Reference parity: appinventiv.com

A section-by-section reading of the reference, what each one is actually doing,
and what V4You has or needs in its place.

Taken from their live markup (735 KB) and their inlined stylesheet (325 KB) —
not from looking at the page, because most of what makes it feel expensive is
not visible in a screenshot.

---

## 1. Their motion vocabulary, complete

| Effect | Class / mechanism | Uses | V4You |
|---|---|---|---|
| Masked line reveal on headings | `line-anim` | 12 | ✅ SplitText |
| Masked label swap on hover | `text-hover` | 53 | ✅ `SwapLabel` |
| Marquee | `@keyframes marquee` ×4 | 100+ cards | ✅ two opposing rails |
| Accordion | `accordion-*`, `home-accordion-*` | 14 | ✅ + animated open |
| Pinned column | `compliance-fixed-section` | 1 | ✅ `PinnedSequence` |
| Tabs | `tabbing_panel` | 2 | ✅ sliding indicator |
| Horizontal drag slider | `gsap-slider`, `--slider-spv` | 12 items | ❌ |
| Custom cursor over slider | `slider-cursor`, `slider__cursor-inner` | 2 | ❌ |
| 3D stacked vertical slider | `vertical-slider__item`, `perspective: 50em` | 6 | ✅ `StackedSlider` |
| Internal scroll region | `scrollable_list`, 6px scrollbar | 11 | ❌ |
| Typewriter | `type-animate` | 1 | ❌ |
| Smooth scroll | Lenis | — | ✅ |

Their easing is `cubic-bezier(.19,1,.22,1)` — exponential-out — and `.3s` is the
default duration, used 100 times. Both are matched in `globals.css`.

---

## 2. Section by section

Reading the page top to bottom.

### 2.1 Hero
Video background, `line-anim` headline, CTA, awards marquee bottom-right.
**V4You:** ✅ built. Entrance is CSS rather than GSAP — see the note in
`HeroPrimary` for why measuring lines above the fold cannot be done honestly.

### 2.2 Services
`home-services-section` with a `scrollable_list` — a fixed-height region that
scrolls internally, with a 6px custom scrollbar.
**V4You:** ServiceCardGrid, a plain grid. Seven services fit; theirs needs the
scroll region because it holds far more.
**Verdict:** the pattern solves a problem we do not have.

### 2.3 Portfolio
`gsap-slider` — horizontal, drag-to-scroll, `touch-action: pan-y`, slides-per-view
as a custom property, prev/next controls, and a **custom cursor** that rotates
90° / −90° near the edges to signal direction.
**V4You:** `CaseStudyRail` exists and renders empty. **Nothing to drag until
case studies are cleared for publication.**

### 2.4 Marquee showcase
Six cards on a horizontal rail. Hover: `background-color: rgba(255,255,255,.08)`
plus a border-colour change, both `.3s ease`.
**V4You:** ✅ `CutCard` now warms the edge toward amber and lifts the fill by
about 4.5%, alongside the existing lift and notch fill.

### 2.5 "Building AI Ecosystem"
`vertical-slider` — cards absolutely stacked inside `perspective: 50em`, with a
right-hand rail of 4px lines that scale to show position, and invisible
full-height buttons over each region to switch. Genuinely the most distinctive
thing on the page.
**V4You:** ✅ `StackedSlider`, on the home page's four pillars. Built as the
ARIA tab pattern rotated vertical — the reference uses `opacity: 0` buttons with
no accessible name, which is unusable by keyboard and silent to a screen reader.
The depth panels behind the active card carry no text, because rendering real
body copy at 25% opacity puts it well under 4.5:1.

### 2.6 C-suite testimonials + leaders marquee
Named executives with photographs, and a 100-card marquee of client logos.
**V4You:** ❌ **cannot build.** No testimonial has `permissionGranted`, and no
client logo has `logoUsagePermitted`. See §3.

### 2.7 Client logo grid — "Trusted by the Disruptors and Fortune 500s"
**V4You:** ❌ cannot build. Same reason.

### 2.8 Statistics — 1700+ / 3000+ / 110+
**V4You:** ❌ cannot build. Same reason.

### 2.9 Technical expertise
A long, dense list of technologies grouped by discipline.
**V4You:** ✅ `LogoMarquee` carries exactly this — as wordmarks, labelled
"Technologies we work with" rather than "Our partners".

### 2.10 Awards and accreditations
**V4You:** ❌ cannot build. No award or certification exists.

### 2.11 Compliance — pinned
`compliance-fixed-section` at 40% width holds position while an accordion
scrolls past it.
**V4You:** ✅ `PinnedSequence`, using `position: sticky` rather than
ScrollTrigger's pin — the pin takes the section out of flow, so page height
stops matching scroll height and find-in-page lands in the wrong place.

### 2.12 Partnership marquee
**V4You:** ✅ two opposing rails at 46s and 38s.

### 2.13 "Solving Complex Challenges Across Every Major Sector"
A sector accordion.
**V4You:** ✅ `IndustryTabs` plus `NumberedAccordion`.

### 2.14 FAQ
**V4You:** ✅ `FAQAccordion`, now with an animated open.

### 2.15 Footer + contact form
Four footer sub-sections and an inline contact form.
**V4You:** ✅ `SiteFooter`; the form lives on `/contact` and `/book-consultation`.

---

## 3. The five sections that cannot be copied

Sections 2.6, 2.7, 2.8 and 2.10 — testimonials, client logos, statistics,
awards — are **four of their strongest sections and they are all pure proof
display.** Between them they carry named executives, Fortune 500 logos, "1700+
projects", "3000+ employees" and a wall of accreditations.

V4You currently has none of it. Not "has it but has not supplied it" — the
access rules in the Payload collections gate every one of these on a permission
flag, and no record has that flag set.

Building those sections means either leaving four visibly empty holes down the
middle of the page, or filling them with numbers nobody can stand behind.
`CLAUDE.md` rule 1 rules out the second, and the site's own `/security` page
states in writing that V4You does not claim what it cannot evidence.

**What unblocks them** is in `docs/08-asset-checklist.md`: client logos with
written usage permission, testimonials with sign-off, and case studies cleared
for publication. Each arrives as data — the components are already written and
already render their empty state — so no new build work is needed once the
permissions exist.

Until then the page runs shorter than theirs, and every section on it is true.

---

## 4. Outstanding build work

Ordered by how much it changes the page.

1. **Horizontal drag rail with custom cursor** (§2.3) — built against
   `CaseStudyRail`, dormant until case studies exist.
2. **Typewriter** (§1) — low value; the reference uses it once, and a headline
   that types itself out delays the one line a visitor came to read.
3. **Internal scroll region** (§2.2) — solves a problem V4You does not have.
   Not planned.

Everything else in §1 is built.
