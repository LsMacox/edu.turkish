import type { Job } from 'bullmq'
import { Worker } from 'bullmq'
import type { LeadData, ActivityData } from '~~/server/types/crm'
import { CRMFactory } from '~~/server/services/crm/CRMFactory'
import { getRedisClient } from '~~/server/utils/redis'
import { parsePositiveInt } from '~~/lib/number'

interface QueueJobData {
  operation: 'createLead' | 'logActivity'
  provider: 'bitrix' | 'espocrm'
  data: LeadData | ActivityData
}

/**
 * CRM Queue Worker
 *
 * Processes queued CRM operations with retry logic.
 */
export class CRMQueueWorker {
  private worker: Worker

  constructor() {
    const connection = getRedisClient()

    const concurrency = parsePositiveInt(process.env.CRM_QUEUE_CONCURRENCY) ?? 5
    const rateMax = parsePositiveInt(process.env.CRM_QUEUE_RATE_MAX) ?? 10
    const rateDuration = parsePositiveInt(process.env.CRM_QUEUE_RATE_DURATION_MS) ?? 1000

    this.worker = new Worker(
      'crm-operations',
      async (job: Job<QueueJobData>) => {
        return this.processJob(job)
      },
      {
        connection,
        concurrency, // Process up to 5 jobs concurrently
        limiter: {
          max: rateMax, // Max 10 jobs
          duration: rateDuration, // per second
        },
      },
    )

    this.worker.on('completed', (job) => {
      console.log(`✓ CRM job completed: ${job.id} (${job.data.operation})`)
    })

    this.worker.on('failed', (job, err) => {
      console.error(`✗ CRM job failed: ${job?.id} (${job?.data.operation})`, err.message)

      // Check if max attempts reached
      if (job && job.attemptsMade >= (job.opts.attempts || 3)) {
        console.error(`→ Job ${job.id} moved to DLQ after ${job.attemptsMade} attempts`)
      }
    })

    this.worker.on('error', (err) => {
      console.error('CRM Queue Worker error:', err)
    })

    console.log('CRM Queue Worker started')
  }

  /**
   * Process a single job
   */
  async processJob(job: Job<QueueJobData>): Promise<any> {
    const { operation, provider, data } = job.data

    console.log(`Processing CRM job: ${job.id} - ${operation} (${provider})`)

    try {
      // Get the appropriate CRM provider
      const crmProvider = CRMFactory.create(provider)

      // Execute the operation
      let result

      switch (operation) {
        case 'createLead':
          result = await crmProvider.createLead(data as LeadData)
          break
        case 'logActivity':
          result = await crmProvider.logActivity(data as ActivityData)
          break
        default:
          throw new Error(`Unknown operation: ${operation}`)
      }

      // Check if operation was successful
      if (!result.success) {
        throw new Error(result.error || 'CRM operation failed')
      }

      console.log(`✓ CRM operation successful: ${operation} - ID: ${result.id}`)
      return result
    } catch (error: any) {
      console.error(`✗ CRM operation failed: ${operation}`, error.message)

      // Log attempt number
      console.log(`Attempt ${job.attemptsMade + 1}/${job.opts.attempts || 3}`)

      // Throw error to trigger retry
      throw error
    }
  }

  /**
   * Close the worker
   */
  async close(): Promise<void> {
    await this.worker.close()
    console.log('CRM Queue Worker stopped')
  }

  /**
   * Pause the worker
   */
  async pause(): Promise<void> {
    await this.worker.pause()
    console.log('CRM Queue Worker paused')
  }

  /**
   * Resume the worker
   */
  async resume(): Promise<void> {
    await this.worker.resume()
    console.log('CRM Queue Worker resumed')
  }
}

// Export singleton instance
let workerInstance: CRMQueueWorker | null = null

export function getCRMQueueWorker(): CRMQueueWorker {
  if (!workerInstance) {
    workerInstance = new CRMQueueWorker()
  }
  return workerInstance
}

export async function closeCRMQueueWorker(): Promise<void> {
  if (workerInstance) {
    await workerInstance.close()
    workerInstance = null
  }
}
