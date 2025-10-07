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
          <div class="w-10 h-1 bg-gray-300 rounded-full"/>
        </div>

        <!-- Header -->
        <div
          class="sticky top-0 bg-white z-10 flex items-center justify-between px-5 pt-3 pb-5 md:p-6 border-b border-gray-100"
        >
          <h2 class="text-lg md:text-2xl font-bold text-secondary pr-2">
            {{ $t('modal.consultation_title') }}
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
            <label class="block text-base md:text-sm font-medium text-gray-700 mb-2.5"
              >{{ $t('modal.your_name') }} {{ $t('modal.required') }}</label
            >
            <BaseTextField
              v-model="form.name"
              type="text"
              :placeholder="$t('modal.name_placeholder')"
              :error="nameError"
            />
          </div>

          <div>
            <label class="block text-base md:text-sm font-medium text-gray-700 mb-2.5"
              >{{ $t('modal.phone') }} {{ $t('modal.required') }}</label
            >
            <input
              v-model="form.phone"
              type="tel"
              required
              :placeholder="$t('modal.phone_placeholder')"
              inputmode="tel"
              autocomplete="tel"
              maxlength="20"
              :class="[
                'w-full px-4 border rounded-xl outline-none focus:outline-none transition-all py-4 md:py-3 text-base md:text-sm min-h-[52px] md:min-h-auto',
                phoneError
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent',
              ]"
              :aria-invalid="!!phoneError"
              @input="onPhoneInput"
              @keydown="onPhoneKeydown"
            />
            <p v-if="phoneError" class="mt-2 text-sm text-red-600">{{ phoneError }}</p>
          </div>

          <div>
            <label class="block text-base md:text-sm font-medium text-gray-700 mb-2.5">{{
              $t('modal.email')
            }}</label>
            <BaseTextField
              v-model="form.email"
              type="email"
              :placeholder="$t('modal.email_placeholder')"
              :error="emailError"
            />
          </div>

          

          <div>
            <label class="block text-base md:text-sm font-medium text-gray-700 mb-2.5">{{
              $t('modal.additional_info')
            }}</label>
            <textarea
              v-model="form.message"
              :placeholder="$t('modal.message_placeholder')"
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

          <!-- Preferences display - только для анкеты с главной страницы -->
          <div
            v-if="userPreferences && isQuestionnaire(userPreferences)"
            class="bg-blue-50 border border-blue-200 rounded-xl p-4"
          >
            <h4 class="text-base md:text-sm font-semibold text-blue-800 mb-2.5">
              {{ $t('modal.preferences_title') }}
            </h4>
            <div class="text-sm md:text-xs text-blue-700 space-y-1.5">
              <p>
                • {{ $t('modal.preference_labels.user_type') }}
                {{ getUserTypeText(userPreferences.userType) }}
              </p>
              <p>
                • {{ $t('modal.preference_labels.university') }}
                {{ getUniversityText(userPreferences.universityChosen) }}
              </p>
              <p>
                • {{ $t('modal.preference_labels.language') }}
                {{ getLanguageText(userPreferences.language) }}
              </p>
              <p>
                • {{ $t('modal.preference_labels.scholarship') }}
                {{ getScholarshipText(userPreferences.scholarship) }}
              </p>
            </div>
          </div>

          <BaseCheckbox :checked="form.agreement" @update:checked="form.agreement = $event">
            {{ $t('modal.agreement') }}
          </BaseCheckbox>
          <p v-if="agreementError" class="mt-2 text-sm text-red-600">{{ agreementError }}</p>

          <!-- Hidden referral source field for debugging -->
          <input
            type="hidden"
            name="source"
            :value="referralCode || props.userPreferences?.source || 'website'"
          >

          <button
            type="submit"
            :disabled="isSubmitting || !form.agreement"
            class="w-full bg-primary text-white rounded-xl font-semibold hover:bg-red-600 active:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed py-4 text-lg md:text-lg min-h-[52px] shadow-lg active:shadow-md"
          >
            {{ isSubmitting ? $t('modal.submitting') : $t('modal.submit_button') }}
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { ApplicationPreferences, QuestionnairePreferences } from '~/types/preferences'
import { useReferral } from '~/composables/useReferral'
import { useApplicationModalValidation } from '~/composables/validation/useApplicationModalValidation'

interface Props {
  isOpen: boolean
  userPreferences?: ApplicationPreferences
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { referralCode } = useReferral()

const form = ref({
  name: '',
  phone: '',
  email: '',
  message: '',
  agreement: false,
})

const isSubmitting = ref(false)

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

const {
  applicationModalRules,
  validateApplicationModal,
  validateField,
  getFieldError,
  isFieldTouched,
  resetForm: resetModalValidation,
} = useApplicationModalValidation()

const nameError = computed(() => getFieldError('name'))
const phoneError = computed(() => getFieldError('phone'))
const emailError = computed(() => getFieldError('email'))
const messageError = computed(() => getFieldError('message'))
const agreementError = computed(() => getFieldError('agreement'))

watch(
  () => form.value.name,
  async (value) => {
    if (isFieldTouched('name')) {
      await validateField('name', value, applicationModalRules.name)
    }
  },
)

watch(
  () => form.value.phone,
  async (value) => {
    if (isFieldTouched('phone')) {
      await validateField('phone', value, applicationModalRules.phone)
    }
  },
)

watch(
  () => form.value.email,
  async (value) => {
    if (isFieldTouched('email')) {
      await validateField('email', value, applicationModalRules.email)
    }
  },
)

watch(
  () => form.value.message,
  async (value) => {
    if (isFieldTouched('message')) {
      await validateField('message', value, applicationModalRules.message)
    }
  },
)

watch(
  () => form.value.agreement,
  async (value) => {
    if (isFieldTouched('agreement')) {
      await validateField('agreement', value, applicationModalRules.agreement)
    }
  },
)

const closeModal = () => {
  emit('close')
}


const submitForm = async () => {
  if (isSubmitting.value) return

  const validationResult = await validateApplicationModal(form.value)

  if (!validationResult.isValid) {
    show(validationResult.errors[0] || $t('modal.error_message'), {
      title: $t('modal.error_title'),
      type: 'error',
      duration: 5000,
    })
    return
  }

  isSubmitting.value = true

  try {
    // Подготавливаем данные в формате API
    const nameParts = form.value.name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    const applicationData = {
      personal_info: {
        first_name: firstName,
        last_name: lastName,
        email: form.value.email,
        phone: sanitizePhone(form.value.phone),
      },
      preferences: {
        universities: props.userPreferences?.universityName
          ? [props.userPreferences.universityName]
          : [],
        programs: [],
        budget: 'Не указан',
        start_date: new Date().getFullYear().toString(),
      },
      additional_info: form.value.message || '',
      source: referralCode.value || props.userPreferences?.source || 'website',
      referral_code: referralCode.value,
      user_preferences: props.userPreferences,
    }

    // Отправляем данные на сервер
    const response = await $fetch('/api/v1/applications', {
      method: 'POST',
      body: applicationData,
    })

    emit('submit', response)

    // Показать сообщение об успехе
    show($t('modal.success_message'), {
      title: $t('modal.success_title'),
      type: 'success',
      duration: 5000,
    })

    // Закрыть модал и очистить форму
    closeModal()
    form.value = {
      name: '',
      phone: '',
      email: '',
      message: '',
      agreement: false,
    }
    resetModalValidation()
  } catch (error: any) {
    console.error('Error submitting form:', error)

    // Показываем конкретную ошибку пользователю
    const serverErrors = Array.isArray(error?.data?.errors) ? error.data.errors : null
    if (serverErrors && serverErrors.length) {
      show(serverErrors.join('\n'), {
        title: $t('modal.error_title'),
        type: 'error',
        duration: 7000,
      })
    } else {
      const errorMessage = error?.data?.error || error?.message || $t('modal.error_message')
      show(errorMessage, { title: $t('modal.error_title'), type: 'error', duration: 6000 })
    }
  } finally {
    isSubmitting.value = false
  }
}

// Helper functions for preferences display
const isQuestionnaire = (prefs: ApplicationPreferences): prefs is QuestionnairePreferences => {
  return prefs.source === 'home_questionnaire' && 'userType' in prefs
}

const getUserTypeText = (userType: string): string => {
  return userType === 'student'
    ? ($t('modal.user_types.student') as string)
    : ($t('modal.user_types.parent') as string)
}

const getUniversityText = (chosen: string): string => {
  return chosen === 'yes'
    ? ($t('modal.university_chosen.yes') as string)
    : ($t('modal.university_chosen.no') as string)
}

const getLanguageText = (language: string): string => {
  if (language === 'turkish') {
    return $t('modal.languages.turkish') as string
  }

  if (language === 'english') {
    return $t('modal.languages.english') as string
  }

  return $t('modal.languages.both') as string
}

const getScholarshipText = (scholarship: string): string => {
  return scholarship === 'yes'
    ? ($t('modal.scholarship.yes') as string)
    : ($t('modal.scholarship.no') as string)
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
      resetModalValidation()
    }
  },
  { immediate: true },
)
</script>

<style>
/* Анимация появления */
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

/* На десктопе используем другую анимацию */
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

/* Улучшенный скролл на iOS */
.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
}

/* Оптимизация для мобильных */
@media (max-width: 767px) {
  .modal-content {
    touch-action: pan-y;
  }
}
</style>
