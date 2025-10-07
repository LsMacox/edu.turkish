export const useYandexMetrika = () => {
  const config = useRuntimeConfig()
  const metrikaId = config.public.yandexMetrikaId

  const trackGoal = (goalName: string, params?: Record<string, any>) => {
    if (!metrikaId || !import.meta.client || !(window as any).ym) return

    try {
      ;(window as any).ym(metrikaId, 'reachGoal', goalName, params)
    } catch (error) {
      console.warn('Ошибка при отправке цели в Яндекс.Метрику:', error)
    }
  }

  const trackPageView = (url?: string) => {
    if (!metrikaId || !import.meta.client || !(window as any).ym) return

    try {
      ;(window as any).ym(metrikaId, 'hit', url || window.location.href)
    } catch (error) {
      console.warn('Ошибка при отправке просмотра страницы в Яндекс.Метрику:', error)
    }
  }

  const trackEvent = (action: string, params?: Record<string, any>) => {
    if (!metrikaId || !import.meta.client || !(window as any).ym) return

    try {
      ;(window as any).ym(metrikaId, 'params', { action, ...params })
    } catch (error) {
      console.warn('Ошибка при отправке события в Яндекс.Метрику:', error)
    }
  }

  return {
    trackGoal,
    trackPageView,
    trackEvent,
    isEnabled: !!metrikaId,
  }
}

// Расширение глобального объекта Window для TypeScript
declare global {
  interface Window {
    ym: (counterId: string, method: string, ...args: any[]) => void
  }
}
