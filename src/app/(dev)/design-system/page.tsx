import type { Metadata } from 'next'

/**
 * Living proof sheet for the design system: every colour, every one of the nine
 * type steps, and each use of the 45° cut, all read from the token layer.
 *
 * It is a real route so it can be reviewed in a browser, but it is noindexed,
 * unlinked, and excluded from the sitemap. It is a build tool, not a page.
 */

export const metadata: Metadata = {
  title: 'Design system — V4You',
  robots: { index: false, follow: false },
}

const swatches = [
  { token: 'navy-900', hex: '#0A1D3E', note: 'Primary ink, dark canvas' },
  { token: 'navy-800', hex: '#12294F', note: 'Elevated surface on dark' },
  { token: 'navy-700', hex: '#1C3A66', note: 'Borders on dark' },
  { token: 'navy-600', hex: '#2A4C7D', note: 'Hover borders on dark' },
  { token: 'amber-500', hex: '#EDA11A', note: 'The accent. Fill only on light.' },
  { token: 'amber-600', hex: '#C98611', note: 'Amber hover / pressed' },
  { token: 'amber-ink', hex: '#7A4F06', note: 'Amber-family text on light' },
  { token: 'bone', hex: '#F6F5F1', note: 'Light canvas' },
  { token: 'bone-2', hex: '#EEEDE7', note: 'Alternate light section' },
  { token: 'white', hex: '#FFFFFF', note: 'Card surface on bone' },
  { token: 'slate-500', hex: '#5B6B85', note: 'Body text on light' },
  { token: 'slate-300', hex: '#93A4BF', note: 'Body text on dark' },
  { token: 'line-light', hex: '#DEDCD4', note: 'Borders on light' },
  { token: 'line-dark', hex: '#1F3A63', note: 'Borders on dark' },
]

/**
 * `measure` caps at 68ch for long-form, `headline` at 20ch — docs/01 §3. Which
 * cap a step gets is part of what this sheet is proving.
 */
const steps = [
  { name: 'display', cls: 'text-display font-display', width: 'headline', sample: 'Build what’s next.' },
  {
    name: 'h1',
    cls: 'text-h1 font-display',
    width: 'headline',
    sample: 'Turn AI potential into operating advantage.',
  },
  {
    name: 'h2',
    cls: 'text-h2 font-display',
    width: 'headline',
    sample: 'Start with the business problem',
  },
  { name: 'h3', cls: 'text-h3 font-display', width: 'headline', sample: 'Disconnected systems' },
  {
    name: 'body-lg',
    cls: 'text-body-lg font-body text-slate-500',
    width: 'measure',
    sample:
      'V4You helps startups, SMEs and enterprises turn complex business challenges into intelligent products, connected workflows and measurable growth.',
  },
  {
    name: 'body',
    cls: 'text-body font-body text-slate-500',
    width: 'measure',
    sample:
      'Leads live in one tool. Operations run on spreadsheets. Customer questions arrive after hours. Reports arrive too late. Teams spend their best energy moving information between systems.',
  },
  {
    name: 'body-sm',
    cls: 'text-body-sm font-body text-slate-500',
    width: 'measure',
    sample: 'Results depend on context, data, and adoption. Indicative estimate — not a proposal.',
  },
  {
    name: 'label',
    cls: 'text-label font-mono uppercase text-amber-ink',
    width: 'measure',
    sample: 'AI-first transformation',
  },
  { name: 'metric', cls: 'text-metric font-display', width: 'headline', sample: '68%' },
] as const

export default function TokenProofSheet() {
  return (
    <main className="mx-auto w-full max-w-content px-gutter py-16">
      <p className="flex items-center gap-3">
        <span aria-hidden="true" className="cut-slash block size-4 bg-amber-500" />
        <span className="font-mono text-label uppercase text-amber-ink">Build reference</span>
      </p>
      <h1 className="mt-4 max-w-headline text-h1 font-display">Design system</h1>
      <p className="mt-5 max-w-measure text-body-lg text-slate-500">
        Every value on this page is read from the token layer in <code>globals.css</code>. If a
        swatch or a type step looks wrong here, the tokens are wrong — not the component using
        them. Source of truth: <code>docs/01-design-system.md</code>.
      </p>

      <h2 className="mt-16 text-h2 font-display">Colour</h2>
      <ul className="mt-8 grid gap-px border border-line-light bg-line-light sm:grid-cols-2 lg:grid-cols-3">
        {swatches.map((s) => (
          <li key={s.token} className="flex items-center gap-4 bg-white p-4">
            <span
              aria-hidden="true"
              className="size-14 shrink-0 border border-line-light"
              style={{ backgroundColor: s.hex }}
            />
            <span className="min-w-0">
              <span className="block font-mono text-body-sm text-navy-900">{s.token}</span>
              <span className="block font-mono text-label uppercase text-slate-500">{s.hex}</span>
              <span className="mt-1 block text-body-sm text-slate-500">{s.note}</span>
            </span>
          </li>
        ))}
      </ul>

      <h2 className="mt-16 text-h2 font-display">Type scale</h2>
      <dl className="mt-8 divide-y divide-line-light border-y border-line-light">
        {steps.map((s) => (
          <div key={s.name} className="grid gap-2 py-6 md:grid-cols-[8rem_1fr] md:gap-8">
            <dt className="pt-1 font-mono text-label uppercase text-slate-500">{s.name}</dt>
            <dd
              className={`${s.cls} ${s.width === 'headline' ? 'max-w-headline' : 'max-w-measure'}`}
            >
              {s.sample}
            </dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-16 text-h2 font-display">The 45° cut</h2>
      <p className="mt-4 max-w-measure text-body text-slate-500">
        Three of its four uses are shown. The fourth is the hero diagram’s rotated core, which
        arrives with that component.
      </p>
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="font-mono text-label uppercase text-slate-500">Card — 22px</p>
          <div className="mt-3 cut-card border border-line-light bg-white p-6">
            <p className="text-h3 font-display">Manual operations</p>
            <p className="mt-2 text-body-sm text-slate-500">
              Repetitive work absorbs expensive human time.
            </p>
          </div>
        </div>
        <div>
          <p className="font-mono text-label uppercase text-slate-500">Button — 14px, two corners</p>
          <p className="mt-3">
            <span className="cut-button inline-block bg-amber-500 px-6 py-3 font-display font-semibold text-navy-900">
              Book a transformation consultation
            </span>
          </p>
        </div>
        <div>
          <p className="font-mono text-label uppercase text-slate-500">Eyebrow glyph — 16px</p>
          <p className="mt-3 flex items-center gap-3">
            <span aria-hidden="true" className="cut-slash block size-4 bg-amber-500" />
            <span className="font-mono text-label uppercase text-amber-ink">
              AI-first transformation
            </span>
          </p>
        </div>
      </div>

      <h2 className="mt-16 text-h2 font-display">On navy</h2>
      <div className="mt-8 bg-navy-900 p-8">
        <p className="flex items-center gap-3">
          <span aria-hidden="true" className="cut-slash block size-4 bg-amber-500" />
          <span className="font-mono text-label uppercase text-amber-500">Proof over promises</span>
        </p>
        <p className="mt-4 max-w-headline text-h2 font-display text-bone">
          Growth gets harder when your systems do not work together.
        </p>
        <p className="mt-4 max-w-measure text-body-lg text-slate-300">
          On navy, amber is both a fill and a typeface colour — 7.72:1. On bone it is a fill,
          rule or icon only.
        </p>
      </div>
    </main>
  )
}
