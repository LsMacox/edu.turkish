import type { ValidationErrorResponse, FieldErrorIssue } from '~~/server/types/api'

export interface FieldErrorState {
  [field: string]: string[]
}

export const useServerValidation = () => {
  const fieldErrors = ref<FieldErrorState>({})
  const nonFieldErrors = ref<string[]>([])
  const { t } = useI18n()

  const translateErrorCode = (code: string, meta?: Record<string, any>, field?: string): string => {
    const tryTranslate = (key: string) => {
      const msg = meta ? t(key, meta) : t(key)
      return typeof msg === 'string' && msg !== key ? msg : null
    }

    if (field) {
      const fieldMsg = tryTranslate(`fields.${field}.${code}`)
      if (fieldMsg) return fieldMsg
    }

    return tryTranslate(code) || tryTranslate(`errors.${code}`) || code
  }

  const handleValidationError = (error: any) => {
    fieldErrors.value = {}
    nonFieldErrors.value = []

    const status = error?.statusCode ?? error?.status ?? error?.response?.status
    if (status === 422) {
      // Support various ofetch/h3 error shapes
      const raw =
        error?.data ?? error?.response?._data ?? error?.response?.data ?? error?.data?.data

      if (!raw) {
        return true
      }

      const validationError = (raw?.data ?? raw) as ValidationErrorResponse

      if (validationError.fieldErrors) {
        for (const [field, issues] of Object.entries(validationError.fieldErrors)) {
          fieldErrors.value[field] = issues.map((issue: FieldErrorIssue) =>
            translateErrorCode(issue.code, issue.meta, field),
          )
        }
      }

      if (validationError.nonFieldErrors) {
        nonFieldErrors.value = validationError.nonFieldErrors.map((issue) =>
          translateErrorCode(issue.code, issue.meta),
        )
      }

      return true
    }

    return false
  }

  const getFieldError = (field: string): string | undefined => {
    return fieldErrors.value[field]?.[0]
  }

  const clearFieldError = (field: string) => {
    if (fieldErrors.value[field]) {
      delete fieldErrors.value[field]
    }
  }

  const clearAllErrors = () => {
    fieldErrors.value = {}
    nonFieldErrors.value = []
  }

  return {
    fieldErrors: readonly(fieldErrors),
    nonFieldErrors: readonly(nonFieldErrors),
    handleValidationError,
    getFieldError,
    clearFieldError,
    clearAllErrors,
  }
}
