import { Headline } from '@/components/shared/Headline'
import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell, type Canvas } from '@/components/shared/SectionShell'
import { capabilityShowcase } from '@/seed/home'

import { Tabs, type TabItem } from './Tabs'

/**
 * CapabilityTabs — docs/04 §22, home §4.6.
 *
 * The AI capability showcase. The panel's right side is a numbered reference
 * flow with stage chips — TRIGGER, RAG, GATE, EXECUTE — which is the part that
 * makes the section an argument rather than a feature list: every capability
 * shown includes the point at which a person is still in control.
 */
export function CapabilityTabs({ canvas = 'navy' }: { canvas?: Canvas } = {}) {
  const items: TabItem[] = capabilityShowcase.tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    panel: (
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
        <div>
          <h3 className="max-w-headline font-display text-h3 text-(--ink)">{tab.title}</h3>
          <p className="mt-4 max-w-measure text-body-lg">{tab.body}</p>
          <div className="mt-8">
            <Button href={capabilityShowcase.cta.href} variant="ghost-dark">
              {capabilityShowcase.cta.label}
            </Button>
          </div>
        </div>

        <div className="border-t border-(--line) pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
          <p className="font-mono text-label text-(--accent-text) uppercase">How it runs</p>
          <ol className="mt-6 space-y-6">
            {tab.flow.map((step, index) => (
              <li key={step.stage} className="grid grid-cols-[2rem_1fr] gap-4">
                <span aria-hidden="true" className="font-mono text-label text-(--ink-muted)">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block w-fit bg-navy-700 px-2 py-0.5 font-mono text-label text-bone uppercase">
                    {step.stage}
                  </span>
                  <span className="mt-2 block text-body-sm">{step.label}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    ),
  }))

  return (
    <SectionShell canvas={canvas} reveal>
      <div className="max-w-measure">
        <Eyebrow>{capabilityShowcase.eyebrow}</Eyebrow>
        <Headline className="mt-5">{capabilityShowcase.heading}</Headline>
        <p className="mt-5 text-body-lg">{capabilityShowcase.body}</p>
      </div>

      <Tabs items={items} selectLabel="AI capabilities" className="mt-12" />
    </SectionShell>
  )
}
