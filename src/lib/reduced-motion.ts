/**
 * The reduced-motion check, deliberately in a module of its own.
 *
 * It used to live in `@/lib/motion`, which is the module that imports GSAP.
 * MotionProvider has to ask this question *before* deciding whether to fetch
 * GSAP at all, so importing it from there pulled the whole 136KB graph into the
 * initial bundle to run one `matchMedia` call.
 *
 * Keep this file free of anything that imports a motion library.
 */
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
