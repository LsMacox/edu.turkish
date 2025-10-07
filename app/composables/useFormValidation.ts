/**
 * Enhanced Form Validation Composable
 *
 * Provides comprehensive form validation with real-time feedback, multiple validation rules,
 * and accessibility support. Supports both synchronous and asynchronous validation.
 *
 * @module useFormValidation
 * @author edu.turkish development team
 * @since 1.0.0
 *
 * @example Basic usage
 * ```typescript
 * const { validateField, isFormValid, getFieldError } = useFormValidation()
 *
 * // Validate a field
 * await validateField('email', email.value, [
 *   createRules.required(),
 *   createRules.email()
 * ])
 *
 * // Check if field has errors
 * const emailError = getFieldError('email')
 * ```
 *
 * @example Multiple field validation
 * ```typescript
 * const validation = useFormValidation()
 *
 * const validateForm = async () => {
 *   const result = await validation.validateFields({
 *     name: { value: name.value, rules: [validation.createRules.required()] },
 *     email: { value: email.value, rules: [validation.createRules.email()] }
 *   })
 *
 *   if (result.isValid) {
 *     // Submit form
 *   }
 * }
 * ```
 */

import type {
  ValidationRule,
  ValidationResult,
  FormValidationState,
  ValidationContext,
  CustomValidator,
} from '~/types/validation'

/**
 * Enhanced form validation composable
 * Provides comprehensive validation with real-time feedback
 */
export const useFormValidation = () => {
  // Validation state management
  const validationState = reactive<FormValidationState>({})
  const isValidating = ref(false)
  const touchedFields = ref(new Set<string>())

  // Validation patterns (reusing from types)
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    // E.164: + followed by 8 to 15 digits
    phone: /^\+[1-9]\d{7,14}$/,
    url: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&=]*)$/,
    strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    alphaNumeric: /^[a-zA-Z0-9]+$/,
    alpha: /^[a-zA-Z\s]+$/,
    numeric: /^[0-9]+$/,
  }

  // Default error messages
  const messages = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    url: 'Please enter a valid URL',
    minLength: (min: number) => `Minimum length is ${min} characters`,
    maxLength: (max: number) => `Maximum length is ${max} characters`,
    min: (minimum: number) => `Minimum value is ${minimum}`,
    max: (maximum: number) => `Maximum value is ${maximum}`,
    pattern: 'Invalid format',
  }

  /**
   * Initialize field validation state
   */
  const initializeField = (fieldName: string, initialValue: any = '') => {
    if (!validationState[fieldName]) {
      validationState[fieldName] = {
        value: initialValue,
        isValid: true,
        errors: [],
        touched: false,
        dirty: false,
      }
    }
  }

  /**
   * Validate a single rule
   */
  const validateRule = async (
    value: any,
    rule: ValidationRule,
    context?: ValidationContext,
  ): Promise<string | null> => {
    const { type, value: ruleValue, message } = rule

    switch (type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return typeof message === 'function' ? message(value, type) : message
        }
        break

      case 'email':
        if (value && !patterns.email.test(value)) {
          return typeof message === 'function' ? message(value, type) : message
        }
        break

      case 'phone': {
        if (value) {
          const normalizedValue =
            typeof value === 'string'
              ? value.replace(/[^\d+]/g, '')
              : String(value)

          if (!patterns.phone.test(normalizedValue)) {
            return typeof message === 'function' ? message(value, type) : message
          }
        }
        break
      }

      case 'url':
        if (value && !patterns.url.test(value)) {
          return typeof message === 'function' ? message(value, type) : message
        }
        break

      case 'pattern':
        if (value && ruleValue instanceof RegExp && !ruleValue.test(value)) {
          return typeof message === 'function' ? message(value, type) : message
        }
        break

      case 'minLength':
        if (value && typeof value === 'string' && value.length < ruleValue) {
          return typeof message === 'function' ? message(value, type) : message
        }
        break

      case 'maxLength':
        if (value && typeof value === 'string' && value.length > ruleValue) {
          return typeof message === 'function' ? message(value, type) : message
        }
        break

      case 'min':
        if (value !== undefined && Number(value) < ruleValue) {
          return typeof message === 'function' ? message(value, type) : message
        }
        break

      case 'max':
        if (value !== undefined && Number(value) > ruleValue) {
          return typeof message === 'function' ? message(value, type) : message
        }
        break

      case 'number':
        if (value && isNaN(Number(value))) {
          return typeof message === 'function' ? message(value, type) : message
        }
        break

      case 'custom':
        if (ruleValue && typeof ruleValue === 'function') {
          const result = await ruleValue(value, context)
          if (result !== true) {
            return typeof result === 'string'
              ? result
              : typeof message === 'function'
                ? message(value, type)
                : message
          }
        }
        break
    }

    return null
  }

  /**
   * Validate a single field
   */
  const validateField = async (
    fieldName: string,
    value: any,
    rules: ValidationRule[] = [],
  ): Promise<ValidationResult> => {
    initializeField(fieldName, value)

    const errors: string[] = []
    const context: ValidationContext = {
      value,
      field: fieldName,
      form: getFormValues(),
    }

    // Run all validation rules
    for (const rule of rules) {
      const error = await validateRule(value, rule, context)
      if (error) {
        errors.push(error)
      }
    }

    // Update validation state
    const previous = validationState[fieldName]
    validationState[fieldName] = {
      value,
      isValid: errors.length === 0,
      errors,
      touched: previous?.touched ?? false,
      dirty: previous ? previous.value !== value : false,
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate multiple fields
   */
  const validateFields = async (
    fieldsConfig: Record<string, { value: any; rules: ValidationRule[] }>,
  ): Promise<ValidationResult> => {
    isValidating.value = true
    const allErrors: string[] = []

    try {
      await Promise.all(
        Object.entries(fieldsConfig).map(async ([fieldName, config]) => {
          const result = await validateField(fieldName, config.value, config.rules)
          if (!result.isValid) {
            allErrors.push(...result.errors)
          }
        }),
      )

      return {
        isValid: allErrors.length === 0,
        errors: allErrors,
      }
    } finally {
      isValidating.value = false
    }
  }

  /**
   * Mark field as touched
   */
  const touchField = (fieldName: string) => {
    initializeField(fieldName)
    touchedFields.value.add(fieldName)
    if (validationState[fieldName]) {
      validationState[fieldName].touched = true
    }
  }

  /**
   * Mark field as untouched
   */
  const untouchField = (fieldName: string) => {
    initializeField(fieldName)
    touchedFields.value.delete(fieldName)
    if (validationState[fieldName]) {
      validationState[fieldName].touched = false
    }
  }

  /**
   * Clear field validation
   */
  const clearFieldValidation = (fieldName: string) => {
    if (validationState[fieldName]) {
      validationState[fieldName].errors = []
      validationState[fieldName].isValid = true
    }
  }

  /**
   * Clear all validation
   */
  const clearAllValidation = () => {
    Object.keys(validationState).forEach((fieldName) => {
      if (validationState[fieldName]) {
        validationState[fieldName].errors = []
        validationState[fieldName].isValid = true
      }
    })
    touchedFields.value.clear()
  }

  /**
   * Reset form state
   */
  const resetForm = () => {
    Object.keys(validationState).forEach((fieldName) => {
      delete validationState[fieldName]
    })
    touchedFields.value.clear()
  }

  /**
   * Get current form values
   */
  const getFormValues = () => {
    const values: Record<string, any> = {}
    Object.entries(validationState).forEach(([fieldName, state]) => {
      values[fieldName] = state.value
    })
    return values
  }

  /**
   * Get field error messages
   */
  const getFieldErrors = (fieldName: string): string[] => {
    return validationState[fieldName]?.errors || []
  }

  /**
   * Get first field error
   */
  const getFieldError = (fieldName: string): string | undefined => {
    const errors = getFieldErrors(fieldName)
    return errors.length > 0 ? errors[0] : undefined
  }

  /**
   * Check if field is valid
   */
  const isFieldValid = (fieldName: string): boolean => {
    return validationState[fieldName]?.isValid ?? true
  }

  /**
   * Check if field is touched
   */
  const isFieldTouched = (fieldName: string): boolean => {
    return validationState[fieldName]?.touched ?? false
  }

  /**
   * Check if field is dirty
   */
  const isFieldDirty = (fieldName: string): boolean => {
    return validationState[fieldName]?.dirty ?? false
  }

  // Computed properties
  const isFormValid = computed(() => {
    return Object.values(validationState).every((field) => field.isValid)
  })

  const hasErrors = computed(() => {
    return Object.values(validationState).some((field) => field.errors.length > 0)
  })

  const isDirty = computed(() => {
    return Object.values(validationState).some((field) => field.dirty)
  })

  const touchedFieldsCount = computed(() => touchedFields.value.size)

  const allErrors = computed(() => {
    const errors: string[] = []
    Object.values(validationState).forEach((field) => {
      errors.push(...field.errors)
    })
    return errors
  })

  // Helper function to create common validation rules
  const createRules = {
    required: (message = messages.required): ValidationRule => ({
      type: 'required',
      message,
    }),

    email: (message = messages.email): ValidationRule => ({
      type: 'email',
      message,
    }),

    phone: (message = messages.phone): ValidationRule => ({
      type: 'phone',
      message,
    }),

    minLength: (min: number, message?: string): ValidationRule => ({
      type: 'minLength',
      value: min,
      message: message || messages.minLength(min),
    }),

    maxLength: (max: number, message?: string): ValidationRule => ({
      type: 'maxLength',
      value: max,
      message: message || messages.maxLength(max),
    }),

    pattern: (regex: RegExp, message = messages.pattern): ValidationRule => ({
      type: 'pattern',
      value: regex,
      message,
    }),

    custom: (validator: CustomValidator, message = 'Invalid value'): ValidationRule => ({
      type: 'custom',
      value: validator,
      message,
    }),
  }

  return {
    // State
    validationState: readonly(validationState),
    isValidating: readonly(isValidating),

    // Methods
    initializeField,
    validateField,
    validateFields,
    touchField,
    untouchField,
    clearFieldValidation,
    clearAllValidation,
    resetForm,

    // Getters
    getFormValues,
    getFieldErrors,
    getFieldError,
    isFieldValid,
    isFieldTouched,
    isFieldDirty,

    // Computed
    isFormValid,
    hasErrors,
    isDirty,
    touchedFieldsCount,
    allErrors,

    // Helpers
    createRules,
    patterns,
    messages,
  }
}

/**
 * Helper composable for specific form validation scenarios
 */
