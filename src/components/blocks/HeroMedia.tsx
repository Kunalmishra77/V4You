'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * The hero's background layer: a video when one exists, an abstract field when
 * it does not.
 *
 * Three things this handles that a bare `<video>` tag does not.
 *
 * **Reduced motion.** A full-bleed autoplaying video is the single most
 * intrusive thing a page can do to someone with a vestibular disorder. Under
 * `prefers-reduced-motion: reduce` the video never loads at all — not paused,
 * not hidden: the element is never created, so no bytes are fetched.
 *
 * **Contrast.** Text over video cannot be checked against a fixed background,
 * because the background moves. The first version solved that by darkening the
 * left 40% of the frame, which worked and looked like exactly what it was — a
 * bright film with a black bar over half of it.
 *
 * This version keeps the footage bright and full frame. A light, even navy wash
 * sits over everything, and a soft scrim fades in only behind the copy and only
 * as far as the copy reaches. Neither reads as a band. The text also carries a
 * shadow, which does nothing on dark frames and saves the line on bright ones.
 *
 * The wash is deliberately mild, so **final contrast has to be verified against
 * the real footage** — `pnpm a11y` measures it. If a shot blows out under the
 * headline, the fix is that shot, not a heavier overlay.
 *
 * **No video yet.** Until the file exists the same slot renders a slow abstract
 * field in the brand geometry. It is not a grey box and not a stock clip; it
 * looks deliberate, and it claims nothing.
 */
export function HeroMedia({ src, poster }: { src?: string; poster?: string }) {
  const [allowMotion, setAllowMotion] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setAllowMotion(!query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-navy-900">
      {src && allowMotion ? (
        <video
          ref={videoRef}
          className="size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : src && poster ? (
        // Motion is unwelcome, but the still frame carries the same atmosphere.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className="size-full object-cover" />
      ) : (
        <AbstractField />
      )}

      {/*
        A light, even wash. Enough to seat the type; not enough to read as a
        filter over the film.
      */}
      <div className="absolute inset-0 bg-navy-900/30" />

      {/*
        The scrim that does the real work: strongest at the very left edge,
        gone by 58%. It follows the copy rather than halving the frame.
      */}
      <div className="absolute inset-0 bg-[linear-gradient(96deg,color-mix(in_oklab,var(--color-navy-900)_82%,transparent)_0%,color-mix(in_oklab,var(--color-navy-900)_58%,transparent)_28%,transparent_58%)]" />

      {/* A little weight at the foot, where the proof strip sits. */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--color-navy-900)_88%,transparent),transparent)]" />
    </div>
  )
}

/**
 * The standing-in field: the 45° language at architectural scale.
 *
 * Built to look like a decision rather than an absence. It is what a visitor
 * sees until the hero video exists, and a hero that looks unfinished costs more
 * than one with no imagery at all.
 */
function AbstractField() {
  return (
    <svg
      className="size-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="1440" height="900" fill="var(--color-navy-900)" />

      {/* A field of diagonals, densest on the right where the copy is not. */}
      <g strokeWidth="1.5" fill="none">
        {Array.from({ length: 30 }, (_, i) => (
          <line
            key={i}
            x1={i * 72 - 260}
            y1="900"
            x2={i * 72 + 340}
            y2="-40"
            stroke="var(--color-navy-600)"
            opacity={Math.min(0.85, 0.1 + i * 0.035)}
          />
        ))}
      </g>

      {/* Concentric rotated squares — the logomark opened out. */}
      <g fill="none">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={1010 - i * 78}
            y={370 - i * 78}
            width={120 + i * 156}
            height={120 + i * 156}
            transform={`rotate(45 1070 430)`}
            stroke="var(--color-navy-600)"
            strokeWidth={i === 0 ? 3 : 2}
            opacity={0.9 - i * 0.16}
          />
        ))}
      </g>

      {/* The core, at full strength. */}
      <rect
        x="1010"
        y="370"
        width="120"
        height="120"
        fill="var(--color-amber-500)"
        transform="rotate(45 1070 430)"
      />

      {/* Sparks along one diagonal, so the field is not entirely inert. */}
      <g fill="var(--color-amber-500)">
        {[0, 1, 2].map((i) => (
          <circle key={i} r="5" cx={640 + i * 150} cy={640 - i * 150} opacity={0.5 - i * 0.12} />
        ))}
      </g>
    </svg>
  )
}
