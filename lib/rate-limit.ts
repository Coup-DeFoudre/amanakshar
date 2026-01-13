import { LRUCache } from 'lru-cache'

type RateLimitOptions = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export function rateLimit(options?: RateLimitOptions) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options?.uniqueTokenPerInterval ?? 500,
    ttl: options?.interval ?? 60000, // 1 minute
  })

  return {
    check: (limit: number, token: string) => {
      const now = Date.now()
      const tokenCount = tokenCache.get(token) ?? []
      
      // Remove old timestamps
      const windowStart = now - (options?.interval ?? 60000)
      const recentRequests = tokenCount.filter(t => t > windowStart)
      
      if (recentRequests.length >= limit) {
        return {
          success: false,
          remaining: 0,
          reset: Math.ceil((recentRequests[0] + (options?.interval ?? 60000) - now) / 1000),
        }
      }
      
      recentRequests.push(now)
      tokenCache.set(token, recentRequests)
      
      return {
        success: true,
        remaining: limit - recentRequests.length,
        reset: Math.ceil((options?.interval ?? 60000) / 1000),
      }
    },
  }
}

// Default rate limiter for admin routes
export const adminRateLimiter = rateLimit({
  uniqueTokenPerInterval: 100,
  interval: 60000, // 1 minute
})

