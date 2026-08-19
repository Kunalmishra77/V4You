# 09 — Hero video brief

Everything needed to generate the home page hero background video, in order.
Written for Google Flow (Veo), but the content decisions apply to any tool.

---

## 1. The one rule that overrides everything else

**Nothing in this video may assert a fact.**

A hero background is understood as evocative rather than documentary, the same
way stock B-roll is. That gives reasonable latitude — but it stops the moment
something in frame makes a specific claim. Concretely:

| Allowed | Not allowed |
|---|---|
| Abstract light, data as texture, motion suggesting flow | **Any readable number, chart or metric** |
| People working, faces soft or turned, no identification | A caption or context implying "this is our team" |
| Generic screens with illegible UI | A recognisable product screen presented as V4You's work |
| Neutral modern workspace | A named client's office, branding or logo |

The readable-number rule is the important one. The reference site
(appinventiv.com) shows holographic dashboards over a restaurant scene. If ours
shows a legible figure — "+47%", "2.4M", a rising chart — that is an invented
metric on the most prominent surface of the site, and CLAUDE.md rule 1 rules it
out. Keep all data abstract: light, particles, flow, geometry. No axes, no
digits.

---

## 2. What the video should actually be about

The site's argument is one sentence: **signals come in from customers,
operations, data and teams; an intelligence layer routes work back out to
products, agents, dashboards and people.**

The video should feel like the human end of that — the moment where a system
quietly does its job and a person gets on with theirs. Not the technology.

`blueprint §15.1` rules out three things explicitly: **no robots, no
neural-network clichés, no floating gradient orbs.** Those are the defaults every
AI video generator reaches for, so they must be excluded in the prompt rather
than hoped against.

### Recommended concept — "the work continues"

A calm, modern working environment at the blue hour. People working with
evident focus. Screens present but never legible. Occasional slow amber
accents — a light, a reflection, a moving highlight — echoing the brand mark.
Camera almost still: a very slow push or drift, no cuts.

Why this and not the reference's approach: their scene is a busy restaurant
with visible AI overlays, which sells "AI is everywhere". V4You's positioning is
the opposite — *technology that earns its place and gets out of the way*. A
quieter frame is truer to the copy sitting on top of it.

### Two alternatives, if you want a different feel

- **Architectural** — slow drift through a modern building's structural
  geometry: glass, steel, repeating diagonals. No people at all. Coldest,
  safest, most abstract. Pairs strongest with the 45° brand language.
- **Hands and craft** — close, shallow-focus shots of hands working: a
  keyboard, a whiteboard, a notebook, a screen edge. Warm and human without
  ever showing an identifiable face.

---

## 3. Constraints the design imposes

The hero copy sits over the **left 40%** of the frame, on near-opaque navy.
So:

- **Keep the left third quiet and dark.** Nothing important there. It will be
  covered.
- **Put the visual interest in the right half**, roughly 55–100% across.
- **Overall exposure: dark.** The site's canvas is `#0A1D3E`. A bright video
  fights the whole page.
- **Cool palette** — blues, steel, deep neutrals. Warm accents only in small
  amounts, ideally near amber `#EDA11A`.
- **No hard cuts.** It loops silently behind text; a cut reads as a glitch.
- **Nothing crossing the centre fast.** Movement behind text is what makes hero
  video unreadable.

---

## 4. Google Flow — step by step

### Before you start

1. Open **labs.google/flow** and sign in.
2. New project, name it `v4you-hero`.
3. Choose the highest-quality Veo model available on your plan.
4. Set aspect ratio **16:9**. Highest resolution offered — you will downscale
   later, never upscale.

### Generate

Flow produces roughly 8-second clips. You want **three or four**, then pick the
best one or stitch two. Generate each shot separately rather than asking for a
sequence — a single clip with no cut is the goal.

Run each prompt **3–4 times**. Generation is non-deterministic; the difference
between attempt one and attempt four is usually large.

### Prompt A — recommended, the primary shot

```text
Cinematic wide shot of a calm modern office interior at blue hour, floor to
ceiling windows, city lights soft and out of focus far behind. Three or four
people working at desks in the mid and far distance, seen from behind or in
profile, faces not identifiable. Computer screens visible but the content is
completely illegible, only soft glow. Cool blue and deep navy colour palette,
low key lighting, deep shadows. One small warm amber light source on the right
side of the frame. Extremely slow camera push in, almost imperceptible. Shallow
depth of field. Quiet, composed, unhurried mood. Anamorphic lens, subtle film
grain, no text, no graphics, no user interface overlays, no charts, no numbers.
```

**Negative prompt** — paste into the negative field if Flow offers one; if not,
append it as a sentence:

```text
robots, humanoid robots, androids, holograms, holographic displays, floating
user interfaces, dashboards, charts, graphs, numbers, text, logos, glowing
neural network diagrams, brain imagery, circuit board patterns, glowing orbs,
purple and cyan neon, lens flares, fast motion, camera shake, cuts, transitions,
crowds, direct eye contact with camera
```

### Prompt B — architectural alternative

```text
Cinematic slow drift past the structural geometry of a modern glass and steel
building, seen from inside. Repeating diagonal lines and sharp angular
intersections. Deep navy and cool steel blue, very low key, dark overall
exposure. A single narrow band of warm amber light falling across the structure
on the right of frame. No people. Extremely slow lateral camera movement.
Shallow depth of field, anamorphic lens, subtle film grain. Calm, precise,
architectural. No text, no graphics, no interface elements.
```

### Prompt C — hands and craft

```text
Extreme close up, shallow depth of field, hands working at a laptop keyboard in
a dimly lit modern workspace. Only hands and forearms visible, no face. Screen
glow illuminating the hands, screen content completely out of focus and
illegible. Deep navy and cool blue palette, single warm amber accent light from
the right. Very slow camera drift. Quiet and focused. Anamorphic lens, film
grain. No text, no interface, no graphics, no numbers.
```

### Prompt D — a second angle of A, for stitching

```text
Cinematic medium shot, over the shoulder and from behind, one person standing
at a large window in a dark modern office at dusk, city out of focus beyond.
Figure in silhouette, face not visible. Cool navy palette, very low key, warm
amber reflection on the glass at the right of frame. Almost static camera with
the slightest drift. Contemplative, calm. Anamorphic, film grain. No text, no
graphics, no interface.
```

### What to look for when choosing

Reject a clip if any of these are true. They are the common failure modes and
none of them can be fixed afterwards:

- Any legible text, number, chart or UI on a screen
- A face looking at camera, or clearly identifiable
- Anything robotic, holographic or neural-network shaped
- The left third is bright or busy
- Motion crosses the centre quickly
- Warped hands, extra fingers, melting objects — look closely, it is common
- Overall exposure too bright to sit under bone-coloured text

---

## 5. Turning the clip into a web asset

Flow's export is far too heavy for a hero background. A hero video should be
**under about 3MB**; the raw export is often 30–60MB.

| Property | Target | Why |
|---|---|---|
| Duration | 8–12s, seamless loop | Longer means more weight for something nobody watches |
| Resolution | 1920×1080 max | It sits behind text at partial opacity |
| Format | MP4 (H.264), optionally WebM (VP9) | H.264 for reach, VP9 for size |
| Audio | **Removed entirely** | It is muted anyway; the track is dead weight |
| Size | Under 3MB | Above that it competes with the page for bandwidth |
| Poster | One JPEG frame | Shown before load and under reduced motion |

With ffmpeg:

```bash
# H.264 — the broad-compatibility version
ffmpeg -i flow-export.mp4 -an -vf "scale=1920:-2" \
  -c:v libx264 -crf 30 -preset slow -movflags +faststart \
  public/hero.mp4

# VP9 — smaller, for browsers that accept it
ffmpeg -i flow-export.mp4 -an -vf "scale=1920:-2" \
  -c:v libvpx-vp9 -crf 40 -b:v 0 public/hero.webm

# Poster frame, taken two seconds in
ffmpeg -i flow-export.mp4 -ss 00:00:02 -vframes 1 -q:v 3 public/hero-poster.jpg
```

`-an` strips audio. `-movflags +faststart` moves the index to the front so
playback can begin before the file finishes downloading. Raise `-crf` to shrink
further — 30 to 34 is usually invisible behind a gradient.

---

## 6. Wiring it in

Drop `hero.mp4` and `hero-poster.jpg` into `public/`, then add to `homeHero` in
`src/seed/home.ts`:

```ts
videoSrc: '/hero.mp4',
videoPoster: '/hero-poster.jpg',
```

Nothing else changes. `HeroMedia` already handles the rest: it plays the video
when motion is welcome, shows the poster when it is not, falls back to the
abstract field if neither exists, and keeps the contrast gradient over all
three.

Then check:

```bash
pnpm build && pnpm start
pnpm a11y            # contrast must still pass over the new footage
pnpm audit:images    # the poster counts against the asset budget
```

---

## 7. If the video never happens

The abstract field is a legitimate permanent answer, not a placeholder that has
to be replaced. Plenty of strong engineering sites carry no hero video at all,
and it costs nothing in bandwidth, nothing in accessibility, and nothing in
honesty. Generate the video because it makes the page better — not because the
slot exists.
