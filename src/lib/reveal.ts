import type { CSSProperties } from 'react'

/**
 * Props that mark an element as a staggered peer inside a revealing section.
 *
 * Spread it onto each item of a mapped list:
 *
 *     {cards.map((card, index) => (
 *       <li key={card.title} {...revealChild(index)}>…</li>
 *     ))}
 *
 * and set `reveal="stagger"` on the section that contains them.
 *
 * The index goes out as a custom property rather than a computed delay so the
 * timing itself stays in the stylesheet, next to the rest of the motion, and a
 * change to the step does not mean touching fifteen components. The motion
 * runtime overrides both with a GSAP stagger when it is available; the custom
 * property is what makes the effect survive without it.
 */
export function revealChild(index: number) {
  return {
    'data-reveal-child': '',
    style: { '--reveal-index': index } as CSSProperties,
  }
}
