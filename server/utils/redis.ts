import Redis from 'ioredis'
import { parsePositiveInt } from '~~/lib/number'

let redisClient: Redis | null = null

export function getRedisClient(): Redis {
  if (!redisClient) {
    const config = {
      redisHost: process.env.REDIS_HOST || 'localhost',
      redisPort: process.env.REDIS_PORT || '6379',
      redisPassword: process.env.REDIS_PASSWORD || '',
    }

    const port = parsePositiveInt(config.redisPort) ?? 6379
    redisClient = new Redis({
      host: config.redisHost,
      port,
      password: config.redisPassword || undefined,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      reconnectOnError(err) {
        const targetError = 'READONLY'
        if (err.message.includes(targetError)) {
          return true
        }
        return false
      },
    })

    redisClient.on('error', (err) => {
      console.error('Redis client error:', err)
    })

    redisClient.on('connect', () => {
      console.log('Redis client connected')
    })
  }

  return redisClient
}

export async function closeRedisClient(): Promise<void> {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
  }
}
