export const useFingerprint = () => {
  const { $ensureFingerprint } = useNuxtApp()

  const ensureFingerprint = async (): Promise<string | null> => {
    if (!import.meta.client || typeof $ensureFingerprint !== 'function') return null
    try {
      return await $ensureFingerprint()
    } catch {
      return null
    }
  }

  const openWithFingerprint = async (href?: string, target: '_blank' | '_self' = '_blank') => {
    if (!href) return
    await ensureFingerprint()
    if (!import.meta.client) return
    if (target === '_blank') {
      window.open(href, '_blank', 'noopener,noreferrer,nofollow')
    } else {
      window.location.href = href
    }
  }

  return { ensureFingerprint, openWithFingerprint }
}
