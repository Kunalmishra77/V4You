import { DiagramSparks } from './DiagramSparks'

/**
 * The orchestration diagram — docs/01 §6.
 *
 * The page's thesis, drawn: signals enter from customers, operations, data and
 * teams; an intelligence layer routes work out to products, agents, dashboards
 * and people. Inline SVG, no library.
 *
 * The centre is a 45°-rotated square — the logomark restated at the heart of
 * the page's main visual, and the fourth and last permitted use of the cut
 * (docs/01 §2).
 *
 * What it must not be, per the spec: not a robot, not a neural-network cliché,
 * not a floating gradient orb. It is an architecture diagram and should be
 * legible as one.
 *
 * Accessibility: one `role="img"` with a sentence-long label. Individual nodes
 * are deliberately not exposed — a screen reader reading sixteen disconnected
 * words produces noise, not a diagram.
 */

const INPUTS = ['Customers', 'Operations', 'Data', 'Teams']
const OUTPUTS = ['Products', 'Agents', 'Dashboards', 'People']

const W = 780
const H = 560
const ROWS = [70, 210, 350, 490]
const NODE_W = 168
const NODE_H = 52
const CORE = { x: 390, y: 280, half: 92 }

const LEFT_EDGE = NODE_W
const RIGHT_EDGE = W - NODE_W

/** Input i → the core's left vertex. */
const inPath = (y: number) =>
  `M${LEFT_EDGE} ${y} C${LEFT_EDGE + 110} ${y} ${CORE.x - CORE.half - 90} ${CORE.y} ${CORE.x - CORE.half} ${CORE.y}`

/** The core's right vertex → output i. */
const outPath = (y: number) =>
  `M${CORE.x + CORE.half} ${CORE.y} C${CORE.x + CORE.half + 90} ${CORE.y} ${RIGHT_EDGE - 110} ${y} ${RIGHT_EDGE} ${y}`

export function OrchestrationDiagram() {
  const paths = [
    ...ROWS.map((y, i) => ({ id: `flow-in-${i}`, d: inPath(y) })),
    ...ROWS.map((y, i) => ({ id: `flow-out-${i}`, d: outPath(y) })),
  ]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="An architecture diagram: signals from customers, operations, data and teams flow into an intelligence layer, which routes work out to products, agents, dashboards and people."
      className="h-auto w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {paths.map((path) => (
          <path key={path.id} id={path.id} d={path.d} />
        ))}
      </defs>

      {/* Connections, drawn first so the nodes sit on top of them. */}
      <g fill="none" stroke="var(--color-navy-600)" strokeWidth="1.5">
        {paths.map((path) => (
          <use key={path.id} href={`#${path.id}`} />
        ))}
      </g>

      {/* Input nodes */}
      {ROWS.map((y, i) => (
        <g key={INPUTS[i]}>
          <rect
            x="0"
            y={y - NODE_H / 2}
            width={NODE_W}
            height={NODE_H}
            fill="var(--color-navy-800)"
            stroke="var(--color-navy-700)"
          />
          <text
            x={NODE_W / 2}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--color-bone)"
            fontFamily="var(--font-body)"
            fontSize="16"
          >
            {INPUTS[i]}
          </text>
        </g>
      ))}

      {/* Output nodes */}
      {ROWS.map((y, i) => (
        <g key={OUTPUTS[i]}>
          <rect
            x={RIGHT_EDGE}
            y={y - NODE_H / 2}
            width={NODE_W}
            height={NODE_H}
            fill="var(--color-navy-800)"
            stroke="var(--color-navy-700)"
          />
          <text
            x={RIGHT_EDGE + NODE_W / 2}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--color-bone)"
            fontFamily="var(--font-body)"
            fontSize="16"
          >
            {OUTPUTS[i]}
          </text>
        </g>
      ))}

      {/* The core: the logomark's square, rotated 45°. */}
      <rect
        x={CORE.x - CORE.half / Math.SQRT2 - 20}
        y={CORE.y - CORE.half / Math.SQRT2 - 20}
        width={(CORE.half / Math.SQRT2 + 20) * 2}
        height={(CORE.half / Math.SQRT2 + 20) * 2}
        fill="var(--color-amber-500)"
        transform={`rotate(45 ${CORE.x} ${CORE.y})`}
      />
      {/* Label stays horizontal — a rotated label is a logo, not a diagram. */}
      <text
        x={CORE.x}
        y={CORE.y - 9}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--color-navy-900)"
        fontFamily="var(--font-mono)"
        fontSize="13"
        fontWeight="500"
        letterSpacing="1.4"
      >
        INTELLIGENCE
      </text>
      <text
        x={CORE.x}
        y={CORE.y + 11}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--color-navy-900)"
        fontFamily="var(--font-mono)"
        fontSize="13"
        fontWeight="500"
        letterSpacing="1.4"
      >
        LAYER
      </text>

      <DiagramSparks pathIds={paths.map((p) => p.id)} />
    </svg>
  )
}
