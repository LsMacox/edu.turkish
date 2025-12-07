import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { ApplicationRequest } from '~~/server/types/api'

// Import after mocks
import {
  ApplicationService,
  getApplicationService,
} from '~~/server/services/application/ApplicationService'
import { prisma } from '~~/lib/prisma'

// Use vi.hoisted for variables used in vi.mock factories
const { mockGetCookie, mockCRMService, mockQueue } = vi.hoisted(() => ({
  mockGetCookie: vi.fn(),
  mockCRMService: {
    providerName: 'espocrm' as const,
    createLead: vi.fn(),
  },
  mockQueue: {
    addJob: vi.fn().mockResolvedValue({ id: 'job-1' }),
    getQueueLength: vi.fn().mockResolvedValue(0),
    clear: vi.fn().mockResolvedValue(undefined),
    _jobs: [] as any[],
  },
}))

// Track queued jobs for assertions
mockQueue.addJob.mockImplementation(async (op: string, provider: string, data: any) => {
  const job = { id: `job-${mockQueue._jobs.length + 1}`, operation: op, provider, data }
  mockQueue._jobs.push(job)
  return job
})
mockQueue.getQueueLength.mockImplementation(async () => mockQueue._jobs.length)
mockQueue.clear.mockImplementation(async () => {
  mockQueue._jobs = []
})

vi.mock('~~/lib/prisma', () => ({
  prisma: {
    application: {
      create: vi.fn(),
    },
  },
}))

vi.mock('~~/server/services/queue', () => ({
  getRedisQueue: () => mockQueue,
}))

vi.mock('~~/server/services/crm/CRMFactory', () => ({
  CRMFactory: {
    createFromEnv: () => mockCRMService,
  },
}))

vi.mock('h3', async (importOriginal) => {
  const actual = await importOriginal<typeof import('h3')>()
  return {
    ...actual,
    getCookie: mockGetCookie,
  }
})

const mockPrisma = prisma as any

describe('ApplicationService', () => {
  let service: ApplicationService

  const validRequest: ApplicationRequest = {
    personal_info: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '+79001234567',
    },
    preferences: {
      universities: ['Istanbul University'],
      programs: ['Computer Science'],
    },
    source: 'website',
    referral_code: 'TEST123',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    service = new ApplicationService()

    // Setup default mock responses
    mockPrisma.application.create.mockResolvedValue({
      id: 1,
      trackingCode: 'EDU-TEST-12345678',
      status: 'submitted',
      submittedAt: new Date('2025-01-01T12:00:00Z'),
    })

    mockCRMService.createLead.mockResolvedValue({
      success: true,
      id: 'crm-lead-123',
    })
  })

  afterEach(async () => {
    await mockQueue.clear()
  })

  describe('submit', () => {
    it('should create application and sync to CRM successfully', async () => {
      const result = await service.submit(validRequest)

      expect(result.id).toBe('1')
      expect(result.tracking_code).toBe('EDU-TEST-12345678')
      expect(result.status).toBe('submitted')
      expect(result.crm.provider).toBe('espocrm')
      expect(result.crm.leadId).toBe('crm-lead-123')
      expect(result.crm.error).toBeNull()
    })

    it('should persist application even if CRM fails', async () => {
      mockCRMService.createLead.mockResolvedValue({
        success: false,
        error: 'CRM connection timeout',
      })

      const result = await service.submit(validRequest)

      // Application should still be created
      expect(result.id).toBe('1')
      expect(result.tracking_code).toBe('EDU-TEST-12345678')

      // CRM error should be captured
      expect(result.crm.error).toBe('CRM connection timeout')
      expect(result.crm.leadId).toBeNull()

      // Job should be queued for retry
      const queueLength = await mockQueue.getQueueLength()
      expect(queueLength).toBe(1)
    })

    it('should queue for retry when CRM throws exception', async () => {
      mockCRMService.createLead.mockRejectedValue(new Error('Network error'))

      const result = await service.submit(validRequest)

      expect(result.id).toBe('1')
      expect(result.crm.error).toBe('Network error')

      const queueLength = await mockQueue.getQueueLength()
      expect(queueLength).toBe(1)
    })

    it('should throw validation error from CRM', async () => {
      mockCRMService.createLead.mockResolvedValue({
        success: false,
        validationErrors: ['Phone number already exists', 'Invalid email format'],
      })

      await expect(service.submit(validRequest)).rejects.toMatchObject({
        isValidationError: true,
        errors: ['Phone number already exists', 'Invalid email format'],
      })

      // Should NOT queue validation errors
      const queueLength = await mockQueue.getQueueLength()
      expect(queueLength).toBe(0)
    })

    it('should handle duplicate leads gracefully', async () => {
      mockCRMService.createLead.mockResolvedValue({
        success: true,
        id: 'existing-lead-456',
        duplicate: true,
      })

      const result = await service.submit(validRequest)

      expect(result.crm.leadId).toBe('existing-lead-456')
      expect(result.crm.error).toBeNull()
    })

    it('should include fingerprint data in CRM lead', async () => {
      await service.submit(validRequest, {
        fingerprintCookie: 'fp-abc123',
      })

      expect(mockCRMService.createLead).toHaveBeenCalledWith(
        expect.objectContaining({
          session: 'fp-abc123',
          fingerprintKey: 'email:john@example.com|phone:79001234567',
        }),
      )
    })
  })

  describe('getApplicationService', () => {
    it('should return singleton instance', () => {
      const instance1 = getApplicationService()
      const instance2 = getApplicationService()

      expect(instance1).toBe(instance2)
    })
  })

  describe('extractContext', () => {
    it('should extract fingerprint cookie from event', () => {
      const mockEvent = {
        node: { req: {}, res: {} },
      } as any

      mockGetCookie.mockReturnValue('  fp-test-cookie  ')

      const ctx = service.extractContext(mockEvent)

      expect(ctx.fingerprintCookie).toBe('fp-test-cookie')
      expect(mockGetCookie).toHaveBeenCalledWith(mockEvent, 'fp')
    })
  })
})
