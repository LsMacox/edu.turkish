<template>
  <div class="relative">
    <!-- Label with required indicator -->
    <BaseFieldLabel :label="label" :for-id="elementId" :required="required" :size="size" />

    <!-- Textarea -->
    <textarea
      :id="elementId"
      :name="elementName"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :rows="rows"
      :maxlength="maxlength"
      :aria-label="ariaLabel || label"
      :aria-describedby="
        error ? `${elementId}-error` : helperText ? `${elementId}-helper` : undefined
      "
      :aria-required="required"
      :aria-invalid="!!error"
      :class="[
        'w-full bg-white border transition-all duration-200 focus:outline-none',
        'font-medium text-secondary placeholder-gray-400',
        'px-3 md:px-4',
        sizeClasses,
        roundedClasses,
        'min-h-touch-44',
        // State-based styling
        disabled ? 'opacity-50 cursor-not-allowed bg-surface' : '',
        readonly ? 'bg-surface cursor-default' : '',
        // Validation styling
        validationClasses,
      ]"
      @input="handleInput"
      @change="$emit('change', $event)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      @keydown="$emit('keydown', $event)"
      @keyup="$emit('keyup', $event)"
    ></textarea>

    <!-- Error and helper text -->
    <BaseFieldMessage :error="error" :helper-text="helperText" :element-id="elementId" :size="size" />
  </div>
</template>

<script setup lang="ts">
import type { BaseTextareaProps, BaseTextareaEvents } from '~/types/ui'

const props = withDefaults(defineProps<BaseTextareaProps>(), {
  rows: 4,
  required: false,
  disabled: false,
  readonly: false,
  size: 'md',
})

const sizeClasses = useFormSizeClasses(() => props.size)

const roundedClasses = useRoundedClasses(() => props.rounded, { context: 'form' })

const validationClasses = useValidationClasses({
  error: () => props.error,
})

const generatedId = useId()
const elementId = computed(() => props.id ?? generatedId)
const elementName = computed(() => props.name ?? props.id ?? generatedId)

const emit = defineEmits<BaseTextareaEvents>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('input', event)
}
</script>
