import 'server-only'

/**
 * Cloudflare Turnstile verification — T-053.
 *
 * Verified **server-side**. A client-side widget that reports success to itself
 * is a decoration; the token only means anything once Cloudflare has confirmed
 * it, and that call has to happen where the visitor cannot intercept it.
 *
 * docs/02 §1 picked Turnstile specifically to avoid maths captchas, which fail
 * accessibility.
 *
 * Unconfigured, this returns `skipped` rather than `failed`. That is a
 * deliberate choice about which way to fail: a missing secret is an
 * infrastructure gap, and refusing every enquiry until someone notices is worse
 * than accepting a few with the honeypot and rate limit still in force.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export type TurnstileResult =
  | { status: 'passed' }
  | { status: 'skipped'; reason: string }
  | { status: 'failed'; reason: string }

export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY

  if (!secret) {
    return { status: 'skipped', reason: 'TURNSTILE_SECRET_KEY is not set' }
  }

  if (!token) {
    // Turnstile is configured but no token arrived — either JavaScript is off
    // or the widget did not run. The form tells the visitor which.
    return { status: 'failed', reason: 'no-token' }
  }

  try {
    const body = new URLSearchParams({ secret, response: token })
    if (remoteIp) body.set('remoteip', remoteIp)

    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      // Cloudflare being slow must not hold a form submission open indefinitely.
      signal: AbortSignal.timeout(8000),
    })

    const result = (await response.json()) as { success: boolean; 'error-codes'?: string[] }

    return result.success
      ? { status: 'passed' }
      : { status: 'failed', reason: result['error-codes']?.join(', ') ?? 'rejected' }
  } catch (error) {
    // A network failure to Cloudflare should not lose a real enquiry. Log it
    // and let the other two defences carry the request.
    console.warn('[turnstile] verification call failed, allowing through:', error)
    return { status: 'skipped', reason: 'verification-unreachable' }
  }
}
