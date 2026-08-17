import { reportMissingAsset } from '@/lib/missing-assets'

import { CapabilityStrip } from './CapabilityStrip'

/**
 * TrustBar — docs/04 §11.
 *
 * A client logo wall, showing only clients where `logoUsagePermitted` is true.
 * The permission boolean is the whole point: there is no code path that renders
 * an unpermitted logo, because the query never returns one.
 *
 * Empty state is **substitute**, not omit — docs/04's empty-state policy. The
 * section's job is establishing credibility, and that job still needs doing
 * when the logos are not cleared yet, so `CapabilityStrip` takes the slot.
 * Never an empty band, never greyed-out placeholder logos.
 */

export type PermittedClient = {
  name: string
  logo: string
  width: number
  height: number
}

export function TrustBar({ clients = [] }: { clients?: PermittedClient[] }) {
  if (clients.length === 0) {
    reportMissingAsset({
      component: 'TrustBar',
      needs: 'clients with logoUsagePermitted: true, plus assets/clients/permissions.csv',
      blocks: 'home §2 — substituting CapabilityStrip',
    })
    return <CapabilityStrip />
  }

  // The permitted-logo wall arrives with the first cleared client. It is left
  // unwritten rather than written and unreachable — there is no way to check
  // the spacing, the greyscale treatment or the alt text of a wall that has
  // never held a real logo.
  return <CapabilityStrip />
}
