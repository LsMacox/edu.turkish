import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

declare global {
  // eslint-disable-next-line no-var
  var defineEventHandler: <T>(handler: T) => T
  // eslint-disable-next-line no-var
  var getQuery: (event: unknown) => Record<string, unknown>
  // eslint-disable-next-line no-var
  var setCookie: ReturnType<typeof vi.fn>
}

const getQueryMock = vi.fn()
const setCookieMock = vi.fn()

const originalNodeEnv = process.env.NODE_ENV

beforeEach(() => {
  vi.resetModules()

  getQueryMock.mockReset()
  setCookieMock.mockReset()

  globalThis.defineEventHandler = (<T>(handler: T) => handler) as any
  globalThis.getQuery = getQueryMock as any
  globalThis.setCookie = setCookieMock as any
})

afterAll(() => {
  process.env.NODE_ENV = originalNodeEnv
})

describe('referral middleware', () => {
  it('sets referral cookie without secure flag in development', async () => {
    process.env.NODE_ENV = 'development'
    getQueryMock.mockReturnValue({ ref: 'dev-123' })

    const handlerModule = await import('../../../server/middleware/referral')
    const handler = handlerModule.default

    const event = {}
    await handler(event as any)

    expect(setCookieMock).toHaveBeenCalledWith(
      event,
      'referral_code',
      'dev-123',
      expect.objectContaining({
        secure: false,
        httpOnly: false
      })
    )
  })

  it('sets secure flag in production', async () => {
    process.env.NODE_ENV = 'production'
    getQueryMock.mockReturnValue({ ref: 'prod-123' })

    const handlerModule = await import('../../../server/middleware/referral')
    const handler = handlerModule.default

    const event = {}
    await handler(event as any)

    expect(setCookieMock).toHaveBeenCalledWith(
      event,
      'referral_code',
      'prod-123',
      expect.objectContaining({
        secure: true
      })
    )
  })
})
