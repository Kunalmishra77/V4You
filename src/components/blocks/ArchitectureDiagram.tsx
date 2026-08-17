'use client'

import { Fragment, useState } from 'react'

import { cn } from '@/lib/utils'

/**
 * ArchitectureDiagram — docs/04 §25, docs/06 §C2.
 *
 * An interactive system diagram for service and industry pages. Nodes are
 * hoverable and focusable and reveal a short description.
 *
 * The accessibility requirement is unusually specific and worth honouring
 * exactly: each node is a `<button>` with a text alternative, and **the whole
 * diagram has a text summary rendered visibly below it, not only for screen
 * readers**. Visibly is the operative word. A diagram that only makes sense to
 * people who can see it and parse it is a diagram that fails a tired reader on
 * a phone as surely as it fails a blind one — the visible summary serves both.
 *
 * The nodes are HTML positioned over a CSS grid rather than SVG `<text>`,
 * because HTML buttons come with focus, hit area and text wrapping already
 * correct.
 */

export type DiagramNode = {
  id: string
  label: string
  /** Which band the node sits in, left to right. */
  layer: 'source' | 'process' | 'surface'
  description: string
}

const LAYER_LABEL: Record<DiagramNode['layer'], string> = {
  source: 'Sources',
  process: 'Processing',
  surface: 'Where people meet it',
}

const LAYERS: DiagramNode['layer'][] = ['source', 'process', 'surface']

export function ArchitectureDiagram({
  nodes,
  summary,
  caption,
}: {
  nodes: DiagramNode[]
  /** The visible prose summary. Required — see the note above. */
  summary: string
  caption: string
}) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = nodes.find((node) => node.id === activeId)

  return (
    <div>
      {/*
        The arrow columns are what make this a diagram rather than three lists.
        Without them the layers read as unrelated groups; with them the eye
        follows source → processing → surface, which is the whole argument the
        picture is making. They are `aria-hidden` — the layer headings already
        carry the sequence for a screen reader, and the visible summary below
        states it in prose.
      */}
      <div className="grid items-start gap-6 border border-(--line) p-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-4 lg:gap-6 lg:p-8">
        {LAYERS.map((layer, layerIndex) => {
          const inLayer = nodes.filter((node) => node.layer === layer)
          if (inLayer.length === 0) return null

          return (
            <Fragment key={layer}>
              {layerIndex > 0 && (
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center self-stretch max-md:h-6 max-md:rotate-90"
                >
                  <svg
                    viewBox="0 0 32 12"
                    className="h-3 w-8 text-amber-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M0 6h28M23 1l5 5-5 5" />
                  </svg>
                </div>
              )}
              <div>
                <p className="font-mono text-label text-(--accent-text) uppercase">
                  {LAYER_LABEL[layer]}
                </p>
                <ul className="mt-4 space-y-3">
                  {inLayer.map((node) => {
                    const isActive = node.id === activeId
                    return (
                      <li key={node.id}>
                        <button
                          type="button"
                          aria-pressed={isActive}
                          aria-describedby={isActive ? 'architecture-detail' : undefined}
                          onClick={() => setActiveId(isActive ? null : node.id)}
                          onMouseEnter={() => setActiveId(node.id)}
                          onFocus={() => setActiveId(node.id)}
                          className={cn(
                            'w-full border px-4 py-3 text-left font-display text-body-sm font-medium transition-colors',
                            isActive
                              ? 'border-amber-500 text-(--ink)'
                              : 'border-(--line) text-(--ink-muted) hover:border-(--ink-muted) hover:text-(--ink)',
                          )}
                        >
                          {node.label}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </Fragment>
          )
        })}
      </div>

      {/*
        The detail panel is a live region so that activating a node announces
        its description rather than changing silently.
      */}
      <div
        id="architecture-detail"
        aria-live="polite"
        className="mt-4 min-h-20 border-l-2 border-amber-500 py-1 pl-5 text-body-sm"
      >
        {active ? (
          <>
            <span className="font-display font-semibold text-(--ink)">{active.label}. </span>
            {active.description}
          </>
        ) : (
          <span className="text-(--ink-muted)">
            Select any part of the diagram to see what it does.
          </span>
        )}
      </div>

      {/*
        The visible text summary docs/04 §25 requires. It is not sr-only and it
        is not a caption — it is the diagram, written down, for anyone who would
        rather read it than decode it.
      */}
      <div className="mt-8 max-w-measure border-t border-(--line) pt-6">
        <h3 className="font-mono text-label text-(--ink-muted) uppercase">{caption}</h3>
        <p className="mt-3 text-body-sm">{summary}</p>
      </div>
    </div>
  )
}
