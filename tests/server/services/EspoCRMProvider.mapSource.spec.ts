import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { EspoCRMProvider } from '~~/server/services/crm/EspoCRMProvider'
import { FORM_SOURCES } from '~/types/preferences'

describe('EspoCRMProvider mapEspoSource', () => {
  const originalEnv = { ...process.env }
  let provider: EspoCRMProvider

  beforeEach(() => {
    process.env.CRM_PROVIDER = 'espocrm'
    process.env.ESPOCRM_URL = 'https://crm.example.com'
    process.env.ESPOCRM_API_KEY = 'test-api-key'
    provider = new EspoCRMProvider()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    Object.keys(process.env).forEach((key) => {
      if (!(key in originalEnv)) {
        delete process.env[key]
      }
    })
    Object.assign(process.env, originalEnv)
  })

  it('maps all CTA sources to Web Site', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const ctaKeys = Object.keys(FORM_SOURCES)

    for (const key of ctaKeys) {
      const mapped = (provider as any).mapEspoSource(key)
      expect(mapped).toBe('Web Site')
    }

    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('logs when encountering an unknown source', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const mapped = (provider as any).mapEspoSource('new_cta_source')

    expect(mapped).toBeUndefined()
    expect(warnSpy).toHaveBeenCalledWith(
      'EspoCRMProvider: unknown lead source received',
      'new_cta_source',
    )
  })
})
