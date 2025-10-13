import { Worker } from 'bullmq'
import type { Job } from 'bullmq'
import type { TelegramNotificationJob } from '~~/server/types/telegram'
import { getRedisClient } from '~~/server/utils/redis'
import { createTelegramNotificationService } from '~~/server/services/telegram/TelegramNotificationService'

/**
 * Telegram Queue Worker
 *
 * Processes Telegram notification jobs from the queue
 */

let worker: Worker | null = null

/**
 * Get or create Telegram queue worker singleton
 */
export function getTelegramQueueWorker(): Worker {
  if (!worker) {
    const connection = getRedisClient()

    worker = new Worker(
      'telegram-notifications',
      async (job: Job<TelegramNotificationJob>) => {
        console.log(`Processing Telegram notification job: ${job.id}`)

        try {
          const service = createTelegramNotificationService()
          const result = await service.sendNotification(job.data)

          if (!result.success) {
            // Throw error to trigger retry
            throw new Error(result.error || 'Failed to send Telegram notification')
          }

          return result
        } catch (error: any) {
          console.error(`Telegram notification job ${job.id} failed:`, error)
          throw error // Re-throw to trigger BullMQ retry logic
        }
      },
      {
        connection,
        concurrency: 5, // Process 5 jobs concurrently
        limiter: {
          max: 10, // Max 10 jobs
          duration: 1000, // Per second
        },
      },
    )

    // Event handlers
    worker.on('completed', (job) => {
      console.log(`Telegram notification job ${job.id} completed successfully`)
    })

    worker.on('failed', (job, err) => {
      if (job) {
        console.error(
          `Telegram notification job ${job.id} failed after ${job.attemptsMade} attempts:`,
          err.message,
        )
      }
    })

    worker.on('error', (err) => {
      console.error('Telegram queue worker error:', err)
    })

    console.log('Telegram Queue Worker started')
  }

  return worker
}

/**
 * Close Telegram queue worker
 */
export async function closeTelegramQueueWorker(): Promise<void> {
  if (worker) {
    await worker.close()
    worker = null
    console.log('Telegram Queue Worker closed')
  }
}
