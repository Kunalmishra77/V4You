'use client'

import { useState } from 'react'

import { Eyebrow } from '@/components/shared/Eyebrow'
import { SectionShell } from '@/components/shared/SectionShell'
import { cn } from '@/lib/utils'

/**
 * TestimonialSlider — docs/04 §15.
 *
 * Empty state is **omit**: no permitted testimonials means no section at all.
 * docs/04's policy calls this "better absent than hollow", and the alternative —
 * a placeholder quote about building a proof library — is a company talking
 * about itself in a slot reserved for a customer talking about it.
 *
 * `<blockquote>` with `<cite>`, arrow-key navigation, and **no autoplay**.
 * Autoplay in a quote carousel moves text while someone is reading it, which is
 * a WCAG 2.2.2 failure as well as an annoyance.
 */

export type Testimonial = {
  quote: string
  authorName: string
  authorRole: string
  company: string
}

export function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0)

  // Omit entirely. The caller does not need to check first.
  if (testimonials.length === 0) return null

  const current = testimonials[index]
  const go = (next: number) => setIndex((next + testimonials.length) % testimonials.length)

  return (
    <SectionShell canvas="navy" reveal>
      <Eyebrow>In their words</Eyebrow>

      <figure
        className="mt-8"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') go(index + 1)
          if (event.key === 'ArrowLeft') go(index - 1)
        }}
      >
        <blockquote className="max-w-measure">
          <p className="font-display text-h2 text-(--ink)">“{current.quote}”</p>
        </blockquote>
        <figcaption className="mt-8 text-body-sm">
          <cite className="font-display font-semibold text-(--ink) not-italic">
            {current.authorName}
          </cite>
          <span className="mt-1 block">
            {current.authorRole}, {current.company}
          </span>
        </figcaption>
      </figure>

      {testimonials.length > 1 && (
        <div className="mt-10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous testimonial"
            className="inline-flex size-11 items-center justify-center border border-(--line) text-(--ink) transition-colors hover:border-amber-500"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next testimonial"
            className="inline-flex size-11 items-center justify-center border border-(--line) text-(--ink) transition-colors hover:border-amber-500"
          >
            <span aria-hidden="true">→</span>
          </button>
          <p aria-live="polite" className="ml-2 font-mono text-label text-(--ink-muted) uppercase">
            {index + 1} of {testimonials.length}
          </p>
        </div>
      )}

      <div className={cn('sr-only')} aria-live="polite">
        {current.authorName}, {current.company}
      </div>
    </SectionShell>
  )
}
