<template>
  <div 
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
        <h2 class="text-xl md:text-2xl font-bold text-secondary">{{ $t('modal.consultation_title') }}</h2>
        <button 
          @click="closeModal"
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors min-h-touch-44 min-w-touch-44"
          aria-label="Close modal"
        >
          <Icon name="mdi:close" class="text-gray-500 text-xl" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="p-4 md:p-6 space-y-4 md:space-y-4">
        <div>
          <label class="block text-sm md:text-sm font-medium text-gray-700 mb-2">{{ $t('modal.your_name') }} {{ $t('modal.required') }}</label>
          <UiFormsBaseTextField
            v-model="form.name"
            type="text"
            :placeholder="$t('modal.name_placeholder')"
          />
        </div>

        <div>
          <label class="block text-sm md:text-sm font-medium text-gray-700 mb-2">{{ $t('modal.phone') }} {{ $t('modal.required') }}</label>
          <input 
            v-model="form.phone"
            type="tel" 
            required
            :placeholder="$t('modal.phone_placeholder')"
            inputmode="tel"
            autocomplete="tel"
            maxlength="20"
            @input="onPhoneInput"
            @keydown="onPhoneKeydown"
            class="w-full px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none focus:outline-none transition-all py-4 md:py-3 text-base md:text-sm min-h-touch-48 md:min-h-auto"
          >
        </div>

        <div>
          <label class="block text-sm md:text-sm font-medium text-gray-700 mb-2">{{ $t('modal.email') }}</label>
          <UiFormsBaseTextField
            v-model="form.email"
            type="email"
            :placeholder="$t('modal.email_placeholder')"
          />
        </div>

        <div>
          <label class="block text-sm md:text-sm font-medium text-gray-700 mb-2">{{ $t('modal.direction') }}</label>
          <UiFormsBaseSelect v-model="form.direction">
            <option value="">{{ $t('modal.direction_placeholder') }}</option>
            <option v-for="d in directions" :key="d.id" :value="d.name">{{ d.name }}</option>
            <option value="other">{{ $t('modal.directions.other') }}</option>
          </UiFormsBaseSelect>
        </div>

        <div>
          <label class="block text-sm md:text-sm font-medium text-gray-700 mb-2">{{ $t('modal.additional_info') }}</label>
          <textarea 
            v-model="form.message"
            :placeholder="$t('modal.message_placeholder')" 
            rows="3"
            class="w-full px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all resize-none py-4 md:py-3 text-base md:text-sm min-h-[80px]"
          ></textarea>
        </div>

        <!-- Preferences display - только для анкеты с главной страницы -->
        <div v-if="userPreferences && isQuestionnaire(userPreferences)" class="bg-blue-50 border border-blue-200 rounded-xl p-3 md:p-4">
          <h4 class="text-sm font-semibold text-blue-800 mb-2">
            {{ $t('modal.preferences_title') }}
          </h4>
          <div class="text-xs md:text-xs text-blue-700 space-y-1">
            <p>• {{ $t('modal.preference_labels.user_type') }} {{ getUserTypeText(userPreferences.userType) }}</p>
            <p>• {{ $t('modal.preference_labels.university') }} {{ getUniversityText(userPreferences.universityChosen) }}</p>
            <p>• {{ $t('modal.preference_labels.language') }} {{ getLanguageText(userPreferences.language) }}</p>
            <p>• {{ $t('modal.preference_labels.scholarship') }} {{ getScholarshipText(userPreferences.scholarship) }}</p>
          </div>
        </div>

        <UiFormsBaseCheckbox 
          :checked="form.agreement"
          @update:checked="form.agreement = $event"
        >
          {{ $t('modal.agreement') }}
        </UiFormsBaseCheckbox>

        <button 
          type="submit" 
          :disabled="isSubmitting || !form.agreement"
          class="w-full bg-primary text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed py-4 text-base md:text-lg min-h-touch-48"
        >
          {{ isSubmitting ? $t('modal.submitting') : $t('modal.submit_button') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApplicationPreferences, QuestionnairePreferences } from '../../types/preferences'
import type { DirectionInfo, DirectionResponse } from '../../../server/types/api'

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

const form = ref({
  name: '',
  phone: '',
  email: '',
  direction: '',
  message: '',
  agreement: false
})

const isSubmitting = ref(false)

const directions = ref<DirectionInfo[]>([])
const directionsLoading = ref(false)
const directionsError = ref<string | null>(null)

const { show } = useToast()

const closeModal = () => {
  emit('close')
}

const fetchDirections = async () => {
  if (directionsLoading.value) return
  directionsLoading.value = true
  directionsError.value = null
  try {
    const { locale } = useI18n()
    const res = await $fetch<DirectionResponse>('/api/v1/directions', {
      query: { limit: 1000, lang: locale.value }
    })
    directions.value = res.data || []
  } catch (e: any) {
    directionsError.value = e?.message || 'Failed to load directions'
    directions.value = []
  } finally {
    directionsLoading.value = false
  }
}

watch(() => props.isOpen, (open) => {
  if (open && directions.value.length === 0) {
    fetchDirections()
  }
})

const submitForm = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // Подготавливаем данные в формате API
    const nameParts = form.value.name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    
    const sanitizePhone = (value: string) => value.replace(/[^+\d]/g, '')
    const applicationData = {
      personal_info: {
        first_name: firstName,
        last_name: lastName,
        email: form.value.email,
        phone: sanitizePhone(form.value.phone)
      },
      education: {
        level: 'bachelor', // По умолчанию, можно добавить поле выбора
        field: form.value.direction || 'Не указано'
      },
      preferences: {
        universities: props.userPreferences?.universityName ? [props.userPreferences.universityName] : [],
        programs: form.value.direction ? [form.value.direction] : [],
        budget: 'Не указан',
        start_date: new Date().getFullYear().toString()
      },
      additional_info: form.value.message || '',
      source: props.userPreferences?.source || 'website',
      user_preferences: props.userPreferences
    }
    
    // Отправляем данные на сервер
    const response = await $fetch('/api/v1/applications', {
      method: 'POST',
      body: applicationData
    })
    
    console.log('Application submitted successfully:', response)
    
    // Проверяем результат интеграции с Bitrix
    if ((response as any).bitrix?.leadId) {
      console.log(`Bitrix lead created with ID: ${(response as any).bitrix.leadId}`)
    } else if ((response as any).bitrix?.error) {
      console.warn('Bitrix integration error:', (response as any).bitrix.error)
    }
    
    emit('submit', response)
    
    // Показать сообщение об успехе
    show($t('modal.success_message'), { title: $t('modal.success_title'), type: 'success', duration: 5000 })
    
    // Закрыть модал и очистить форму
    closeModal()
    form.value = {
      name: '',
      phone: '',
      email: '',
      direction: '',
      message: '',
      agreement: false
    }
    
  } catch (error: any) {
    console.error('Error submitting form:', error)
    
    // Показываем конкретную ошибку пользователю
    const serverErrors = Array.isArray(error?.data?.errors) ? error.data.errors : null
    if (serverErrors && serverErrors.length) {
      show(serverErrors.join('\n'), { title: $t('modal.error_title'), type: 'error', duration: 7000 })
    } else {
      const errorMessage = error?.data?.error || error?.message || $t('modal.error_message')
      show(errorMessage, { title: $t('modal.error_title'), type: 'error', duration: 6000 })
    }
  } finally {
    isSubmitting.value = false
  }
}

// Страна-aware визуальная маска.
// - Для +7 и +90: +CC (XXX) XXX XX-XX
// - Для остальных: + и группировка по 3 цифры (до 15 цифр)
const formatInternationalPhone = (raw: string) => {
  const input = raw.replace(/[^+\d]/g, '')
  const hasPlus = input.startsWith('+')
  const digits = input.replace(/\D/g, '')

  // Позволяем полностью очищать поле
  if (digits.length === 0) return ''

  // Проверяем коды страны
  const startsWith7 = hasPlus ? input.startsWith('+7') : digits.startsWith('7')
  const startsWith90 = hasPlus ? input.startsWith('+90') : digits.startsWith('90')

  if (startsWith7) {
    const body = digits.slice(1, 11)
    let res = '+7'
    if (body.length === 0) return res
    res += ' (' + body.slice(0, 3)
    if (body.length >= 3) res += ') '
    if (body.length > 3) res += body.slice(3, 6)
    if (body.length >= 6) res += ' ' + body.slice(6, 8)
    if (body.length >= 8) res += '-' + body.slice(8, 10)
    return res.trim()
  }

  if (startsWith90) {
    const body = digits.slice(2, 12)
    let res = '+90'
    if (body.length === 0) return res
    res += ' (' + body.slice(0, 3)
    if (body.length >= 3) res += ') '
    if (body.length > 3) res += body.slice(3, 6)
    if (body.length >= 6) res += ' ' + body.slice(6, 8)
    if (body.length >= 8) res += '-' + body.slice(8, 10)
    return res.trim()
  }

  // Fallback: + и группировка по 3 цифры до 15
  const limited = digits.slice(0, 15)
  const groups = limited.match(/\d{1,3}/g) || []
  return (hasPlus || limited.length > 0 ? '+' : '') + groups.join(' ')
}

const onPhoneInput = (e: Event) => {
  const el = (e.target as HTMLInputElement)
  form.value.phone = formatInternationalPhone(el.value)
}

const onPhoneKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Backspace') return
  const el = e.target as HTMLInputElement
  const start = el.selectionStart ?? 0
  const end = el.selectionEnd ?? 0
  const value = el.value
  if (start !== end || start === 0) return
  const leftChar = value[start - 1] || ''
  if (/\d/.test(leftChar)) return
  e.preventDefault()
  const digits = value.replace(/\D/g, '')
  const newDigits = digits.slice(0, -1)
  const newRaw = newDigits.length ? ('+' + newDigits) : ''
  form.value.phone = formatInternationalPhone(newRaw)
}

// Helper functions for preferences display
const isQuestionnaire = (prefs: ApplicationPreferences): prefs is QuestionnairePreferences => {
  return prefs.source === 'home_questionnaire' && 'userType' in prefs
}

const getUserTypeText = (userType: string): string => {
  return userType === 'student' ? $t('modal.user_types.student') as string : $t('modal.user_types.parent') as string
}

const getUniversityText = (chosen: string): string => {
  return chosen === 'yes' ? $t('modal.university_chosen.yes') as string : $t('modal.university_chosen.no') as string
}

const getLanguageText = (language: string): string => {
  return language === 'turkish' ? $t('modal.languages.turkish') as string : $t('modal.languages.english') as string
}

const getScholarshipText = (scholarship: string): string => {
  return scholarship === 'yes' ? $t('modal.scholarship.yes') as string : $t('modal.scholarship.no') as string
}


// Закрытие по ESC
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
</script>

<style scoped>
/* Анимация появления */
.fixed {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.bg-white {
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
