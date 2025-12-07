import { useReferral } from '~/composables/useReferral'
import { useServerValidation } from '~/composables/useServerValidation'
import { useFingerprint } from '~/composables/useFingerprint'
import type { UniversityDetail, UniversityProgram } from '~~/server/types/api/universities'

export interface ApplicationFormData {
  name: string
  phone: string
  email: string
  program: string
  level: 'bachelor' | 'master'
  comment: string
  privacyAgreed: boolean
}

export interface UseApplicationFormOptions {
  university: Ref<UniversityDetail> | ComputedRef<UniversityDetail>
  source?: string
}

/**
 * Composable for university application form logic
 * Handles form state, validation, submission, and phone formatting
 */
export function useApplicationForm(options: UseApplicationFormOptions) {
  const { show } = useToast()
  const { referralCode, setReferralCode } = useReferral()
  const { ensureFingerprint } = useFingerprint()
  const { getFieldError, handleValidationError, clearAllErrors, nonFieldErrors } =
    useServerValidation()

  // Form state
  const form = ref<ApplicationFormData>({
    name: '',
    phone: '',
    email: '',
    program: '',
    level: 'bachelor',
    comment: '',
    privacyAgreed: false,
  })

  const isSubmitting = ref(false)

  // Initialize referral code from cookie
  onMounted(() => {
    const referralCookie = useCookie<string | null>('ref')
    if (referralCookie?.value) {
      setReferralCode(referralCookie.value)
    }
  })

  // Phone input handling
  const phoneRef = computed({
    get: () => form.value.phone,
    set: (value: string) => {
      form.value.phone = value
    },
  })

  const { sanitizePhone, onPhoneInput, onPhoneKeydown } = useInternationalPhone(phoneRef)

  // Field errors
  const fieldErrors = {
    name: computed(() => getFieldError('personal_info.first_name')),
    phone: computed(() => getFieldError('personal_info.phone')),
    email: computed(() => getFieldError('personal_info.email')),
    program: computed(() => getFieldError('preferences.programs')),
    comment: computed(() => getFieldError('additional_info')),
  }

  // Available programs based on selected level
  const availablePrograms = computed(() => {
    const programs = toValue(options.university).programs
    if (!programs) return []
    return programs
      .filter((p: UniversityProgram) => p.degreeType === form.value.level)
      .map((p: UniversityProgram) => p.name)
  })

  // Reset form to initial state
  const resetForm = () => {
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
  }

  // Submit application
  const submitApplication = async () => {
    if (isSubmitting.value || !form.value.privacyAgreed) return

    clearAllErrors()
    isSubmitting.value = true

    try {
      const university = toValue(options.university)
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
          universities: [university.title],
          programs: form.value.program ? [form.value.program] : [],
          budget: 'Не указан',
          start_date: new Date().getFullYear().toString(),
        },
        additional_info: form.value.comment || '',
        source: options.source ?? 'university_detail',
        ref: referralCode.value,
      }

      await ensureFingerprint()

      const response = await $fetch('/api/v1/applications', {
        method: 'POST',
        body: applicationData,
      })

      if (response.crm?.error) {
        console.warn(
          `CRM integration error (${response.crm.provider || 'unknown'}):`,
          response.crm.error,
        )
      }

      resetForm()

      show('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', {
        title: 'Заявка отправлена',
        type: 'success',
        duration: 5000,
      })

      return { success: true }
    } catch (error: unknown) {
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
        const errorWithData = error as { data?: { message?: string } }
        show(
          errorWithData?.data?.message ||
            'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.',
          {
            title: 'Ошибка отправки',
            type: 'error',
            duration: 5000,
          },
        )
      }

      return { success: false }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    // State
    form,
    isSubmitting,

    // Phone handling
    onPhoneInput,
    onPhoneKeydown,

    // Field errors
    fieldErrors,
    nonFieldErrors,

    // Computed
    availablePrograms,

    // Actions
    submitApplication,
    resetForm,
  }
}
