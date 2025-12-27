<template>
  <div class="relative">
    <!-- Enhanced label with required indicator -->
    <BaseFieldLabel :label="label" :for-id="elementId" :required="required" :size="size" />

    <!-- Input wrapper -->
    <div class="relative">
      <input
        :id="elementId"
        :name="elementName"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="inputReadonly"
        :min="min"
        :max="max"
        :step="step"
        :maxlength="maxlength"
        :autocomplete="autocompleteAttr"
        :inputmode="inputModeAttr"
        :enterkeyhint="enterKeyHintAttr"
        :autocapitalize="autoCapitalizeAttr"
        :autocorrect="autoCorrectAttr"
        :spellcheck="spellcheckAttr"
        :aria-label="ariaLabel || label"
        :aria-describedby="
          error ? `${elementId}-error` : helperText ? `${elementId}-helper` : undefined
        "
        :aria-required="required"
        :aria-invalid="!!error"
        :class="[
          'w-full bg-white border transition-all duration-200 appearance-none focus:outline-none',
          'font-medium text-secondary placeholder-gray-400',
          // Size-based styling
          sizeClasses,
          // Icon padding (also account for clearable)
          icon && iconPosition === 'left' ? '!pl-10' : 'pl-3 md:pl-4',
          icon && iconPosition === 'right' ? '!pr-10' : clearable ? '!pr-10' : 'pr-3 md:pr-4',
          // State-based styling
          disabled ? 'opacity-50 cursor-not-allowed bg-surface' : '',
          inputReadonly ? 'bg-surface cursor-default' : '',
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
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
        data-testid="icon"
      >
        <Icon
          :name="icon"
          :class="[ICON_SIZES.md, error ? 'text-red-400' : 'text-hint']"
        />
      </div>

      <!-- Right icon -->
      <div
        v-if="icon && iconPosition === 'right'"
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
        data-testid="icon"
      >
        <Icon
          :name="icon"
          :class="[ICON_SIZES.md, error ? 'text-red-400' : 'text-hint']"
        />
      </div>

      <!-- Clear button -->
      <BaseButton
        v-if="clearable && modelValue && !disabled && !inputReadonly"
        variant="input-clear"
        icon="mdi:close"
        :aria-label="t(key('common.clear'))"
        no-focus-ring
        class="absolute inset-y-0 right-0 flex items-center"
        @click="handleClear"
      />
    </div>

    <!-- Enhanced error and helper text -->
    <BaseFieldMessage :error="error" :helper-text="helperText" :element-id="elementId" :size="size" />
  </div>
</template>

<script setup lang="ts">
import type { BaseTextFieldEvents, BaseTextFieldProps } from '~/types/ui'
import { key } from '~~/lib/i18n'
import { ICON_SIZES } from '~/composables/ui/useSize'

const { t } = useI18n()
const generatedId = useId()
const isFocused = ref(false)


const props = withDefaults(defineProps<BaseTextFieldProps>(), {
  type: 'text',
  iconPosition: 'left',
  size: 'md',
  clearable: false,
  readonly: false,
  required: false,
  disabled: false,
})

const elementId = computed(() => props.id ?? generatedId)
const elementName = computed(() => props.name ?? props.id ?? generatedId)

const inputReadonly = computed(() => props.readonly)

const emit = defineEmits<BaseTextFieldEvents>()

const sizeClasses = useFormSizeClasses(() => props.size)

const roundedClasses = useRoundedClasses(() => props.rounded, { context: 'form' })

const validationClasses = useValidationClasses({
  error: () => props.error,
  isFocused: () => isFocused.value,
})

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
  if (event.key === 'Escape' && props.clearable) {
    handleClear()
  }
  emit('keydown', event)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}

defineExpose({
  focus: () => {
    const input = document.getElementById(elementId.value) as HTMLInputElement | null
    input?.focus()
  },
  blur: () => {
    const input = document.getElementById(elementId.value) as HTMLInputElement | null
    input?.blur()
  },
  clear: handleClear,
})
</script>
