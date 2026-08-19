'use client'

import { useEffect, useState } from 'react'

/**
 * The small rotating strip at the foot of the hero.
 *
 * The reference this is modelled on puts award badges here — "App Development
 * Company of the Year" and similar. V4You has no awards, no permitted client
 * logos and no certifications, and inventing any of them is the exact failure
 * CLAUDE.md rule 1 exists to prevent. A visitor reads a strip in this position
 * as proof, which is precisely why it cannot be filled with something that only
 * looks like proof.
 *
 * So it carries the technology ecosystem instead, under the label docs/04 §14
 * fixes: "Technologies we work with" — never "our partners". That is true
 * today, it occupies the slot honestly, and it still does the job of showing a
 * visitor that real engineering happens here.
 *
 * When permitted client logos exist, pass them as `items` and the same
 * component shows those instead. The slot is built for the proof it will have,
 * not the proof it wishes it had.
 */
export function HeroProofStrip({
  items,
  label = 'Technologies we work with',
  interval = 2600,
}: {
  items: string[]
  label?: string
  interval?: number
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || items.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), interval)
    return () => clearInterval(id)
  }, [items.length, interval, paused])

  if (items.length === 0) return null

  // Three at a time, wrapping — enough to read as a set rather than a ticker.
  const visible = [0, 1, 2].map((offset) => items[(index + offset) % items.length])

  return (
    <div
      className="w-full max-w-sm"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <p className="font-mono text-label text-slate-300 uppercase">{label}</p>

      {/*
        The full list is in the DOM for assistive technology and for crawlers;
        the rotation is a visual treatment on top of it. A screen reader gets
        the set, not a word that changes underneath it.
      */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        className="mt-3 grid grid-cols-3 gap-px bg-navy-700 [@media(max-height:820px)]:mt-2"
      >
        {visible.map((item, position) => (
          <div
            key={`${item}-${position}`}
            className="flex min-h-16 items-center justify-center bg-navy-800/80 px-3 py-3 text-center [@media(max-height:820px)]:min-h-12 [@media(max-height:820px)]:py-2"
          >
            <span className="font-display text-body-sm font-medium text-bone">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
