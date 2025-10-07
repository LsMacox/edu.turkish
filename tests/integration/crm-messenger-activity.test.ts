import { describe, it, expect, beforeEach } from 'vitest'
import { createMockQueue } from '~~/tests/test-utils'
import type { ActivityData } from '~~/server/types/crm'

describe('CRM Messenger Activity Integration', () => {
  let queue: ReturnType<typeof createMockQueue>

  beforeEach(async () => {
    queue = createMockQueue()
    await queue.clear()
  })

  describe('Messenger Click → Activity Log', () => {
    it('should queue telegram click activity', async () => {
      // Arrange
      const activityData: ActivityData = {
        channel: 'telegramBot',
        referralCode: 'PARTNER123',
        utm: {
          source: 'instagram',
          campaign: 'summer2024',
        },
        metadata: {
          page: '/university/bogazici',
          section: 'contact',
        },
      }

      // Act
      const job = await queue.addJob('logActivity', 'espocrm', activityData)

      // Assert
      expect(job.id).toBeDefined()
      expect(job.operation).toBe('logActivity')
      expect(job.data).toEqual(activityData)
    })

    it('should queue whatsapp click activity', async () => {
      // Arrange
      const activityData: ActivityData = {
        channel: 'whatsapp',
        referralCode: 'PARTNER456',
        session: 'session-abc-123',
      }

      // Act
      const job = await queue.addJob('logActivity', 'espocrm', activityData)

      // Assert
      expect(job.id).toBeDefined()
      expect(job.data.channel).toBe('whatsapp')
      expect(job.data.session).toBe('session-abc-123')
    })

    it('should queue instagram click activity', async () => {
      // Arrange
      const activityData: ActivityData = {
        channel: 'instagram',
        referralCode: 'PARTNER789',
        utm: {
          source: 'facebook',
          medium: 'social',
        },
      }

      // Act
      const job = await queue.addJob('logActivity', 'espocrm', activityData)

      // Assert
      expect(job.data.channel).toBe('instagram')
      expect(job.data.utm).toEqual({ source: 'facebook', medium: 'social' })
    })

    it('should preserve UTM parameters in queued activity', async () => {
      // Arrange
      const activityData: ActivityData = {
        channel: 'telegramBot',
        referralCode: 'UTM_TEST',
        utm: {
          source: 'google',
          medium: 'cpc',
          campaign: 'test_campaign',
          content: 'ad_variant_a',
          term: 'study+turkey',
        },
      }

      // Act
      const job = await queue.addJob('logActivity', 'espocrm', activityData)
      const retrieved = await queue.getJob(job.id)

      // Assert
      expect(retrieved?.data.utm).toEqual({
        source: 'google',
        medium: 'cpc',
        campaign: 'test_campaign',
        content: 'ad_variant_a',
        term: 'study+turkey',
      })
    })

    it('should preserve session and metadata in queued activity', async () => {
      // Arrange
      const activityData: ActivityData = {
        channel: 'whatsapp',
        referralCode: 'SESSION_TEST',
        session: 'user-session-xyz-789',
        metadata: {
          referrer: 'https://google.com',
          page: '/universities',
        },
      }

      // Act
      const job = await queue.addJob('logActivity', 'espocrm', activityData)

      // Assert
      expect(job.data.session).toBe('user-session-xyz-789')
      expect(job.data.metadata).toEqual({
        referrer: 'https://google.com',
        page: '/universities',
      })
    })
  })

  describe('Activity Queue Management', () => {
    it('should queue multiple activities independently', async () => {
      // Arrange & Act
      await queue.addJob('logActivity', 'espocrm', { channel: 'telegramBot', referralCode: 'ACT1' } as ActivityData)
      await queue.addJob('logActivity', 'bitrix', { channel: 'whatsapp', referralCode: 'ACT2' } as ActivityData)
      await queue.addJob('logActivity', 'espocrm', { channel: 'instagram', referralCode: 'ACT3' } as ActivityData)

      // Assert
      expect(await queue.getQueueLength()).toBe(3)
    })

    it('should preserve referral codes across different channels', async () => {
      // Arrange
      const activities = [
        { channel: 'telegramBot' as const, referralCode: 'REF1' },
        { channel: 'whatsapp' as const, referralCode: 'REF2' },
        { channel: 'instagram' as const, referralCode: 'REF3' },
      ]

      // Act
      const jobs = await Promise.all(
        activities.map((act) => queue.addJob('logActivity', 'espocrm', act))
      )

      // Assert
      expect(jobs[0]?.data.referralCode).toBe('REF1')
      expect(jobs[1]?.data.referralCode).toBe('REF2')
      expect(jobs[2]?.data.referralCode).toBe('REF3')
    })

    it('should support both Bitrix and EspoCRM providers', async () => {
      // Arrange
      const activityData: ActivityData = {
        channel: 'telegramBot',
        referralCode: 'CROSS_TEST',
        utm: {
          source: 'test',
        },
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
})
