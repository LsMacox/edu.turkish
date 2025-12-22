<template>
  <div class="relative">
    <!-- External label with required indicator (for form layout consistency) -->
    <BaseFieldLabel v-if="!$slots.default" :label="label" :for-id="elementId" :required="required" :size="size" />

    <label :class="['flex items-center cursor-pointer py-1', sizeClasses.container]">
      <input
        :id="elementId"
        :name="name"
        :checked="modelValue === value"
        type="radio"
        :value="value"
        :class="[
          'text-primary bg-white border border-gray-300 flex-shrink-0 input-focus',
          roundedClasses,
          'transition-color-fast accent-primary',
          sizeClasses.input,
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ]"
        :aria-describedby="
          error ? `${elementId}-error` : helperText ? `${elementId}-helper` : undefined
        "
        :aria-required="required"
        :aria-invalid="!!error"
        :disabled="disabled"
        @change="$emit('update:modelValue', value)"
      />
      <span
        :class="[
          `ml-3 font-medium ${LABEL_LINE_HEIGHT}`,
          sizeClasses.text,
          disabled ? 'text-hint' : 'text-secondary',
        ]"
      >
        <!-- Use label prop if no slot content, otherwise use slot -->
        <template v-if="$slots.default">
          <slot />
        </template>
        <template v-else-if="label">
          {{ label }}
          <span v-if="required" class="text-error ml-1" aria-label="required">*</span>
        </template>
      </span>
    </label>

    <!-- Error and helper text -->
    <BaseFieldMessage :error="error" :helper-text="helperText" :element-id="elementId" :size="size" />
  </div>
</template>

<script setup lang="ts">
import type { BaseRadioProps, BaseRadioEvents } from '~/types/ui'
import { LABEL_LINE_HEIGHT } from '~/composables/ui/useSize'

const props = withDefaults(defineProps<BaseRadioProps>(), {
  disabled: false,
  size: 'md',
  required: false,
})

const generatedId = useId()
const elementId = computed(() => props.id ?? generatedId)

const sizeClasses = useCheckboxSizeClasses(() => props.size)
const roundedClasses = useRoundedClasses(() => props.rounded, { context: 'radio' })

defineEmits<BaseRadioEvents>()
</script>
