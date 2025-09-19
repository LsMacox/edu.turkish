// Validation system types for form handling

/**
 * Validation rule types
 */
export type ValidationType =
  | 'required'
  | 'email'
  | 'phone'
  | 'url'
  | 'number'
  | 'pattern'
  | 'minLength'
  | 'maxLength'
  | 'min'
  | 'max'
  | 'custom'

/**
 * Validation rule configuration
 */
export interface ValidationRule {
  type: ValidationType
  value?: any
  message: string | ((value: any, ruleName: string) => string)
}

/**
 * Field validation configuration
 */
export interface FieldValidation {
  required?: boolean
  rules?: ValidationRule[]
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Form validation state
 */
export interface FormValidationState {
  [fieldName: string]: {
    value: any
    isValid: boolean
    errors: string[]
    touched: boolean
    dirty: boolean
  }
}

/**
 * Validation context
 */
export interface ValidationContext {
  value: any
  field: string
  form?: Record<string, any>
  index?: number
}

/**
 * Custom validator function type
 */
export type CustomValidator = (
  value: any,
  context?: ValidationContext,
) => boolean | string | Promise<boolean | string>

/**
 * Async validation result
 */
export interface AsyncValidationResult {
  isValid: boolean
  error?: string
  pending?: boolean
}

/**
 * Built-in validation rules
 */
export const ValidationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    type: 'required',
    message,
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    type: 'email',
    message,
  }),

  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    type: 'phone',
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    type: 'minLength',
    value: min,
    message: message || `Minimum length is ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    type: 'maxLength',
    value: max,
    message: message || `Maximum length is ${max} characters`,
  }),

  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule => ({
    type: 'pattern',
    value: regex,
    message,
  }),

  min: (minimum: number, message?: string): ValidationRule => ({
    type: 'min',
    value: minimum,
    message: message || `Minimum value is ${minimum}`,
  }),

  max: (maximum: number, message?: string): ValidationRule => ({
    type: 'max',
    value: maximum,
    message: message || `Maximum value is ${maximum}`,
  }),

  custom: (validator: CustomValidator, message = 'Invalid value'): ValidationRule => ({
    type: 'custom',
    value: validator,
    message,
  }),
}

/**
 * Common validation patterns
 */
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // E.164: + followed by 8 to 15 digits
  phone: /^\+[1-9]\d{7,14}$/,
  url: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&=]*)$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  alphaNumeric: /^[a-zA-Z0-9]+$/,
  alpha: /^[a-zA-Z]+$/,
  numeric: /^[0-9]+$/,
}

/**
 * Validation error messages
 */
export const ValidationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  minLength: (min: number) => `Minimum length is ${min} characters`,
  maxLength: (max: number) => `Maximum length is ${max} characters`,
  min: (minimum: number) => `Minimum value is ${minimum}`,
  max: (maximum: number) => `Maximum value is ${maximum}`,
  pattern: 'Invalid format',
} as const
