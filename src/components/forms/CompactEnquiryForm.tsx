'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'

import { submitConsultation, type ConsultationState } from '@/app/(site)/contact/actions'
import { Field, inputClass } from '@/components/forms/Field'
import { Button } from '@/components/shared/Button'
import { track } from '@/lib/analytics'

/**
 * CompactEnquiryForm — five fields, for placing beside something else.
 *
 * `ConsultationForm` is the full version and belongs on `/contact` and
 * `/book-consultation`, where filling it in is the whole reason the visitor is
 * there: eleven fields, seven service checkboxes, an NDA option and a
 * "what happens next" block. Put beside the FAQ panel it ran three screens tall
 * against a panel that ran one, which is not a section, it is a form with
 * something small next to it.
 *
 * This asks the least that still makes a reply possible — a name, an address to
 * reply to, and what the person wants to change. Everything else is what the
 * call is for, which is also what the copy says.
 *
 * It posts to the same Server Action, so validation, rate limiting and the email
 * are identical. Nothing here is a second implementation of anything: the
 * fields it does render carry the same names, so a submission from this form is
 * indistinguishable downstream from one made on `/contact`.
 *
 * Progressive enhancement, like its bigger sibling: `<form action={...}>` posts
 * directly, so it works with scripting off. What the JavaScript adds is inline
 * errors, a pending state, and moving focus to the error summary — because an
 * inline error below the fold is an error nobody finds.
 */

const initialState: ConsultationState = { ok: false }

export function CompactEnquiryForm({ source }: { source: string }) {
  const [state, formAction] = useActionState(submitConsultation, initialState)
  const summaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.errors && Object.keys(state.errors).length > 0) summaryRef.current?.focus()
  }, [state.errors])

  const errors = state.errors ?? {}
  const values = state.values ?? {}
  const errorCount = Object.keys(errors).length

  if (state.ok) {
    return (
      <div role="status" className="border border-navy-700 bg-navy-800 p-6 surface-navy-800">
        <p className="font-display text-h4 text-(--ink)">Thank you — that is with us.</p>
        <p className="mt-3 text-body-sm">
          We reply within one business day. If it is urgent, say so in a reply to the confirmation
          email and we will move it up.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-5">
      {errorCount > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="border-l-2 border-error bg-navy-800 px-4 py-3 text-body-sm text-(--ink)"
        >
          {errorCount === 1
            ? 'One field needs attention before this can be sent.'
            : `${errorCount} fields need attention before this can be sent.`}
        </div>
      )}

      <input type="hidden" name="source" value={source} />

      {/* A real person never fills in a field they cannot see. */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Your name" required error={errors.name}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              name="name"
              type="text"
              required
              autoComplete="name"
              defaultValue={String(values.name ?? '')}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              className={inputClass(invalid)}
            />
          )}
        </Field>

        <Field name="email" label="Work email" required error={errors.email}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue={String(values.email ?? '')}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              className={inputClass(invalid)}
            />
          )}
        </Field>
      </div>

      <Field name="company" label="Company" error={errors.company}>
        {({ id, describedBy, invalid }) => (
          <input
            id={id}
            name="company"
            type="text"
            autoComplete="organization"
            defaultValue={String(values.company ?? '')}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            className={inputClass(invalid)}
          />
        )}
      </Field>

      <Field
        name="projectBrief"
        label="What are you trying to change?"
        hint="Rough is fine — that is what the call is for."
        error={errors.projectBrief}
      >
        {({ id, describedBy, invalid }) => (
          <textarea
            id={id}
            name="projectBrief"
            rows={4}
            defaultValue={String(values.projectBrief ?? '')}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            className={inputClass(invalid)}
          />
        )}
      </Field>

      {/*
        Rendered directly rather than through `Field`, which would emit its own
        label alongside the wrapping one — two accessible names, the first of
        them "Optional".
      */}
      <div>
        <label className="flex items-start gap-3 text-body-sm">
          <input
            type="checkbox"
            name="consent"
            required
            defaultChecked={Boolean(values.consent)}
            aria-describedby={errors.consent ? 'compact-consent-error' : undefined}
            className="mt-1 size-4 shrink-0 accent-amber-500"
          />
          <span>
            I agree that V4You can store these details and contact me about this enquiry.
            <span aria-hidden="true" className="ml-1 text-(--accent-text)">
              *
            </span>
          </span>
        </label>
        {errors.consent && (
          <p id="compact-consent-error" className="mt-2 text-body-sm text-error">
            {errors.consent}
          </p>
        )}
      </div>

      <SubmitButton source={source} />

      <p className="text-body-sm">
        We reply within one business day. Your details stay confidential — mention an NDA in the
        message if you need one first.
      </p>
    </form>
  )
}

function SubmitButton({ source }: { source: string }) {
  const { pending } = useFormStatus()
  return (
    <>
      <Button
        type="submit"
        disabled={pending}
        block
        onClick={() => track('consultation_form_submit', { source })}
      >
        {pending ? 'Sending…' : 'Send it over'}
      </Button>
      <p aria-live="polite" className="sr-only">
        {pending ? 'Sending your enquiry' : ''}
      </p>
    </>
  )
}
