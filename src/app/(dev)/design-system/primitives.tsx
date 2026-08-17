import { Button } from '@/components/shared/Button'
import { CutCard } from '@/components/shared/CutCard'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell, type Canvas } from '@/components/shared/SectionShell'

/**
 * The primitives, rendered on every canvas they are meant to survive. The point
 * of showing all six is that a component should never need to be told which
 * surface it is on — if a ghost button or an eyebrow looks wrong on one of
 * these, the surface tokens are wrong.
 */

const canvases: { canvas: Canvas; label: string }[] = [
  { canvas: 'bone', label: 'bone — the light canvas' },
  { canvas: 'bone-2', label: 'bone-2 — alternate light section' },
  { canvas: 'white', label: 'white — card surface' },
  { canvas: 'navy', label: 'navy — the dark canvas' },
  { canvas: 'navy-800', label: 'navy-800 — elevated dark' },
  { canvas: 'amber', label: 'amber — the CTA band' },
]

export function Primitives() {
  return (
    <>
      {canvases.map(({ canvas, label }) => (
        <SectionShell key={canvas} canvas={canvas} density="tight">
          <p className="font-mono text-label uppercase text-(--ink-muted)">{label}</p>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
            <div>
              <Eyebrow>AI-first transformation</Eyebrow>
              <h3 className="mt-4 max-w-headline text-h2 font-display text-(--ink)">
                One partner from opportunity to operating impact.
              </h3>
              <p className="mt-4 max-w-measure text-body-lg">
                V4You brings consulting, product thinking, engineering, AI, automation, cloud and
                growth into one connected delivery model.
              </p>

              {/*
                On the amber band the primary CTA is the `navy` variant, per
                docs/04 §29 — "amber canvas, navy text and navy button". An
                amber button on amber would be invisible, which is why the
                variant is a deliberate choice at the call site rather than
                something the canvas overrides silently.
              */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href="/contact" variant={canvas === 'amber' ? 'navy' : 'primary'}>
                  Book a transformation consultation
                </Button>
                <Button
                  href="/services"
                  variant={canvas.startsWith('navy') ? 'ghost-dark' : 'ghost-light'}
                >
                  Explore what we do
                </Button>
              </div>
            </div>

            <CutCard
              variant={canvas.startsWith('navy') ? 'dark' : 'light'}
              interactive
              className="p-6"
            >
              <p className="font-mono text-label uppercase text-(--accent-text)">01</p>
              <h4 className="mt-3 text-h3 font-display text-(--ink)">Disconnected systems</h4>
              <p className="mt-2 text-body-sm">Important data is trapped across tools.</p>
              <p className="mt-5">
                <a
                  href="/contact"
                  className="text-body-sm font-medium text-(--ink) underline underline-offset-4 after:absolute after:inset-0"
                >
                  Find your highest-value opportunity
                </a>
              </p>
            </CutCard>
          </div>
        </SectionShell>
      ))}
    </>
  )
}
