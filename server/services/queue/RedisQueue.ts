import type { Job } from 'bullmq'
import { Queue } from 'bullmq'
import type { CRMQueueJob, LeadData, ActivityData } from '~~/server/types/crm'
import { getRedisClient } from '~~/server/utils/redis'

/**
 * Redis Queue Service
 *
 * Manages CRM operation queue with retry logic using BullMQ.
 */
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
          backoff: {
            type: 'exponential',
            delay: 1000, // Start with 1 second
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
    }
  }

  /**
   * Add a CRM operation job to the queue
   */
  async addJob(
    operation: 'createLead' | 'updateLead' | 'logActivity',
    provider: 'bitrix' | 'espocrm',
    data: LeadData | ActivityData,
  ): Promise<CRMQueueJob> {
    this.ensureConnection()
    const job = await this.queue!.add(
      operation,
      {
        operation,
        provider,
        data,
      },
      {
        jobId: `${operation}-${provider}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
    )

    return {
      id: job.id!,
      operation,
      provider,
      data,
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date(),
      status: 'pending',
    }
  }

  /**
   * Get a job by ID
   */
  async getJob(jobId: string): Promise<CRMQueueJob | null> {
    this.ensureConnection()
    const job = await this.queue!.getJob(jobId)

    if (!job) {
      return null
    }

    return {
      id: job.id!,
      operation: job.data.operation,
      provider: job.data.provider,
      data: job.data.data,
      attempts: job.attemptsMade,
      maxAttempts: job.opts.attempts || 3,
      createdAt: new Date(job.timestamp),
      lastAttemptAt: job.processedOn ? new Date(job.processedOn) : undefined,
      nextRetryAt: job.opts.delay ? new Date(Date.now() + job.opts.delay) : undefined,
      error: job.failedReason,
      status: await this.getJobStatus(job),
    }
  }

  /**
   * Get job status
   */
  private async getJobStatus(job: Job): Promise<'pending' | 'processing' | 'completed' | 'failed'> {
    const state = await job.getState()

    switch (state) {
      case 'waiting':
      case 'delayed':
        return 'pending'
      case 'active':
        return 'processing'
      case 'completed':
        return 'completed'
      case 'failed':
        return 'failed'
      default:
        return 'pending'
    }
  }

  /**
   * Get queue length
   */
  async getQueueLength(): Promise<number> {
    this.ensureConnection()
    const counts = await this.queue!.getJobCounts('waiting', 'delayed', 'active')
    return (counts.waiting ?? 0) + (counts.delayed ?? 0) + (counts.active ?? 0)
  }

  /**
   * Get dead letter queue (failed jobs)
   */
  async getDeadLetterQueue(): Promise<CRMQueueJob[]> {
    this.ensureConnection()
    const failedJobs = await this.queue!.getFailed()

    return Promise.all(
      failedJobs.map(async (job) => ({
        id: job.id!,
        operation: job.data.operation,
        provider: job.data.provider,
        data: job.data.data,
        attempts: job.attemptsMade,
        maxAttempts: job.opts.attempts || 3,
        createdAt: new Date(job.timestamp),
        lastAttemptAt: job.processedOn ? new Date(job.processedOn) : undefined,
        error: job.failedReason,
        status: 'failed' as const,
      })),
    )
  }

  /**
   * Clear all jobs from the queue
   */
  async clear(): Promise<void> {
    this.ensureConnection()
    await this.queue!.drain()
    await this.queue!.clean(0, 1000, 'completed')
    await this.queue!.clean(0, 1000, 'failed')
  }

  /**
   * Close the queue connection
   */
  async close(): Promise<void> {
    if (this.queue) {
      await this.queue.close()
    }
  }
}
