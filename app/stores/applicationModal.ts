import { defineStore } from 'pinia'
import type { ApplicationPreferences } from '~/types/preferences'
import type { SubServiceId, ServiceApplicationContext } from '~/types/services'

export const useApplicationModalStore = defineStore('applicationModal', () => {
  const isOpen = ref<boolean>(false)
  const userPreferences = ref<ApplicationPreferences | null>(null)
  const previousOverflow = ref<string | null>(null)

  const openModal = (preferences: ApplicationPreferences | null = null) => {
    userPreferences.value = preferences
    isOpen.value = true

    if (import.meta.client && (window as any).ym) {
      const config = useRuntimeConfig()
      ;(window as any).ym(config.public.yandexMetrikaId, 'reachGoal', 'modal_open', {
        type: 'application',
      })
    }

    if (typeof document !== 'undefined') {
      previousOverflow.value = document.body.style.overflow || null
      document.body.style.overflow = 'hidden'
    }
  }

  const closeModal = () => {
    isOpen.value = false
    userPreferences.value = null
    if (typeof document !== 'undefined') {
      // Восстановить скролл страницы
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
      source: 'service-page',
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
    if (typeof document !== 'undefined') {
      if (previousOverflow.value) {
        document.body.style.overflow = previousOverflow.value
      } else {
        document.body.style.removeProperty('overflow')
      }
      previousOverflow.value = null
    }
  }

  return {
    isOpen,
    userPreferences,
    previousOverflow,

    openModal,
    closeModal,
    openModalForSubService,
    submitApplication,
    cleanup,
  }
})
