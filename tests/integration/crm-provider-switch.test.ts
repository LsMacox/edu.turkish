import { describe, it, expect, beforeEach } from 'vitest'
import { createMockQueue } from '~~/tests/test-utils'
import type { LeadData, ActivityData } from '~~/server/types/crm'

describe('CRM Provider Switching Integration', () => {
  let queue: ReturnType<typeof createMockQueue>

  beforeEach(async () => {
    queue = createMockQueue()
    await queue.clear()
  })

  describe('Provider Selection via Queue', () => {
    it('should queue jobs for Bitrix provider', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'Bitrix',
        lastName: 'Test',
        phone: '+77001234567',
        email: 'bitrix@example.com',
        referralCode: 'BITRIX',
        source: 'test',
      }

      // Act
      const job = await queue.addJob('createLead', 'bitrix', leadData)
      
      // Assert
      expect(job.provider).toBe('bitrix')
      expect(job.data).toEqual(leadData)
    })

    it('should queue jobs for EspoCRM provider', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'EspoCRM',
        lastName: 'Test',
        phone: '+77001234567',
        email: 'espocrm@example.com',
        referralCode: 'ESPOCRM',
        source: 'test',
      }

      // Act
      const job = await queue.addJob('createLead', 'espocrm', leadData)
      
      // Assert
      expect(job.provider).toBe('espocrm')
      expect(job.data).toEqual(leadData)
    })

    it('should support queuing to both providers simultaneously', async () => {
      // Arrange & Act
      const bitrixJob = await queue.addJob('createLead', 'bitrix', { firstName: 'User1' } as LeadData)
      const espocrmJob = await queue.addJob('createLead', 'espocrm', { firstName: 'User2' } as LeadData)
      
      // Assert
      expect(bitrixJob.provider).toBe('bitrix')
      expect(espocrmJob.provider).toBe('espocrm')
      expect(await queue.getQueueLength()).toBe(2)
    })
  })

  describe('Operations Route to Correct Provider', () => {
    const leadData: LeadData = {
      firstName: 'Switch',
      lastName: 'Test',
      phone: '+77001234567',
      email: 'switch@example.com',
      referralCode: 'SWITCH',
      source: 'test',
    }

    it('should queue lead creation for Bitrix', async () => {
      // Act
      const job = await queue.addJob('createLead', 'bitrix', leadData)

      // Assert
      expect(job.provider).toBe('bitrix')
      expect(job.operation).toBe('createLead')
    })

    it('should queue lead creation for EspoCRM', async () => {
      // Act
      const job = await queue.addJob('createLead', 'espocrm', leadData)

      // Assert
      expect(job.provider).toBe('espocrm')
      expect(job.operation).toBe('createLead')
    })

    it('should queue activity logging for both providers', async () => {
      // Arrange
      const activityData: ActivityData = {
        channel: 'telegramBot',
        referralCode: 'ACTIVITY_SWITCH',
      }

      // Act
      const bitrixJob = await queue.addJob('logActivity', 'bitrix', activityData)
      const espocrmJob = await queue.addJob('logActivity', 'espocrm', activityData)

      // Assert
      expect(bitrixJob.provider).toBe('bitrix')
      expect(espocrmJob.provider).toBe('espocrm')
      expect(await queue.getQueueLength()).toBe(2)
    })
  })

  describe('Queue Data Preservation', () => {
    it('should preserve all lead fields for Bitrix', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'Backward',
        lastName: 'Compatible',
        phone: '+77009876543',
        email: 'backward@example.com',
        referralCode: 'BACKWARD',
        source: 'test',
        userType: 'parent',
      }

      // Act
      const job = await queue.addJob('createLead', 'bitrix', leadData)

      // Assert
      expect(job.data).toEqual(leadData)
      expect(job.data.userType).toBe('parent')
    })

    it('should preserve complex data structures', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'Complex',
        lastName: 'Data',
        phone: '+77001111111',
        email: 'complex@example.com',
        referralCode: 'COMPLEX',
        source: 'test',
        universities: ['Bogazici', 'METU'],
        utm: {
          source: 'google',
          medium: 'cpc',
          campaign: 'test',
        },
      }

      // Act
      const job = await queue.addJob('createLead', 'espocrm', leadData)

      // Assert
      expect(job.data.universities).toEqual(['Bogazici', 'METU'])
      expect(job.data.utm).toEqual({ source: 'google', medium: 'cpc', campaign: 'test' })
    })
  })

  describe('Concurrent Provider Operations', () => {
    it('should handle concurrent queuing to different providers', async () => {
      // Arrange
      const leadData1: LeadData = {
        firstName: 'Concurrent1',
        lastName: 'Test',
        phone: '+77006666666',
        email: 'concurrent1@example.com',
        referralCode: 'CONC1',
        source: 'test',
      }

      const leadData2: LeadData = {
        firstName: 'Concurrent2',
        lastName: 'Test',
        phone: '+77007777777',
        email: 'concurrent2@example.com',
        referralCode: 'CONC2',
        source: 'test',
      }

      // Act
      const [bitrixJob, espocrmJob] = await Promise.all([
        queue.addJob('createLead', 'bitrix', leadData1),
        queue.addJob('createLead', 'espocrm', leadData2),
      ])

      // Assert
      expect(bitrixJob.provider).toBe('bitrix')
      expect(espocrmJob.provider).toBe('espocrm')
      expect(bitrixJob.data.firstName).toBe('Concurrent1')
      expect(espocrmJob.data.firstName).toBe('Concurrent2')
    })

    it('should maintain separate job queues per provider', async () => {
      // Arrange & Act
      await queue.addJob('createLead', 'bitrix', { firstName: 'B1' } as LeadData)
      await queue.addJob('createLead', 'espocrm', { firstName: 'E1' } as LeadData)
      await queue.addJob('createLead', 'bitrix', { firstName: 'B2' } as LeadData)
      await queue.addJob('createLead', 'espocrm', { firstName: 'E2' } as LeadData)

      // Assert
      expect(await queue.getQueueLength()).toBe(4)
    })
  })

  describe('Provider-Specific Data Handling', () => {
    it('should queue Bitrix-specific referral codes', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'Bitrix',
        lastName: 'Ref',
        phone: '+77002222222',
        email: 'bitrix-ref@example.com',
        referralCode: 'BITRIX_REF_123',
        source: 'test',
      }

      // Act
      const job = await queue.addJob('createLead', 'bitrix', leadData)

      // Assert
      expect(job.data.referralCode).toBe('BITRIX_REF_123')
      expect(job.provider).toBe('bitrix')
    })

    it('should queue EspoCRM-specific data fields', async () => {
      // Arrange
      const leadData: LeadData = {
        firstName: 'EspoCRM',
        lastName: 'Custom',
        phone: '+77003333333',
        email: 'espocrm-custom@example.com',
        referralCode: 'ESPO_CUSTOM',
        source: 'test',
        userType: 'student',
        language: 'turkish',
      }

      // Act
      const job = await queue.addJob('createLead', 'espocrm', leadData)

      // Assert
      expect(job.data.userType).toBe('student')
      expect(job.data.language).toBe('turkish')
      expect(job.provider).toBe('espocrm')
    })
  })
})
