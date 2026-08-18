import { z } from 'zod'

/**
 * The consultation form's schema — T-051, docs/04 §30.
 *
 * One schema, two consumers. The client validates with it to give immediate
 * feedback; the Server Action validates with it because client validation is a
 * convenience, never a control. Anything that only runs in the browser can be
 * skipped by anyone who wants to skip it.
 *
 * Free-text fields carry length ceilings. Not because a long brief is unwelcome
 * — because an unbounded text field is a place to paste a megabyte.
 */

/** Rejects the common consumer domains. Not validation — qualification. */
const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'proton.me',
  'protonmail.com',
])

export const BUDGET_RANGES = [
  { value: 'evaluating', label: 'Still evaluating' },
  { value: '<5L', label: 'Under ₹5 lakh' },
  { value: '5-25L', label: '₹5–25 lakh' },
  { value: '25L-1Cr', label: '₹25 lakh – ₹1 crore' },
  { value: '>1Cr', label: 'Over ₹1 crore' },
] as const

export const TIMELINES = [
  { value: 'now', label: 'As soon as possible' },
  { value: '1-3mo', label: 'In 1–3 months' },
  { value: '3-6mo', label: 'In 3–6 months' },
  { value: 'exploring', label: 'Exploring, no date yet' },
] as const

const budgetValues = BUDGET_RANGES.map((b) => b.value) as [string, ...string[]]
const timelineValues = TIMELINES.map((t) => t.value) as [string, ...string[]]

export const consultationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name.')
    .max(120, 'That name is longer than we can store — please shorten it.'),

  email: z
    .string()
    .trim()
    .min(1, 'Please enter an email address so we can reply.')
    .max(254)
    .pipe(z.email('That does not look like an email address. Check for a typo.')),

  phone: z.string().trim().max(40).optional().or(z.literal('')),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  role: z.string().trim().max(120).optional().or(z.literal('')),

  budgetRange: z.enum(budgetValues).optional().or(z.literal('')),
  timeline: z.enum(timelineValues).optional().or(z.literal('')),

  projectBrief: z
    .string()
    .trim()
    .max(4000, 'Please keep this under 4,000 characters — we can go deeper on the call.')
    .optional()
    .or(z.literal('')),

  servicesInterested: z.array(z.string()).max(10).optional(),

  ndaRequested: z.boolean().optional(),

  consent: z.literal(true, {
    message: 'We need your agreement before we can store your details and reply.',
  }),

  /**
   * The honeypot. A real person never sees this field, so anything in it came
   * from something filling every input on the page. Named `company_website`
   * rather than `honeypot` — the name is part of the trap.
   */
  company_website: z.string().max(0).optional(),

  /** Cloudflare Turnstile's token. Absent when Turnstile is not configured. */
  turnstileToken: z.string().optional(),

  /** Where the enquiry came from, for attribution. */
  source: z.string().max(300).optional(),
})

export type ConsultationInput = z.input<typeof consultationSchema>
export type ConsultationData = z.output<typeof consultationSchema>

/** A hint, not a rule — a work address routes better, but nobody is blocked. */
export function isFreeEmailDomain(email: string) {
  const domain = email.split('@')[1]?.toLowerCase()
  return domain ? FREE_EMAIL_DOMAINS.has(domain) : false
}

export type FieldErrors = Partial<Record<keyof ConsultationData | 'form', string>>

/** Flatten Zod's issues to one message per field, which is all the UI shows. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key === 'string' && !(key in errors)) {
      errors[key as keyof FieldErrors] = issue.message
    }
  }
  return errors
}
