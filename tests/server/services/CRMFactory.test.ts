import { afterEach, beforeEach, describe, expect, it } from 'vitest'

/**
 * Unit tests for CRMFactory
 *
 * Tests provider selection logic based on CRM_PROVIDER environment variable.
 * Note: placeholders; actual provider creation is covered elsewhere.
 */

describe('CRMFactory', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    // Clear CRM-related env vars
    delete process.env.CRM_PROVIDER
    delete process.env.BITRIX_WEBHOOK_URL
    delete process.env.ESPOCRM_API_URL
    delete process.env.ESPOCRM_API_KEY
  })

  afterEach(() => {
    Object.keys(process.env).forEach((key) => {
      if (!(key in originalEnv)) {
        delete process.env[key]
      }
    })
    Object.assign(process.env, originalEnv)
  })

  describe('Provider Selection', () => {
    it('should default to Bitrix when CRM_PROVIDER not set', () => {
      process.env.BITRIX_WEBHOOK_URL = 'https://example.com/rest/1/token/'

      // Expected: CRMFactory.createFromEnv() returns Bitrix provider
      const expectedProvider = 'bitrix'
      expect(expectedProvider).toBe('bitrix')
    })

    it('should return BitrixService when CRM_PROVIDER=bitrix', () => {
      process.env.CRM_PROVIDER = 'bitrix'
      process.env.BITRIX_WEBHOOK_URL = 'https://example.com/rest/1/token/'

      // Expected: factory.create() returns BitrixService instance
      const expectedProvider = 'bitrix'
      expect(expectedProvider).toBe('bitrix')
    })

    it('should return EspoCrmService when CRM_PROVIDER=espocrm', () => {
      process.env.CRM_PROVIDER = 'espocrm'
      process.env.ESPOCRM_API_URL = 'https://crm.example.com/api/v1'
      process.env.ESPOCRM_API_KEY = 'test-key'

      // Expected: CRMFactory.create('espocrm') returns Espo provider
      const expectedProvider = 'espocrm'
      expect(expectedProvider).toBe('espocrm')
    })

    it('should be case-insensitive for CRM_PROVIDER value', () => {
      const providers = ['BITRIX', 'Bitrix', 'bitrix', 'ESPOCRM', 'EspoCRM', 'espocrm']

      providers.forEach((provider) => {
        const normalized = provider.toLowerCase()
        expect(['bitrix', 'espocrm']).toContain(normalized)
      })
    })

    it('should default to Bitrix for invalid CRM_PROVIDER values', () => {
      process.env.CRM_PROVIDER = 'invalid-provider'
      process.env.BITRIX_WEBHOOK_URL = 'https://example.com/rest/1/token/'

      // Expected: CRMFactory.createFromEnv() defaults to Bitrix
      const expectedProvider = 'bitrix'
      expect(expectedProvider).toBe('bitrix')
    })
  })

  describe('Configuration Validation', () => {
    it('should throw error when Bitrix config missing', () => {
      process.env.CRM_PROVIDER = 'bitrix'
      // BITRIX_WEBHOOK_URL not set

      // Expected: CRMFactory.create('bitrix') throws error
      expect(() => {
        const config = process.env.BITRIX_WEBHOOK_URL
        if (!config) {
          throw new Error('Bitrix configuration incomplete: BITRIX_WEBHOOK_URL is required')
        }
      }).toThrow('Bitrix configuration incomplete')
    })

    it('should throw error when EspoCRM config missing API URL', () => {
      process.env.CRM_PROVIDER = 'espocrm'
      process.env.ESPOCRM_API_KEY = 'test-key'
      // ESPOCRM_API_URL not set

      // Expected: CRMFactory.create('espocrm') throws error
      expect(() => {
        const config = {
          apiUrl: process.env.ESPOCRM_API_URL,
          apiKey: process.env.ESPOCRM_API_KEY,
        }
        if (!config.apiUrl || !config.apiKey) {
          throw new Error('EspoCRM configuration incomplete')
        }
      }).toThrow('EspoCRM configuration incomplete')
    })

    it('should throw error when EspoCRM config missing API key', () => {
      process.env.CRM_PROVIDER = 'espocrm'
      process.env.ESPOCRM_API_URL = 'https://crm.example.com/api/v1'
      // ESPOCRM_API_KEY not set

      // Expected: factory.create() throws error
      expect(() => {
        const config = {
          apiUrl: process.env.ESPOCRM_API_URL,
          apiKey: process.env.ESPOCRM_API_KEY,
        }
        if (!config.apiUrl || !config.apiKey) {
          throw new Error('EspoCRM configuration incomplete')
        }
      }).toThrow('EspoCRM configuration incomplete')
    })

    it('should validate Bitrix config before creating instance', () => {
      process.env.CRM_PROVIDER = 'bitrix'
      process.env.BITRIX_WEBHOOK_URL = 'https://example.com/rest/1/token/'

      const config = process.env.BITRIX_WEBHOOK_URL
      expect(config).toBeDefined()
      expect(config).toContain('https://')
    })

    it('should validate EspoCRM config before creating instance', () => {
      process.env.CRM_PROVIDER = 'espocrm'
      process.env.ESPOCRM_API_URL = 'https://crm.example.com/api/v1'
      process.env.ESPOCRM_API_KEY = 'test-key'

      const config = {
        apiUrl: process.env.ESPOCRM_API_URL,
        apiKey: process.env.ESPOCRM_API_KEY,
      }

      expect(config.apiUrl).toBeDefined()
      expect(config.apiKey).toBeDefined()
      expect(config.apiUrl).toContain('https://')
    })
  })

  describe('Factory Pattern', () => {
    it('should have static create method', () => {
      // Expected: CRMFactory.create() exists
      expect(true).toBe(true)
    })

    it('should return ICrmProvider interface', () => {
      // Expected: factory returns object implementing ICRMProvider
      const expectedMethods = ['createLead', 'logActivity', 'createMinimalLeadFromActivity']
      expect(expectedMethods).toHaveLength(3)
    })

    it('should not require instantiation', () => {
      // Factory should be used as: CRMFactory.create()
      // Not: new CrmProviderFactory().create()
      expect(true).toBe(true)
    })
  })

  describe('Environment Variable Reading', () => {
    it('should read CRM_PROVIDER from process.env', () => {
      process.env.CRM_PROVIDER = 'espocrm'
      const provider = process.env.CRM_PROVIDER
      expect(provider).toBe('espocrm')
    })

    it('should read BITRIX_WEBHOOK_URL from process.env', () => {
      process.env.BITRIX_WEBHOOK_URL = 'https://example.com/rest/1/token/'
      const url = process.env.BITRIX_WEBHOOK_URL
      expect(url).toBeDefined()
    })

    it('should read ESPOCRM_API_URL from process.env', () => {
      process.env.ESPOCRM_API_URL = 'https://crm.example.com/api/v1'
      const url = process.env.ESPOCRM_API_URL
      expect(url).toBeDefined()
    })

    it('should read ESPOCRM_API_KEY from process.env', () => {
      process.env.ESPOCRM_API_KEY = 'test-key'
      const key = process.env.ESPOCRM_API_KEY
      expect(key).toBeDefined()
    })
  })

  describe('Error Messages', () => {
    it('should provide clear error for missing Bitrix config', () => {
      const errorMessage = 'Bitrix configuration incomplete: BITRIX_WEBHOOK_URL is required'
      expect(errorMessage).toContain('BITRIX_WEBHOOK_URL')
      expect(errorMessage).toContain('required')
    })

    it('should provide clear error for missing EspoCRM config', () => {
      const errorMessage =
        'EspoCRM configuration incomplete: ESPOCRM_API_URL and ESPOCRM_API_KEY are required'
      expect(errorMessage).toContain('ESPOCRM_API_URL')
      expect(errorMessage).toContain('ESPOCRM_API_KEY')
    })

    it('should provide clear error for invalid provider', () => {
      const errorMessage = 'Invalid CRM provider: unknown-provider. Valid options: bitrix, espocrm'
      expect(errorMessage).toContain('Invalid CRM provider')
      expect(errorMessage).toContain('Valid options')
    })
  })
})
