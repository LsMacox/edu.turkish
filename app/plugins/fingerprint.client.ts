import FingerprintJS from '@fingerprintjs/fingerprintjs'

export default defineNuxtPlugin(async () => {
  // Read cookie helper
  const getCookie = (name: string): string | null => {
    const re = new RegExp(
      '(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)',
    )
    const match = document.cookie.match(re)
    if (!match || typeof match[1] !== 'string') return null
    return decodeURIComponent(match[1])
  }

  // Write cookie helper (1 year)
  const setCookie = (name: string, value: string, days = 365) => {
    const maxAge = days * 24 * 60 * 60
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
      value,
    )}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
  }

  // If we already have fp, refresh cookie TTL and exit
  const existing = getCookie('fp') || (typeof localStorage !== 'undefined' ? localStorage.getItem('fp') : null)
  if (existing) {
    setCookie('fp', existing)
    try {
      localStorage.setItem('fp', existing)
    } catch {
      // Ignore localStorage errors
    }
    return
  }

  // Load and compute visitorId via FingerprintJS OSS
  try {
    const fpLib = await FingerprintJS.load()
    const result = await fpLib.get()
    const visitorId = result.visitorId
    setCookie('fp', visitorId)
    try {
      localStorage.setItem('fp', visitorId)
    } catch {
      // Ignore localStorage errors
    }
  } catch {
    // Fingerprint library failed
    // Fallback: random token to avoid empty value
    const fallback = Math.random().toString(36).slice(2) + Date.now().toString(36)
    setCookie('fp', fallback)
    try {
      localStorage.setItem('fp', fallback)
    } catch {
      // Ignore localStorage errors
    }
  }
})
