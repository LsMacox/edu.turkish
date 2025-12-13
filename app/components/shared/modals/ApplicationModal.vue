<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="application-modal-overlay fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="modal-content bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-md mx-auto max-h-[95vh] md:max-h-[90vh] overflow-y-auto overscroll-contain"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <!-- Swipe indicator (mobile only) -->
        <div class="md:hidden flex justify-center pt-3 pb-2">
          <div class="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <!-- Header -->
        <div
          class="sticky top-0 bg-white z-10 flex items-center justify-between px-5 pt-3 pb-5 md:p-6 border-b border-gray-100"
        >
          <h2 class="text-lg md:text-2xl font-bold text-secondary pr-2">
            {{ t(modalNs('consultation_title')) }}
          </h2>
          <button
            class="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0"
            aria-label="Close modal"
            @click="closeModal"
          >
            <Icon name="mdi:close" class="text-gray-500 text-2xl" />
          </button>
        </div>

        <!-- Form -->
        <form class="p-5 md:p-6 space-y-5 md:space-y-4 pb-8" @submit.prevent="submitForm">
          <div>
            <label
              class="block text-base md:text-sm font-medium text-gray-700 mb-2.5"
              :for="nameFieldId"
            >
              {{ t(modalNs('your_name')) }} {{ t(modalNs('required')) }}
            </label>
            <BaseTextField
              :id="nameFieldId"
              v-model="form.name"
              name="name"
              type="text"
              :placeholder="t(modalNs('name_placeholder'))"
              :error="nameError"
            />
          </div>

          <div>
            <label
              class="block text-base md:text-sm font-medium text-gray-700 mb-2.5"
              :for="phoneFieldId"
            >
              {{ t(modalNs('phone')) }} {{ t(modalNs('required')) }}
            </label>
            <BaseTextField
              :id="phoneFieldId"
              v-model="form.phone"
              name="phone"
              type="tel"
              required
              :placeholder="t(modalNs('phone_placeholder'))"
              autocomplete="tel"
              :maxlength="20"
              :error="phoneError"
              @input="onPhoneInput"
              @keydown="onPhoneKeydown"
            />
          </div>

          <div>
            <label
              class="block text-base md:text-sm font-medium text-gray-700 mb-2.5"
              :for="emailFieldId"
            >
              {{ t(modalNs('email')) }}
            </label>
            <BaseTextField
              :id="emailFieldId"
              v-model="form.email"
              name="email"
              type="email"
              :placeholder="t(modalNs('email_placeholder'))"
              :error="emailError"
            />
          </div>

          <div>
            <label
              class="block text-base md:text-sm font-medium text-gray-700 mb-2.5"
              :for="messageFieldId"
            >
              {{ t(modalNs('additional_info')) }}
            </label>
            <textarea
              :id="messageFieldId"
              v-model="form.message"
              name="message"
              :placeholder="t(modalNs('message_placeholder'))"
              rows="3"
              :class="[
                'w-full px-4 border rounded-xl focus:outline-none transition-all resize-none py-4 md:py-3 text-base md:text-sm min-h-[100px]',
                messageError
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent',
              ]"
              :aria-invalid="!!messageError"
            ></textarea>
            <p v-if="messageError" class="mt-2 text-sm text-red-600">{{ messageError }}</p>
          </div>

          <!-- Questionnaire preferences display -->
          <div v-if="isQuestionnaire" class="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 class="text-base md:text-sm font-semibold text-blue-800 mb-2.5">
              {{ t(modalNs('preferences_title')) }}
            </h4>
            <div class="text-sm md:text-xs text-blue-700 space-y-1.5">
              <p v-if="userPreferences?.userType">
                • {{ t(modalNs('preference_labels.user_type')) }}
                {{ getUserTypeText(userPreferences.userType) }}
              </p>
              <p v-if="userPreferences?.universityChosen !== undefined">
                • {{ t(modalNs('preference_labels.university')) }}
                {{ getUniversityText(userPreferences.universityChosen) }}
              </p>
              <p v-if="userPreferences?.language">
                • {{ t(modalNs('preference_labels.language')) }}
                {{ getLanguageText(userPreferences.language) }}
              </p>
              <p v-if="userPreferences?.scholarship !== undefined">
                • {{ t(modalNs('preference_labels.scholarship')) }}
                {{ getScholarshipText(userPreferences.scholarship) }}
              </p>
            </div>
          </div>

          <BaseCheckbox :checked="form.agreement" @update:checked="form.agreement = $event">
            {{ t(modalNs('agreement')) }}
          </BaseCheckbox>

          <!-- Hidden referral source field for debugging -->
          <input type="hidden" name="source" :value="props.userPreferences?.source || 'website'" />

          <button
            type="submit"
            :disabled="isSubmitting || !form.agreement"
            class="w-full bg-primary text-white rounded-xl font-semibold hover:bg-red-600 active:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed py-4 text-lg md:text-lg min-h-[52px] shadow-lg active:shadow-md"
          >
            {{ isSubmitting ? t(modalNs('submitting')) : t(modalNs('submit_button')) }}
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { ApplicationPreferences } from '~/types/features/application'
import { useReferral } from '~/composables/useReferral'
import { useFormSubmit } from '~/composables/useFormSubmit'
import { useFingerprint } from '~/composables/useFingerprint'
import { namespace } from '~~/lib/i18n'

const modalNs = namespace('modal')

interface Props {
  isOpen: boolean
  userPreferences?: ApplicationPreferences | null
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()
const { referralCode } = useReferral()

const { ensureFingerprint } = useFingerprint()

const form = ref({
  name: '',
  phone: '',
  email: '',
  message: '',
  agreement: false,
})

// Touch gesture handling for mobile swipe-to-close
const touchStartY = ref(0)
const touchCurrentY = ref(0)
const isDragging = ref(false)

const phoneRef = computed({
  get: () => form.value.phone,
  set: (value: string) => {
    form.value.phone = value
  },
})

const { sanitizePhone, onPhoneInput, onPhoneKeydown } = useInternationalPhone(phoneRef)

const { show } = useToast()

const nameFieldId = useId()
const phoneFieldId = useId()
const emailFieldId = useId()
const messageFieldId = useId()

const {
  isSubmitting,
  getFieldError,
  clearAllErrors,
  submit,
} = useFormSubmit()

const nameError = computed(() => getFieldError('personal_info.first_name'))
const phoneError = computed(() => getFieldError('personal_info.phone'))
const emailError = computed(() => getFieldError('personal_info.email'))
const messageError = computed(() => getFieldError('additional_info'))

// Simple source-based checks
const isQuestionnaire = computed(() => props.userPreferences?.source === 'home_questionnaire')

const closeModal = () => {
  emit('close')
}

const submitForm = async () => {
  if (!form.value.agreement) return

  await submit({
    submitFn: async () => {
      const nameParts = form.value.name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      const ctaSource = props.userPreferences?.source || 'website'
      const ctaDescription = props.userPreferences?.description
      const universityName = props.userPreferences?.universityName

      const applicationData = {
        personal_info: {
          first_name: firstName,
          last_name: lastName,
          email: form.value.email,
          phone: sanitizePhone(form.value.phone),
        },
        preferences: {
          universities: universityName ? [universityName] : [],
          programs: [],
          budget: 'Не указан',
          start_date: new Date().getFullYear().toString(),
        },
        additional_info: form.value.message || '',
        source: ctaSource,
        source_description: ctaDescription,
        referral_code: referralCode.value || undefined,
        user_preferences: props.userPreferences,
      }

      await ensureFingerprint()

      return await ($fetch as typeof $fetch<unknown>)('/api/v1/applications', {
        method: 'POST',
        body: applicationData,
      })
    },
    onSuccess: (response) => {
      emit('submit', response)

      show(t(modalNs('success_message')), {
        title: t(modalNs('success_title')),
        type: 'success',
        duration: 5000,
      })

      closeModal()
      form.value = {
        name: '',
        phone: '',
        email: '',
        message: '',
        agreement: false,
      }
      clearAllErrors()
    },
    messages: {
      validationErrorTitle: t(modalNs('error_title')),
      genericErrorTitle: t(modalNs('error_title')),
    },
  })
}

// Helper functions for preferences display
const getUserTypeText = (userType: string): string => {
  return userType === 'student'
    ? (t(modalNs('user_types.student')) as string)
    : (t(modalNs('user_types.parent')) as string)
}

const getUniversityText = (chosen: string): string => {
  return chosen === 'yes'
    ? (t(modalNs('university_chosen.yes')) as string)
    : (t(modalNs('university_chosen.no')) as string)
}

const getLanguageText = (language: string): string => {
  const languageMap: Record<string, string> = {
    turkish: t(modalNs('languages.turkish')) as string,
    english: t(modalNs('languages.english')) as string,
    both: t(modalNs('languages.both')) as string,
  }
  return languageMap[language] || language
}

const getScholarshipText = (scholarship: string): string => {
  return scholarship === 'yes'
    ? (t(modalNs('scholarship.yes')) as string)
    : (t(modalNs('scholarship.no')) as string)
}

// Touch gesture handlers
const handleTouchStart = (e: TouchEvent) => {
  const modalContent = e.currentTarget as HTMLElement
  const scrollTop = modalContent.scrollTop

  // Only allow swipe-to-close when scrolled to top
  if (scrollTop === 0 && e.touches[0]) {
    touchStartY.value = e.touches[0].clientY
    isDragging.value = true
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || !e.touches[0]) return

  touchCurrentY.value = e.touches[0].clientY
  const diff = touchCurrentY.value - touchStartY.value

  // Only allow downward swipe
  if (diff > 0) {
    const modalContent = e.currentTarget as HTMLElement
    modalContent.style.transform = `translateY(${diff}px)`
    modalContent.style.transition = 'none'
  }
}

const handleTouchEnd = () => {
  if (!isDragging.value) return

  const diff = touchCurrentY.value - touchStartY.value
  const modalContent = document.querySelector('.modal-content') as HTMLElement

  if (modalContent) {
    modalContent.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'

    // Close if swiped down more than 100px
    if (diff > 100) {
      modalContent.style.transform = 'translateY(100%)'
      setTimeout(() => {
        closeModal()
      }, 300)
    } else {
      modalContent.style.transform = 'translateY(0)'
    }
  }

  isDragging.value = false
  touchStartY.value = 0
  touchCurrentY.value = 0
}

// Закрытие по ESC и блокировка скролла body
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      closeModal()
    }
  }

  document.addEventListener('keydown', handleEscape)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})

// Блокировка скролла body при открытии модала
watch(
  () => props.isOpen,
  (isOpen) => {
    if (import.meta.client) {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }

    if (!isOpen) {
      clearAllErrors()
    }
  },
  { immediate: true },
)
</script>

<style>
.application-modal-overlay {
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (min-width: 768px) {
  @keyframes slideIn {
    from {
      transform: translateY(-20px) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
}

.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 767px) {
  .modal-content {
    touch-action: pan-y;
  }
}
</style>
