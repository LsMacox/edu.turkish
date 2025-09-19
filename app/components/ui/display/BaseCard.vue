<template>
  <component
    :is="tag"
    :href="href"
    :to="to"
    :role="role"
    :tabindex="tabIndex"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedBy"
    :aria-pressed="ariaPressed"
    :class="[
      'bg-white overflow-hidden',
      borderRadiusClasses,
      shadowClasses,
      paddingClasses,
      hoverClasses,
      fullHeight ? 'h-full' : '',
      bordered ? 'border border-gray-200' : '',
      clickable
        ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
        : '',
      // Enhanced keyboard navigation
      clickable
        ? 'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
        : '',
    ]"
    @click="handleClick"
    @keydown="handleKeydown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Header slot -->
    <div v-if="$slots.header" :class="headerClasses" :aria-label="headerAriaLabel">
      <slot name="header" />
    </div>

    <!-- Default content -->
    <div v-if="$slots.default" :class="contentClasses" :aria-label="contentAriaLabel">
      <slot />
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" :class="footerClasses" :aria-label="footerAriaLabel">
      <slot name="footer" />
    </div>

    <!-- Screen reader text for interactive cards -->
    <span v-if="clickable && !ariaLabel" class="sr-only">
      {{ clickableDescription || 'Interactive card - press Enter or Space to activate' }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BaseCardProps, BaseCardEvents } from '~/types/ui'

const props = withDefaults(defineProps<BaseCardProps>(), {
  padding: 'md',
  shadow: 'md',
  rounded: 'lg',
  hover: false,
  bordered: false,
  fullHeight: false,
  clickable: false,
})

const emit = defineEmits<BaseCardEvents>()

// Mouse interaction state
const isHovered = ref(false)

// Determine which component/tag to render
const tag = computed(() => {
  if (props.href) return 'a'
  if (props.to) return 'NuxtLink'
  if (props.clickable) return 'button'
  return 'div'
})

// Enhanced accessibility role
const role = computed(() => {
  if (props.clickable && tag.value === 'div') return 'button'
  if (props.href || props.to) return 'link'
  return props.role || undefined
})

// Tab index for keyboard navigation
const tabIndex = computed(() => {
  if (props.tabIndex !== undefined) return props.tabIndex
  if (props.clickable) return 0
  return undefined
})

// Padding classes (slightly tighter on small screens)
const paddingClasses = computed(() => {
  if (props.padding === 'none') return ''

  const paddingMap = {
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-5 md:p-8',
    xl: 'p-6 md:p-10',
  }

  return paddingMap[props.padding] || paddingMap.md
})

// Shadow classes with enhanced hover states
const shadowClasses = computed(() => {
  const shadowMap = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-lg',
    lg: 'shadow-xl',
    xl: 'shadow-2xl',
  }

  let baseClasses = shadowMap[props.shadow] || shadowMap.md

  // Enhanced shadow on hover for interactive cards
  if (props.clickable && isHovered.value && props.shadow !== 'none') {
    baseClasses += ' shadow-2xl'
  }

  return baseClasses
})

// Border radius classes
const borderRadiusClasses = computed(() => {
  const roundedMap = {
    none: '',
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    '2xl': 'rounded-3xl',
  }

  return roundedMap[props.rounded] || roundedMap.lg
})

// Enhanced hover effect classes
const hoverClasses = computed(() => {
  if (!props.hover) return props.clickable ? 'transition-all duration-300 ease-out' : ''

  const baseTransition = 'transition-all duration-300 ease-out'

  switch (props.hover) {
    case 'lift':
      return `${baseTransition} hover:-translate-y-1 hover:shadow-xl`
    case 'shadow':
      return `${baseTransition} hover:shadow-xl`
    case 'scale':
      return `${baseTransition} hover:scale-105`
    case true:
      // Default hover effect (lift)
      return `${baseTransition} hover:-translate-y-1 hover:shadow-xl`
    default:
      return baseTransition
  }
})

// Header classes (no padding since card handles it)
const headerClasses = computed(() => {
  return props.padding === 'none'
    ? 'px-4 py-3 border-b border-gray-200'
    : 'border-b border-gray-200 pb-4 mb-4'
})

// Content classes
const contentClasses = computed(() => {
  return props.padding === 'none' ? 'px-4 py-3' : ''
})

// Footer classes
const footerClasses = computed(() => {
  return props.padding === 'none'
    ? 'px-4 py-3 border-t border-gray-200'
    : 'border-t border-gray-200 pt-4 mt-4'
})

// Enhanced event handlers
const handleClick = (event: Event) => {
  if (props.clickable || props.href || props.to) {
    emit('click', event)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  // Activate card on Enter or Space for keyboard users
  if ((event.key === 'Enter' || event.key === ' ') && props.clickable) {
    event.preventDefault()
    handleClick(event)
  }
}

const handleMouseEnter = (event: MouseEvent) => {
  isHovered.value = true
  emit('mouseenter', event)
}

const handleMouseLeave = (event: MouseEvent) => {
  isHovered.value = false
  emit('mouseleave', event)
}

// Expose methods for parent component access
defineExpose({
  focus: () => {
    const card = event?.target as HTMLElement
    card?.focus()
  },
  blur: () => {
    const card = event?.target as HTMLElement
    card?.blur()
  },
})
</script>
