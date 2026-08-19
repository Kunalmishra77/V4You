import type Lenis from 'lenis'

/**
 * A module-level handle on the running Lenis instance.
 *
 * Anything that takes over the viewport — the lead-capture modal, the mobile
 * drawer, the mega menu — has to stop the smooth-scroll loop as well as setting
 * `overflow: hidden`. Setting overflow alone is not enough: Lenis drives
 * `scrollTop` directly on a rAF loop and will happily keep scrolling a document
 * the browser has been told not to scroll, so the page slides behind the modal.
 *
 * A module singleton rather than context, because the callers are scattered
 * across the tree and none of them are children of the provider in any useful
 * sense. `null` before the provider mounts and after it unmounts, so every
 * caller has to cope with its absence — which they must anyway, since Lenis
 * never starts under reduced motion.
 */

let instance: Lenis | null = null

export function setLenis(next: Lenis | null) {
  instance = next
}

export function getLenis() {
  return instance
}

/** Freeze the page. Safe to call when Lenis is not running. */
export function lockScroll() {
  instance?.stop()
}

/** Release it again. */
export function unlockScroll() {
  instance?.start()
}
