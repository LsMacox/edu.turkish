// Enhanced component types for edu.turkish application

/**
 * Generic component slots interface
 */
export interface ComponentSlots {
  default?: any
  header?: any
  footer?: any
  actions?: any
  preTitle?: any
  title?: any
  subtitle?: any
}

/**
 * Generic component emits interface
 */
export type ComponentEmits<T = Record<string, any[]>> = {
  [K in keyof T]: T[K]
}

/**
 * Form validation rule interface
 */
export interface ValidationRule {
  type: 'required' | 'pattern' | 'minLength' | 'maxLength' | 'min' | 'max' | 'custom'
  value?: any
  message: string
}

/**
 * Form field validation interface
 */
export interface FormValidation {
  required?: boolean
  pattern?: RegExp
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  customValidator?: (value: any) => boolean | string
  rules?: ValidationRule[]
}

/**
 * Generic data component interface
 */
export interface DataComponent<T> {
  data: T
  loading: boolean
  error?: string
}

/**
 * University card props interface (standardized)
 */
export interface UniversityCardProps {
  title: string
  city: string
  languages: string[]
  tuition: number
  badge?: BadgeData
  image?: string
  type?: UniversityType
  slug?: string
  featured?: boolean
}

/**
 * University badge data interface
 */
export interface BadgeData {
  label?: string
  labelKey?: string
  color: string
}

import type { UniversityType } from './domain'

/**
 * Enhanced text field props interface
 */
export interface TextFieldProps {
  modelValue: string | number
  label?: string
  helperText?: string
  error?: string
  required?: boolean
  readonly?: boolean
  disabled?: boolean
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  icon?: string
  validation?: FormValidation
  autocomplete?: string
  min?: string | number
  max?: string | number
  step?: string | number
}

/**
 * Component state types
 */
export type ComponentState = 'idle' | 'loading' | 'error' | 'success'

/**
 * Interactive component events interface
 */
export interface InteractiveComponentEvents {
  click: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown?: [event: KeyboardEvent]
  keyup?: [event: KeyboardEvent]
}

/**
 * Card component events interface
 */
export interface CardComponentEvents extends InteractiveComponentEvents {
  cardClick: [event: Event]
}

/**
 * Form component events interface
 */
export interface FormComponentEvents {
  'update:modelValue': [value: any]
  input: [event: Event]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown?: [event: KeyboardEvent]
  validate?: [isValid: boolean, errors?: string[]]
}

/**
 * University card subcomponent props
 */
export interface UniversityCardHeaderProps {
  title: string
  type?: UniversityType
  typeLabel?: string
  featured?: boolean
}

export interface UniversityCardDetailsProps {
  city: string
  languages: string[]
  tuition: number
  badge?: BadgeData
}

export interface UniversityCardActionsProps {
  detailHref: string
  applyLabel?: string
  detailLabel?: string
}

/**
 * Enhanced component composition types
 */
export interface ComponentComposition {
  props: Record<string, any>
  emits: Record<string, any>
  slots: ComponentSlots
  expose?: Record<string, any>
}

/**
 * Enhanced accessibility props
 */
export interface EnhancedAccessibilityProps {
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaLabelledBy?: string
  ariaRequired?: boolean
  ariaInvalid?: boolean
  role?: string
  tabIndex?: number
  ariaExpanded?: boolean
  ariaHaspopup?: boolean
  ariaControls?: string
}

/**
 * Image component props with optimization
 */
export interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  sizes?: string
  loading?: 'lazy' | 'eager'
  format?: string
  quality?: number
  placeholder?: boolean
  class?: string
}

/**
 * Component animation configuration
 */
export interface ComponentAnimation {
  name: string
  duration?: number
  delay?: number
  easing?: string
  iterations?: number | 'infinite'
}

/**
 * Enhanced modal props
 */
export interface ModalComponentProps {
  isOpen: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  persistent?: boolean
  animation?: ComponentAnimation
}

/**
 * Toast notification types and props
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: number
  message: string
  title?: string
  type: ToastType
  duration?: number
  persistent?: boolean
  actions?: Array<{
    label: string
    action: () => void
    variant?: 'primary' | 'secondary'
  }>
}

/**
 * Filter component types
 */
export interface FilterOption {
  value: string
  label: string
  count?: number
  disabled?: boolean
}

export interface FilterProps {
  options: FilterOption[]
  modelValue: string | string[]
  multiple?: boolean
  searchable?: boolean
  placeholder?: string
  clearable?: boolean
}

/**
 * Export namespace for organized imports
 */
// Note: avoid namespaces in ES modules to satisfy lint rules
export type ComponentTypesUniversityCard = UniversityCardProps
export type ComponentTypesTextField = TextFieldProps
export type ComponentTypesModal = ModalComponentProps
export type ComponentTypesToast = ToastProps
export type ComponentTypesFilter = FilterProps