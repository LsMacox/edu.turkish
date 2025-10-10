<template>
  <label class="flex items-center cursor-pointer py-1 min-h-touch-44 md:min-h-auto">
    <input
      :checked="checked"
      type="checkbox"
      :value="value"
      :class="[
        'w-5 h-5 md:w-4 md:h-4 text-primary bg-white border-gray-300 rounded flex-shrink-0',
        'focus:ring-2 focus:ring-primary focus:ring-offset-0',
        'transition-colors duration-200',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ]"
      :disabled="disabled"
      @change="$emit('update:checked', ($event.target as HTMLInputElement).checked)"
    />
    <span
      :class="[
        'ml-3 text-xs md:text-sm font-medium leading-snug',
        disabled ? 'text-gray-400' : 'text-secondary',
      ]"
    >
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  checked: boolean
  value?: string
  disabled?: boolean
}>()

defineEmits<{
  (e: 'update:checked', value: boolean): void
}>()
</script>
