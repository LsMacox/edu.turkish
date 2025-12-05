import { Queue } from 'bullmq'
import type { LeadData } from '~~/server/types/crm'
import { getRedisClient } from '~~/server/utils/redis'

interface QueuedJob {
  id: string
  data: LeadData
}

export class RedisQueue {
  private queue: Queue | null = null
  private connection: any = null

  private ensureConnection(): void {
    if (!this.connection) {
      this.connection = getRedisClient()
      this.queue = new Queue('crm-operations', {
        connection: this.connection,
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: { age: 24 * 3600, count: 1000 },
          removeOnFail: { age: 7 * 24 * 3600 },
        },
      })
    }
  }

  async addJob(
    operation: 'createLead',
    provider: 'espocrm',
    data: LeadData,
  ): Promise<QueuedJob> {
    this.ensureConnection()
    const job = await this.queue!.add(operation, { operation, provider, data }, {
      jobId: `${operation}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    })
    return { id: job.id!, data }
  }

  async getQueueLength(): Promise<number> {
    this.ensureConnection()
    const counts = await this.queue!.getJobCounts('waiting', 'delayed', 'active')
    return (counts.waiting ?? 0) + (counts.delayed ?? 0) + (counts.active ?? 0)
  }

  async clear(): Promise<void> {
    this.ensureConnection()
    await this.queue!.drain()
    await this.queue!.clean(0, 1000, 'completed')
    await this.queue!.clean(0, 1000, 'failed')
  }

  async close(): Promise<void> {
    if (this.queue) {
      await this.queue.close()
    }
  }
}
