import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { BitrixService } from '~~/server/services/BitrixService'

describe('BitrixService.logMessengerEvent', () => {
  const originalEnv = { ...process.env }
  const webhookUrl = 'https://example.com/rest/1/abc'

  beforeEach(() => {
    process.env.BITRIX_WEBHOOK_URL = webhookUrl
    process.env.BITRIX_DOMAIN = 'example.com'
    process.env.BITRIX_ACCESS_TOKEN = 'token'
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

  it('sanitizes payload and ignores invalid activity config values', async () => {
    process.env.BITRIX_ACTIVITY_OWNER_ID = 'invalid'
    process.env.BITRIX_ACTIVITY_OWNER_TYPE_ID = '4'
    process.env.BITRIX_ACTIVITY_RESPONSIBLE_ID = '12'

    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ result: 321 }),
    }))
    ;(global as any).fetch = fetchMock

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const service = new BitrixService({ domain: 'example.com', accessToken: 'token', webhookUrl })

    const result = await service.logMessengerEvent({
      channel: ' telegram ',
      referralCode: ' ref-code ',
      session: '   ',
      utm: {
        utm_source: ' Google ',
        utm_medium: '',
        utm_campaign: '',
        utm_content: '',
        utm_term: '',
      },
      metadata: {
        page: ' /contact ',
        section: '',
        component: '',
        campaign: '',
        referrer: '',
        notes: '  custom note  ',
      },
    })

    expect(result).toEqual({ success: true, activityId: 321 })
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [, requestInit] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    const body = JSON.parse(requestInit.body as string)

    expect(body.fields.SUBJECT).toBe('Messenger click: telegram')
    expect(body.fields.COMMUNICATIONS).toEqual([{ TYPE: 'IM', VALUE: 'telegram' }])
    expect(body.fields.OWNER_ID).toBeUndefined()
    expect(body.fields.OWNER_TYPE_ID).toBe(4)
    expect(body.fields.RESPONSIBLE_ID).toBe(12)
    expect(body.fields.DESCRIPTION).toContain('Channel: telegram')
    expect(body.fields.DESCRIPTION).not.toContain('other')
    expect(body.fields.DESCRIPTION).not.toContain('utm_term')
    expect(body.fields.DESCRIPTION).not.toContain('session')

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('BITRIX_ACTIVITY_OWNER_ID'),
    )
  })

  it('returns failure when payload validation fails', async () => {
    const fetchMock = vi.fn()
    ;(global as any).fetch = fetchMock

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const service = new BitrixService({ domain: 'example.com', accessToken: 'token', webhookUrl })

    const result = await service.logMessengerEvent({
      channel: '',
      referralCode: '',
      session: '',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid messenger event payload')
    expect(fetchMock).not.toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalled()
  })
})
