'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'

import { Field, inputClass } from '@/components/forms/Field'
import { Button } from '@/components/shared/Button'
import { submitConsultation, type ConsultationState } from '@/app/(site)/contact/actions'
import { track } from '@/lib/analytics'
import { BUDGET_RANGES, TIMELINES } from '@/lib/forms/consultation-schema'
import { serviceCards } from '@/seed/services'

/**
 * ConsultationForm — docs/04 §30, docs/06 §C1.
 *
 * Progressive enhancement, not a JavaScript app: `<form action={...}>` posts to
 * the Server Action directly, so the form works with scripting disabled. What
 * this component adds is inline errors, a pending state, and focus management —
 * improvements on a thing that already worked.
 *
 * The accessibility contract, all of it required by docs/04 §30:
 *   - every field has a real label
 *   - errors are linked with aria-describedby and marked aria-invalid
 *   - an error summary sits at the top and takes focus on a failed submit,
 *     because an inline error four fields below the fold is an error nobody
 *     finds
 *   - status is announced through aria-live="polite"
 *
 * The "what happens next" block above the submit button is also a requirement,
 * and the reason is in the blueprint: every form explains what follows. A form
 * that does not is asking for trust it has not offered anything for.
 */

const initialState: ConsultationState = { ok: false }

export function ConsultationForm({ source = '/contact' }: { source?: string }) {
  const [state, formAction] = useActionState(submitConsultation, initialState)
  const summaryRef = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  // Move focus to the error summary when a submit comes back failed.
  useEffect(() => {
    if (state.errors && Object.keys(state.errors).length > 0) {
      summaryRef.current?.focus()
    }
  }, [state])

  const errors = state.errors ?? {}
  const values = state.values ?? {}
  const errorEntries = (Object.entries(errors) as [string, string][]).filter(
    ([key]) => key !== 'form',
  )

  const onFirstInteraction = () => {
    if (started.current) return
    started.current = true
    track('consultation_form_start', { source })
  }

  return (
    <form
      action={formAction}
      onFocusCapture={onFirstInteraction}
      noValidate
      className="max-w-measure"
    >
      <input type="hidden" name="source" value={source} />

      {/*
        The honeypot. Hidden from sight and from assistive technology, and
        removed from the tab order — a person should never reach it by any
        route, which is what makes anything in it meaningful.
      */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {(errorEntries.length > 0 || errors.form) && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-8 border-l-2 border-error bg-(--surface) py-4 pl-5"
        >
          <p className="font-display text-body font-semibold text-(--ink)">
            {errors.form ? 'We could not send that' : 'Please check these fields'}
          </p>
          {errors.form ? (
            <p className="mt-2 text-body-sm">{errors.form}</p>
          ) : (
            <ul className="mt-3 space-y-1">
              {errorEntries.map(([field, message]) => (
                <li key={field}>
                  <a href={`#field-${field}`} className="text-body-sm underline underline-offset-4">
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="name" label="Your name" required error={errors.name}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              name="name"
              type="text"
              autoComplete="name"
              defaultValue={String(values.name ?? '')}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={inputClass(invalid)}
            />
          )}
        </Field>

        <Field
          name="email"
          label="Work email"
          required
          hint="A work address helps us route your enquiry."
          error={errors.email}
        >
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={String(values.email ?? '')}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={inputClass(invalid)}
            />
          )}
        </Field>

        <Field name="company" label="Company" error={errors.company}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              name="company"
              type="text"
              autoComplete="organization"
              defaultValue={String(values.company ?? '')}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={inputClass(invalid)}
            />
          )}
        </Field>

        <Field name="role" label="Your role" error={errors.role}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              name="role"
              type="text"
              autoComplete="organization-title"
              defaultValue={String(values.role ?? '')}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={inputClass(invalid)}
            />
          )}
        </Field>

        <Field name="phone" label="Phone" error={errors.phone}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              name="phone"
              type="tel"
              autoComplete="tel"
              defaultValue={String(values.phone ?? '')}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={inputClass(invalid)}
            />
          )}
        </Field>

        <Field name="timeline" label="Timeline" error={errors.timeline}>
          {({ id, describedBy, invalid }) => (
            <select
              id={id}
              name="timeline"
              defaultValue={String(values.timeline ?? '')}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={inputClass(invalid)}
            >
              <option value="">No preference yet</option>
              {TIMELINES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field
          name="budgetRange"
          label="Budget range"
          hint="A range is enough. It shapes what we suggest, not whether we reply."
          error={errors.budgetRange}
          className="sm:col-span-2"
        >
          {({ id, describedBy, invalid }) => (
            <select
              id={id}
              name="budgetRange"
              defaultValue={String(values.budgetRange ?? '')}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={inputClass(invalid)}
            >
              <option value="">Prefer not to say</option>
              {BUDGET_RANGES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field
          name="projectBrief"
          label="What are you trying to change?"
          hint="Share as much or as little as you know. Rough is fine — that is what the call is for."
          error={errors.projectBrief}
          className="sm:col-span-2"
        >
          {({ id, describedBy, invalid }) => (
            <textarea
              id={id}
              name="projectBrief"
              rows={5}
              defaultValue={String(values.projectBrief ?? '')}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={inputClass(invalid)}
            />
          )}
        </Field>
      </div>

      <fieldset className="mt-8">
        <legend className="font-display text-body-sm font-medium text-(--ink)">
          Which of these is closest?
          <span className="ml-2 font-body font-normal text-(--ink-muted)">Optional</span>
        </legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {serviceCards.map((service) => (
            <label key={service.slug} className="flex items-start gap-3 text-body-sm">
              <input
                type="checkbox"
                name="servicesInterested"
                value={service.slug}
                defaultChecked={
                  Array.isArray(values.servicesInterested) &&
                  values.servicesInterested.includes(service.slug)
                }
                className="mt-1 size-4 shrink-0 accent-amber-500"
              />
              <span>{service.title}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 space-y-4">
        <label className="flex items-start gap-3 text-body-sm">
          <input
            type="checkbox"
            name="ndaRequested"
            className="mt-1 size-4 shrink-0 accent-amber-500"
          />
          <span>
            I would like an NDA in place before we talk.
            <span className="mt-1 block text-(--ink-muted)">
              Your project details stay confidential either way.
            </span>
          </span>
        </label>

        {/*
          Deliberately not routed through <Field>. That component renders its
          own <label for="…">, and wrapping the input in a second label as well
          gave this checkbox two accessible names — the first of which was the
          word "Optional", because Field appends it when `required` is unset.

          A screen reader therefore announced a legally required consent
          checkbox as optional, which is not merely wrong but the opposite of
          true. Found by axe's form-field-multiple-labels check.

          One wrapping label, one accessible name, and the error rendered
          alongside rather than through the wrapper.
        */}
        <div className="flex flex-col gap-2">
          <label className="flex items-start gap-3 text-body-sm">
            <input
              id="field-consent"
              type="checkbox"
              name="consent"
              required
              aria-describedby={errors.consent ? 'field-consent-error' : undefined}
              aria-invalid={Boolean(errors.consent)}
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
            <p id="field-consent-error" className="flex gap-2 text-body-sm text-error">
              <span aria-hidden="true">✕</span>
              <span>{errors.consent}</span>
            </p>
          )}
        </div>
      </div>

      {/* Required by docs/04 §30 — three steps and the response time. */}
      <div className="mt-10 border-t border-(--line) pt-6">
        <p className="font-mono text-label text-(--accent-text) uppercase">What happens next</p>
        <ol className="mt-4 space-y-2 text-body-sm">
          <li>1. We reply within one business day.</li>
          <li>2. The first call is 30 minutes. We come with questions, not a pitch.</li>
          <li>3. You leave with a suggested next step, even if it is not us.</li>
        </ol>
      </div>

      <div className="mt-8">
        <SubmitButton source={source} />
      </div>
    </form>
  )
}

/**
 * Split out so `useFormStatus` can read the pending state of the form above it —
 * the hook only reports for a form it is rendered inside.
 */
function SubmitButton({ source }: { source: string }) {
  const { pending } = useFormStatus()

  return (
    <>
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        onClick={() => track('consultation_form_submit', { source })}
      >
        {pending ? 'Sending…' : 'Book a transformation consultation'}
      </Button>
      <p aria-live="polite" className="sr-only">
        {pending ? 'Sending your enquiry' : ''}
      </p>
    </>
  )
}
