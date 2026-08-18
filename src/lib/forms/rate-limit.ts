import 'server-only'

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/**
 * Submission rate limiting — T-053.
 *
 * Five submissions per IP per hour, sliding window. That is generous for a
 * consultation form — nobody legitimately sends six enquiries in an hour — and
 * tight enough that a script gets bored.
 *
 * Unconfigured, it allows everything. Same reasoning as Turnstile: a missing
 * Upstash credential is an infrastructure gap, not a signal that the visitor is
 * a bot, and blocking real enquiries over it would be the worse failure.
 */

let limiter: Ratelimit | null | undefined

function getLimiter() {
  if (limiter !== undefined) return limiter

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    limiter = null
    return limiter
  }

  limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    prefix: 'v4you:consultation',
    analytics: false,
  })
  return limiter
}

export type RateLimitResult = { allowed: boolean; configured: boolean; retryAfterSeconds?: number }

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const instance = getLimiter()
  if (!instance) return { allowed: true, configured: false }

  try {
    const { success, reset } = await instance.limit(identifier)
    return {
      allowed: success,
      configured: true,
      retryAfterSeconds: success ? undefined : Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
    }
  } catch (error) {
    // Upstash being unreachable must not take the form down with it.
    console.warn('[rate-limit] check failed, allowing through:', error)
    return { allowed: true, configured: true }
  }
}
