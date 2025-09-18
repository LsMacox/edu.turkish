export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const nuxtApp = useNuxtApp()
  const metrikaId = config.public.yandexMetrikaId

  // Не загружаем в development без явного указания ID
  if (process.dev && !metrikaId) {
    console.info('Yandex Metrika отключена в режиме разработки. Для включения добавьте NUXT_PUBLIC_YANDEX_METRIKA_ID в .env')
    return
  }

  // Не загружаем если нет ID
  if (!metrikaId) {
    console.warn('Yandex Metrika ID не установлен. Добавьте NUXT_PUBLIC_YANDEX_METRIKA_ID в переменные окружения')
    return
  }

  // Инициализация Яндекс.Метрики
  const initYandexMetrika = () => {
    // Создаем функцию ym если её нет
    ;(window as any).ym = (window as any).ym || function() {
      ((window as any).ym.a = (window as any).ym.a || []).push(arguments)
    }
    ;(window as any).ym.l = 1 * (+new Date())

    // Проверяем, не загружен ли уже скрипт
    const existingScript = document.querySelector(`script[src*="mc.yandex.ru/metrika/tag.js"]`)
    if (existingScript) return

    // Создаем и загружаем скрипт
    const script = document.createElement('script')
    const firstScript = document.getElementsByTagName('script')[0]
    
    script.async = true
    script.src = `https://mc.yandex.ru/metrika/tag.js?id=${metrikaId}`
    
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript)
    }

    // Инициализируем счетчик
    ;(window as any).ym(metrikaId, 'init', {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: 'dataLayer',
      accurateTrackBounce: true,
      trackLinks: true
    })
  }

  // Отслеживание переходов между страницами
  router.afterEach((to) => {
    nextTick(() => {
      if ((window as any).ym && metrikaId) {
        ;(window as any).ym(metrikaId, 'hit', to.fullPath)
      }
    })
  })

  // Инициализируем при загрузке страницы
  nuxtApp.hook('app:mounted', () => {
    initYandexMetrika()
  })
})
