import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

const getQueryMock = vi.fn()
const setCookieMock = vi.fn()
const sendRedirectMock = vi.fn()
const eventHandlerMock = vi.fn((handler: any) => handler)

vi.mock('h3', async () => {
  const actual = await vi.importActual<any>('h3')
  return {
    ...actual,
    eventHandler: eventHandlerMock,
    sendRedirect: sendRedirectMock,
  }
})

const originalNodeEnv = process.env.NODE_ENV

beforeEach(() => {
  getQueryMock.mockReset()
  setCookieMock.mockReset()
  sendRedirectMock.mockReset()

  ;(globalThis as any).getQuery = getQueryMock
  ;(globalThis as any).setCookie = setCookieMock
  ;(globalThis as any).sendRedirect = sendRedirectMock
})

afterAll(() => {
  process.env.NODE_ENV = originalNodeEnv
})

describe('referral middleware', () => {
  it('sets referral_code cookie without secure flag in development', async () => {
    process.env.NODE_ENV = 'development'
    getQueryMock.mockReturnValue({ ref: 'dev-123' })

    const handlerModule = await import('../../../server/middleware/referral')
    const handler = handlerModule.default

    const event = {
      node: { req: { method: 'GET', url: '/some-page?ref=dev-123' }, res: {} },
      path: '/some-page',
      context: {},
      headers: new Map(),
    }

    await handler(event as any)

    expect(setCookieMock).toHaveBeenCalledTimes(1)
    expect(setCookieMock).toHaveBeenCalledWith(
      event,
      'referral_code',
      'dev-123',
      expect.objectContaining({
        secure: false,
        httpOnly: false,
      }),
    )
    expect(sendRedirectMock).toHaveBeenCalledWith(event, '/some-page', 302)
  })

  it('sets secure flag in production', async () => {
    process.env.NODE_ENV = 'production'
    getQueryMock.mockReturnValue({ ref: 'prod-123' })

    const handlerModule = await import('../../../server/middleware/referral')
    const handler = handlerModule.default

    const event = {
      node: { req: { method: 'GET', url: '/some-page?ref=prod-123' }, res: {} },
      path: '/some-page',
      context: {},
      headers: new Map(),
    }

    await handler(event as any)

    expect(setCookieMock).toHaveBeenCalledTimes(1)
    expect(setCookieMock).toHaveBeenCalledWith(
      event,
      'referral_code',
      'prod-123',
      expect.objectContaining({
        secure: true,
      }),
    )
    expect(sendRedirectMock).toHaveBeenCalledWith(event, '/some-page', 302)
  })

  it('preserves other query parameters when redirecting', async () => {
    process.env.NODE_ENV = 'development'
    getQueryMock.mockReturnValue({ ref: 'keepme' })

    const handlerModule = await import('../../../server/middleware/referral')
    const handler = handlerModule.default

    const event = {
      node: { req: { method: 'GET', url: '/landing?ref=keepme&utm=123' }, res: {} },
      path: '/landing',
      context: {},
      headers: new Map(),
    }

    await handler(event as any)

    expect(setCookieMock).toHaveBeenCalledTimes(1)
    expect(sendRedirectMock).toHaveBeenCalledWith(event, '/landing?utm=123', 302)
  })

  it('does not act on invalid referral code', async () => {
    process.env.NODE_ENV = 'development'
    getQueryMock.mockReturnValue({ ref: 'invalid code!' })

    const handlerModule = await import('../../../server/middleware/referral')
    const handler = handlerModule.default

    const event = {
      node: { req: { method: 'GET', url: '/?ref=invalid%20code!' }, res: {} },
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
      node: { req: { method: 'POST', url: '/some-page?ref=partner123' }, res: {} },
      path: '/some-page',
      context: {},
      headers: new Map(),
    }

    await handler(event as any)

    expect(setCookieMock).toHaveBeenCalledTimes(1)
    expect(sendRedirectMock).not.toHaveBeenCalled()
  })

  it('does not redirect API routes', async () => {
    process.env.NODE_ENV = 'development'
    getQueryMock.mockReturnValue({ ref: 'partner123' })

    const handlerModule = await import('../../../server/middleware/referral')
    const handler = handlerModule.default

    const event = {
      node: { req: { method: 'GET', url: '/api/something?ref=partner123' }, res: {} },
      path: '/api/something',
      context: {},
      headers: new Map(),
    }

    await handler(event as any)

    expect(setCookieMock).toHaveBeenCalledTimes(1)
    expect(sendRedirectMock).not.toHaveBeenCalled()
  })
})
