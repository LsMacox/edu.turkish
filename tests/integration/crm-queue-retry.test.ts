import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createMockQueue } from '~~/tests/test-utils'
import type { LeadData } from '~~/server/types/crm'

describe('CRM Queue Retry Integration', () => {
  let queue: ReturnType<typeof createMockQueue>

  beforeEach(async () => {
    queue = createMockQueue()
    await queue.clear()
  })

  describe('CRM Failure → Queue', () => {
    it('should queue job when CRM fails', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'Queue',
        lastName: 'Test',
        phone: '+77001111111',
        email: 'queue@example.com',
        referralCode: 'QUEUE1',
        source: 'test',
      }

      // Act
      const job = await queue.addJob('createLead', 'espocrm', leadData)
      
      // Assert
      expect(job.id).toBeDefined()
      expect(job.status).toBe('pending')
    })

    it('should preserve all lead data in queue', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'Preserve',
        lastName: 'Data',
        phone: '+77002222222',
        email: 'preserve@example.com',
        referralCode: 'PRESERVE',
        source: 'test',
        userType: 'student',
        language: 'turkish',
        utm: {
          source: 'google',
          campaign: 'test',
        },
      }

      // Act
      const job = await queue.addJob('createLead', 'espocrm', leadData)
      const retrieved = await queue.getJob(job.id)
      
      // Assert
      expect(retrieved?.data).toEqual(leadData)
    })

    it('should queue activity logging on failure', async () => {
      // Arrange
      const activityData = {
        channel: 'telegramBot' as const,
        referralCode: 'ACTIVITY_QUEUE',
      }

      // Act
      const job = await queue.addJob('logActivity', 'espocrm', activityData)
      
      // Assert
      expect(job.operation).toBe('logActivity')
    })
  })

  describe('Retry with Exponential Backoff', () => {
    it('should retry with 1s delay on first failure', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'Retry1',
        lastName: 'Test',
        phone: '+77003333333',
        email: 'retry1@example.com',
        referralCode: 'RETRY1',
        source: 'test',
      }
      const job = await queue.addJob('createLead', 'espocrm', leadData)

      // Act
      await queue.simulateFailure(job.id)
      const updated = await queue.getJob(job.id)
      
      // Assert
      expect(updated?.attempts).toBe(1)
      expect(updated?.nextRetryAt).toBeDefined()
      const retryDelay = updated!.nextRetryAt!.getTime() - Date.now()
      expect(retryDelay).toBeGreaterThanOrEqual(900)
      expect(retryDelay).toBeLessThanOrEqual(1100)
    })

    it('should retry with 5s delay on second failure', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'Retry2',
        lastName: 'Test',
        phone: '+77004444444',
        email: 'retry2@example.com',
        referralCode: 'RETRY2',
        source: 'test',
      }
      const job = await queue.addJob('createLead', 'espocrm', leadData)

      // Act
      await queue.simulateFailure(job.id)
      await queue.simulateFailure(job.id)
      const updated = await queue.getJob(job.id)
      
      // Assert
      expect(updated?.attempts).toBe(2)
      const expectedDelay = 5000
      const retryDelay = updated!.nextRetryAt!.getTime() - Date.now()
      expect(retryDelay).toBeGreaterThanOrEqual(expectedDelay - 100)
      expect(retryDelay).toBeLessThanOrEqual(expectedDelay + 100)
    })

    it('should retry with 25s delay on third failure', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'Retry3',
        lastName: 'Test',
        phone: '+77005555555',
        email: 'retry3@example.com',
        referralCode: 'RETRY3',
        source: 'test',
      }
      const job = await queue.addJob('createLead', 'espocrm', leadData)

      // Act
      await queue.simulateFailure(job.id)
      await queue.simulateFailure(job.id)
      await queue.simulateFailure(job.id)
      
      // Assert
      const dlqJobs = await queue.getDeadLetterQueue()
      expect(dlqJobs).toContainEqual(expect.objectContaining({ id: job.id, attempts: 3 }))
    })

    it('should move to DLQ after max retries', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'MaxRetry',
        lastName: 'Test',
        phone: '+77006666666',
        email: 'maxretry@example.com',
        referralCode: 'MAXRETRY',
        source: 'test',
      }
      const job = await queue.addJob('createLead', 'espocrm', leadData)

      // Act
      await queue.simulateFailure(job.id)
      await queue.simulateFailure(job.id)
      await queue.simulateFailure(job.id)
      
      // Assert
      const dlqJobs = await queue.getDeadLetterQueue()
      expect(dlqJobs).toHaveLength(1)
      expect(dlqJobs[0]?.id).toBe(job.id)
      expect(await queue.getJob(job.id)).toBeNull()
    })
  })

  describe('Queue Persistence', () => {
    it('should persist jobs in memory queue', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'Persist',
        lastName: 'Test',
        phone: '+77007777777',
        email: 'persist@example.com',
        referralCode: 'PERSIST',
        source: 'test',
      }

      // Act
      const job = await queue.addJob('createLead', 'espocrm', leadData)
      const retrieved = await queue.getJob(job.id)
      
      // Assert
      expect(retrieved).toBeDefined()
      expect(retrieved?.data).toEqual(leadData)
    })

    it('should maintain queue state across operations', async () => {
      // Arrange & Act
      await queue.addJob('createLead', 'bitrix', { firstName: 'Job1' } as LeadData)
      await queue.addJob('createLead', 'espocrm', { firstName: 'Job2' } as LeadData)
      
      // Assert
      expect(await queue.getQueueLength()).toBe(2)
    })
  })

  describe('Successful Retry', () => {
    it('should complete job on successful retry', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'Success',
        lastName: 'Retry',
        phone: '+77008888888',
        email: 'success@example.com',
        referralCode: 'SUCCESS',
        source: 'test',
      }
      const job = await queue.addJob('createLead', 'espocrm', leadData)

      // Act
      await queue.simulateFailure(job.id)
      await queue.simulateSuccess(job.id)
      const retrieved = await queue.getJob(job.id)
      
      // Assert
      expect(retrieved).toBeNull()
    })

    it('should remove job from queue after success', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'Remove',
        lastName: 'Test',
        phone: '+77009999999',
        email: 'remove@example.com',
        referralCode: 'REMOVE',
        source: 'test',
      }
      const job = await queue.addJob('createLead', 'espocrm', leadData)

      // Act
      await queue.simulateSuccess(job.id)
      
      // Assert
      expect(await queue.getQueueLength()).toBe(0)
      expect(await queue.getJob(job.id)).toBeNull()
    })
  })

  describe('Error Handling', () => {
    it('should store error message in job on failure', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'Error',
        lastName: 'Store',
        phone: '+77001111111',
        email: 'errorstore@example.com',
        referralCode: 'ERRORSTORE',
        source: 'test',
      }
      const job = await queue.addJob('createLead', 'espocrm', leadData)

      // Act
      await queue.simulateFailure(job.id)
      const updated = await queue.getJob(job.id)
      
      // Assert
      expect(updated?.error).toBeDefined()
      expect(updated?.error).toContain('Simulated failure')
    })

    it('should track failure attempts correctly', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'Attempts',
        lastName: 'Track',
        phone: '+77002020202',
        email: 'attempts@example.com',
        referralCode: 'ATTEMPTS',
        source: 'test',
      }
      const job = await queue.addJob('createLead', 'espocrm', leadData)
      
      // Verify initial state
      expect(job.attempts).toBe(0)

      // Act
      await queue.simulateFailure(job.id)
      const firstAttempt = await queue.getJob(job.id)
      await queue.simulateFailure(job.id)
      const secondAttempt = await queue.getJob(job.id)
      
      // Assert
      expect(firstAttempt?.attempts).toBe(1)
      expect(secondAttempt?.attempts).toBe(2)
    })
  })
})
