import type { ValidationErrorResponse, FieldErrorIssue } from '~~/lib/types'
import { key } from '~~/lib/i18n'

export interface FieldErrorState {
  [field: string]: string[]
}

export const useServerValidation = () => {
  const fieldErrors = ref<FieldErrorState>({})
  const nonFieldErrors = ref<string[]>([])
  const { t } = useI18n()

  const FIELD_ERROR_KEYS: Record<string, Record<string, string>> = {
    'personal_info.first_name': {
      required: key('errors.fields.personal_info.first_name.required'),
      min_length: key('errors.fields.personal_info.first_name.min_length'),
      max_length: key('errors.fields.personal_info.first_name.max_length'),
    },
    'personal_info.phone': {
      required: key('errors.fields.personal_info.phone.required'),
      invalid_phone: key('errors.fields.personal_info.phone.invalid_phone'),
    },
    'personal_info.email': {
      invalid_email: key('errors.fields.personal_info.email.invalid_email'),
      max_length: key('errors.fields.personal_info.email.max_length'),
    },
    additional_info: {
      max_length: key('errors.fields.additional_info.max_length'),
    },
  }

  const ERROR_KEYS: Record<string, string> = {
    required: key('errors.required'),
    min_length: key('errors.min_length'),
    max_length: key('errors.max_length'),
    invalid_email: key('errors.invalid_email'),
    invalid_phone: key('errors.invalid_phone'),
    invalid_format: key('errors.invalid_format'),
    invalid: key('errors.invalid'),
    crm_validation_error: key('errors.crm_validation_error'),
    server_error: key('errors.server_error'),
    unknown_error: key('errors.unknown_error'),
    min_value: key('errors.min_value'),
    max_value: key('errors.max_value'),
    invalid_year: key('errors.invalid_year'),
  }

  const translateErrorCode = (code: string, meta?: Record<string, any>, field?: string): string => {
    const tryTranslate = (key: string) => {
      const msg = meta ? t(key, meta) : t(key)
      return typeof msg === 'string' && msg !== key ? msg : null
    }

    if (field) {
      const fieldKey = FIELD_ERROR_KEYS[field]?.[code]
      if (fieldKey) {
        const fieldMsg = tryTranslate(fieldKey)
        if (fieldMsg) return fieldMsg
      }
    }

    const errorKey = ERROR_KEYS[code]
    if (errorKey) {
      const msg = tryTranslate(errorKey)
      if (msg) return msg
    }

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
