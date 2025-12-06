/**
 * Composable for lazy loading Swiper with common modules
 */

type SwiperVueModule = typeof import('swiper/vue')
type SwiperComponentType = SwiperVueModule['Swiper']
type SwiperSlideComponentType = SwiperVueModule['SwiperSlide']
type SwiperModule = (typeof import('swiper/modules'))[keyof typeof import('swiper/modules')]

export function useSwiper() {
  const swiperComponent = shallowRef<SwiperComponentType | null>(null)
  const swiperSlideComponent = shallowRef<SwiperSlideComponentType | null>(null)
  const swiperModules = shallowRef<SwiperModule[]>([])

  const isReady = computed(
    () =>
      swiperComponent.value !== null &&
      swiperSlideComponent.value !== null &&
      swiperModules.value.length > 0,
  )

  const load = async () => {
    if (swiperComponent.value) return

    try {
      await Promise.all([
        import('swiper/css'),
        import('swiper/css/navigation'),
        import('swiper/css/pagination'),
      ])

      const [{ Swiper, SwiperSlide }, modules] = await Promise.all([
        import('swiper/vue'),
        import('swiper/modules'),
      ])

      swiperComponent.value = Swiper
      swiperSlideComponent.value = SwiperSlide
      swiperModules.value = [modules.Autoplay, modules.Navigation, modules.Pagination]
    } catch (error) {
      console.error('Failed to load Swiper', error)
    }
  }

  const scheduleLoad = () => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      ;(window as typeof window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(() => {
        load()
      })
      return
    }
    setTimeout(() => load(), 0)
  }

  // Auto-load on client mount
  if (import.meta.client) {
    onMounted(() => {
      scheduleLoad()
    })
  }

  return {
    swiperComponent,
    swiperSlideComponent,
    swiperModules,
    isReady,
    load,
    scheduleLoad,
  }
}
