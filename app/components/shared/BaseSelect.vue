<template>
  <div class="relative">
    <select
      :value="modelValue"
      :class="[
        'w-full px-3 md:px-4 pr-10 md:pr-10 bg-white rounded-xl focus:outline-none appearance-none cursor-pointer text-secondary font-medium',
        'py-3 md:py-3 text-sm md:text-sm min-h-touch-44 md:min-h-auto',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        error
          ? 'border border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
          : 'border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent',
      ]"
      :aria-invalid="!!error"
      :disabled="disabled"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <slot />
    </select>
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 md:pr-3 pointer-events-none">
      <Icon name="mdi:chevron-down" class="w-5 h-5 md:w-5 md:h-5 text-gray-400" />
    </div>
    <p v-if="error" class="mt-1.5 md:mt-2 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  disabled?: boolean
  error?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
