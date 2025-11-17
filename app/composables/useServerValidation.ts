import type { ValidationErrorResponse, FieldErrorIssue } from '~~/server/types/api'

export interface FieldErrorState {
  [field: string]: string[]
}

export const useServerValidation = () => {
  const fieldErrors = ref<FieldErrorState>({})
  const nonFieldErrors = ref<string[]>([])
  const { t } = useI18n()

  const translateErrorCode = (code: string, meta?: Record<string, any>, field?: string): string => {
    // 1) Поле-специфичные ошибки: errors.json -> fields.{path}.{code}
    if (field) {
      const fieldKey = `fields.${field}.${code}`
      const fieldMsg = meta ? t(fieldKey, meta) : t(fieldKey)
      if (typeof fieldMsg === 'string' && fieldMsg !== fieldKey) {
        return fieldMsg
      }
    }

    // 2) Общие ошибки по коду: errors.json -> {code}
    const genericKey = code
    const genericMsg = meta ? t(genericKey, meta) : t(genericKey)
    if (typeof genericMsg === 'string' && genericMsg !== genericKey) {
      return genericMsg
    }

    // 3) Fallback для возможных legacy-ключей вида errors.code
    const legacyKey = `errors.${code}`
    const legacyMsg = meta ? t(legacyKey, meta) : t(legacyKey)
    if (typeof legacyMsg === 'string' && legacyMsg !== legacyKey) {
      return legacyMsg
    }

    // 4) Сам код как крайний вариант (для отладки)
    return code
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
