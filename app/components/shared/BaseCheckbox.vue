<template>
  <div class="relative">
    <!-- External label with required indicator (for form layout consistency) -->
    <BaseFieldLabel v-if="!$slots.default" :label="label" :for-id="elementId" :required="required" :size="size" />

    <label :class="['flex items-start cursor-pointer py-1 group', sizeClasses.container]">
      <input
        :id="elementId"
        :name="elementName"
        :checked="modelValue"
        type="checkbox"
        :value="value"
        :class="[
          'text-primary bg-white border border-gray-300 flex-shrink-0 mt-0.5 input-focus',
          roundedClasses,
          'transition-all duration-200',
          'checked:bg-primary checked:border-primary',
          'hover:border-primary',
          sizeClasses.input,
          disabled ? 'opacity-50 cursor-not-allowed hover:border-muted' : 'cursor-pointer',
        ]"
        :aria-describedby="
          error ? `${elementId}-error` : helperText ? `${elementId}-helper` : undefined
        "
        :aria-required="required"
        :aria-invalid="!!error"
        :disabled="disabled"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
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
import type { BaseCheckboxProps, BaseCheckboxEvents } from '~/types/ui'
import { LABEL_LINE_HEIGHT } from '~/composables/ui/useSize'

const props = withDefaults(defineProps<BaseCheckboxProps>(), {
  disabled: false,
  size: 'md',
  required: false,
})

const generatedId = useId()
const elementId = computed(() => props.id ?? generatedId)
const elementName = computed(() => props.name ?? props.id ?? generatedId)

const sizeClasses = useCheckboxSizeClasses(() => props.size)
const roundedClasses = useRoundedClasses(() => props.rounded, { context: 'checkbox' })

defineEmits<BaseCheckboxEvents>()
</script>
