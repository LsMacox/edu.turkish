import { beforeEach, describe, expect, it, vi } from 'vitest'

declare global {
  // eslint-disable-next-line no-var
  var defineEventHandler: <T>(handler: T) => T
  // eslint-disable-next-line no-var
  var readBody: <T>(event: any) => Promise<T>
  // eslint-disable-next-line no-var
  var createError: (input: any) => any
}

const readBodyMock = vi.fn()
const logMessengerEventMock = vi.fn()
const BitrixServiceMock = vi.fn(() => ({
  logMessengerEvent: logMessengerEventMock
}))
const getBitrixConfigMock = vi.fn(() => ({ domain: 'example.com', accessToken: 'token' }))

vi.mock('../../../../server/services/BitrixService', () => ({
  BitrixService: BitrixServiceMock
}))

vi.mock('../../../../server/utils/bitrix-config', () => ({
  getBitrixConfig: getBitrixConfigMock
}))

beforeEach(() => {
  readBodyMock.mockReset()
  logMessengerEventMock.mockReset()
  BitrixServiceMock.mockClear()
  getBitrixConfigMock.mockClear()
})

globalThis.defineEventHandler = (<T>(handler: T) => handler) as any
; (globalThis as any).readBody = readBodyMock
; (globalThis as any).createError = (input: any) => input

describe('POST /api/v1/messenger-events', () => {
  it('requires referral code to be provided', async () => {
    readBodyMock.mockResolvedValue({ channel: 'telegramPersonal' })

    const handlerModule = await import('../../../../server/api/v1/messenger-events.post')
    const handler = handlerModule.default

    await expect(handler({} as any)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Referral code is required'
    })

    expect(BitrixServiceMock).not.toHaveBeenCalled()
  })

  it('proxies payload to Bitrix service when valid', async () => {
    readBodyMock.mockResolvedValue({
      channel: 'telegramPersonal',
      referral_code: 'ref-123',
      session: 'session-1',
      utm: {
        utm_source: 'test-source',
        utm_medium: '',
        other: 42
      },
      metadata: {
        page: '/contacts'
      }
    })

    logMessengerEventMock.mockResolvedValue({ success: true, activityId: 99 })

    const handlerModule = await import('../../../../server/api/v1/messenger-events.post')
    const handler = handlerModule.default

    const result = await handler({} as any)

    expect(BitrixServiceMock).toHaveBeenCalledWith({ domain: 'example.com', accessToken: 'token' })
    expect(logMessengerEventMock).toHaveBeenCalledWith({
      channel: 'telegramPersonal',
      referralCode: 'ref-123',
      session: 'session-1',
      utm: {
        utm_source: 'test-source'
      },
      metadata: {
        page: '/contacts'
      }
    })
    expect(result).toEqual({
      success: true,
      activityId: 99
    })
  })

  it('returns 502 when Bitrix logging fails', async () => {
    readBodyMock.mockResolvedValue({
      channel: 'telegramPersonal',
      referral_code: 'ref-123'
    })

    logMessengerEventMock.mockResolvedValue({ success: false, error: 'Failed to log' })

    const handlerModule = await import('../../../../server/api/v1/messenger-events.post')
    const handler = handlerModule.default

    await expect(handler({} as any)).rejects.toMatchObject({
      statusCode: 502,
      statusMessage: 'Failed to log'
    })
  })
})
