import { useServerValidation } from '~/composables/useServerValidation'
import { key } from '~~/lib/i18n'

export interface FormSubmitOptions<T> {
  /** The async function that performs the submission */
  submitFn: () => Promise<T>
  /** Called on successful submission */
  onSuccess?: (result: T) => void
  /** Called on error (after default handling) */
  onError?: (error: unknown) => void
  /** Toast messages configuration */
  messages?: {
    validationErrorTitle?: string
    genericErrorTitle?: string
    genericErrorMessage?: string
  }
}

export interface FormSubmitReturn {
  isSubmitting: Ref<boolean>
  fieldErrors: ReturnType<typeof useServerValidation>['fieldErrors']
  nonFieldErrors: ReturnType<typeof useServerValidation>['nonFieldErrors']
  getFieldError: ReturnType<typeof useServerValidation>['getFieldError']
  clearFieldError: ReturnType<typeof useServerValidation>['clearFieldError']
  clearAllErrors: ReturnType<typeof useServerValidation>['clearAllErrors']
  submit: <T>(options: FormSubmitOptions<T>) => Promise<{ success: boolean; result?: T }>
}

/**
 * Unified form submission handler with error handling.
 * Combines server validation, toast notifications, and loading state management.
 */
export function useFormSubmit(): FormSubmitReturn {
  const { show } = useToast()
  const { t } = useI18n()
  const {
    fieldErrors,
    nonFieldErrors,
    handleValidationError,
    getFieldError,
    clearFieldError,
    clearAllErrors,
  } = useServerValidation()

  const isSubmitting = ref(false)

  const submit = async <T>(options: FormSubmitOptions<T>): Promise<{ success: boolean; result?: T }> => {
    if (isSubmitting.value) {
      return { success: false }
    }

    clearAllErrors()
    isSubmitting.value = true

    const messages = {
      validationErrorTitle: options.messages?.validationErrorTitle ?? String(t(key('errors.validation_error_title'))),
      genericErrorTitle: options.messages?.genericErrorTitle ?? String(t(key('errors.generic_error_title'))),
      genericErrorMessage: options.messages?.genericErrorMessage ?? String(t(key('errors.generic_error_message'))),
    }

    try {
      const result = await options.submitFn()
      options.onSuccess?.(result)
      return { success: true, result }
    } catch (error: unknown) {
      console.error('Form submission error:', error)

      if (handleValidationError(error)) {
        if (nonFieldErrors.value.length > 0) {
          show(nonFieldErrors.value.join('\n'), {
            title: messages.validationErrorTitle,
            type: 'error',
            duration: 7000,
          })
        }
      } else {
        const errorWithData = error as { data?: { message?: string } }
        show(errorWithData?.data?.message || messages.genericErrorMessage, {
          title: messages.genericErrorTitle,
          type: 'error',
          duration: 5000,
        })
      }

      options.onError?.(error)
      return { success: false }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isSubmitting,
    fieldErrors,
    nonFieldErrors,
    getFieldError,
    clearFieldError,
    clearAllErrors,
    submit,
  }
}
