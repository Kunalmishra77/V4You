import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // CLAUDE.md is the project contract from docs/, not a generated file. Next
  // otherwise appends its own agent-rules block to it on every `next dev`.
  agentRules: false,

  // docs/06 §A1: trailing slash off, enforced consistently — mismatches create
  // duplicate URLs.
  trailingSlash: false,

  images: {
    // docs/02 §4: AVIF first, WebP fallback.
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
