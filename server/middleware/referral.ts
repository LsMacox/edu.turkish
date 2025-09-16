export default defineEventHandler((event) => {
  // Check for ref parameter in URL
  const query = getQuery(event)
  const refCode = query.ref as string
  
  if (refCode && /^[a-zA-Z0-9_-]+$/.test(refCode)) {
    // Set cookie with 30-day expiration
    setCookie(event, 'referral_code', refCode, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      secure: true,
      sameSite: 'lax'
    })
  }
})