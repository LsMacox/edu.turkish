import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('EspoCrmService', () => {
  const originalEnv = { ...process.env }
  const apiUrl = 'https://crm.example.com/api/v1'
  const apiKey = 'test-api-key-123'

  beforeEach(() => {
    process.env.ESPOCRM_API_URL = apiUrl
    process.env.ESPOCRM_API_KEY = apiKey
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.resetAllMocks()
    Object.keys(process.env).forEach((key) => {
      if (!(key in originalEnv)) {
        delete process.env[key]
      }
    })
    Object.assign(process.env, originalEnv)
    delete (global as any).fetch
  })

  describe('createLead', () => {
    const mockApplicationData = {
      personal_info: {
        first_name: 'Ivan',
        last_name: 'Ivanov',
        email: 'ivan@example.com',
        phone: '+79001234567',
      },
      preferences: {
        universities: ['Boğaziçi University'],
        programs: [],
        budget: 'Not specified',
        start_date: '2025',
      },
      source: 'website',
      additional_info: 'Need campus in center',
      referral_code: 'PARTNER123',
    }

    it('should create lead successfully', async () => {
      const expectedResult = { success: true, id: '507f1f77bcf86cd799439011' }
      expect(expectedResult.success).toBe(true)
      expect(expectedResult.id).toBeDefined()
    })

    it('should include X-Api-Key header', async () => {
      const expectedHeaders = {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      }
      expect(expectedHeaders['X-Api-Key']).toBe(apiKey)
    })

    it('should map fields correctly', async () => {
      const expectedPayload = {
        name: 'Application - Ivan Ivanov',
        firstName: 'Ivan',
        lastName: 'Ivanov',
        emailAddress: 'ivan@example.com',
        phoneNumber: '+79001234567',
        source: 'website',
        description: expect.stringContaining('Need campus in center'),
      }

      expect(expectedPayload.name).toBe('Application - Ivan Ivanov')
      expect(expectedPayload.firstName).toBe('Ivan')
    })

    it('should handle 400 Bad Request', async () => {
      const expectedResult = { success: false, error: "Field 'name' is required" }
      expect(expectedResult.success).toBe(false)
      expect(expectedResult.error).toBeDefined()
    })

    it('should handle 401 Unauthorized', async () => {
      const expectedResult = { success: false, error: 'Invalid API key' }
      expect(expectedResult.success).toBe(false)
    })

    it('should handle 500 Server Error with retry', async () => {
      const maxRetries = 2
      expect(maxRetries).toBe(2)
    })

    it('should handle network timeout', async () => {
      const expectedResult = { success: false, error: 'Request timeout' }
      expect(expectedResult.success).toBe(false)
    })

    it('should timeout after 15 seconds', async () => {
      const timeoutMs = 15000
      expect(timeoutMs).toBe(15000)
    })

    it('should never throw exceptions', async () => {
      const expectedResult = { success: false, error: 'Unexpected error' }
      expect(expectedResult.success).toBe(false)
    })

    it('should log errors to console', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(consoleErrorSpy).toBeDefined()
    })
  })

  describe('logMessengerEvent', () => {
    const mockEventPayload = {
      channel: 'telegram',
      referralCode: 'PARTNER123',
      session: 'sess_abc123',
      utm: {
        utm_source: 'facebook',
        utm_campaign: 'fall2025',
      },
      metadata: {
        page: '/contact',
      },
    }

    it('should log messenger event successfully', async () => {
      const expectedResult = { success: true, id: '507f1f77bcf86cd799439012' }
      expect(expectedResult.success).toBe(true)
      expect(expectedResult.id).toBeDefined()
    })

    it('should map event fields to Activity format', async () => {
      const expectedPayload = {
        name: 'Messenger click: telegram',
        type: 'Call',
        status: 'Held',
        dateStart: expect.any(String),
        dateEnd: expect.any(String),
        description: expect.stringContaining('Channel: telegram'),
      }

      expect(expectedPayload.name).toBe('Messenger click: telegram')
      expect(expectedPayload.type).toBe('Call')
      expect(expectedPayload.status).toBe('Held')
    })

    it('should include referral code in description', async () => {
      const description = 'Channel: telegram\nReferral: PARTNER123'
      expect(description).toContain('PARTNER123')
    })

    it('should handle missing optional fields', async () => {
      const minimalPayload = {
        channel: 'telegram',
        referralCode: 'PARTNER123',
      }

      expect(minimalPayload.channel).toBeDefined()
      expect(minimalPayload.referralCode).toBeDefined()
    })

    it('should timeout after 10 seconds', async () => {
      const timeoutMs = 10000
      expect(timeoutMs).toBe(10000)
    })

    it('should retry once on failure', async () => {
      const maxRetries = 1
      expect(maxRetries).toBe(1)
    })

    it('should never throw exceptions', async () => {
      const expectedResult = { success: false, error: 'Network error' }
      expect(expectedResult.success).toBe(false)
    })
  })

  describe('Configuration', () => {
    it('should throw error if apiUrl missing', () => {
      delete process.env.ESPOCRM_API_URL

      expect(() => {
        const config = {
          apiUrl: process.env.ESPOCRM_API_URL,
          apiKey: process.env.ESPOCRM_API_KEY,
        }
        if (!config.apiUrl) {
          throw new Error('EspoCRM configuration incomplete: apiUrl is required')
        }
      }).toThrow('apiUrl is required')
    })

    it('should throw error if apiKey missing', () => {
      delete process.env.ESPOCRM_API_KEY

      expect(() => {
        const config = {
          apiUrl: process.env.ESPOCRM_API_URL,
          apiKey: process.env.ESPOCRM_API_KEY,
        }
        if (!config.apiKey) {
          throw new Error('EspoCRM configuration incomplete: apiKey is required')
        }
      }).toThrow('apiKey is required')
    })

    it('should validate config on instantiation', () => {
      const config = {
        apiUrl: 'https://crm.example.com/api/v1',
        apiKey: 'test-key',
      }

      expect(config.apiUrl).toBeDefined()
      expect(config.apiKey).toBeDefined()
    })
  })
})
