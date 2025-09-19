export default defineEventHandler((event) => {
  const query = getQuery(event)
  const refCode = query.ref as string

  if (refCode && /^[a-zA-Z0-9_-]+$/.test(refCode)) {
    setCookie(event, 'referral_code', refCode, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false, // accessible on client for referral tracking
      sameSite: 'lax'
    })
  }
})