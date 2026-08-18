'use client'

import { Button } from '@/components/shared/Button'
import { track } from '@/lib/analytics'

/**
 * WhatsAppButton — docs/04 §33, T-057.
 *
 * Renders only when a number is configured. docs/04 says "renders only when
 * `siteSettings.contact.whatsapp` is set", and the reason is the same one
 * blueprint §13.7 gives about live chat: never imply a channel is staffed when
 * it is not. A WhatsApp button nobody is watching is worse than no button —
 * it converts a warm enquiry into an unanswered message.
 */
export function WhatsAppButton({
  number,
  label = 'Message us on WhatsApp',
  variant = 'ghost-light',
  prefill = 'Hello — I would like to talk about a project.',
}: {
  /** International format, no plus. Absent means this renders nothing. */
  number?: string
  label?: string
  variant?: 'ghost-light' | 'ghost-dark' | 'navy'
  prefill?: string
}) {
  if (!number) return null

  const href = `https://wa.me/${number}?text=${encodeURIComponent(prefill)}`

  return (
    <Button
      href={href}
      variant={variant}
      target="_blank"
      onClick={() => track('whatsapp_click', { number_configured: true })}
    >
      {label}
    </Button>
  )
}
