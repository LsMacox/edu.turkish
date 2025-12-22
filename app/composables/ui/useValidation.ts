import { computed, type MaybeRefOrGetter, toValue } from 'vue'

export interface ValidationClassesOptions {
  error: MaybeRefOrGetter<string | undefined>
  success?: MaybeRefOrGetter<boolean>
  isFocused?: MaybeRefOrGetter<boolean>
}

const VALIDATION_CLASSES = {
  error: 'border-red-300 input-focus-error',
  success: 'border-success input-focus-success',
  focused: 'border-primary input-focus',
  default: 'border-gray-300 input-focus',
} as const

export function useValidationClasses(options: ValidationClassesOptions) {
  return computed(() => {
    const error = toValue(options.error)
    const success = toValue(options.success) ?? false
    const isFocused = toValue(options.isFocused) ?? false

    if (error) {
      return VALIDATION_CLASSES.error
    }
    if (success) {
      return VALIDATION_CLASSES.success
    }
    if (isFocused) {
      return VALIDATION_CLASSES.focused
    }
    return VALIDATION_CLASSES.default
  })
}

export { VALIDATION_CLASSES }
