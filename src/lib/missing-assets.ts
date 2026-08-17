import 'server-only'

import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

/**
 * The missing-asset log — T-014, CLAUDE.md "what to do when something is
 * missing".
 *
 * When a component finds no data it renders its documented empty state and
 * calls this, so the gap ends up written down instead of quietly absorbed. The
 * whole point of the empty-state policy is that an absence stays visible to the
 * people who can fill it.
 *
 * In development it appends to a machine-managed block in MISSING-ASSETS.md,
 * deduplicated by component and asset. In production it does nothing at all —
 * a marketing page must never touch the filesystem to serve a request.
 */

export type MissingAsset = {
  /** The component that needed it, e.g. `TrustBar`. */
  component: string
  /** What is missing, e.g. `clients with logoUsagePermitted: true`. */
  needs: string
  /** What the absence costs, e.g. `home §2 falls back to CapabilityStrip`. */
  blocks: string
}

const BEGIN = '<!-- BEGIN:auto-logged -->'
const END = '<!-- END:auto-logged -->'

/** Deduplicates within a process. Dev servers re-render constantly. */
const seen = new Set<string>()

export function reportMissingAsset(asset: MissingAsset) {
  if (process.env.NODE_ENV !== 'development') return

  const key = `${asset.component}::${asset.needs}`
  if (seen.has(key)) return
  seen.add(key)

  const line = `| \`${asset.component}\` | ${asset.needs} | ${asset.blocks} |`
  const file = path.join(process.cwd(), 'MISSING-ASSETS.md')

  try {
    const existing = readFileSync(file, 'utf8')
    if (existing.includes(line)) return

    const updated = existing.includes(BEGIN)
      ? // Insert immediately above the closing marker so the table stays intact.
        existing.replace(`\n${END}`, `${line}\n${END}`)
      : existing.trimEnd() +
        '\n' +
        [
          '',
          '---',
          '',
          '## Logged automatically by components',
          '',
          'Written by `reportMissingAsset()` when a component renders its empty state.',
          'Entries are appended, never removed — delete a row once the asset lands.',
          '',
          BEGIN,
          '',
          '| Component | Needs | Blocks |',
          '|---|---|---|',
          line,
          END,
          '',
        ].join('\n')

    writeFileSync(file, updated, 'utf8')
  } catch {
    // A logging helper must never take a page down with it.
    console.warn(`[missing-asset] ${asset.component} needs ${asset.needs} — ${asset.blocks}`)
  }
}
