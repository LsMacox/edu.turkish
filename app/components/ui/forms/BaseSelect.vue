<template>
  <div class="relative">
    <select 
      :value="modelValue" 
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      :class="[
        'w-full px-4 pr-12 md:pr-10 bg-white border border-gray-300 rounded-xl',
        'focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none',
        'appearance-none cursor-pointer',
        'text-secondary font-medium',
        // Mobile/tablet responsive padding and height
        'py-4 md:py-3 text-base md:text-sm min-h-touch-48 md:min-h-auto',
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      ]"
      :disabled="disabled"
    >
      <slot />
    </select>
    <div class="absolute inset-y-0 right-0 flex items-center pr-4 md:pr-3 pointer-events-none">
      <Icon name="mdi:chevron-down" class="w-6 h-6 md:w-5 md:h-5 text-gray-400" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  disabled?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
