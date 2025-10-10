<template>
  <span
    :class="[
      'inline-flex items-center font-medium rounded-lg',
      sizeClasses,
      colorClasses,
      removable ? 'pr-1' : '',
    ]"
  >
    <!-- Icon (if provided) -->
    <Icon v-if="icon" :name="icon" :class="[iconSizeClasses, $slots.default ? 'mr-1' : '']" />

    <!-- Badge content -->
    <slot />

    <!-- Remove button (if removable) -->
    <button
      v-if="removable"
      :class="[
        'ml-1 inline-flex items-center justify-center rounded-full',
        'hover:opacity-75 focus:outline-none transition-opacity',
        removeButtonClasses,
      ]"
      :aria-label="removeLabel"
      @click="handleRemove"
    >
      <Icon name="mdi:close" :class="removeIconClasses" />
    </button>
  </span>
</template>

<script setup lang="ts">
import type { BaseBadgeProps } from '~/types/ui'

const props = withDefaults(defineProps<BaseBadgeProps>(), {
  color: 'neutral',
  size: 'md',
  variant: 'soft',
  removable: false,
  removeLabel: 'Remove',
})

const emit = defineEmits<{
  remove: []
}>()

// Size-based classes
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2 py-0.5 text-xs'
    case 'lg':
      return 'px-3 py-1 text-sm'
    default: // md
      return 'px-2 py-1 text-xs'
  }
})

// Icon size based on badge size
const iconSizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-3 h-3'
    case 'lg':
      return 'w-4 h-4'
    default: // md
      return 'w-3 h-3'
  }
})

// Remove button classes based on size
const removeButtonClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-3 h-3'
    case 'lg':
      return 'w-4 h-4'
    default: // md
      return 'w-3 h-3'
  }
})

// Remove icon classes based on size
const removeIconClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-2 h-2'
    case 'lg':
      return 'w-3 h-3'
    default: // md
      return 'w-2 h-2'
  }
})

// Color and variant-based classes
const colorClasses = computed(() => {
  const { color, variant } = props

  // Color mappings for different variants
  const colorMap = {
    primary: {
      solid: 'bg-primary text-white',
      soft: 'bg-red-100 text-red-800',
      outline: 'border border-primary text-primary bg-transparent',
    },
    secondary: {
      solid: 'bg-secondary text-white',
      soft: 'bg-gray-100 text-gray-800',
      outline: 'border border-secondary text-secondary bg-transparent',
    },
    success: {
      solid: 'bg-green-600 text-white',
      soft: 'bg-green-100 text-green-800',
      outline: 'border border-green-600 text-green-600 bg-transparent',
    },
    warning: {
      solid: 'bg-yellow-600 text-white',
      soft: 'bg-yellow-100 text-yellow-800',
      outline: 'border border-yellow-600 text-yellow-600 bg-transparent',
    },
    error: {
      solid: 'bg-red-600 text-white',
      soft: 'bg-red-100 text-red-800',
      outline: 'border border-red-600 text-red-600 bg-transparent',
    },
    info: {
      solid: 'bg-blue-600 text-white',
      soft: 'bg-blue-100 text-blue-800',
      outline: 'border border-blue-600 text-blue-600 bg-transparent',
    },
    neutral: {
      solid: 'bg-gray-600 text-white',
      soft: 'bg-gray-100 text-gray-700',
      outline: 'border border-gray-300 text-gray-700 bg-transparent',
    },
    gray: {
      solid: 'bg-gray-600 text-white',
      soft: 'bg-gray-100 text-gray-700',
      outline: 'border border-gray-300 text-gray-700 bg-transparent',
    },
  }

  return colorMap[color]?.[variant] || colorMap.neutral.soft
})

const handleRemove = () => {
  emit('remove')
}
</script>
