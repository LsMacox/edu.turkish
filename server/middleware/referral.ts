export default defineEventHandler((event) => {
  const query = getQuery(event)
  const refCode = typeof query.ref === 'string' ? query.ref : ''
  const isValidReferral = /^[a-zA-Z0-9_-]+$/.test(refCode)
  const existingReferral = getCookie(event, 'referral_code')
  const hasExistingReferral = typeof existingReferral === 'string' && existingReferral.length > 0

  const method = event.node.req.method
  const isGetRequest = method === 'GET'
  const path = event.path || ''
  const isPageRequest = !path.startsWith('/api/') && !path.startsWith('/_')

  if (isValidReferral && !hasExistingReferral) {
    setCookie(event, 'referral_code', refCode, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false, // accessible on client for referral tracking
      sameSite: 'lax',
    })
  }

  if (isValidReferral && isGetRequest && isPageRequest) {
    return sendRedirect(event, '/', 302)
  }
})
