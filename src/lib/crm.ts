import 'server-only'

import type { ConsultationData } from '@/lib/forms/consultation-schema'

/**
 * CRM sync — T-055.
 *
 * The requirement is precise: "Failure is recorded, never silent." So this
 * returns a status the caller writes to the lead's `crmSyncStatus`, and a lead
 * that never reached the CRM is visibly `failed` in the admin rather than
 * looking identical to one that synced.
 *
 * Three attempts with exponential backoff, because the common failure is a
 * transient 502 rather than a wrong key. A 4xx is not retried — repeating a
 * request the CRM has already rejected on its merits just delays the report.
 *
 * Unconfigured, it returns `pending`, not `failed`. There is a difference
 * between "the CRM refused this" and "there is no CRM yet", and collapsing them
 * would mean every lead looked broken until sales chose a vendor.
 */

export type CrmSyncResult = {
  status: 'synced' | 'failed' | 'pending'
  recordId?: string
  reason?: string
}

const MAX_ATTEMPTS = 3

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function syncLeadToCrm(lead: ConsultationData): Promise<CrmSyncResult> {
  const provider = process.env.CRM_PROVIDER
  const apiKey = process.env.CRM_API_KEY

  if (!provider || !apiKey) {
    return { status: 'pending', reason: 'No CRM configured — CRM_PROVIDER and CRM_API_KEY unset' }
  }

  const endpoint = process.env.CRM_WEBHOOK_URL
  if (!endpoint) {
    return { status: 'pending', reason: 'CRM_WEBHOOK_URL is not set' }
  }

  let lastReason = 'unknown'

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          phone: lead.phone || undefined,
          company: lead.company || undefined,
          role: lead.role || undefined,
          budgetRange: lead.budgetRange || undefined,
          timeline: lead.timeline || undefined,
          projectBrief: lead.projectBrief || undefined,
          ndaRequested: Boolean(lead.ndaRequested),
          source: lead.source || undefined,
        }),
        signal: AbortSignal.timeout(10_000),
      })

      if (response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { id?: string }
        return { status: 'synced', recordId: payload.id }
      }

      lastReason = `HTTP ${response.status}`

      // The CRM understood and declined. Retrying will not change its mind.
      if (response.status >= 400 && response.status < 500) {
        return { status: 'failed', reason: lastReason }
      }
    } catch (error) {
      lastReason = error instanceof Error ? error.message : String(error)
    }

    if (attempt < MAX_ATTEMPTS) await sleep(2 ** attempt * 250)
  }

  console.error(`[crm] sync failed after ${MAX_ATTEMPTS} attempts: ${lastReason}`)
  return { status: 'failed', reason: lastReason }
}
