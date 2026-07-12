/**
 * lib/rate-limit.ts
 * In-memory rate limiter for Next.js API routes.
 * Rule #2: Every public-facing endpoint must have rate limiting.
 *
 * Usage:
 *   const limiter = rateLimit({ limit: 10, windowMs: 60_000 });
 *   const { success } = await limiter.check(req, 'user-id-or-ip');
 *   if (!success) return NextResponse.json({ error: 'Too Many Requests' }, { status: 429, headers: { 'Retry-After': '60' } });
 */

interface RateLimitOptions {
  /** Max requests per window */
  limit: number;
  /** Window in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // timestamp ms when window resets
}

const store = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(options: RateLimitOptions) {
  const { limit, windowMs } = options;

  return {
    check(identifier: string): RateLimitResult {
      const now = Date.now();
      const existing = store.get(identifier);

      if (!existing || now > existing.resetAt) {
        // First request or window expired — reset
        store.set(identifier, { count: 1, resetAt: now + windowMs });
        return { success: true, remaining: limit - 1, reset: now + windowMs };
      }

      existing.count += 1;
      const remaining = Math.max(0, limit - existing.count);
      const success = existing.count <= limit;

      return { success, remaining, reset: existing.resetAt };
    },
  };
}

// Pre-configured limiters per endpoint type (Rule #2 defaults)
export const authLimiter = rateLimit({ limit: 5, windowMs: 15 * 60 * 1000 }); // 5/15min
export const apiLimiter = rateLimit({ limit: 60, windowMs: 60 * 1000 });       // 60/min
export const llmLimiter = rateLimit({ limit: 10, windowMs: 60 * 1000 });       // 10/min
export const uploadLimiter = rateLimit({ limit: 5, windowMs: 60 * 1000 });     // 5/min

/**
 * Get client IP from Next.js request for rate limit key.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}
