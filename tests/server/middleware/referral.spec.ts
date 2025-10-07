import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { H3Event } from 'h3'

const getQueryMock = vi.fn()
const setCookieMock = vi.fn()
const sendRedirectMock = vi.fn()
const getCookieMock = vi.fn()

vi.mock('h3', async () => {
  const actual = await vi.importActual<any>('h3')
  return {
    ...actual,
    sendRedirect: sendRedirectMock,
    getCookie: getCookieMock,
  }
})

const originalNodeEnv = process.env.NODE_ENV

beforeEach(() => {
  getQueryMock.mockReset()
  setCookieMock.mockReset()
  sendRedirectMock.mockReset()
  getCookieMock.mockReset()
  getCookieMock.mockReturnValue(undefined)
  
  // Override global mocks for this test
  ;(globalThis as any).getQuery = getQueryMock
  ;(globalThis as any).setCookie = setCookieMock
  ;(globalThis as any).getCookie = getCookieMock
  ;(globalThis as any).sendRedirect = sendRedirectMock
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

    const event = {
      node: { req: { method: 'GET' } },
      path: '/some-page',
      context: {},
      headers: new Map(),
    }
    await handler(event as any)

    expect(setCookieMock).toHaveBeenCalledWith(
      event,
      'referral_code',
      'dev-123',
      expect.objectContaining({
        secure: false,
        httpOnly: false,
      }),
    )
    expect(sendRedirectMock).toHaveBeenCalledWith(event, '/', 302)
  })

  it('sets secure flag in production', async () => {
    process.env.NODE_ENV = 'production'
    getQueryMock.mockReturnValue({ ref: 'prod-123' })

    const handlerModule = await import('../../../server/middleware/referral')
    const handler = handlerModule.default

    const event = {
      node: { req: { method: 'GET' } },
      path: '/some-page',
      context: {},
      headers: new Map(),
    }
    await handler(event as any)

    expect(setCookieMock).toHaveBeenCalledWith(
      event,
      'referral_code',
      'prod-123',
      expect.objectContaining({
        secure: true,
      }),
    )
    expect(sendRedirectMock).toHaveBeenCalledWith(event, '/', 302)
  })

  it('does not redirect for invalid referral code', async () => {
    process.env.NODE_ENV = 'development'
    getQueryMock.mockReturnValue({ ref: 'invalid code!' })

    const handlerModule = await import('../../../server/middleware/referral')
    const handler = handlerModule.default

    const event = {
      node: { req: { method: 'GET' } },
      path: '/',
      context: {},
      headers: new Map(),
    }
    await handler(event as any)

    expect(setCookieMock).not.toHaveBeenCalled()
    expect(sendRedirectMock).not.toHaveBeenCalled()
  })

  it('does not redirect non-GET requests', async () => {
    process.env.NODE_ENV = 'development'
    getQueryMock.mockReturnValue({ ref: 'partner123' })

    const handlerModule = await import('../../../server/middleware/referral')
    const handler = handlerModule.default

    const event = {
      node: { req: { method: 'POST' } },
      path: '/some-page',
      context: {},
      headers: new Map(),
    }
    await handler(event as any)

    expect(setCookieMock).toHaveBeenCalled()
    expect(sendRedirectMock).not.toHaveBeenCalled()
  })

  it('does not redirect API routes', async () => {
    process.env.NODE_ENV = 'development'
    getQueryMock.mockReturnValue({ ref: 'partner123' })

    const handlerModule = await import('../../../server/middleware/referral')
    const handler = handlerModule.default

    const event = {
      node: { req: { method: 'GET' } },
      path: '/api/something',
      context: {},
      headers: new Map(),
    }
    await handler(event as any)

    expect(setCookieMock).toHaveBeenCalled()
    expect(sendRedirectMock).not.toHaveBeenCalled()
  })

  it('does not overwrite existing cookie', async () => {
    process.env.NODE_ENV = 'development'
    getQueryMock.mockReturnValue({ ref: 'new-code' })

    const handlerModule = await import('../../../server/middleware/referral')
    const handler = handlerModule.default

    const event = {
      node: { req: { method: 'GET' } },
      path: '/some-page',
      context: {},
      headers: new Map(),
    }

    getCookieMock.mockReturnValue('existing-code')

    await handler(event as any)

    expect(setCookieMock).not.toHaveBeenCalled()
    expect(sendRedirectMock).toHaveBeenCalledWith(event, '/', 302)
  })
})
