'use client'

import { useEffect } from 'react'

import { setLenis } from '@/lib/lenis'
import { prefersReducedMotion } from '@/lib/reduced-motion'

/**
 * The motion runtime. One instance, mounted once in the site layout.
 *
 * It owns three things:
 *
 *   1. **Lenis** — inertial smooth scrolling, driven off GSAP's ticker rather
 *      than its own rAF loop so the two never disagree about frame timing.
 *   2. **Headings** — every `[data-split]` is split into visual lines by
 *      SplitText and each line climbs out from behind a mask.
 *   3. **Sections** — every `[data-reveal]` arrives on scroll, with children
 *      marked `data-reveal-child` staggered a step apart.
 *
 * **GSAP is imported dynamically, inside the effect.** This component is
 * mounted from the site layout, so a static `import` would put GSAP,
 * ScrollTrigger and SplitText — 136KB raw, 52KB over the wire — into the
 * initial chunk of every route, including the ones with nothing to animate.
 * Measured on `/security` at 4× CPU throttle, that cost about 500ms of the
 * page's 983ms of blocking time: roughly 250ms to fetch, parse and execute the
 * library, and another 250ms of setup during hydration. Lenis was already
 * loaded this way; this is the same pattern applied to the larger dependency.
 *
 * Nothing here runs under `prefers-reduced-motion: reduce`. The effect returns
 * before GSAP is even requested, so a visitor who has asked for less motion
 * does not download a motion library — the page scrolls natively and every
 * element renders in its final state, which is what the CSS in globals.css
 * already guarantees for that case.
 *
 * **The failsafe.** Sections are server-rendered hidden, so if the runtime
 * never starts — a chunk that 404s behind a bad cache, a JS error earlier in
 * the tree — the page would be permanently blank below the fold. The inline
 * script in the layout starts a timer that restores everything if this
 * component has not reported in. Because the import is now asynchronous, the
 * document is marked ready inside the `then`, not at the top of the effect:
 * marking it early would tell the failsafe that motion is alive at a point
 * where the chunk may still fail to arrive, and disarm the one thing that
 * un-hides the page.
 */
export function MotionProvider() {
  useEffect(() => {
    // Asked before anything is fetched, which is the whole point of keeping
    // this check in a module that does not carry GSAP.
    if (prefersReducedMotion()) {
      document.documentElement.dataset.motion = 'ready'
      return
    }

    let cancelled = false
    let teardown: (() => void) | undefined

    void import('@/lib/motion')
      .then((motion) => {
        if (cancelled) return
        // Tell the failsafe we are alive. First statement once the chunk is
        // here, on purpose: everything below can fail, and a blank page is a
        // far worse outcome than a page that does not animate.
        document.documentElement.dataset.motion = 'ready'
        teardown = start(motion)
      })
      .catch((error) => {
        // Deliberately leave `data-motion` unset. The layout's four-second
        // timer then adds `.motion-failed` and the CSS reveals every section,
        // which is the correct outcome for a chunk that never arrived.
        console.error('[motion] chunk failed to load, page will render without animation', error)
      })

    return () => {
      cancelled = true
      teardown?.()
      delete document.documentElement.dataset.motion
    }
  }, [])

  return null
}

/**
 * Everything that needs GSAP, called once the chunk has arrived. Returns its
 * own teardown so the effect does not have to know what was created.
 */
function start(motion: typeof import('@/lib/motion')) {
  const { DURATION, EASE, ScrollTrigger, SplitText, STAGGER, TRIGGER_START, gsap, registerGsap } =
    motion

  registerGsap()

  // Every statement below runs inside the same effect that renders the whole
  // public site. An unhandled throw here does not degrade the animation — it
  // reaches React's error boundary and replaces the entire page with the
  // error screen. That happened once already, on the five routes that have no
  // animated heading at all, and it is not a class of bug worth risking
  // twice: no visual enhancement is worth a blank page.
  let ctx: ReturnType<typeof gsap.context> | undefined
  try {
    ctx = gsap.context(() => {
      // --- Headings ---------------------------------------------------------
      // `autoSplit` re-splits when the font finishes loading or the element
      // changes width. Without it a heading split against the fallback font
      // keeps those line breaks after the real face arrives, and the masks end
      // up in the wrong places.
      // A heading inside a sticky column cannot be its own ScrollTrigger.
      // ScrollTrigger measures the trigger's position once and converts it to a
      // scroll offset; a sticky element's position is a function of the scroll
      // it is being used to measure, so the offset it produces is wrong and the
      // trigger can simply never fire. The heading then sits at its `from`
      // state — below its own mask — permanently invisible.
      //
      // Walk up to the first sticky ancestor and trigger off that element's
      // parent instead, which is in normal flow and starts at the same place
      // the sticky column does.
      const triggerFor = (el: Element): Element => {
        let node = el.parentElement
        while (node && node !== document.body) {
          if (getComputedStyle(node).position === 'sticky') return node.parentElement ?? node
          node = node.parentElement
        }
        return el
      }

      SplitText.create('[data-split]', {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          // SplitText calls this even when the selector matched nothing, so a
          // page with no animated heading arrives here with an empty
          // `elements`. Reading a trigger off `elements[0]` then throws.
          const target = self.elements[0]
          if (!target || !self.lines.length) return

          // Returning the tween hands it to SplitText, which reverts it before
          // re-splitting. Skipping that leaves the old lines mid-tween and the
          // new ones inherit a transform nothing will ever clear.
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: DURATION.line,
            ease: EASE.expo,
            stagger: STAGGER.line,
            scrollTrigger: {
              trigger: triggerFor(target),
              start: TRIGGER_START,
              once: true,
            },
          })
        },
      })

      // --- Sections ---------------------------------------------------------
      // `batch` groups elements that cross the trigger line in the same frame
      // into one callback, so a row of cards animates as a row rather than as
      // however many separate triggers happened to fire.
      ScrollTrigger.batch('[data-reveal]', {
        start: TRIGGER_START,
        once: true,
        onEnter(batch) {
          for (const el of batch) el.setAttribute('data-reveal', 'shown')

          // A section marked as a group does not move itself — its children do.
          const children = batch.flatMap((el) =>
            el.hasAttribute('data-reveal-group')
              ? gsap.utils.toArray<HTMLElement>('[data-reveal-child]', el)
              : [],
          )
          if (!children.length) return

          gsap.fromTo(
            children,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: DURATION.reveal,
              ease: EASE.reveal,
              stagger: STAGGER.step,
              clearProps: 'opacity,transform',
            },
          )
        },
      })
    })
  } catch (error) {
    // Leave the document marked ready — the sections have already been
    // revealed or will be by the CSS fallback — and let the page render
    // without motion rather than not at all.
    console.error('[motion] setup failed, continuing without animation', error)
  }

  // ScrollTrigger records each trigger's position as a scroll offset when it is
  // created, and at that moment the page is not its final height: the webfonts
  // have not landed, so every block of text is still measured in the fallback
  // face. Near the top the error is too small to matter. Further down it
  // accumulates, and a trigger can end up recorded past the point it should
  // fire — the heading then stays at its `from` state for good, which is a
  // masked line stuck below its own mask.
  //
  // It only shows on a jump. Scrolling down the page crosses the stale offset on
  // the way, so the trigger fires anyway and the bug hides; landing on an anchor
  // or restoring a scroll position does not. Recomputing once the fonts have
  // settled fixes every trigger at once.
  void document.fonts?.ready.then(() => {
    ScrollTrigger.refresh()
  })

  // --- Lenis -----------------------------------------------------------------
  let lenis: import('lenis').default | null = null
  let tick: ((time: number) => void) | null = null
  let cancelled = false

  void import('lenis').then(({ default: Lenis }) => {
    if (cancelled) return

    lenis = new Lenis({
      // ~1.05s to settle. Long enough to read as inertia, short enough that a
      // visitor scanning for a phone number does not feel held up.
      lerp: 0.1,
      wheelMultiplier: 1,
      // Touch devices already have inertial scrolling in hardware. Adding a
      // second layer on top makes it feel laggy and detached from the finger.
      syncTouch: false,
    })
    setLenis(lenis)

    lenis.on('scroll', ScrollTrigger.update)

    // One ticker for both. GSAP's runs at a known point in the frame relative
    // to its tweens; Lenis on its own rAF can land either side of it and the
    // pinned sections judder.
    tick = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    // GSAP smooths its delta by default, which is right for tweens and wrong
    // for a scroll position that must track the wheel exactly.
    gsap.ticker.lagSmoothing(0)
  })

  return () => {
    cancelled = true
    if (tick) gsap.ticker.remove(tick)
    if (lenis) {
      lenis.destroy()
      setLenis(null)
    }
    ctx?.revert()
    ScrollTrigger.getAll().forEach((t) => t.kill())
  }
}
