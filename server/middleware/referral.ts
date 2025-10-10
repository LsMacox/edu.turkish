import type { H3Event } from 'h3'
import {
  getCookie as h3GetCookie,
  getQuery as h3GetQuery,
  sendRedirect as h3SendRedirect,
  setCookie as h3SetCookie,
} from 'h3'

const REFERRAL_COOKIE = 'referral_code'
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
    const hadRef = parsed.searchParams.has('ref')
    const hadReferralCode = parsed.searchParams.has('referral_code')

    if (!hadRef && !hadReferralCode) {
      return null
    }

    parsed.searchParams.delete('ref')
    parsed.searchParams.delete('referral_code')

    return `${parsed.pathname}${parsed.search}${parsed.hash}` || '/'
  } catch {
    return null
  }
}

const handler = async (event: H3Event) => {
  const getQueryFn = (globalThis as any).getQuery || h3GetQuery
  const query = getQueryFn(event) as { ref?: string; referral_code?: string }
  const code = (query.ref || query.referral_code || '').trim()

  if (!code || !REFERRAL_CODE_PATTERN.test(code)) {
    return
  }

  const getCookieFn = (globalThis as any).getCookie || h3GetCookie
  const existing = getCookieFn(event, REFERRAL_COOKIE)
  if (!existing) {
    const setCookieFn = (globalThis as any).setCookie || h3SetCookie
    setCookieFn(event, REFERRAL_COOKIE, code, {
      maxAge: REFERRAL_MAX_AGE,
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    })
  }

  const method = event.node?.req?.method || 'GET'
  if (method === 'GET' && !isApiPath(event.path)) {
    const location = sanitizeRedirectLocation(event)
    if (!location) return

    const sendRedirectFn = (globalThis as any).sendRedirect || h3SendRedirect
    await sendRedirectFn(event, location, 302)
  }
}

export default handler
