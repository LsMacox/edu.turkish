import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ApplicationPreferences, FormSubmissionData } from '~/types/preferences'

export const useApplicationModalStore = defineStore('applicationModal', () => {
  // State
  const isOpen = ref<boolean>(false)
  const userPreferences = ref<ApplicationPreferences | null>(null)

  // Actions
  const openModal = (preferences: ApplicationPreferences | null = null) => {
    userPreferences.value = preferences
    isOpen.value = true
    
    // Отслеживание открытия модала
    if (process.client && (window as any).ym) {
      const config = useRuntimeConfig()
      ;(window as any).ym(config.public.yandexMetrikaId, 'reachGoal', 'modal_open', { type: 'application' })
    }
    
    if (process.client && typeof document !== 'undefined') {
      // Предотвратить скролл страницы когда модал открыт
      document.body.style.overflow = 'hidden'
    }
  }

  const closeModal = () => {
    isOpen.value = false
    userPreferences.value = null
    if (process.client) {
      // Восстановить скролл страницы
      document.body.style.overflow = 'auto'
    }
  }

  const submitApplication = (formData: FormSubmissionData) => {
    // Отслеживание отправки заявки
    if (process.client && (window as any).ym) {
      const config = useRuntimeConfig()
      ;(window as any).ym(config.public.yandexMetrikaId, 'reachGoal', 'application_submitted', {
        academicDirection: formData.academicDirection,
        hasPreferences: !!formData.preferences
      })
    }
    
    // Здесь будет логика отправки данных
    console.log('Application submitted:', formData)
    closeModal()
  }

  // Cleanup function to ensure body overflow is reset
  const cleanup = () => {
    if (process.client && typeof document !== 'undefined') {
      document.body.style.overflow = 'auto'
    }
  }

  return {
    // State
    isOpen,
    userPreferences,
    
    // Actions
    openModal,
    closeModal,
    submitApplication,
    cleanup
  }
})