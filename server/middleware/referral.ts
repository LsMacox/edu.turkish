import { eventHandler, getQuery as h3GetQuery, sendRedirect as h3SendRedirect, setCookie as h3SetCookie } from 'h3'
import type { H3Event } from 'h3'

const REFERRAL_COOKIE_NAME = 'referral_code'
const REFERRAL_MAX_AGE = 60 * 60 * 24 * 30 // 30 days
const REFERRAL_CODE_PATTERN = /^[a-zA-Z0-9_-]+$/

const isApiPath = (path: string | undefined): boolean => {
  if (!path) return false
  return path.startsWith('/api/')
}

const sanitizeRedirectLocation = (event: H3Event): string | null => {
  const rawUrl = event.node?.req?.url
  if (!rawUrl) return null

  try {
    const parsed = new URL(rawUrl, 'http://internal')
    if (!parsed.searchParams.has('ref')) {
      return null
    }

    parsed.searchParams.delete('ref')

    return `${parsed.pathname}${parsed.search}${parsed.hash}` || '/'
  } catch {
    return null
  }
}

const handler = eventHandler(async (event) => {
  const getQueryFn = (globalThis as any).getQuery || h3GetQuery
  const query = getQueryFn(event) as { ref?: string }
  const code = (query.ref || '').trim()

  if (!code || !REFERRAL_CODE_PATTERN.test(code)) {
    return
  }

  const setCookieFn = (globalThis as any).setCookie || h3SetCookie
  setCookieFn(event, REFERRAL_COOKIE_NAME, code, {
    maxAge: REFERRAL_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
  })

  const method = (event.node?.req?.method || 'GET').toUpperCase()
  if (method !== 'GET') {
    return
  }

  const path = event.path
  if (isApiPath(path)) {
    return
  }

  const location = sanitizeRedirectLocation(event)
  if (!location) {
    return
  }

  const sendRedirectFn = (globalThis as any).sendRedirect || h3SendRedirect
  await sendRedirectFn(event, location, 302)
})

export default handler
