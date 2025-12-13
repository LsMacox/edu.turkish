import type { Job } from 'bullmq'
import { Worker } from 'bullmq'
import type { LeadData } from '~~/lib/schemas/crm'
import { CrmFactory } from '~~/server/services/crm/CRMFactory'
import { parsePositiveInt } from '~~/lib/utils/number'
import { getRedisClient } from './redis'

interface QueueJobData {
  operation: 'createLead'
  provider: 'espocrm'
  data: LeadData
}

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
        concurrency,
        limiter: {
          max: rateMax,
          duration: rateDuration,
        },
      },
    )

    this.worker.on('completed', (job) => {
      console.log(`✓ CRM job completed: ${job.id} (${job.data.operation})`)
    })

    this.worker.on('failed', (job, err) => {
      console.error(`✗ CRM job failed: ${job?.id} (${job?.data.operation})`, err.message)

      if (job && job.attemptsMade >= (job.opts.attempts || 3)) {
        console.error(`→ Job ${job.id} moved to DLQ after ${job.attemptsMade} attempts`)
      }
    })

    this.worker.on('error', (err) => {
      console.error('CRM Queue Worker error:', err)
    })

    console.log('CRM Queue Worker started')
  }

  async processJob(job: Job<QueueJobData>): Promise<any> {
    const { operation, provider, data } = job.data

    console.log(`Processing CRM job: ${job.id} - ${operation} (${provider})`)

    try {
      const crmProvider = CrmFactory.create(provider)
      const result = await crmProvider.createLead(data)

      if (!result.success) {
        throw new Error(result.error || 'CRM operation failed')
      }

      console.log(`✓ CRM operation successful: ${operation} - ID: ${result.id}`)
      return result
    } catch (error: any) {
      console.error(`✗ CRM operation failed: ${operation}`, error.message)

      console.log(`Attempt ${job.attemptsMade + 1}/${job.opts.attempts || 3}`)

      throw error
    }
  }

  async close(): Promise<void> {
    await this.worker.close()
    console.log('CRM Queue Worker stopped')
  }

  async pause(): Promise<void> {
    await this.worker.pause()
    console.log('CRM Queue Worker paused')
  }

  async resume(): Promise<void> {
    await this.worker.resume()
    console.log('CRM Queue Worker resumed')
  }
}

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
