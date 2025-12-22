<template>
  <div :class="['relative', disabled && 'opacity-50 cursor-not-allowed']" :style="{ '--thumb-size': sizeClasses.thumbSize }">
    <!-- Label with required indicator and value display -->
    <div :class="['flex items-center justify-between', labelSizeClasses.margin]">
      <BaseFieldLabel v-if="label" :label="label" :for-id="rangeInputId" :required="required" :size="size" no-margin />
      <span :class="sizeClasses.value"
        >{{ formatValue(modelValue[0]) }} - {{ formatValue(modelValue[1]) }}</span
      >
    </div>

    <div class="space-y-4">
      <div class="hidden sm:block relative h-6 isolate" style="z-index: 0; contain: layout">
        <!-- Track -->
        <div :class="['absolute w-full bg-surface-muted rounded-lg top-1/2 -translate-y-1/2', sizeClasses.track]" />

        <!-- Progress -->
        <div
          :class="['absolute bg-primary rounded-lg top-1/2 -translate-y-1/2', sizeClasses.track, error ? 'bg-red-500' : 'bg-primary']"
          :style="{
            left: `${((modelValue[0] - min) / (max - min)) * 100}%`,
            width: `${((modelValue[1] - modelValue[0]) / (max - min)) * 100}%`,
          }"
        />

        <!-- Single input that controls both handles -->
        <input
          :id="rangeInputId"
          ref="sliderRef"
          :name="rangeInputId"
          type="range"
          :min="min"
          :max="max"
          :step="step"
          :value="activeHandle === 'min' ? modelValue[0] : modelValue[1]"
          :disabled="disabled"
          :class="['absolute w-full bg-transparent appearance-none top-1/2 -translate-y-1/2 slider-thumb', sizeClasses.track, disabled ? 'cursor-not-allowed' : 'cursor-pointer']"
          :aria-describedby="
            error ? `${elementId}-error` : helperText ? `${elementId}-helper` : undefined
          "
          :aria-required="required"
          :aria-invalid="!!error"
          style="z-index: 1"
          @input="handleInput"
          @mousedown="handleMouseDown"
        />
      </div>

      <!-- Input fields -->
      <div class="flex items-center gap-component-md">
        <input
          :id="minInputId"
          :name="minInputId"
          :value="modelValue[0]"
          type="number"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          :class="[
            'border input-focus',
            roundedClasses,
            sizeClasses.numberInput,
            error ? 'border-red-300' : 'border-gray-300',
            disabled ? 'cursor-not-allowed bg-surface' : '',
          ]"
          @input="updateMinInput"
        />
        <div :class="['flex-1 text-center text-hint', sizeClasses.separator]">{{ t(key('range.to')) }}</div>
        <input
          :id="maxInputId"
          :name="maxInputId"
          :value="modelValue[1]"
          type="number"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          :class="[
            'border input-focus',
            roundedClasses,
            sizeClasses.numberInput,
            error ? 'border-red-300' : 'border-gray-300',
            disabled ? 'cursor-not-allowed bg-surface' : '',
          ]"
          @input="updateMaxInput"
        />
      </div>
    </div>

    <!-- Error and helper text -->
    <BaseFieldMessage :error="error" :helper-text="helperText" :element-id="elementId" :size="size" />
  </div>
</template>

<script setup lang="ts">
import { key } from '~~/lib/i18n'
import type { BaseRangeSliderProps, BaseRangeSliderEvents } from '~/types/ui'

const props = withDefaults(defineProps<BaseRangeSliderProps>(), {
  size: 'md',
  required: false,
  disabled: false,
})

const roundedClasses = useRoundedClasses(() => props.rounded, { context: 'form' })

const emit = defineEmits<BaseRangeSliderEvents>()

const sliderRef = ref<HTMLInputElement>()
const activeHandle = ref<'min' | 'max'>('min')

const { t } = useI18n()

const elementId = useId()
const rangeInputId = `${elementId}-range`
const minInputId = `${elementId}-min`
const maxInputId = `${elementId}-max`

const sizeClasses = useRangeSliderSizeClasses(() => props.size)
const labelSizeClasses = useFieldLabelSizeClasses(() => props.size)

const formatValue = (value: number) => {
  if (props.formatter) return props.formatter(value)
  return value.toLocaleString()
}

const updateMinInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  if (value >= props.min && value <= props.modelValue[1]) {
    emit('update:modelValue', [value, props.modelValue[1]])
  }
}

const updateMaxInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  if (value <= props.max && value >= props.modelValue[0]) {
    emit('update:modelValue', [props.modelValue[0], value])
  }
}

const handleMouseDown = (event: MouseEvent) => {
  if (!sliderRef.value) return

  const rect = sliderRef.value.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  const value = props.min + percent * (props.max - props.min)

  // Определяем какой ползунок ближе к точке клика
  const minDistance = Math.abs(value - props.modelValue[0])
  const maxDistance = Math.abs(value - props.modelValue[1])

  activeHandle.value = minDistance <= maxDistance ? 'min' : 'max'
}

const handleInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)

  if (activeHandle.value === 'min') {
    if (value <= props.modelValue[1]) {
      emit('update:modelValue', [value, props.modelValue[1]])
    }
  } else {
    if (value >= props.modelValue[0]) {
      emit('update:modelValue', [props.modelValue[0], value])
    }
  }
}
</script>
