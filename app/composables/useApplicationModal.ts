import type { ApplicationPreferences } from '~/types/application'
import type { SubServiceId, ServiceApplicationContext } from '~/types/services'

export function useApplicationModal() {
  const isOpen = useState<boolean>('applicationModal:isOpen', () => false)
  const userPreferences = useState<ApplicationPreferences | null>(
    'applicationModal:userPreferences',
    () => null,
  )
  const previousOverflow = useState<string | null>('applicationModal:previousOverflow', () => null)

  const openModal = (preferences: ApplicationPreferences | null = null) => {
    userPreferences.value = preferences
    isOpen.value = true

    if (import.meta.client && (window as any).ym) {
      const config = useRuntimeConfig()
      ;(window as any).ym(config.public.yandexMetrikaId, 'reachGoal', 'modal_open', {
        type: 'application',
      })
    }

    if (import.meta.client) {
      previousOverflow.value = document.body.style.overflow || null
      document.body.style.overflow = 'hidden'
    }
  }

  const closeModal = () => {
    isOpen.value = false
    userPreferences.value = null

    if (import.meta.client) {
      if (previousOverflow.value) {
        document.body.style.overflow = previousOverflow.value
      } else {
        document.body.style.removeProperty('overflow')
      }
      previousOverflow.value = null
    }
  }

  const openModalForSubService = (subServiceId: SubServiceId, subServiceName: string) => {
    const context: ServiceApplicationContext = {
      subServiceId,
      subServiceName,
      source: 'service_page',
      sourceDescription: subServiceName,
    }

    openModal({
      source: 'service_page',
      description: subServiceName,
      serviceContext: context,
    })
  }

  const submitApplication = () => {
    if (import.meta.client && (window as any).ym) {
      const config = useRuntimeConfig()
      ;(window as any).ym(config.public.yandexMetrikaId, 'reachGoal', 'application_submitted', {
        hasPreferences: !!userPreferences.value,
      })
    }

    closeModal()
  }

  const cleanup = () => {
    if (import.meta.client) {
      if (previousOverflow.value) {
        document.body.style.overflow = previousOverflow.value
      } else {
        document.body.style.removeProperty('overflow')
      }
      previousOverflow.value = null
    }
  }

  return {
    isOpen: readonly(isOpen),
    userPreferences: readonly(userPreferences),

    openModal,
    closeModal,
    openModalForSubService,
    submitApplication,
    cleanup,
  }
}
