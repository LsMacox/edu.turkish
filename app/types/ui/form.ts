import type { Size } from './common'

export interface BaseTextFieldProps {
  modelValue: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  id?: string
  name?: string
  label?: string
  placeholder?: string
  helperText?: string
  error?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  ariaLabel?: string
  min?: string | number
  max?: string | number
  step?: string | number
  maxlength?: number | string
  autocomplete?: string
  clearable?: boolean
  size?: Size
}
