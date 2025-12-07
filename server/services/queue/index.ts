import { RedisQueue } from './RedisQueue'

// Singleton instance
let instance: RedisQueue | null = null

/**
 * Get singleton RedisQueue instance.
 * Reuses Redis connection across requests.
 */
export function getRedisQueue(): RedisQueue {
  return (instance ??= new RedisQueue())
}

/**
 * Close the queue connection (for graceful shutdown).
 */
export async function closeRedisQueue(): Promise<void> {
  if (instance) {
    await instance.close()
    instance = null
  }
}

export { RedisQueue }
