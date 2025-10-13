import { Queue } from 'bullmq'
import type { TelegramNotificationJob } from '~~/server/types/telegram'
import { getRedisClient } from '~~/server/utils/redis'

/**
 * Telegram Notification Queue
 *
 * BullMQ queue for Telegram notification jobs
 */

let queue: Queue<TelegramNotificationJob> | null = null

/**
 * Get or create Telegram notification queue singleton
 */
export function getTelegramQueue(): Queue<TelegramNotificationJob> {
  if (!queue) {
    const connection = getRedisClient()

    queue = new Queue<TelegramNotificationJob>('telegram-notifications', {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000, // Start with 1 second, then 2s, 4s
        },
        removeOnComplete: {
          age: 24 * 3600, // Keep completed jobs for 24 hours
          count: 1000,
        },
        removeOnFail: {
          age: 7 * 24 * 3600, // Keep failed jobs for 7 days
        },
      },
    })

    console.log('Telegram notification queue initialized')
  }

  return queue
}

/**
 * Close Telegram queue
 */
export async function closeTelegramQueue(): Promise<void> {
  if (queue) {
    await queue.close()
    queue = null
    console.log('Telegram notification queue closed')
  }
}
