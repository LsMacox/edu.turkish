const COOKIE_NAME = 'referral_code'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days
const CODE_PATTERN = /^[a-zA-Z0-9_-]+$/

const isValidCode = (code: string | undefined): code is string =>
  Boolean(code && CODE_PATTERN.test(code))

const cookieOptions = () => ({
  maxAge: MAX_AGE,
  path: '/',
  sameSite: 'lax' as const,
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
})

export default defineEventHandler(async (event) => {
  const codeFromQuery = (getQuery(event).referral_code as string | undefined)?.trim()
  const codeFromCookie = getCookie(event, COOKIE_NAME)?.trim()

  const code = [codeFromQuery, codeFromCookie].find(isValidCode)
  if (!code) return

  if (code !== codeFromCookie) {
    setCookie(event, COOKIE_NAME, code, cookieOptions())
  }

  if (codeFromQuery && getMethod(event) === 'GET' && !event.path?.startsWith('/api/')) {
    const url = getRequestURL(event)
    url.searchParams.delete('referral_code')
    await sendRedirect(event, url.pathname + url.search, 302)
  }
})
