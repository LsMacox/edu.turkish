<template>
  <div :class="['flex items-center', alignClasses, spacingClasses]">
    <!-- Icon -->
    <Icon :name="icon" :class="[iconColorClasses, iconSizeClasses, 'flex-shrink-0']" />

    <!-- Text content -->
    <span :class="textClasses">
      <slot>{{ text }}</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BaseIconTextProps } from '~/types/ui'

const props = withDefaults(defineProps<BaseIconTextProps>(), {
  size: 'md',
  color: 'secondary',
  iconColor: 'primary',
  align: 'center',
  spacing: 'md',
  truncate: false,
  weight: 'normal',
})

// Alignment classes
const alignClasses = computed(() => {
  switch (props.align) {
    case 'start':
      return 'items-start'
    case 'end':
      return 'items-end'
    default: // center
      return 'items-center'
  }
})

// Spacing classes
const spacingClasses = computed(() => {
  switch (props.spacing) {
    case 'sm':
      return 'space-x-1'
    case 'lg':
      return 'space-x-3'
    default: // md
      return 'space-x-2'
  }
})

// Icon size classes
const iconSizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-4 h-4'
    case 'lg':
      return 'w-6 h-6'
    default: // md
      return 'w-5 h-5'
  }
})

// Icon color classes
const iconColorClasses = computed(() => {
  if (props.iconColor === 'inherit') return ''

  const colorMap = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    gray: 'text-gray-400',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  }

  return colorMap[props.iconColor] || colorMap.primary
})

// Text classes
const textClasses = computed(() => {
  const sizeMap = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const colorMap = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    gray: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  }

  const weightMap = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  return [
    sizeMap[props.size] || sizeMap.md,
    colorMap[props.color] || colorMap.secondary,
    weightMap[props.weight] || weightMap.normal,
    props.truncate ? 'truncate' : 'leading-relaxed',
  ].join(' ')
})
</script>
