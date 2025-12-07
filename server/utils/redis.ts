import Redis, { type RedisOptions } from 'ioredis'
import { parsePositiveInt } from '~~/lib/number'

let sharedRedisClient: Redis | null = null

export function createRedisClient(options: RedisOptions = {}): Redis {
  const config = {
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: process.env.REDIS_PORT || '6379',
    redisPassword: process.env.REDIS_PASSWORD || '',
  }

  const port = parsePositiveInt(config.redisPort) ?? 6379
  const client = new Redis({
    host: config.redisHost,
    port,
    password: config.redisPassword || undefined,
    maxRetriesPerRequest: null,
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
    ...options,
  })

  client.on('error', (err) => {
    console.error('Redis client error:', err.message)
  })

  client.on('connect', () => {
    console.log('Redis client connected')
  })

  return client
}

export function getRedisClient(): Redis {
  if (!sharedRedisClient) {
    sharedRedisClient = createRedisClient()
  }

  return sharedRedisClient
}

export async function closeRedisClient(): Promise<void> {
  if (sharedRedisClient) {
    await sharedRedisClient.quit()
    sharedRedisClient = null
  }
}
