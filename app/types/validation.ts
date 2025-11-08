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
