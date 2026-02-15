// Simple in-memory rate limiter for serverless environment
// Suitable for single-instance deployment (Vercel serverless)
// For production scale, consider Redis/Upstash

interface RateLimitEntry {
  count: number
  resetAt: number
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

// In-memory store for rate limit tracking
const store = new Map<string, RateLimitEntry>()

/**
 * Rate limiter using token bucket algorithm
 * @param key - Unique identifier (e.g., IP address, user ID)
 * @param limit - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Result indicating if request is allowed
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  // No entry or expired window - create new entry
  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt
    }
  }

  // Limit exceeded
  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt
    }
  }

  // Increment count and allow
  entry.count++
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt
  }
}

/**
 * Gets client IP from request headers
 * @param request - Next.js Request object
 * @returns IP address string
 */
export function getClientIp(request: Request): string {
  // Check common headers for IP (Vercel, Cloudflare, etc.)
  const headers = request.headers
  const forwarded = headers.get("x-forwarded-for")
  const realIp = headers.get("x-real-ip")
  const cfConnectingIp = headers.get("cf-connecting-ip")

  if (forwarded) {
    // x-forwarded-for can be comma-separated list
    return forwarded.split(",")[0].trim()
  }

  if (realIp) return realIp
  if (cfConnectingIp) return cfConnectingIp

  // Fallback
  return "unknown"
}

/**
 * Creates rate limit key for view tracking
 * @param slug - Personal slug
 * @param ip - Client IP
 * @returns Rate limit key
 */
export function createViewTrackingKey(slug: string, ip: string): string {
  return `view_track:${slug}:${ip}`
}

/**
 * Creates rate limit key for card viewing
 * @param slug - Personal slug
 * @param ip - Client IP
 * @returns Rate limit key
 */
export function createCardViewKey(slug: string, ip: string): string {
  return `card_view:${slug}:${ip}`
}

/**
 * Creates rate limit key for file uploads
 * @param userId - User ID
 * @returns Rate limit key
 */
export function createUploadKey(userId: string): string {
  return `upload:${userId}`
}

/**
 * Creates rate limit key for email sending
 * @param userId - User ID
 * @returns Rate limit key
 */
export function createEmailKey(userId: string): string {
  return `email:${userId}`
}

// Clean up expired entries periodically (every 60 seconds)
// This prevents memory leaks in long-running serverless instances
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    let cleanedCount = 0

    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) {
        store.delete(key)
        cleanedCount++
      }
    }

    if (cleanedCount > 0) {
      console.log(`[RateLimit] Cleaned ${cleanedCount} expired entries`)
    }
  }, 60_000) // Every minute
}

// Export store size for monitoring
export function getRateLimitStoreSize(): number {
  return store.size
}
