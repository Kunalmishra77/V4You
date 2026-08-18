import { BUDGET_RANGES, TIMELINES, type ConsultationData } from '@/lib/forms/consultation-schema'

/**
 * The two consultation emails — T-054.
 *
 * Both plain text. The confirmation repeats the three commitments the form made
 * before submission, because a promise shown once on a page and never again is
 * a promise the sender has already forgotten.
 */

const label = (options: readonly { value: string; label: string }[], value?: string) =>
  options.find((option) => option.value === value)?.label ?? '—'

/** Internal notification. Written to be triaged from a phone in ten seconds. */
export function leadNotificationEmail(lead: ConsultationData, leadId?: string | number) {
  const lines = [
    `New consultation enquiry — ${lead.name}${lead.company ? ` (${lead.company})` : ''}`,
    '',
    `Name:      ${lead.name}`,
    `Email:     ${lead.email}`,
    `Phone:     ${lead.phone || '—'}`,
    `Company:   ${lead.company || '—'}`,
    `Role:      ${lead.role || '—'}`,
    `Budget:    ${label(BUDGET_RANGES, lead.budgetRange)}`,
    `Timeline:  ${label(TIMELINES, lead.timeline)}`,
    `NDA:       ${lead.ndaRequested ? 'Requested' : 'Not requested'}`,
    `Source:    ${lead.source || '—'}`,
    '',
    'What they are trying to change',
    '------------------------------',
    lead.projectBrief || '(not provided)',
    '',
  ]

  if (lead.servicesInterested?.length) {
    lines.push(`Services of interest: ${lead.servicesInterested.join(', ')}`, '')
  }

  lines.push(
    'We told them we would reply within one business day. The clock started when',
    'this arrived.',
  )

  if (leadId) lines.push('', `Lead record: ${leadId}`)

  return {
    subject: `Consultation enquiry — ${lead.name}${lead.company ? `, ${lead.company}` : ''}`,
    text: lines.join('\n'),
  }
}

/** Confirmation to the person who submitted. */
export function leadConfirmationEmail(lead: ConsultationData) {
  const firstName = lead.name.split(' ')[0]

  const text = [
    `Hello ${firstName},`,
    '',
    'Thank you — your enquiry reached us and someone is reading it.',
    '',
    'What happens next',
    '-----------------',
    '1. We reply within one business day.',
    '2. The first call is 30 minutes. We come with questions, not a pitch.',
    '3. You leave with a suggested next step, even if it is not us.',
    '',
    'Your project details stay confidential.',
    lead.ndaRequested
      ? 'You asked about an NDA — we will bring one to the first conversation.'
      : 'If you need an NDA before we talk, reply to this email and we will send one.',
    '',
    'To make the first call useful, it helps to have in mind: what currently',
    'happens today, who it affects, and what you would want to be different in',
    'six months. Rough answers are fine — that is what the call is for.',
    '',
    'V4You Technologies',
  ].join('\n')

  return { subject: 'We have your enquiry — what happens next', text }
}
