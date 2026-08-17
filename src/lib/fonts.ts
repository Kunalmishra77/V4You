import { IBM_Plex_Mono, Inter_Tight, Schibsted_Grotesk } from 'next/font/google'

/**
 * Three faces, three jobs (docs/01 §3). Loaded with `display: 'swap'` and the
 * latin subset; next/font self-hosts the subset at build time, which is what
 * docs/01 asks for in production and what keeps the font off the critical path.
 *
 * Each exposes a CSS custom property consumed by the `--font-*` theme tokens in
 * globals.css, so components only ever reference `font-display`, `font-body` or
 * `font-mono`.
 */

export const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-schibsted-grotesk',
})

export const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  variable: '--font-inter-tight',
})

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
})

export const fontVariables = [
  schibstedGrotesk.variable,
  interTight.variable,
  ibmPlexMono.variable,
].join(' ')
