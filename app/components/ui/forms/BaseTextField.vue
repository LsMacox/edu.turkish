<!--
/**
 * BaseTextField Component
 * 
 * Enhanced text input component with validation, accessibility, and responsive design.
 * Supports various input types, icons, validation states, and helper text.
 * 
 * @component BaseTextField
 * @example
 * ```vue
 * <BaseTextField
 *   v-model="email"
 *   type="email"
 *   label="Email Address"
 *   placeholder="Enter your email"
 *   required
 *   icon="mdi:email"
 *   helper-text="We'll never share your email"
 * />
 * ```
 * 
 * @example With validation
 * ```vue
 * <BaseTextField
 *   v-model="password"
 *   type="password"
 *   label="Password"
 *   required
 *   :error="passwordError"
 *   helper-text="Must be at least 8 characters"
 * />
 * ```
 */
-->
<template>
  <div class="relative">
    <!-- Enhanced label with required indicator -->
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-secondary mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1" aria-label="required">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="relative">
      <input
        :id="inputId"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="inputReadonly"
        :min="min"
        :max="max"
        :step="step"
        :autocomplete="autocompleteAttr"
        :inputmode="inputModeAttr"
        :enterkeyhint="enterKeyHintAttr"
        :autocapitalize="autoCapitalizeAttr"
        :autocorrect="autoCorrectAttr"
        :spellcheck="spellcheckAttr"
        :aria-label="ariaLabel || label"
        :aria-describedby="
          ariaDescribedBy ||
          (error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined)
        "
        :aria-required="required"
        :aria-invalid="!!error"
        :class="[
          'w-full bg-white border transition-all duration-200 appearance-none',
          'focus:ring-2 focus:border-transparent focus:outline-none',
          'font-medium text-secondary placeholder-gray-400',
          // Size-based styling
          sizeClasses,
          // Icon padding
          icon ? (iconPosition === 'right' ? 'pr-12 md:pr-10' : 'pl-12 md:pl-10') : 'px-4',
          // State-based styling
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : '',
          inputReadonly ? 'bg-gray-50 cursor-default' : '',
          // Validation styling
          validationClasses,
          // Rounded corners
          roundedClasses,
        ]"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />

      <!-- Left icon -->
      <div
        v-if="icon && iconPosition === 'left'"
        class="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-3 pointer-events-none"
        data-testid="icon"
      >
        <Icon
          :name="icon"
          :class="['w-6 h-6 md:w-5 md:h-5', error ? 'text-red-400' : 'text-gray-400']"
        />
      </div>

      <!-- Right icon -->
      <div
        v-if="icon && iconPosition === 'right'"
        class="absolute inset-y-0 right-0 flex items-center pr-3 md:pr-3 pointer-events-none"
        data-testid="icon"
      >
        <Icon
          :name="icon"
          :class="['w-6 h-6 md:w-5 md:h-5', error ? 'text-red-400' : 'text-gray-400']"
        />
      </div>

      <!-- Clear button -->
      <button
        v-if="clearable && modelValue && !disabled && !inputReadonly"
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
        :aria-label="$t('common.clear') || 'Clear'"
        @click="handleClear"
      >
        <Icon name="mdi:close" class="w-5 h-5" />
      </button>
    </div>

    <!-- Enhanced error and helper text -->
    <div v-if="error || helperText" class="mt-2">
      <p
        v-if="error"
        :id="`${inputId}-error`"
        class="text-sm text-red-600 leading-relaxed flex items-start gap-1"
        role="alert"
        aria-live="polite"
      >
        <Icon name="mdi:alert-circle" class="w-4 h-4 mt-0.5 flex-shrink-0" />
        {{ error }}
      </p>
      <p
        v-else-if="helperText"
        :id="`${inputId}-helper`"
        class="text-sm text-gray-600 leading-relaxed"
      >
        {{ helperText }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * BaseTextField Component Script
 *
 * Provides enhanced text input functionality with:
 * - Real-time validation and error handling
 * - Accessibility features (ARIA labels, screen reader support)
 * - Responsive design with mobile-optimized touch targets
 * - Icon support with customizable positioning
 * - Clearable input option
 * - Multiple input types (text, email, password, etc.)
 *
 * @author edu.turkish development team
 * @since 1.0.0
 */

import { computed, useId, ref } from 'vue'
import type { BaseTextFieldProps } from '../../../types/ui'

// Generate unique ID for the input
const inputId = useId()
const isFocused = ref(false)

/**
 * Component props with enhanced interface and default values
 *
 * @interface BaseTextFieldProps
 * @property {string|number} modelValue - The current value of the input
 * @property {string} [type='text'] - Input type (text, email, password, number, tel, url)
 * @property {string} [label] - Label text displayed above the input
 * @property {string} [placeholder] - Placeholder text
 * @property {string} [helperText] - Helper text displayed below the input
 * @property {string} [error] - Error message to display
 * @property {boolean} [required=false] - Whether the field is required
 * @property {boolean} [disabled=false] - Whether the input is disabled
 * @property {boolean} [readonly=false] - Whether the input is read-only
 * @property {string} [icon] - Icon name to display
 * @property {'left'|'right'} [iconPosition='left'] - Position of the icon
 * @property {boolean} [clearable=false] - Whether to show clear button
 * @property {'sm'|'md'|'lg'} [size='md'] - Input size
 * @property {'sm'|'md'|'lg'|'xl'|'2xl'} [rounded='xl'] - Border radius
 */
const props = withDefaults(defineProps<BaseTextFieldProps>(), {
  type: 'text',
  iconPosition: 'left',
  size: 'md',
  rounded: 'xl',
  clearable: false,
  readonly: false,
  required: false,
  disabled: false,
})

// Avoid collision with Vue's global isReadonly() helper
const inputReadonly = computed(() => props.readonly)

/**
 * Component events
 *
 * @fires update:modelValue - Emitted when the input value changes
 * @fires input - Emitted on input event
 * @fires change - Emitted on change event
 * @fires focus - Emitted when input gains focus
 * @fires blur - Emitted when input loses focus
 * @fires keydown - Emitted on keydown event
 * @fires clear - Emitted when clear button is clicked
 */
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'input' | 'change', event: Event): void
  (e: 'focus' | 'blur', event: FocusEvent): void
  (e: 'keydown' | 'keyup', event: KeyboardEvent): void
  (e: 'clear'): void
}>()

// Computed classes
const sizeClasses = computed(() => {
  const sizes = {
    sm: 'py-2 md:py-2 text-sm min-h-touch-44',
    md: 'py-4 md:py-3 text-base md:text-sm min-h-touch-48 md:min-h-auto',
    lg: 'py-5 md:py-4 text-lg md:text-base min-h-touch-48',
  }
  return sizes[props.size] || sizes.md
})

const roundedClasses = computed(() => {
  const rounded = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  }
  return rounded[props.rounded] || rounded.xl
})

const validationClasses = computed(() => {
  if (props.error) {
    return 'border-red-300 focus:ring-red-500 focus:border-red-300'
  }
  if (isFocused.value) {
    return 'border-primary focus:ring-primary'
  }
  return 'border-gray-300 focus:ring-primary focus:border-transparent'
})

// Mobile-friendly input attributes
const inputModeAttr = computed(() => {
  switch (props.type) {
    case 'email':
      return 'email'
    case 'tel':
      return 'tel'
    case 'number':
      return 'decimal'
    case 'url':
      return 'url'
    default:
      return 'text'
  }
})

const autoCapitalizeAttr = computed(() => {
  switch (props.type) {
    case 'email':
    case 'password':
    case 'number':
    case 'tel':
    case 'url':
      return 'off'
    default:
      return 'sentences'
  }
})

const autoCorrectAttr = computed(() => {
  switch (props.type) {
    case 'email':
    case 'password':
    case 'number':
    case 'tel':
    case 'url':
      return 'off'
    default:
      return 'on'
  }
})

const spellcheckAttr = computed(() => {
  switch (props.type) {
    case 'email':
    case 'password':
    case 'number':
    case 'tel':
    case 'url':
      return false
    default:
      return true
  }
})

const enterKeyHintAttr = computed(() => {
  // Provide a sensible default; consumers can override via forms/buttons
  return 'done'
})

const autocompleteAttrByType = (type: string): string | undefined => {
  switch (type) {
    case 'email':
      return 'email'
    case 'password':
      return 'current-password'
    case 'tel':
      return 'tel'
    case 'url':
      return 'url'
    default:
      return undefined
  }
}

const autocompleteAttr = computed(() => {
  return props.autocomplete || autocompleteAttrByType(props.type)
})

// Event handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
  emit('input', event)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  // Clear on Escape key
  if (event.key === 'Escape' && props.clearable) {
    handleClear()
  }
  emit('keydown', event)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}

// Expose methods for parent component access
defineExpose({
  focus: () => {
    const input = document.getElementById(inputId) as HTMLInputElement
    input?.focus()
  },
  blur: () => {
    const input = document.getElementById(inputId) as HTMLInputElement
    input?.blur()
  },
  clear: handleClear,
})
</script>
