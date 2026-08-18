import { withPayload } from '@payloadcms/next/withPayload'
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

  experimental: {
    /**
     * Static generation runs one worker per core by default. On a machine with
     * 8GB of RAM that is seven concurrent React renderers, and the build dies
     * with exit code 1 and no error message — the signature of an OOM kill
     * rather than a compile failure.
     *
     * Two workers builds more slowly and finishes. CI runners have more memory,
     * so this can be raised there if build time starts to matter.
     */
    cpus: 2,
  },
}

// withPayload mounts the admin bundle and keeps Payload's server-only
// dependencies out of the client graph.
export default withPayload(nextConfig, { devBundleServerPackages: false })
