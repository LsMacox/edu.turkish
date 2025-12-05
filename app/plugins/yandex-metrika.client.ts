export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const nuxtApp = useNuxtApp()
  const metrikaId = config.public.yandexMetrikaId

  if (import.meta.dev && !metrikaId) {
    return
  }

  if (!metrikaId) {
    return
  }

  const initYandexMetrika = () => {
    ;(window as any).ym =
      (window as any).ym ||
      function (...args: unknown[]) {
        ;((window as any).ym.a = (window as any).ym.a || []).push(args)
      }
    ;(window as any).ym.l = 1 * +new Date()

    const existingScript = document.querySelector(`script[src*="mc.yandex.ru/metrika/tag.js"]`)
    if (existingScript) return

    const script = document.createElement('script')
    const firstScript = document.getElementsByTagName('script')[0]

    script.async = true
    script.src = `https://mc.yandex.ru/metrika/tag.js?id=${metrikaId}`

    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript)
    }

    ;(window as any).ym(metrikaId, 'init', {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: 'dataLayer',
      accurateTrackBounce: true,
      trackLinks: true,
    })
  }

  router.afterEach((to) => {
    nextTick(() => {
      if ((window as any).ym && metrikaId) {
        ;(window as any).ym(metrikaId as unknown as number, 'hit', to.fullPath)
      }
    })
  })

  nuxtApp.hook('app:mounted', () => {
    initYandexMetrika()
  })
})
