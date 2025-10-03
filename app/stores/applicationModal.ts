import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ApplicationPreferences, FormSubmissionData } from '~/types/preferences'

export const useApplicationModalStore = defineStore('applicationModal', () => {
  // State
  const isOpen = ref<boolean>(false)
  const userPreferences = ref<ApplicationPreferences | null>(null)
  const previousOverflow = ref<string | null>(null)

  // Actions
  const openModal = (preferences: ApplicationPreferences | null = null) => {
    userPreferences.value = preferences
    isOpen.value = true

    // Отслеживание открытия модала
    if (process.client && (window as any).ym) {
      const config = useRuntimeConfig()
      ;(window as any).ym(config.public.yandexMetrikaId, 'reachGoal', 'modal_open', {
        type: 'application',
      })
    }

    if (process.client && typeof document !== 'undefined') {
      // Предотвратить скролл страницы когда модал открыт
      const currentOverflow = document.body.style.overflow
      previousOverflow.value = currentOverflow || null
      document.body.style.overflow = 'hidden'
    }
  }

  const closeModal = () => {
    isOpen.value = false
    userPreferences.value = null
    if (process.client && typeof document !== 'undefined') {
      // Восстановить скролл страницы
      if (previousOverflow.value !== null) {
        document.body.style.overflow = previousOverflow.value
      } else {
        document.body.style.removeProperty('overflow')
      }
      previousOverflow.value = null
    }
  }

  const submitApplication = (formData: FormSubmissionData) => {
    // Отслеживание отправки заявки
    if (process.client && (window as any).ym) {
      const config = useRuntimeConfig()
      ;(window as any).ym(config.public.yandexMetrikaId, 'reachGoal', 'application_submitted', {
        hasPreferences: !!formData.preferences,
      })
    }

    // Здесь будет логика отправки данных
    closeModal()
  }

  // Cleanup function to ensure body overflow is reset
  const cleanup = () => {
    if (process.client && typeof document !== 'undefined') {
      if (previousOverflow.value !== null) {
        document.body.style.overflow = previousOverflow.value
      } else {
        document.body.style.removeProperty('overflow')
      }
      previousOverflow.value = null
    }
  }

  return {
    // State
    isOpen,
    userPreferences,
    previousOverflow,

    // Actions
    openModal,
    closeModal,
    submitApplication,
    cleanup,
  }
})
