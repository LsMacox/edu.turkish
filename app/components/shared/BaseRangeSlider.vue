<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-secondary">{{ label }}</span>
      <span class="text-sm text-gray-600"
        >{{ formatValue(modelValue[0]) }} - {{ formatValue(modelValue[1]) }}</span
      >
    </div>

    <div class="relative h-6 isolate" style="z-index: 0; contain: layout">
      <!-- Track -->
      <div class="absolute w-full h-2 bg-gray-200 rounded-lg top-1/2 -translate-y-1/2"/>

      <!-- Progress -->
      <div
        class="absolute h-2 bg-primary rounded-lg top-1/2 -translate-y-1/2"
        :style="{
          left: `${((modelValue[0] - min) / (max - min)) * 100}%`,
          width: `${((modelValue[1] - modelValue[0]) / (max - min)) * 100}%`,
        }"
      />

      <!-- Single input that controls both handles -->
      <input
        ref="sliderRef"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="activeHandle === 'min' ? modelValue[0] : modelValue[1]"
        class="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb top-1/2 -translate-y-1/2"
        style="z-index: 1"
        @input="handleInput"
        @mousedown="handleMouseDown"
      >
    </div>

    <!-- Input fields -->
    <div class="flex items-center gap-3">
      <input
        :value="modelValue[0]"
        type="number"
        :min="min"
        :max="max"
        :step="step"
        class="w-24 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
        @input="updateMinInput"
      >
      <div class="flex-1 text-center text-gray-400 text-sm">{{ t('range.to') }}</div>
      <input
        :value="modelValue[1]"
        type="number"
        :min="min"
        :max="max"
        :step="step"
        class="w-24 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
        @input="updateMaxInput"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: [number, number]
  min: number
  max: number
  step?: number
  label?: string
  formatter?: (value: number) => string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: [number, number]): void
}>()

const sliderRef = ref<HTMLInputElement>()
const activeHandle = ref<'min' | 'max'>('min')

const { t } = useI18n()

const formatValue = (value: number) => {
  if (props.formatter) return props.formatter(value)
  return `$${value.toLocaleString('en-US')}`
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

<style scoped>
.slider-thumb {
  outline: none;
}

.slider-thumb:focus {
  outline: none;
}

.slider-thumb::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #f44336;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  outline: none;
}

.slider-thumb::-webkit-slider-thumb:focus {
  outline: none;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}

.slider-thumb::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #f44336;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  border: none;
  outline: none;
}

.slider-thumb::-moz-range-thumb:focus {
  outline: none;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}
</style>
