'use client'

import { useEffect, useState } from 'react'

/**
 * The travelling dots on the orchestration diagram — docs/01 §6.
 *
 * Eight sparks on eight paths, staggered, 3.6s to 5.0s, driven by native SMIL
 * `animateMotion`. No animation library: the motion follows a path that already
 * exists in the DOM, which is precisely what SMIL does and what a JS tween
 * would have to reimplement.
 *
 * docs/01 §5 requires these to be **removed from the DOM** under reduced
 * motion rather than paused, so this renders nothing until it has confirmed
 * motion is welcome. That ordering matters: the server renders no sparks, so a
 * visitor who prefers reduced motion never receives them at all, rather than
 * receiving them and having them stripped after hydration.
 */
export function DiagramSparks({ pathIds }: { pathIds: string[] }) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setAnimate(!query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  if (!animate) return null

  return (
    <g aria-hidden="true">
      {pathIds.map((id, index) => {
        // Spread the eight sparks across the specified ranges so no two ever
        // arrive at the core together.
        const dur = 3.6 + (index % 4) * 0.35 + (index >= 4 ? 0.2 : 0)
        const begin = (index * 3.2) / pathIds.length

        return (
          <circle key={id} r="4.5" fill="var(--color-amber-500)">
            <animateMotion
              dur={`${dur.toFixed(2)}s`}
              begin={`${begin.toFixed(2)}s`}
              repeatCount="indefinite"
            >
              <mpath href={`#${id}`} />
            </animateMotion>
          </circle>
        )
      })}
    </g>
  )
}
