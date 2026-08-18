'use client'

import { useActionState } from 'react'

import { Field, inputClass } from '@/components/forms/Field'
import { Button } from '@/components/shared/Button'
import { subscribeToNewsletter, type SubscribeState } from '@/app/(site)/contact/subscribe'
import { track } from '@/lib/analytics'

/**
 * NewsletterSignup — docs/04 §32, T-057.
 *
 * Email plus an explicit consent checkbox. **Consent is never pre-ticked** —
 * a pre-ticked box is not consent in any jurisdiction that has thought about
 * it, and defaulting it on would make the checkbox decorative.
 *
 * The form works without JavaScript, same as the consultation form.
 */

const initialState: SubscribeState = { status: 'idle' }

export function NewsletterSignup({ source = 'footer' }: { source?: string }) {
  const [state, formAction] = useActionState(subscribeToNewsletter, initialState)

  if (state.status === 'subscribed') {
    return (
      <p aria-live="polite" className="text-body-sm">
        Thank you — you are on the list. Every email has a one-click unsubscribe, and we do not send
        often enough for you to need it.
      </p>
    )
  }

  return (
    <form action={formAction} className="max-w-measure">
      <input type="hidden" name="source" value={source} />

      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="newsletter_website">Website</label>
        <input id="newsletter_website" name="newsletter_website" tabIndex={-1} autoComplete="off" />
      </div>

      <Field
        name="newsletter-email"
        label="Email"
        error={state.status === 'error' ? state.message : undefined}
      >
        {({ id, describedBy, invalid }) => (
          <input
            id={id}
            name="email"
            type="email"
            autoComplete="email"
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className={inputClass(invalid)}
          />
        )}
      </Field>

      <label className="mt-4 flex items-start gap-3 text-body-sm">
        {/* No defaultChecked. Deliberately. */}
        <input type="checkbox" name="consent" className="mt-1 size-4 shrink-0 accent-amber-500" />
        <span>
          I agree to receive occasional emails from V4You and can unsubscribe at any time.
        </span>
      </label>

      <div className="mt-5">
        <Button
          type="submit"
          variant="ghost-dark"
          onClick={() => track('newsletter_signup', { source })}
        >
          Subscribe
        </Button>
      </div>
    </form>
  )
}
