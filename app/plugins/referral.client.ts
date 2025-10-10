export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  try {
    const params = new URLSearchParams(window.location.search)
    const refParam = params.get('ref') || ''
    const referralCodeParam = params.get('referral_code') || ''
    const code = (refParam || referralCodeParam || '').trim()

    const isValid = /^[a-zA-Z0-9_-]+$/.test(code)
    if (!isValid || code.length === 0) return

    // Check existing cookie
    const existing = document.cookie
      .split('; ')
      .find((row) => row.startsWith('referral_code='))
    const existingVal = existing ? decodeURIComponent(existing.split('=')[1] || '') : ''

    // Set cookie for 30 days if not set or different
    if (existingVal !== code) {
      const days = 30
      const maxAge = days * 24 * 60 * 60
      const secure = location.protocol === 'https:' ? '; Secure' : ''
      document.cookie = `referral_code=${encodeURIComponent(
        code,
      )}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
    }

    // Optional: clean URL (remove referral params) after setting cookie
    if (params.has('ref') || params.has('referral_code')) {
      const cleaned = new URL(window.location.href)
      cleaned.searchParams.delete('ref')
      cleaned.searchParams.delete('referral_code')
      const newUrl = `${cleaned.pathname}${cleaned.search}${cleaned.hash}`
      window.history.replaceState({}, '', newUrl)
    }
  } catch {
    // no-op
  }
})
