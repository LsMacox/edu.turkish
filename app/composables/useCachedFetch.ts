/**
 * Shared caching abstraction for fetch requests.
 * Provides TTL-based caching and inflight request deduplication.
 */

export interface CachedFetchOptions {
  /** Cache time-to-live in milliseconds (default: 60000) */
  ttl?: number
  /** Maximum cache entries before LRU eviction (default: 50) */
  maxEntries?: number
}

interface CacheEntry<T> {
  ts: number
  data: T
}

const DEFAULT_TTL = 60_000
const DEFAULT_MAX_ENTRIES = 50

/**
 * Creates a cached fetch wrapper with TTL-based caching and inflight deduplication.
 */
export function useCachedFetch<T, Args extends unknown[]>(
  fetcher: (...args: Args) => Promise<T>,
  options: CachedFetchOptions = {},
) {
  const { ttl = DEFAULT_TTL, maxEntries = DEFAULT_MAX_ENTRIES } = options

  const cache = new Map<string, CacheEntry<T>>()
  const inflight = new Map<string, Promise<T>>()

  const execute = async (...args: Args): Promise<T> => {
    const key = JSON.stringify(args)

    // Check cache
    const cached = cache.get(key)
    if (cached && Date.now() - cached.ts < ttl) {
      return cached.data
    }

    // Check inflight
    const existing = inflight.get(key)
    if (existing) return existing

    // New request
    const promise = fetcher(...args)
    inflight.set(key, promise)

    try {
      const data = await promise
      cache.set(key, { ts: Date.now(), data })

      if (cache.size > maxEntries) {
        const sorted = [...cache.entries()].sort((a, b) => a[1].ts - b[1].ts)
        sorted.slice(0, Math.ceil(sorted.length / 2)).forEach(([k]) => cache.delete(k))
      }

      return data
    } finally {
      inflight.delete(key)
    }
  }

  const clear = () => cache.clear()

  return { execute, clear }
}
