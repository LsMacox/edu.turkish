import type { Size3, Rounded } from '../common'

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
  size?: Size3
  rounded?: Exclude<Rounded, 'none' | 'sm'>
}

export interface BaseTextFieldEvents {
  'update:modelValue': [value: string | number]
  input: [event: Event]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
  keyup: [event: KeyboardEvent]
  clear: []
}

export interface BaseCheckboxProps {
  modelValue: boolean
  value?: string
  disabled?: boolean
  id?: string
  name?: string
  label?: string
  required?: boolean
  helperText?: string
  error?: string
  size?: Size3
  rounded?: Exclude<Rounded, 'none'>
}

export interface BaseCheckboxEvents {
  'update:modelValue': [value: boolean]
}

export interface BaseRadioProps {
  modelValue: string
  value: string
  name: string
  disabled?: boolean
  id?: string
  label?: string
  required?: boolean
  helperText?: string
  error?: string
  size?: Size3
  rounded?: Exclude<Rounded, 'none'>
}

export interface BaseRadioEvents {
  'update:modelValue': [value: string]
}

export interface BaseSelectProps {
  modelValue: string
  disabled?: boolean
  error?: string
  id?: string
  name?: string
  label?: string
  required?: boolean
  helperText?: string
  size?: Size3
  rounded?: Exclude<Rounded, 'none' | 'sm'>
}

export interface BaseSelectEvents {
  'update:modelValue': [value: string]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}

export interface BaseTextareaProps {
  modelValue: string
  label?: string
  placeholder?: string
  helperText?: string
  error?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  rows?: number
  maxlength?: number
  id?: string
  name?: string
  ariaLabel?: string
  size?: Size3
  rounded?: Exclude<Rounded, 'none' | 'sm'>
}

export interface BaseTextareaEvents {
  'update:modelValue': [value: string]
  input: [event: Event]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
  keyup: [event: KeyboardEvent]
}

export interface BaseRangeSliderProps {
  modelValue: [number, number]
  min: number
  max: number
  step?: number
  label?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
  error?: string
  formatter?: (value: number) => string
  size?: Size3
  rounded?: Exclude<Rounded, 'none' | 'sm'>
}

export interface BaseRangeSliderEvents {
  'update:modelValue': [value: [number, number]]
}
