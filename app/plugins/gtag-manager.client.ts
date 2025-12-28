declare global {
  interface Window {
    dataLayer?: IArguments[] | unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig().public
  const gtmId = config.gtmId

  // Initialize dataLayer and gtag always to prevent "ReferenceError: dataLayer is not defined"
  // This is also required for Yandex Metrika ecommerce: 'dataLayer'
  window.dataLayer = window.dataLayer || []
  if (!window.gtag) {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
  }

  if (!gtmId) {
    console.warn('GTM ID not found in runtime config (NUXT_PUBLIC_GTM_ID)')
    return
  }

  // Initial gtag commands
  window.gtag('js', new Date())

  // Load GTM script
  if (!document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${gtmId}"]`)) {
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    })

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
    const firstScript = document.getElementsByTagName('script')[0]
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript)
    } else {
      document.head.append(script)
    }
  }
})
