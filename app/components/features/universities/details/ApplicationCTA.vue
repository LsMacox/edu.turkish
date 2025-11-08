<template>
  <section class="py-20 bg-gradient-to-r from-primary to-red-600">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12 text-white">
          <h2 class="text-4xl lg:text-5xl font-bold mb-6">
            {{ $t('applicationCTA.title', { universityName: university.name }) }}
          </h2>
          <p class="text-xl opacity-90">
            {{ $t('applicationCTA.subtitle') }}
          </p>
        </div>

        <div class="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
          <form class="space-y-6" @submit.prevent="submitApplication">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-secondary mb-2" :for="nameFieldId">
                  {{ $t('applicationCTA.form.name_label') }}
                </label>
                <BaseTextField
                  :id="nameFieldId"
                  v-model="form.name"
                  name="name"
                  type="text"
                  :placeholder="$t('applicationCTA.form.name_placeholder')"
                  :error="nameError"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-secondary mb-2" :for="phoneFieldId">
                  {{ $t('applicationCTA.form.phone_label') }}
                </label>
                <div class="relative">
                  <input
                    :id="phoneFieldId"
                    v-model="form.phone"
                    name="phone"
                    type="tel"
                    required
                    :placeholder="$t('applicationCTA.form.phone_placeholder')"
                    inputmode="tel"
                    autocomplete="tel"
                    maxlength="18"
                    :class="[
                      'w-full px-4 py-3 bg-white rounded-xl focus:outline-none font-medium text-secondary placeholder-gray-400 transition-all duration-200',
                      phoneError
                        ? 'border border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                        : 'border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent',
                    ]"
                    :aria-invalid="!!phoneError"
                    @input="onPhoneInput"
                    @keydown="onPhoneKeydown"
                  />
                </div>
                <p v-if="phoneError" class="mt-2 text-sm text-red-600">{{ phoneError }}</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-secondary mb-2" :for="emailFieldId">
                {{ $t('applicationCTA.form.email_label') }}
              </label>
              <BaseTextField
                :id="emailFieldId"
                v-model="form.email"
                name="email"
                type="email"
                :placeholder="$t('applicationCTA.form.email_placeholder')"
                :error="emailError"
              />
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  class="block text-sm font-semibold text-secondary mb-2"
                  :for="programFieldId"
                >
                  {{ $t('applicationCTA.form.program_label') }} *
                </label>
                <BaseSelect
                  :id="programFieldId"
                  v-model="form.program"
                  name="program"
                  required
                  :error="programError"
                >
                  <option value="">{{ $t('applicationCTA.form.program_placeholder') }}</option>
                  <option v-for="program in availablePrograms" :key="program" :value="program">
                    {{ program }}
                  </option>
                  <option value="other">{{ $t('applicationCTA.form.program_other') }}</option>
                </BaseSelect>
              </div>
              <div>
                <label class="block text-sm font-semibold text-secondary mb-2" :for="levelFieldId">
                  {{ $t('applicationCTA.form.level_label') }}
                </label>
                <BaseSelect :id="levelFieldId" v-model="form.level" name="level">
                  <option value="bachelor">{{ $t('applicationCTA.form.level_bachelor') }}</option>
                  <option value="master">{{ $t('applicationCTA.form.level_master') }}</option>
                </BaseSelect>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-secondary mb-2" :for="commentFieldId">
                {{ $t('applicationCTA.form.comment_label') }}
              </label>
              <textarea
                :id="commentFieldId"
                v-model="form.comment"
                name="comment"
                rows="4"
                :class="[
                  'w-full px-4 py-3 bg-white rounded-xl focus:outline-none font-medium text-secondary placeholder-gray-400 transition-all duration-200 resize-none',
                  commentError
                    ? 'border border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    : 'border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent',
                ]"
                :aria-invalid="!!commentError"
                :placeholder="$t('applicationCTA.form.comment_placeholder')"
              ></textarea>
              <p v-if="commentError" class="mt-2 text-sm text-red-600">{{ commentError }}</p>
            </div>

            <BaseCheckbox
              :checked="form.privacyAgreed"
              @update:checked="form.privacyAgreed = $event"
            >
              {{ $t('applicationCTA.form.privacy_agreement') }}
            </BaseCheckbox>

            <div class="text-center">
              <button
                type="submit"
                :disabled="isSubmitting || !form.privacyAgreed"
                class="bg-primary text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
              >
                <span v-if="!isSubmitting">{{ $t('applicationCTA.form.submit_button') }}</span>
                <span v-else class="flex items-center justify-center space-x-2">
                  <Icon name="ph:spinner" class="animate-spin" />
                  <span>{{ $t('applicationCTA.form.submitting') }}</span>
                </span>
              </button>
              <p class="text-sm text-gray-500 mt-3">
                {{ $t('applicationCTA.form.response_time') }}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useReferral } from '~/composables/useReferral'
import { useServerValidation } from '~/composables/useServerValidation'
import type { DegreeType } from '~/types/domain'

const { show } = useToast()

const nameFieldId = useId()
const phoneFieldId = useId()
const emailFieldId = useId()
const programFieldId = useId()
const levelFieldId = useId()
const commentFieldId = useId()

interface Props {
  university: {
    name: string
    academicPrograms?: Array<{
      name: string
      level: DegreeType
      language: string
      duration: string
      price: number
    }>
  }
}

const props = defineProps<Props>()

const { referralCode, setReferralCode } = useReferral()

onMounted(() => {
  const referralCookie = useCookie<string | null>('ref')

  if (referralCookie?.value) {
    setReferralCode(referralCookie.value)
  }
})

const form = ref({
  name: '',
  phone: '',
  email: '',
  program: '',
  level: 'bachelor' as 'bachelor' | 'master',
  comment: '',
  privacyAgreed: false,
})

const isSubmitting = ref(false)

const { getFieldError, handleValidationError, clearAllErrors, nonFieldErrors } =
  useServerValidation()

const nameError = computed(() => getFieldError('personal_info.first_name'))
const phoneError = computed(() => getFieldError('personal_info.phone'))
const emailError = computed(() => getFieldError('personal_info.email'))
const programError = computed(() => getFieldError('preferences.programs'))
const commentError = computed(() => getFieldError('additional_info'))

const phoneRef = computed({
  get: () => form.value.phone,
  set: (value: string) => {
    form.value.phone = value
  },
})

const { sanitizePhone, onPhoneInput, onPhoneKeydown } = useInternationalPhone(phoneRef)

// Get available programs based on university data
const availablePrograms = computed(() => {
  const programs = props.university.academicPrograms
  if (!programs) return []

  const level = form.value.level
  return programs.filter((program) => program.level === level).map((program) => program.name)
})

const submitApplication = async () => {
  if (isSubmitting.value || !form.value.privacyAgreed) {
    return
  }

  clearAllErrors()
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
      education: {
        level: form.value.level,
        field: form.value.program || 'Не указано',
      },
      preferences: {
        universities: [props.university.name],
        programs: form.value.program ? [form.value.program] : [],
        budget: 'Не указан',
        start_date: new Date().getFullYear().toString(),
      },
      additional_info: form.value.comment || '',
      source: 'university_detail',
      ref: referralCode.value,
    }

    // Отправляем данные на сервер
    const response = await $fetch('/api/v1/applications', {
      method: 'POST',
      body: applicationData,
    })

    // Success - response contains created application and CRM info

    // Проверяем результат интеграции с CRM (возможен Bitrix/EspoCRM)
    if (response.crm?.error) {
      console.warn(
        `CRM integration error (${response.crm.provider || 'unknown'}):`,
        response.crm.error,
      )
    }

    form.value = {
      name: '',
      phone: '',
      email: '',
      program: '',
      level: 'bachelor',
      comment: '',
      privacyAgreed: false,
    }
    clearAllErrors()

    // Показать сообщение об успехе
    show('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', {
      title: 'Заявка отправлена',
      type: 'success',
      duration: 5000,
    })
  } catch (error: any) {
    console.error('Error submitting application:', error)

    if (handleValidationError(error)) {
      if (nonFieldErrors.value.length > 0) {
        show(nonFieldErrors.value.join('\n'), {
          title: 'Ошибка валидации',
          type: 'error',
          duration: 7000,
        })
      }
    } else {
      show(
        error?.data?.message ||
          'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.',
        {
          title: 'Ошибка отправки',
          type: 'error',
          duration: 5000,
        },
      )
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
