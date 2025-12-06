declare global {
  interface Window {
    ym?: ((...args: unknown[]) => void) & { a?: unknown[]; l?: number }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const metrikaId = useRuntimeConfig().public.yandexMetrikaId
  if (!metrikaId) return

  const ym = (...args: unknown[]) => window.ym?.(metrikaId, ...args)

  nuxtApp.hook('app:mounted', () => {
    if (document.querySelector('script[src*="mc.yandex.ru/metrika"]')) return

    window.ym = window.ym || ((...args) => { (window.ym!.a ||= []).push(args) })
    window.ym.l = Date.now()

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://mc.yandex.ru/metrika/tag.js'
    document.head.append(script)

    ym('init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
      ecommerce: 'dataLayer',
    })
  })

  useRouter().afterEach((to) => nextTick(() => ym('hit', to.fullPath)))
})
