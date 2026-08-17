/**
 * The analytics wrapper — docs/06 §B.
 *
 * Every tracked interaction on the site goes through `track()`. No component
 * imports GA4 or PostHog directly, so swapping a provider never touches
 * component code. With no provider configured the whole module no-ops silently,
 * which is why it is safe to call `track()` from anywhere in development.
 */

/**
 * Exactly these twenty names, from docs/06 §B2. `EventName` is a union rather
 * than `string` on purpose: adding an event means adding it here first, which
 * is the only place the catalogue can drift from the analytics plan.
 *
 * The four Phase 4 events — assessment and calculator — are defined now and
 * fire never. That is expected.
 */
export const EVENT_NAMES = [
  'hero_primary_cta_click',
  'hero_secondary_cta_click',
  'mega_menu_open',
  'service_card_click',
  'industry_card_click',
  'solution_card_click',
  'technology_page_view',
  'case_study_view',
  'case_study_cta_click',
  'assessment_start',
  'assessment_complete',
  'calculator_start',
  'calculator_complete',
  'consultation_form_start',
  'consultation_form_submit',
  'calendar_booking',
  'resource_download',
  'newsletter_signup',
  'whatsapp_click',
  'search_used',
] as const

export type EventName = (typeof EVENT_NAMES)[number]

export type EventProps = Record<string, string | number | boolean>

/** Attached to every event — docs/06 §B3. */
type StandardProps = {
  page_path: string
  page_type: string
  device: 'mobile' | 'tablet' | 'desktop'
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    posthog?: { capture: (event: string, props?: Record<string, unknown>) => void }
  }
}

const UTM_KEYS = ['source', 'medium', 'campaign', 'term', 'content'] as const
const UTM_STORAGE_KEY = 'v4you:utm'

/**
 * Consent gate — docs/06 §B4. The banner gates initialisation, not just the
 * cookie write, so nothing is sent and no provider is loaded before consent.
 * Until then events queue in memory; on consent the queue flushes in order, so
 * a first-visit conversion is not lost to the banner.
 */
let consented = false
let queue: { name: EventName; props: EventProps }[] = []

/** The page type for the current route. Set once per navigation by the layout. */
let pageType = 'unknown'

export function setPageType(value: string) {
  pageType = value
}

export function grantConsent() {
  if (consented) return
  consented = true
  const pending = queue
  queue = []
  for (const event of pending) dispatch(event.name, event.props)
}

export function revokeConsent() {
  consented = false
  queue = []
}

export function hasConsent() {
  return consented
}

function device(): StandardProps['device'] {
  const w = window.innerWidth
  if (w < 700) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

/**
 * UTM parameters persist for the session, because the conversion rarely happens
 * on the landing page that carried them.
 */
export function captureUtm() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const found: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const value = params.get(`utm_${key}`)
    if (value) found[`utm_${key}`] = value
  }
  if (Object.keys(found).length === 0) return
  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(found))
  } catch {
    // Storage can be unavailable in private modes. UTM attribution is not worth
    // an exception.
  }
}

function storedUtm(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

function standardProps(): StandardProps {
  return {
    page_path: window.location.pathname,
    page_type: pageType,
    device: device(),
    ...storedUtm(),
  }
}

function dispatch(name: EventName, props: EventProps) {
  const payload = { event: name, ...standardProps(), ...props }

  if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload)
  window.posthog?.capture(name, payload)

  if (process.env.NODE_ENV === 'development') {
    // Without this, a mistyped call in development is indistinguishable from a
    // provider simply not being configured.
    console.debug('[track]', name, payload)
  }
}

/**
 * Record an interaction. Safe to call from anywhere: it returns immediately on
 * the server, queues before consent, and no-ops when no provider is configured.
 */
export function track(name: EventName, props: EventProps = {}) {
  if (typeof window === 'undefined') return

  if (!consented) {
    queue.push({ name, props })
    return
  }

  dispatch(name, props)
}
