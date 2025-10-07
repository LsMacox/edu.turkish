import { describe, it, expect, beforeEach } from 'vitest'
import { createMockQueue } from '~~/tests/test-utils'
import type { LeadData } from '~~/server/types/crm'

describe('CRM Lead Creation Integration', () => {
  let queue: ReturnType<typeof createMockQueue>

  beforeEach(async () => {
    queue = createMockQueue()
    await queue.clear()
  })

  describe('Application Submission → CRM Lead', () => {
    const applicationData: LeadData = {
      firstName: 'Integration',
      lastName: 'Test',
      phone: '+77005555555',
      email: 'integration@example.com',
      referralCode: 'INTEG123',
      source: 'university_detail',
      userType: 'student',
      language: 'turkish',
      universities: ['Bogazici', 'METU'],
      scholarship: 'yes',
      utm: {
        source: 'google',
        medium: 'cpc',
        campaign: 'summer2024',
      },
    }

    it('should queue lead creation for Bitrix', async () => {
      // Arrange
      const job = await queue.addJob('createLead', 'bitrix', applicationData)

      // Assert
      expect(job.id).toBeDefined()
      expect(job.status).toBe('pending')
      expect(job.provider).toBe('bitrix')
      expect(job.data).toEqual(applicationData)
    })

    it('should queue lead creation for EspoCRM', async () => {
      // Arrange
      const job = await queue.addJob('createLead', 'espocrm', applicationData)

      // Assert
      expect(job.id).toBeDefined()
      expect(job.status).toBe('pending')
      expect(job.provider).toBe('espocrm')
      expect(job.data).toEqual(applicationData)
    })

    it('should preserve all lead data in queue', async () => {
      // Arrange
      const job = await queue.addJob('createLead', 'bitrix', applicationData)

      // Act
      const retrieved = await queue.getJob(job.id)

      // Assert
      expect(retrieved).toBeDefined()
      expect(retrieved?.data).toEqual(applicationData)
    })

    it('should queue multiple leads independently', async () => {
      // Arrange
      const job1 = await queue.addJob('createLead', 'espocrm', applicationData)
      const job2 = await queue.addJob('createLead', 'bitrix', { ...applicationData, email: 'test2@example.com' })

      // Assert
      expect(job1.id).not.toBe(job2.id)
      expect(await queue.getQueueLength()).toBe(2)
    })

    it('should handle minimal application data', async () => {
      // Arrange
      const minimalData: LeadData = {
        firstName: 'Minimal',
        lastName: 'Lead',
        phone: '+77006666666',
        email: 'minimal@example.com',
        referralCode: 'MIN',
        source: 'test',
      }

      // Act
      const job = await queue.addJob('createLead', 'espocrm', minimalData)

      // Assert
      expect(job.data).toEqual(minimalData)
    })

    it('should preserve UTM parameters in queued lead', async () => {
      // Act
      const job = await queue.addJob('createLead', 'espocrm', applicationData)
      const retrieved = await queue.getJob(job.id)

      // Assert
      expect(retrieved?.data).toMatchObject({
        utm: {
          source: 'google',
          medium: 'cpc',
          campaign: 'summer2024',
        },
      })
    })
  })

  describe('Field Mapping Validation', () => {
    it('should queue referral code data for Bitrix', async () => {
      // Arrange
      const data: LeadData = {
        firstName: 'Ref',
        lastName: 'Test',
        phone: '+77007777777',
        email: 'ref@example.com',
        referralCode: 'REF123',
        source: 'test',
      }

      // Act
      const job = await queue.addJob('createLead', 'bitrix', data)

      // Assert
      expect(job.data.referralCode).toBe('REF123')
    })

    it('should queue referral code data for EspoCRM', async () => {
      // Arrange
      const data: LeadData = {
        firstName: 'Ref',
        lastName: 'Test',
        phone: '+77007777777',
        email: 'ref@example.com',
        referralCode: 'REF123',
        source: 'test',
      }

      // Act
      const job = await queue.addJob('createLead', 'espocrm', data)

      // Assert
      expect(job.data.referralCode).toBe('REF123')
    })

    it('should queue user type data correctly', async () => {
      // Arrange
      const studentData: LeadData = {
        firstName: 'Student',
        lastName: 'User',
        phone: '+77008888888',
        email: 'student@example.com',
        referralCode: 'STU',
        source: 'test',
        userType: 'student',
      }

      // Act
      const job = await queue.addJob('createLead', 'espocrm', studentData)

      // Assert
      expect(job.data.userType).toBe('student')
    })

    it('should queue language preference correctly', async () => {
      // Arrange
      const data: LeadData = {
        firstName: 'Lang',
        lastName: 'Test',
        phone: '+77009999999',
        email: 'lang@example.com',
        referralCode: 'LANG',
        source: 'test',
        language: 'both',
      }

      // Act
      const job = await queue.addJob('createLead', 'espocrm', data)

      // Assert
      expect(job.data.language).toBe('both')
    })
  })
})
