'use server'

import config from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { syncLeadToCrm } from '@/lib/crm'
import { sendPlainTextEmail } from '@/lib/email/send'
import { leadConfirmationEmail, leadNotificationEmail } from '@/lib/email/templates'
import {
  consultationSchema,
  toFieldErrors,
  type FieldErrors,
} from '@/lib/forms/consultation-schema'
import { checkRateLimit } from '@/lib/forms/rate-limit'
import { verifyTurnstile } from '@/lib/forms/turnstile'

/**
 * The consultation Server Action — T-052.
 *
 * Works with JavaScript disabled: the form posts to this action directly and
 * the browser follows the redirect. The client component adds inline errors and
 * a pending state on top of that, rather than being the thing that makes it work.
 *
 * Order of operations is deliberate. Cheap local checks reject obvious junk
 * before anything costs a network call, and the lead is **written before email
 * or CRM are attempted** — those are recoverable if they fail, and the lead is
 * not.
 */

export type ConsultationState = {
  ok: boolean
  errors?: FieldErrors
  /** Echoed back so a failed submit does not empty the form. */
  values?: Record<string, string | string[] | boolean>
}

export async function submitConsultation(
  _previous: ConsultationState,
  formData: FormData,
): Promise<ConsultationState> {
  const raw = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    company: String(formData.get('company') ?? ''),
    role: String(formData.get('role') ?? ''),
    budgetRange: String(formData.get('budgetRange') ?? ''),
    timeline: String(formData.get('timeline') ?? ''),
    projectBrief: String(formData.get('projectBrief') ?? ''),
    servicesInterested: formData.getAll('servicesInterested').map(String),
    ndaRequested: formData.get('ndaRequested') === 'on',
    consent: formData.get('consent') === 'on',
    company_website: String(formData.get('company_website') ?? ''),
    turnstileToken: String(formData.get('cf-turnstile-response') ?? ''),
    source: String(formData.get('source') ?? '/contact'),
  }

  // Echoed back on failure. The honeypot and the token are deliberately absent
  // — one must stay empty, the other is single-use.
  const values = {
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    company: raw.company,
    role: raw.role,
    budgetRange: raw.budgetRange,
    timeline: raw.timeline,
    projectBrief: raw.projectBrief,
    servicesInterested: raw.servicesInterested,
    ndaRequested: raw.ndaRequested,
  }

  // 1. Honeypot. Free, local, and catches the least sophisticated traffic.
  //    Answered with the same success shape a real submission gets: telling a
  //    bot precisely why it failed is how it learns to pass.
  if (raw.company_website) {
    return { ok: true }
  }

  // 2. Schema. Still free, and rejects most malformed input.
  const parsed = consultationSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, errors: toFieldErrors(parsed.error), values }
  }

  const requestHeaders = await headers()
  const ip =
    requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    requestHeaders.get('x-real-ip') ??
    'unknown'

  // 3. Rate limit before Turnstile: it is a Redis round-trip against a
  //    Cloudflare round-trip, and a flood should be stopped by the cheaper one.
  const limit = await checkRateLimit(ip)
  if (!limit.allowed) {
    return {
      ok: false,
      errors: {
        form: `That is several enquiries in a short time. Please try again in ${Math.ceil((limit.retryAfterSeconds ?? 3600) / 60)} minutes, or email us directly.`,
      },
      values,
    }
  }

  // 4. Turnstile, verified server-side.
  const turnstile = await verifyTurnstile(parsed.data.turnstileToken, ip)
  if (turnstile.status === 'failed') {
    return {
      ok: false,
      errors: {
        form:
          turnstile.reason === 'no-token'
            ? 'The spam check did not run. It needs JavaScript — please enable it and try again, or email us directly and we will pick it up.'
            : 'The spam check did not pass. Please try again, or email us directly.',
      },
      values,
    }
  }

  // 5. Persist. Everything after this point is recoverable; this is not.
  let leadId: string | number | undefined
  try {
    const payload = await getPayload({ config })
    const created = await payload.create({
      collection: 'leads',
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || undefined,
        company: parsed.data.company || undefined,
        role: parsed.data.role || undefined,
        budgetRange: (parsed.data.budgetRange || undefined) as never,
        timeline: (parsed.data.timeline || undefined) as never,
        projectBrief: parsed.data.projectBrief || undefined,
        ndaRequested: Boolean(parsed.data.ndaRequested),
        source: parsed.data.source || '/contact',
        consentAt: new Date().toISOString(),
        crmSyncStatus: 'pending',
      },
    })
    leadId = created.id
  } catch (error) {
    console.error('[consultation] could not save lead:', error)
    return {
      ok: false,
      errors: {
        form: 'Something went wrong saving your enquiry, and we would rather tell you than lose it. Please email us directly and we will reply the same way.',
      },
      values,
    }
  }

  // 6. Notify, confirm and sync. None of these can fail the submission — the
  //    enquiry is already safe, and a person who has pressed submit should not
  //    be shown an error about our mail provider.
  const notification = leadNotificationEmail(parsed.data, leadId)
  const confirmation = leadConfirmationEmail(parsed.data)
  const notifyTo = process.env.LEAD_NOTIFICATION_EMAIL

  const [, , crm] = await Promise.all([
    notifyTo
      ? sendPlainTextEmail({
          to: notifyTo,
          subject: notification.subject,
          text: notification.text,
          replyTo: parsed.data.email,
        })
      : Promise.resolve({ status: 'skipped' as const, reason: 'LEAD_NOTIFICATION_EMAIL unset' }),
    sendPlainTextEmail({
      to: parsed.data.email,
      subject: confirmation.subject,
      text: confirmation.text,
    }),
    syncLeadToCrm(parsed.data),
  ])

  // The CRM outcome is recorded against the lead, so a failure is visible in
  // the admin rather than inferred from its absence.
  if (leadId && crm.status !== 'pending') {
    try {
      const payload = await getPayload({ config })
      await payload.update({
        collection: 'leads',
        id: leadId,
        data: { crmSyncStatus: crm.status, crmRecordId: crm.recordId },
      })
    } catch (error) {
      console.error('[consultation] could not record CRM status:', error)
    }
  }

  redirect('/thank-you')
}
