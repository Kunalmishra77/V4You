import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

/**
 * GSAP registration, in one place.
 *
 * Registering a plugin twice is harmless but registering it in three different
 * modules means three different files import GSAP, and the bundler has no way
 * to know they are the same intent. Everything that needs GSAP imports it from
 * here.
 *
 * This module is only ever reached from a `'use client'` component, and every
 * one of those is loaded through `next/dynamic` with `ssr: false`, so GSAP
 * stays out of the server bundle and out of the initial chunk.
 */

let registered = false

export function registerGsap() {
  if (registered) return
  gsap.registerPlugin(ScrollTrigger, SplitText)
  registered = true
}

/**
 * The site's motion vocabulary, matched to the tokens in globals.css.
 *
 * These are duplicated from CSS rather than read out of it because GSAP needs
 * numbers, and reading a custom property at runtime to parse a cubic-bezier
 * back into a GSAP ease is a lot of machinery for a value that changes once a
 * year. They are named the same, so a change to one is an obvious prompt to
 * change the other.
 */
export const EASE = {
  /** Arrivals: fast in, long settle. Matches `--ease-expo`. */
  expo: 'expo.out',
  /** Fades and general reveals. Matches `--ease-reveal`. */
  reveal: 'power2.out',
  /** Symmetric, for state that toggles. Matches `--ease-swap`. */
  swap: 'power2.inOut',
} as const

export const DURATION = {
  line: 0.9,
  reveal: 0.6,
  swap: 0.26,
} as const

export const STAGGER = {
  /** Between peers in a grid. */
  step: 0.09,
  /** Between the lines of a heading — slower, because lines are read. */
  line: 0.11,
} as const

/**
 * Where a trigger fires, as a ScrollTrigger `start` string.
 *
 * 85% rather than the more common 80%: with Lenis running, the eye reaches the
 * element slightly before the scroll position settles, and a later trigger
 * reads as the animation chasing the scroll rather than greeting it.
 */
export const TRIGGER_START = 'top 85%'

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export { gsap, ScrollTrigger, SplitText }
