import { useReferral } from '~/composables/useReferral'
import { useFormSubmit } from '~/composables/useFormSubmit'
import { useFingerprint } from '~/composables/useFingerprint'
import type { UniversityDetail, UniversityProgram } from '~~/lib/types'

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

export function useApplicationForm(options: UseApplicationFormOptions) {
  const { show } = useToast()
  const { referralCode, setReferralCode } = useReferral()
  const { ensureFingerprint } = useFingerprint()
  const {
    isSubmitting,
    getFieldError,
    clearAllErrors,
    nonFieldErrors,
    submit,
  } = useFormSubmit()

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

  onMounted(() => {
    const referralCookie = useCookie<string | null>('ref')
    if (referralCookie?.value) {
      setReferralCode(referralCookie.value)
    }
  })

  const phoneRef = computed({
    get: () => form.value.phone,
    set: (value: string) => {
      form.value.phone = value
    },
  })

  const { sanitizePhone, onPhoneInput, onPhoneKeydown } = useInternationalPhone(phoneRef)

  const fieldErrors = {
    name: computed(() => getFieldError('personal_info.first_name')),
    phone: computed(() => getFieldError('personal_info.phone')),
    email: computed(() => getFieldError('personal_info.email')),
    program: computed(() => getFieldError('preferences.programs')),
    comment: computed(() => getFieldError('additional_info')),
  }

  const availablePrograms = computed(() => {
    const programs = toValue(options.university).programs
    if (!programs) return []
    return programs
      .filter((p: UniversityProgram) => p.degreeType === form.value.level)
      .map((p: UniversityProgram) => p.name)
  })

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

  const submitApplication = async () => {
    if (!form.value.privacyAgreed) return { success: false }

    return submit({
      submitFn: async () => {
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

        return response
      },
      onSuccess: () => {
        resetForm()
        show('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', {
          title: 'Заявка отправлена',
          type: 'success',
          duration: 5000,
        })
      },
      messages: {
        validationErrorTitle: 'Ошибка валидации',
        genericErrorTitle: 'Ошибка отправки',
        genericErrorMessage: 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.',
      },
    })
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
