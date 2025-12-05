import { vi, type Mock } from 'vitest'

export interface Job {
  id: string
  operation: 'createLead'
  provider: 'espocrm'
  data: any
  status: 'pending' | 'processing' | 'completed' | 'failed'
  attempts: number
  nextRetryAt?: Date
  error?: string
  createdAt: Date
}

export interface MockQueue {
  addJob(operation: string, provider: string, data: any): Promise<Job>
  getJob(jobId: string): Promise<Job | null>
  getQueueLength(): Promise<number>
  getDeadLetterQueue(): Promise<Job[]>
  clear(): Promise<void>
  processJob(jobId: string, shouldFail?: boolean): Promise<void>
  simulateFailure(jobId: string): Promise<void>
  simulateSuccess(jobId: string): Promise<void>
}

export interface MockRedis {
  get: Mock
  set: Mock
  del: Mock
  exists: Mock
  expire: Mock
  ttl: Mock
  keys: Mock
}

export class MockQueueImpl implements MockQueue {
  private jobs: Map<string, Job> = new Map()
  private dlq: Job[] = []
  private jobCounter = 0
  private readonly maxAttempts = 3
  private readonly retryDelays = [1000, 5000, 25000] // 1s, 5s, 25s

  async addJob(operation: string, provider: string, data: any): Promise<Job> {
    this.jobCounter++
    const job: Job = {
      id: `job-${this.jobCounter}`,
      operation: operation as any,
      provider: provider as any,
      data,
      status: 'pending',
      attempts: 0,
      createdAt: new Date(),
    }
    this.jobs.set(job.id, job)
    return job
  }

  async getJob(jobId: string): Promise<Job | null> {
    const job = this.jobs.get(jobId)
    return job ? { ...job } : null
  }

  async getQueueLength(): Promise<number> {
    return Array.from(this.jobs.values()).filter(
      (job) => job.status === 'pending' || job.status === 'processing',
    ).length
  }

  async getDeadLetterQueue(): Promise<Job[]> {
    return [...this.dlq]
  }

  async clear(): Promise<void> {
    this.jobs.clear()
    this.dlq = []
    this.jobCounter = 0
  }

  async processJob(jobId: string, shouldFail: boolean = true): Promise<void> {
    const job = this.jobs.get(jobId)
    if (!job) {
      throw new Error(`Job ${jobId} not found`)
    }

    job.status = 'processing'
    job.attempts++

    if (shouldFail && job.attempts <= this.maxAttempts) {
      job.status = 'failed'
      job.error = `Simulated failure attempt ${job.attempts}`

      if (job.attempts < this.maxAttempts) {
        const delay =
          this.retryDelays[job.attempts - 1] ?? this.retryDelays[this.retryDelays.length - 1]!
        job.nextRetryAt = new Date(Date.now() + delay)
        job.status = 'pending'
      } else {
        this.dlq.push({ ...job })
        this.jobs.delete(jobId)
      }
    } else {
      job.status = 'completed'
      job.error = undefined
      job.nextRetryAt = undefined
      this.jobs.delete(jobId)
    }
  }

  async simulateFailure(jobId: string): Promise<void> {
    return this.processJob(jobId, true)
  }

  async simulateSuccess(jobId: string): Promise<void> {
    return this.processJob(jobId, false)
  }
}

export function createMockQueue(): MockQueue {
  return new MockQueueImpl()
}

export function createMockRedis(): MockRedis {
  const storage = new Map<string, { value: string; expiry?: number }>()

  return {
    get: vi.fn(async (key: string) => {
      const item = storage.get(key)
      if (!item) return null
      if (item.expiry && Date.now() > item.expiry) {
        storage.delete(key)
        return null
      }
      return item.value
    }),
    set: vi.fn(async (key: string, value: string, mode?: string, duration?: number) => {
      const expiry = mode === 'EX' && duration ? Date.now() + duration * 1000 : undefined
      storage.set(key, { value, expiry })
      return 'OK'
    }),
    del: vi.fn(async (key: string) => {
      const existed = storage.has(key)
      storage.delete(key)
      return existed ? 1 : 0
    }),
    exists: vi.fn(async (key: string) => {
      return storage.has(key) ? 1 : 0
    }),
    expire: vi.fn(async (key: string, seconds: number) => {
      const item = storage.get(key)
      if (item) {
        item.expiry = Date.now() + seconds * 1000
        return 1
      }
      return 0
    }),
    ttl: vi.fn(async (key: string) => {
      const item = storage.get(key)
      if (!item) return -2
      if (!item.expiry) return -1
      const remaining = Math.floor((item.expiry - Date.now()) / 1000)
      return remaining > 0 ? remaining : -2
    }),
    keys: vi.fn(async (pattern: string) => {
      if (pattern === '*') {
        return Array.from(storage.keys())
      }
      const regex = new RegExp(pattern.replace(/\*/g, '.*'))
      return Array.from(storage.keys()).filter((key) => regex.test(key))
    }),
  }
}
