import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const readBodyMock = vi.fn()
const logActivityMock = vi.fn()
const createFromEnvMock = vi.fn(() => ({
  logActivity: logActivityMock,
}))
const getCRMConfigMock = vi.fn(() => ({
  provider: 'bitrix',
  webhookUrl: 'https://example.com/rest/1/token',
  timeout: 15000,
  retries: 2,
  fieldMappings: {},
}))
const validateCRMConfigMock = vi.fn()

vi.mock('../../../../server/services/crm/CRMFactory', () => ({
  CRMFactory: {
    createFromEnv: createFromEnvMock,
  },
}))

vi.mock('../../../../server/utils/crm-config', () => ({
  getCRMConfig: getCRMConfigMock,
  validateCRMConfig: validateCRMConfigMock,
}))

vi.mock('../../../../server/utils/utm', () => ({
  sanitizeUtm: vi.fn((utm) => utm),
}))

let consoleWarnSpy: ReturnType<typeof vi.spyOn>

beforeAll(() => {
  consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
})

beforeEach(() => {
  readBodyMock.mockReset()
  logActivityMock.mockReset()
  createFromEnvMock.mockClear()
  getCRMConfigMock.mockClear()
  validateCRMConfigMock.mockClear()
  consoleWarnSpy.mockClear()

  // Reset to default successful behavior
  validateCRMConfigMock.mockImplementation(() => {}) // No throw = valid
  createFromEnvMock.mockReturnValue({
    logActivity: logActivityMock,
  })
})

afterEach(() => {
  consoleWarnSpy.mockClear()
})

afterAll(() => {
  consoleWarnSpy.mockRestore()
})

vi.stubGlobal('defineEventHandler', (<T>(handler: T) => handler) as any)
vi.stubGlobal('readBody', readBodyMock)
vi.stubGlobal('createError', (input: unknown) => input)

describe('POST /api/v1/messenger-events', () => {
  it('requires channel to be provided', async () => {
    readBodyMock.mockResolvedValue({ ref: 'ref-123' })

    const handlerModule = await import('../../../../server/api/v1/messenger-events.post')
    const handler = handlerModule.default

    await expect(handler({} as any)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Channel is required',
    })

    expect(createFromEnvMock).not.toHaveBeenCalled()
    expect(consoleWarnSpy).not.toHaveBeenCalled()
  })

  it('requires referral code to be provided', async () => {
    readBodyMock.mockResolvedValue({ channel: 'telegramPersonal' })

    const handlerModule = await import('../../../../server/api/v1/messenger-events.post')
    const handler = handlerModule.default

    await expect(handler({} as any)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Referral code is required',
    })

    expect(createFromEnvMock).not.toHaveBeenCalled()
    expect(consoleWarnSpy).not.toHaveBeenCalled()
  })

  it('proxies payload to CRM service when valid', async () => {
    readBodyMock.mockResolvedValue({
      channel: 'telegramPersonal',
      ref: 'ref-123',
      session: 'session-1',
      utm: {
        utm_source: 'test-source',
        utm_medium: '',
        other: 42,
      },
      metadata: {
        page: '/contacts',
      },
    })

    logActivityMock.mockResolvedValue({ success: true, id: 99 })

    const handlerModule = await import('../../../../server/api/v1/messenger-events.post')
    const handler = handlerModule.default

    const result = await handler({} as any)

    expect(createFromEnvMock).toHaveBeenCalled()
    expect(logActivityMock).toHaveBeenCalledWith({
      channel: 'telegramPersonal',
      referralCode: 'ref-123',
      session: 'session-1',
      utm: {
        utm_source: 'test-source',
        utm_medium: '',
        other: 42,
      },
      metadata: {
        page: '/contacts',
      },
    })
    expect(result).toEqual({
      success: true,
      activityId: 99,
    })
    expect(consoleWarnSpy).not.toHaveBeenCalled()
  })

  it('returns success with null activityId when CRM logging fails', async () => {
    readBodyMock.mockResolvedValue({
      channel: 'telegramPersonal',
      ref: 'ref-123',
    })

    logActivityMock.mockResolvedValue({ success: false, error: 'Failed to log' })

    const handlerModule = await import('../../../../server/api/v1/messenger-events.post')
    const handler = handlerModule.default

    const result = await handler({} as any)

    expect(result).toEqual({
      success: true,
      activityId: null,
    })
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    expect(consoleWarnSpy).toHaveBeenCalledWith('[CRM] Failed to log messenger event', {
      channel: 'telegramPersonal',
      referralCode: 'ref-123',
      error: 'Failed to log',
    })
  })

  it('returns 503 when CRM is not configured', async () => {
    readBodyMock.mockResolvedValue({
      channel: 'telegramPersonal',
      ref: 'ref-123',
    })

    validateCRMConfigMock.mockImplementation(() => {
      throw new Error('Config missing')
    })

    const handlerModule = await import('../../../../server/api/v1/messenger-events.post')
    const handler = handlerModule.default

    await expect(handler({} as any)).rejects.toMatchObject({
      statusCode: 503,
      statusMessage: 'CRM integration is not configured',
    })

    expect(createFromEnvMock).not.toHaveBeenCalled()
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[CRM] Configuration is missing. Unable to log messenger event.',
      'Config missing',
    )
  })
})
