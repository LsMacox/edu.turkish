<template>
  <BaseModal
    :is-open="isOpen"
    :title="t(modalNs('consultation_title'))"
    max-width="md"
    close-aria-label="Close modal"
    @close="closeModal"
  >
    <form class="space-y-5 md:space-y-4 pb-3" @submit.prevent="submitForm">
      <div>
        <label
          class="block text-label mb-2.5"
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
          class="block text-label mb-2.5"
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
          class="block text-label mb-2.5"
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
          class="block text-label mb-2.5"
          :for="messageFieldId"
        >
          {{ t(modalNs('additional_info')) }}
        </label>
        <BaseTextarea
          :id="messageFieldId"
          v-model="form.message"
          name="message"
          :placeholder="t(modalNs('message_placeholder'))"
          :rows="3"
          :error="messageError"
        />
      </div>

      <!-- Questionnaire preferences display -->
      <div v-if="isQuestionnaire" class="bg-blue-50 border border-blue-200 rounded-button p-4">
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

      <BaseCheckbox v-model="form.agreement">
        {{ t(modalNs('agreement')) }}
      </BaseCheckbox>

      <!-- Hidden referral source field for debugging -->
      <input type="hidden" name="source" :value="props.userPreferences?.source || 'website'" />

      <BaseButton
        type="submit"
        variant="primary"
        size="lg"
        full-width
        :loading="isSubmitting"
        :disabled="isSubmitting || !form.agreement"
        class="shadow-card"
      >
        {{ isSubmitting ? t(modalNs('submitting')) : t(modalNs('submit_button')) }}
      </BaseButton>
    </form>
  </BaseModal>
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

watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      clearAllErrors()
    }
  },
)
</script>
