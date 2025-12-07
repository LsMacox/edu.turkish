const FP_KEY = 'fp'

const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

const setCookie = (name: string, value: string, days = 365) => {
  const maxAge = days * 86400
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
}

const persist = (value: string) => {
  setCookie(FP_KEY, value)
  try {
    localStorage.setItem(FP_KEY, value)
  } catch {
    /* ignore storage errors */
  }
}

export default defineNuxtPlugin(() => {
  let inFlight: Promise<string> | null = null

  const ensureFingerprint = async (): Promise<string> => {
    const existing = getCookie(FP_KEY) || localStorage.getItem(FP_KEY)
    if (existing) {
      persist(existing)
      return existing
    }

    if (inFlight) return inFlight

    inFlight = (async () => {
      try {
        const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default
        const { visitorId } = await (await FingerprintJS.load()).get()
        persist(visitorId)
        return visitorId
      } catch {
        const fallback = Math.random().toString(36).slice(2) + Date.now().toString(36)
        persist(fallback)
        return fallback
      } finally {
        inFlight = null
      }
    })()

    return inFlight
  }

  return { provide: { ensureFingerprint } }
})
