# 09 — Hero video brief

Everything needed to generate the home page hero video. Written for Google Flow
(Veo); the content decisions apply to any tool.

**This replaces an earlier version that was wrong.** That one specified a calm,
dark office at blue hour with the left of frame kept empty — generic
stock-footage thinking, and not built from V4You's content. The reference
supplied since (`ai-agentix.com`, and appinventiv.com) makes the target clear,
and the page code has been changed so a **bright, full-frame** video works.

---

## 1. What the reference actually does

The Agentix hero film, frame by frame:

| | |
|---|---|
| **Structure** | A sector sequence — university → hospital → real estate → office |
| **Look** | Bright, full-frame, golden-hour daylight. Nothing darkened. |
| **Technique** | Holographic UI panels floating over real environments |
| **Payoff** | Their product dashboard filling frame, their logo inside the UI |
| **Specs** | 24s, 1920 × 1080, 30fps, 9.4 Mbps, 28 MB |

**Three of those four we copy directly.** The sector sequence, the brightness
and the floating-panel technique are all excellent and all available to us.

## 2. The one part we cannot copy, and what replaces it

Read the overlays in that film closely and they contain:

```
+78.4%    +45.6%    −62.7%    ₹12.8 Cr    152 Deals Closed    4.8/s
1,265 → 1,296     92% Complete     2,584 tasks     ₹3,42,000
named leads with phone numbers, a live business feed
```

Agentix is a **product company**. That dashboard is their product, so showing
it is legitimate. **V4You is a services company with no product and no case
study behind any figure.** A V4You-branded dashboard reading "₹12.8 Cr
pipeline" would be a fabricated product displaying fabricated results, on the
most prominent surface of the site — and the site's own security page says, in
writing, that V4You does not claim what it cannot evidence. The hero would be
calling the rest of the site a liar.

### What goes in the panels instead

**Process, not results.** V4You already has the content, and it is more
distinctive than a fake metric:

The four-stage flow from the site's own AI capability section —

```
TRIGGER  →  RAG  →  GATE  →  EXECUTE
```

and the healthcare "where we typically start" flow, verbatim from
`src/seed/industries.ts` —

```
01 DISCOVER        Map the patient journey end to end
02 ADMINISTRATIVE  Automate registration and reminders
03 GOVERNANCE      Add access control and audit logging
04 MEASURE         Report on cycle time and no-shows
```

A viewer reading "GATE — human approval on anything priced or contractual"
learns something true and specific about how V4You works. A viewer reading
"+78.4%" learns nothing, because they know it is decoration.

**This is a better film for this company,** not a compromised one.

---

## 3. The concept — "one system, four floors"

Four environments, one intelligence layer connecting them. Each environment
gets a floating panel showing the *process* running there. The final shot
resolves everything into the V4You mark.

Bright. Daylight. Full frame. Indian settings — the audience is Indian and
international, and the reference is unmistakably Indian.

### Shot 1 — Hospital *(0–6s)*

Modern multi-speciality hospital entrance, morning light, staff and visitors
moving. A translucent panel floats upper-right showing the four-step healthcare
flow above. Small amber pulse travels between steps.

### Shot 2 — Manufacturing *(6–12s)*

Clean production floor, daylight through high windows, operators working.
Panel shows **plan versus actual** as two aligned bars with no numbers on them,
and the labels `PLAN` / `ACTUAL` / `EXCEPTION`. An amber marker moves along.

### Shot 3 — Logistics *(12–18s)*

Warehouse aisle or loading bay, bright, forklifts and staff. Panel shows a
shipment moving through `DISPATCHED → IN TRANSIT → EXCEPTION FLAGGED →
DELIVERED`, with the exception step highlighted amber.

### Shot 4 — The resolve *(18–24s)*

Modern office, a person at a desk, screens present but content abstract. The
camera pushes past them and the floating panels from all three previous shots
converge into a single form: **the V4You mark — the amber square rotated 45°**
— with four faint paths entering and four leaving.

That final shot is the site's own hero diagram brought to life. It is the
strongest tie between the film and the brand, and it is the reason the logo
belongs in the video.

---

## 4. Using the logo

Yes — it is your own mark, so there is no restriction.

**Where:** shot 4 only, as the convergence point. Not a watermark, not a
corner bug, not an intro sting.

**How:** the amber square rotated 45°, exactly as in `public/logo-mark.svg`.
Amber `#EDA11A`. Keep the shape clean; do not add glow, bevel or particles to
it.

Veo will not render a specific logo reliably from a prompt. **Generate the
footage without it and composite the mark in afterwards** (After Effects,
Premiere, DaVinci, CapCut all do this). Same for the panel text — see below.

---

## 5. Producing it — the two-pass method

This is the part that determines whether the result looks professional.

**Do not ask Veo to render the UI panels.** It will produce warped,
meaningless pseudo-text every time, which is exactly what makes AI video look
cheap. Instead:

### Pass 1 — footage only (Veo / Flow)

Generate the four environments **with no overlays at all**. Prompts in §6.
Leave clean space in frame where a panel will sit.

### Pass 2 — panels and logo (compositing)

Add the panels, the text and the mark yourself, in the brand's own type and
colour. They will be sharp, correctly worded, on-brand and legible — none of
which Veo can guarantee.

Panel style, to match the site:

| | |
|---|---|
| Fill | Navy `#0A1D3E` at 55–70% opacity |
| Border | 1px, `#2A4C7D` |
| Corners | **Square. Radius 0 everywhere.** |
| Heading | IBM Plex Mono, uppercase, letter-spacing 0.16em, `#EDA11A` |
| Body | Inter Tight, `#F6F5F1` |
| Accent | Amber `#EDA11A` on the active step only |

Square corners matter. Rounded panels are the giveaway that a video was not
made for this brand.

---

## 6. Flow prompts — footage only, no overlays

Aspect **16:9**, highest resolution available. Run each **3–4 times**;
generation is non-deterministic and attempt four is usually far better than
attempt one.

### Shot 1 — Hospital

```text
Cinematic wide shot, modern multi-speciality hospital entrance in India, bright
morning daylight, clean contemporary architecture with large glass frontage.
Staff in scrubs and visitors walking calmly through the entrance, seen at a
distance, faces not identifiable. Warm natural light, clear sky, fresh and
optimistic mood. Slow smooth camera push forward. Clean open sky in the upper
right of frame. Shot on cinema camera, shallow depth of field, natural colour
grade. No text, no graphics, no user interface, no holograms, no overlays.
```

### Shot 2 — Manufacturing

```text
Cinematic wide shot inside a clean modern manufacturing facility, bright
daylight streaming through high industrial windows. Organised production line,
two or three operators in safety gear working calmly, seen from a distance,
faces not identifiable. Polished floor, orderly and well lit, blue and steel
tones with warm daylight. Slow lateral camera glide. Clean empty space in the
upper left of frame. Cinema camera, natural colour grade. No text, no graphics,
no user interface, no holograms, no overlays.
```

### Shot 3 — Logistics

```text
Cinematic wide shot inside a large modern distribution warehouse, bright
daylight from skylights, tall orderly racking, a forklift moving in the middle
distance, two workers walking, faces not identifiable. Clean, organised,
spacious. Cool neutral tones with warm daylight pools. Slow smooth dolly
forward down the aisle. Clean space in the upper right of frame. Cinema camera,
natural colour grade. No text, no graphics, no user interface, no holograms,
no overlays.
```

### Shot 4 — The resolve

```text
Cinematic medium shot in a bright modern open plan office, large windows with
soft daylight, one person working at a desk seen from behind over the shoulder,
face not visible. Monitors present but screen content completely out of focus
and illegible. Clean uncluttered desk, calm and spacious. Slow camera push past
the person toward the window light, ending on clean bright empty space in the
centre of frame. Cinema camera, shallow depth of field, natural colour grade.
No text, no graphics, no user interface, no holograms, no overlays.
```

### Negative prompt — use on every shot

```text
text, letters, numbers, user interface, holograms, floating panels, dashboards,
charts, graphs, logos, watermarks, robots, humanoid robots, androids, glowing
neural networks, brain imagery, circuit boards, glowing orbs, purple and cyan
neon, heavy lens flare, fast motion, camera shake, cuts, transitions, crowds,
direct eye contact with camera, distorted hands, extra fingers, warped faces
```

### Rejecting a clip

Reject if any of these is true — none can be fixed later:

- Warped hands, extra fingers, melting objects *(look closely — very common)*
- A face clearly identifiable or looking at camera
- Veo has invented text or UI despite the negative prompt
- No clean area where the panel needs to sit
- Motion too fast, or a visible cut mid-clip
- Anything that identifies a real hospital, brand or company

---

## 7. Compression

The web asset budget is **under 3 MB**. The reference is 28 MB at 9.4 Mbps,
which is fine for a portfolio download and far too heavy for a hero.

```bash
# Join the four shots with short cross-dissolves in your editor first,
# export a master, then:

ffmpeg -i master.mp4 -an -vf "scale=1920:-2" \
  -c:v libx264 -crf 30 -preset slow -movflags +faststart \
  public/hero.mp4

ffmpeg -i master.mp4 -an -vf "scale=1920:-2" \
  -c:v libvpx-vp9 -crf 40 -b:v 0 public/hero.webm

ffmpeg -i master.mp4 -ss 00:00:03 -vframes 1 -q:v 3 public/hero-poster.jpg
```

`-an` strips audio — it is muted anyway and the track is dead weight.
`+faststart` lets playback begin before the download finishes. Raise `-crf` to
shrink further; 30–34 is usually invisible.

**Target 16–20s**, not 24. It loops silently behind text; nobody watches it
twice.

---

## 8. Wiring it in

Drop `hero.mp4` and `hero-poster.jpg` into `public/`, then in
`src/seed/home.ts` add to `homeHero`:

```ts
videoSrc: '/hero.mp4',
videoPoster: '/hero-poster.jpg',
```

Then — and this matters — verify contrast against the real footage:

```bash
pnpm build && pnpm start
pnpm a11y            # measures text contrast over the actual frames
pnpm audit:images    # the poster counts against the asset budget
```

The overlay is deliberately light so the film stays bright. If the headline
fails contrast on a particular shot, **change that shot** rather than darkening
the whole video — that is how the first version went wrong.

---

## 9. Checklist

- [ ] Four shots generated, footage only, no overlays
- [ ] Each shot has clean space where its panel will sit
- [ ] No warped hands or invented text in the chosen takes
- [ ] Panels composited in Plex Mono + Inter Tight, square corners
- [ ] Panel copy is **process, never results** — no percentages, no currency
- [ ] V4You mark composited into shot 4 as the convergence point
- [ ] Cross-dissolves, no hard cuts
- [ ] 16–20s, loops seamlessly
- [ ] Audio stripped
- [ ] Under 3 MB
- [ ] Poster frame exported
- [ ] `pnpm a11y` passes with the video in place
