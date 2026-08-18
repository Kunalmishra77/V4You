'use server'

import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import { z } from 'zod'

import { checkRateLimit } from '@/lib/forms/rate-limit'

/**
 * Newsletter subscription — T-057.
 *
 * Consent is required rather than assumed, and `consentAt` records when it was
 * given. `unsubscribeToken` is generated here, not later: a list without a
 * working one-click unsubscribe is a compliance problem, and the token has to
 * exist before the first email can carry it.
 */

export type SubscribeState =
  { status: 'idle' } | { status: 'subscribed' } | { status: 'error'; message: string }

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Please enter an email address.')
    .pipe(z.email('Check that address for a typo.')),
  consent: z.literal(true, { message: 'Please tick the box so we know you want these emails.' }),
})

export async function subscribeToNewsletter(
  _previous: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  if (formData.get('newsletter_website')) return { status: 'subscribed' }

  const parsed = schema.safeParse({
    email: String(formData.get('email') ?? ''),
    consent: formData.get('consent') === 'on',
  })

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Please check that.' }
  }

  const requestHeaders = await headers()
  const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const limit = await checkRateLimit(`newsletter:${ip}`)
  if (!limit.allowed) {
    return { status: 'error', message: 'Too many attempts just now. Please try again shortly.' }
  }

  try {
    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: parsed.data.email } },
      limit: 1,
      overrideAccess: true,
    })

    // Re-subscribing an existing address is a success, not a duplicate-key
    // error — and telling someone "you are already subscribed" leaks who is on
    // the list to anyone who cares to probe.
    if (existing.docs.length > 0) {
      const current = existing.docs[0]
      if (current.status !== 'active') {
        await payload.update({
          collection: 'subscribers',
          id: current.id,
          data: { status: 'active', consentAt: new Date().toISOString() },
          overrideAccess: true,
        })
      }
      return { status: 'subscribed' }
    }

    await payload.create({
      collection: 'subscribers',
      data: {
        email: parsed.data.email,
        consentAt: new Date().toISOString(),
        source: String(formData.get('source') ?? 'unknown'),
        status: 'active',
        unsubscribeToken: crypto.randomUUID(),
      },
      overrideAccess: true,
    })

    return { status: 'subscribed' }
  } catch (error) {
    console.error('[newsletter] subscribe failed:', error)
    return {
      status: 'error',
      message: 'Something went wrong at our end. Please try again, or email us directly.',
    }
  }
}
