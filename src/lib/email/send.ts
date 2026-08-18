import 'server-only'

import { Resend } from 'resend'

/**
 * Transactional email — T-054.
 *
 * Both templates are **plain text**, per docs/07. That is not a shortcut. A
 * lead notification is read on a phone by someone deciding whether to reply in
 * the next ten minutes, and a confirmation is read by someone checking they
 * pressed the right button. Neither is improved by an HTML wrapper, and plain
 * text renders identically everywhere, never trips an image blocker, and is
 * markedly less likely to be filtered.
 *
 * Unconfigured, this logs the message and reports `skipped`. It never throws:
 * a lead is already saved by the time email is attempted, and losing the
 * notification is recoverable while losing the lead is not.
 */

export type SendResult =
  | { status: 'sent'; id?: string }
  | { status: 'skipped'; reason: string }
  | { status: 'failed'; reason: string }

let client: Resend | null | undefined

function getClient() {
  if (client !== undefined) return client
  const key = process.env.RESEND_API_KEY
  client = key ? new Resend(key) : null
  return client
}

export async function sendPlainTextEmail({
  to,
  subject,
  text,
  replyTo,
}: {
  to: string
  subject: string
  text: string
  replyTo?: string
}): Promise<SendResult> {
  const resend = getClient()
  const from = process.env.RESEND_FROM_EMAIL

  if (!resend || !from) {
    const missing = !resend ? 'RESEND_API_KEY' : 'RESEND_FROM_EMAIL'
    if (process.env.NODE_ENV === 'development') {
      console.info(
        `\n[email:skipped ${missing} not set]\n  to: ${to}\n  subject: ${subject}\n\n${text}\n`,
      )
    }
    return { status: 'skipped', reason: `${missing} is not set` }
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      text,
      replyTo,
    })

    if (error) return { status: 'failed', reason: error.message }
    return { status: 'sent', id: data?.id }
  } catch (error) {
    return { status: 'failed', reason: error instanceof Error ? error.message : String(error) }
  }
}
