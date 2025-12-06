declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const googleAdsId = useRuntimeConfig().public.googleAdsId
  if (!googleAdsId) return

  nuxtApp.hook('app:mounted', () => {
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) return

    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args)
    }

    window.gtag('js', new Date())
    window.gtag('config', googleAdsId)

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`
    document.head.append(script)
  })
})
