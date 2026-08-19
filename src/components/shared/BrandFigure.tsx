import { cn } from '@/lib/utils'

/**
 * Abstract compositions built from the brand's own geometry.
 *
 * docs/01 §2 permits the 45° cut in four places and warns that overuse turns a
 * signature into a texture. These figures are not a fifth use of the cut: they
 * are compositions in the same 45° language — squares, diagonals, offsets —
 * which is what blueprint §15.1 asks for when it says "abstract systems visuals
 * instead of cliché robots".
 *
 * Every figure is decorative and says so. `aria-hidden`, no title, no label. A
 * decorative graphic that claims nothing is exactly what CLAUDE.md rule 1
 * permits — the rule is about inventing *proof*, and a geometric pattern
 * asserts nothing about clients, metrics or capability.
 *
 * They read from `--accent-glyph` and `--line` rather than naming colours, so
 * one figure is correct on bone, on navy and on amber without a variant.
 */

export type FigureName = 'grid' | 'flow' | 'layers' | 'signal' | 'converge'

const FIGURES: Record<FigureName, (id: string) => React.ReactNode> = {
  /**
   * A field of squares with one corner cut and a single amber cell — the
   * logomark's relationship to a system, at system scale.
   */
  grid: () => {
    const cells = []
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const accent = row === 1 && col === 3
        const cut = row === 3 && col === 1
        const x = col * 62
        const y = row * 62
        cells.push(
          <path
            key={`${row}-${col}`}
            d={cut ? `M${x} ${y}h34l14 14v34h-48z` : `M${x} ${y}h48v48h-48z`}
            fill={accent ? 'var(--accent-glyph)' : 'none'}
            stroke={accent ? 'none' : 'var(--line)'}
            strokeWidth="1.5"
          />,
        )
      }
    }
    return <g>{cells}</g>
  },

  /** Signals entering a system and leaving changed. */
  flow: () => (
    <g fill="none" stroke="var(--line)" strokeWidth="1.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M0 ${34 + i * 54} C90 ${34 + i * 54} 100 155 155 155 C210 155 220 ${34 + i * 54} 310 ${34 + i * 54}`}
        />
      ))}
      <rect
        x="131"
        y="131"
        width="48"
        height="48"
        fill="var(--accent-glyph)"
        transform="rotate(45 155 155)"
      />
    </g>
  ),

  /** Stacked planes, each cut at the same angle — a system in layers. */
  layers: () => (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${i * 22} ${i * 46}h${210 - i * 22}l-30 30v${46}h-${180 - i * 22}z`}
          fill={i === 1 ? 'var(--accent-glyph)' : 'none'}
          stroke={i === 1 ? 'none' : 'var(--line)'}
          strokeWidth="1.5"
        />
      ))}
    </g>
  ),

  /** Repeated diagonals at increasing weight — signal emerging from noise. */
  signal: () => (
    <g stroke="var(--line)" strokeWidth="1.5">
      {Array.from({ length: 14 }, (_, i) => (
        <line
          key={i}
          x1={i * 22}
          y1="240"
          x2={i * 22 + 90}
          y2="0"
          stroke={i === 9 ? 'var(--accent-glyph)' : 'var(--line)'}
          strokeWidth={i === 9 ? 6 : 1.5}
        />
      ))}
    </g>
  ),

  /** Many paths resolving into one — the delivery model, abstracted. */
  converge: () => (
    <g fill="none" stroke="var(--line)" strokeWidth="1.5">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M0 ${16 + i * 42} C120 ${16 + i * 42} 150 132 290 132`} />
      ))}
      <rect
        x="266"
        y="108"
        width="48"
        height="48"
        fill="var(--accent-glyph)"
        transform="rotate(45 290 132)"
      />
    </g>
  ),
}

const VIEWBOX: Record<FigureName, string> = {
  grid: '0 0 296 296',
  flow: '0 0 310 310',
  layers: '0 0 240 240',
  signal: '0 0 310 240',
  converge: '0 0 320 264',
}

export function BrandFigure({ name, className }: { name: FigureName; className?: string }) {
  return (
    <svg
      viewBox={VIEWBOX[name]}
      aria-hidden="true"
      focusable="false"
      className={cn('h-auto w-full', className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {FIGURES[name](name)}
    </svg>
  )
}
