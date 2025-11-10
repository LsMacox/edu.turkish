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

export interface ValidationRule {
  type: ValidationType
  value?: any
  message: string | ((value: any, ruleName: string) => string)
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export type CustomValidator = (value: any) => boolean | string | Promise<boolean | string>
