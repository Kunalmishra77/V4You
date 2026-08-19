'use client'

import { useActionState, useCallback, useEffect, useRef, useState } from 'react'

import { submitConsultation, type ConsultationState } from '@/app/(site)/contact/actions'
import { Button } from '@/components/shared/Button'
import { Eyebrow } from '@/components/shared/Eyebrow'
import { cn } from '@/lib/utils'

/**
 * The lead-capture modal — blueprint §13.6.
 *
 * Modelled on the pattern the client supplied, with the proof removed, because
 * V4You does not have any of it. The reference fills its left panel with a
 * client count, a named testimonial, four award logos and a row of client
 * logos. Of those five, V4You currently has zero. Rebuilding it faithfully
 * would mean the most interruptive surface on the site was also the least
 * true one.
 *
 * What replaces it is the one thing V4You can say without evidence from anyone
 * else: exactly what happens after the form is submitted. blueprint §13.6 asks
 * for "a useful asset, not a generic discount", and for someone weighing up an
 * enquiry, knowing what the next thirty minutes look like is the useful thing.
 *
 * Accessibility, all of which a modal has to earn:
 *   - `role="dialog"` with `aria-modal`, labelled by its heading
 *   - focus moved in on open, trapped while open, returned to the trigger on
 *     close
 *   - Escape closes; the backdrop closes; the close button is reachable first
 *   - body scroll locked without the sideways jump from a vanishing scrollbar
 *   - never animates under `prefers-reduced-motion`
 *
 * Shown once per session, per blueprint §13.6.
 */

const SESSION_KEY = 'v4you:lead-modal-seen'

export type ModalTrigger =
  /** Fires when the pointer leaves toward the browser chrome. Desktop only. */
  | 'exit-intent'
  /** Fires after a delay. Interrupts before the visitor has read anything. */
  | { afterSeconds: number }

export function LeadCaptureModal({
  trigger = 'exit-intent',
  source,
}: {
  trigger?: ModalTrigger
  source: string
}) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const [state, formAction, pending] = useActionState<ConsultationState, FormData>(
    submitConsultation,
    { ok: false },
  )

  const close = useCallback(() => {
    setOpen(false)
    previouslyFocused.current?.focus()
  }, [])

  const show = useCallback(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // Private browsing. Showing once per page load is an acceptable fallback.
    }
    previouslyFocused.current = document.activeElement as HTMLElement
    setOpen(true)
  }, [])

  // --- Trigger -------------------------------------------------------------
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return
    } catch {
      /* ignore */
    }

    if (trigger === 'exit-intent') {
      // Only meaningful with a pointer. On touch there is no "leaving toward
      // the browser chrome" gesture, and firing on a scroll-up guess mostly
      // catches people who are still reading.
      if (!window.matchMedia('(pointer: fine)').matches) return

      const onLeave = (event: MouseEvent) => {
        if (event.clientY <= 0) show()
      }
      document.addEventListener('mouseout', onLeave)
      return () => document.removeEventListener('mouseout', onLeave)
    }

    const id = setTimeout(show, trigger.afterSeconds * 1000)
    return () => clearTimeout(id)
  }, [trigger, show])

  // --- Modal behaviour -----------------------------------------------------
  useEffect(() => {
    if (!open) return

    const { body, documentElement } = document
    const scrollbar = window.innerWidth - documentElement.clientWidth
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    panelRef.current?.querySelector<HTMLElement>('button')?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
    }
  }, [open, close])

  if (!open) return null

  const errors = state.errors ?? {}

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/80 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-modal-heading"
        className="grid max-h-[92svh] w-full max-w-4xl grid-cols-1 overflow-y-auto bg-navy-900 surface-navy lg:grid-cols-2"
      >
        {/* Left — what actually happens next. The only proof we own. */}
        <div className="flex flex-col justify-between bg-navy-800 p-8 surface-navy-800 lg:p-10">
          <div>
            <Eyebrow>Before you go</Eyebrow>
            <h2
              id="lead-modal-heading"
              className="mt-5 max-w-headline font-display text-h2 text-(--ink)"
            >
              Tell us what you are trying to change.
            </h2>
            <p className="mt-4 text-body-sm">
              You do not need a brief, a budget or a decision. A first conversation is worth having
              even if the answer turns out to be that you need less than you thought.
            </p>

            <ol className="mt-8 space-y-5">
              {[
                'We reply within one business day.',
                'The first call is 30 minutes. We come with questions, not a pitch.',
                'You leave with a suggested next step — even if it is not us.',
              ].map((step, index) => (
                <li key={step} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span aria-hidden="true" className="font-mono text-label text-(--accent-text)">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-body-sm text-(--ink)">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-8 border-t border-navy-700 pt-5 text-body-sm">
            Your project details stay confidential. Need an NDA? Mention it in the message.
          </p>
        </div>

        {/* Right — the short form */}
        <div className="p-8 lg:p-10">
          <div className="flex items-start justify-between gap-4">
            <p className="text-body-sm">
              Share what you are working on and we will come back prepared.
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="-mt-2 -mr-2 inline-flex size-11 shrink-0 items-center justify-center text-(--ink)"
            >
              <span aria-hidden="true" className="relative block size-4">
                <span className="absolute top-1/2 left-0 h-0.5 w-full rotate-45 bg-current" />
                <span className="absolute top-1/2 left-0 h-0.5 w-full -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          {state.ok ? (
            <div className="mt-8" role="status">
              <p className="font-display text-h3 text-(--ink)">Thank you — that is with us.</p>
              <p className="mt-3 text-body-sm">
                We reply within one business day. If it is urgent, say so in a reply to the
                confirmation email and we will move it up.
              </p>
              <Button href="/thank-you" className="mt-6">
                What happens next
              </Button>
            </div>
          ) : (
            <form action={formAction} className="mt-6 space-y-5">
              <input type="hidden" name="source" value={source} />
              {/* Honeypot — a real person never fills a field they cannot see. */}
              <input
                type="text"
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="sr-only"
              />

              <ModalField
                id="modal-name"
                name="name"
                label="Your name"
                error={errors.name}
                required
              />
              <ModalField
                id="modal-email"
                name="email"
                type="email"
                label="Work email"
                error={errors.email}
                required
              />
              <ModalField
                id="modal-company"
                name="company"
                label="Company"
                error={errors.company}
              />

              <div>
                <label htmlFor="modal-brief" className="block text-body-sm text-(--ink)">
                  What are you trying to change?
                </label>
                <textarea
                  id="modal-brief"
                  name="projectBrief"
                  rows={3}
                  aria-describedby={errors.projectBrief ? 'modal-brief-error' : undefined}
                  className="mt-2 w-full border border-navy-700 bg-navy-800 px-3 py-2 text-body-sm text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                />
                {errors.projectBrief && (
                  <p id="modal-brief-error" className="mt-2 text-body-sm text-error">
                    {errors.projectBrief}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-start gap-3 text-body-sm">
                  <input
                    id="modal-consent"
                    type="checkbox"
                    name="consent"
                    required
                    aria-describedby={errors.consent ? 'modal-consent-error' : undefined}
                    className="mt-1 size-4 shrink-0 accent-amber-500"
                  />
                  <span>
                    I agree that V4You can store these details and contact me about this enquiry.
                    <span className="ml-1 text-(--accent-text)" aria-hidden="true">
                      *
                    </span>
                  </span>
                </label>
                {errors.consent && (
                  <p id="modal-consent-error" className="text-body-sm text-error">
                    {errors.consent}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={pending} block>
                {pending ? 'Sending…' : 'Send it over'}
              </Button>

              <p aria-live="polite" className="sr-only">
                {pending ? 'Sending your enquiry' : ''}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function ModalField({
  id,
  name,
  label,
  type = 'text',
  error,
  required = false,
}: {
  id: string
  name: string
  label: string
  type?: string
  error?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-body-sm text-(--ink)">
        {label}
        {required && (
          <span className="ml-1 text-(--accent-text)" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={Boolean(error)}
        className={cn(
          'mt-2 w-full border bg-navy-800 px-3 py-2 text-body-sm text-bone',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500',
          error ? 'border-error' : 'border-navy-700',
        )}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-body-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
}
