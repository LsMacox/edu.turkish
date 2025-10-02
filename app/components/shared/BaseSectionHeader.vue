<template>
  <div :class="[containerClasses, marginClasses]">
    <!-- Pre-title (optional) -->
    <p v-if="preTitle || $slots.preTitle" :class="preTitleClasses">
      <slot name="preTitle">{{ preTitle }}</slot>
    </p>

    <!-- Main title -->
    <component :is="titleTag" v-if="title || $slots.title" :class="titleClasses">
      <slot name="title">{{ title }}</slot>
    </component>

    <!-- Subtitle -->
    <p v-if="subtitle || $slots.subtitle" :class="subtitleClasses">
      <slot name="subtitle">{{ subtitle }}</slot>
    </p>

    <!-- Action slot (e.g., buttons, links) -->
    <div v-if="$slots.action" :class="actionClasses">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BaseSectionHeaderProps } from '../../types/ui'

const props = withDefaults(defineProps<BaseSectionHeaderProps>(), {
  titleTag: 'h2',
  size: 'lg',
  align: 'center',
  marginBottom: 'lg',
  maxWidth: '2xl',
  balanced: true,
})

// Container classes
const containerClasses = computed(() => {
  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const maxWidthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  }

  return [
    alignMap[props.align] || alignMap.center,
    props.align === 'center' ? 'mx-auto' : '',
    maxWidthMap[props.maxWidth] || maxWidthMap['2xl'],
  ]
    .filter(Boolean)
    .join(' ')
})

// Margin bottom classes
const marginClasses = computed(() => {
  const marginMap = {
    none: '',
    sm: 'mb-4 md:mb-6',      // Mobile: 16px, Desktop: 24px
    md: 'mb-6 md:mb-8',      // Mobile: 24px, Desktop: 32px
    lg: 'mb-8 md:mb-12',     // Mobile: 32px, Desktop: 48px
    xl: 'mb-10 md:mb-16',    // Mobile: 40px, Desktop: 64px
  }

  return marginMap[props.marginBottom] || marginMap.lg
})

// Pre-title classes
const preTitleClasses = computed(() => {
  const sizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-sm',
    xl: 'text-base',
  }

  return [
    sizeMap[props.size] || sizeMap.lg,
    'text-primary font-semibold uppercase tracking-wider mb-2',
  ].join(' ')
})

// Title classes
const titleClasses = computed(() => {
  const sizeMap = {
    sm: 'text-xl md:text-2xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl lg:text-4xl',
    xl: 'text-4xl lg:text-5xl xl:text-6xl',
  }

  return [
    sizeMap[props.size] || sizeMap.lg,
    'font-bold text-secondary leading-tight',
    props.balanced ? 'text-balance' : '',
    props.subtitle || props.$slots?.subtitle ? 'mb-4' : '',
  ]
    .filter(Boolean)
    .join(' ')
})

// Subtitle classes
const subtitleClasses = computed(() => {
  const sizeMap = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  return [
    sizeMap[props.size] || sizeMap.lg,
    'text-gray-600 leading-relaxed',
    props.balanced ? 'text-balance' : '',
  ]
    .filter(Boolean)
    .join(' ')
})

// Action classes
const actionClasses = computed(() => {
  return [
    'mt-6',
    props.align === 'center' ? 'flex justify-center' : '',
    props.align === 'right' ? 'flex justify-end' : '',
  ]
    .filter(Boolean)
    .join(' ')
})
</script>
