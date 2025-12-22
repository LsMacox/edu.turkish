<template>
  <div class="relative">
    <!-- Label with required indicator -->
    <BaseFieldLabel :label="label" :for-id="elementId" :required="required" :size="size" />

    <div class="relative">
      <select
        :id="elementId"
        :name="elementName"
        :value="modelValue"
        :class="[
          'w-full px-3 md:px-4 pr-9 md:pr-9 bg-white focus:outline-none appearance-none cursor-pointer text-secondary font-medium border',
          roundedClasses,
          sizeClasses,
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          validationClasses,
        ]"
        :aria-label="label"
        :aria-describedby="
          error ? `${elementId}-error` : helperText ? `${elementId}-helper` : undefined
        "
        :aria-required="required"
        :aria-invalid="!!error"
        :disabled="disabled"
        @change="handleChange"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      >
        <slot />
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
        <Icon name="mdi:chevron-down" class="text-icon text-hint" />
      </div>
    </div>

    <!-- Error and helper text -->
    <BaseFieldMessage :error="error" :helper-text="helperText" :element-id="elementId" :size="size" />
  </div>
</template>

<script setup lang="ts">
import type { BaseSelectProps, BaseSelectEvents } from '~/types/ui'

const props = withDefaults(defineProps<BaseSelectProps>(), {
  size: 'md',
  required: false,
  disabled: false,
})

const roundedClasses = useRoundedClasses(() => props.rounded, { context: 'form' })

const validationClasses = useValidationClasses({
  error: () => props.error,
})

const generatedId = useId()
const elementId = computed(() => props.id ?? generatedId)
const elementName = computed(() => props.name ?? props.id ?? generatedId)

// Size classes - using centralized form size classes
const sizeClasses = useFormSizeClasses(() => props.size)

const emit = defineEmits<BaseSelectEvents>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
  emit('change', event)
}
</script>
