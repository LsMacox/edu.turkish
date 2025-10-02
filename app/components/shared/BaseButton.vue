<!--
/**
 * BaseButton Component
 * 
 * Versatile button component with multiple variants, sizes, and states.
 * Supports icons, loading states, and accessibility features.
 * 
 * @component BaseButton
 * @example
 * ```vue
 * <BaseButton variant="primary" @click="handleClick">
 *   Save Changes
 * </BaseButton>
 * ```
 * 
 * @example With icon and loading
 * ```vue
 * <BaseButton 
 *   variant="outline" 
 *   icon="mdi:download" 
 *   :loading="isDownloading"
 *   @click="downloadFile"
 * >
 *   Download File
 * </BaseButton>
 * ```
 * 
 * @example As link
 * ```vue
 * <BaseButton 
 *   variant="ghost" 
 *   to="/about"
 *   icon="mdi:information"
 * >
 *   Learn More
 * </BaseButton>
 * ```
 */
-->
<template>
  <component
    :is="tag"
    ref="rootEl"
    :href="href"
    :to="to"
    :type="type"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedBy"
    :aria-pressed="ariaPressed"
    :aria-expanded="ariaExpanded"
    :aria-haspopup="ariaHaspopup"
    :aria-controls="ariaControls"
    :tabindex="tabIndex"
    :class="[
      'inline-flex items-center justify-center font-semibold transition-all duration-200 touch-manipulation',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      // Enhanced keyboard focus styling
      'focus-visible:ring-2 focus-visible:ring-offset-2',
      sizeClasses,
      variantClasses,
      fullWidth ? 'w-full' : '',
      loading ? 'cursor-wait' : '',
      // Ensure minimum touch target size
      'min-h-touch-44 min-w-touch-44',
    ]"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- Loading spinner with accessibility -->
    <Icon
      v-if="loading"
      name="mdi:loading"
      :class="[
        'animate-spin',
        iconSizeClasses,
        (icon && iconPosition === 'left') || $slots.default ? 'mr-2' : '',
      ]"
      :aria-hidden="true"
    />

    <!-- Loading text for screen readers -->
    <span v-if="loading" class="sr-only">{{ loadingText || 'Loading...' }}</span>

    <!-- Left icon -->
    <Icon
      v-else-if="icon && iconPosition === 'left'"
      :name="icon"
      :class="[iconSizeClasses, $slots.default ? 'mr-2' : '']"
      :aria-hidden="!iconOnly"
      :aria-label="iconOnly ? ariaLabel || 'Action button' : undefined"
    />

    <!-- Button content -->
    <span v-if="$slots.default" :class="loading ? 'opacity-75' : ''">
      <slot />
    </span>

    <!-- Right icon -->
    <Icon
      v-if="!loading && icon && iconPosition === 'right'"
      :name="icon"
      :class="[iconSizeClasses, $slots.default ? 'ml-2' : '']"
      :aria-hidden="!iconOnly"
      :aria-label="iconOnly ? ariaLabel || 'Action button' : undefined"
    />

    <!-- Screen reader text for icon-only buttons -->
    <span v-if="iconOnly && !$slots.default" class="sr-only">
      {{ ariaLabel || 'Action button' }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, type ComponentPublicInstance } from 'vue'
import type { BaseButtonProps, BaseButtonEvents } from '../../types/ui'

const props = withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  fullWidth: false,
  iconPosition: 'left',
  type: 'button',
  preventDefault: false,
  stopPropagation: false,
})

const emit = defineEmits<BaseButtonEvents>()

const slots = useSlots()

const rootEl = ref<HTMLElement | ComponentPublicInstance | null>(null)

// Determine if this is an icon-only button
const iconOnly = computed(() => {
  return Boolean(props.icon) && !slots.default
})

// Determine which component/tag to render
const tag = computed(() => {
  if (props.href) return 'a'
  if (props.to) return 'NuxtLink'
  return 'button'
})

// Size-based classes
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'btn-padding-sm text-sm rounded-lg'
    case 'lg':
      return 'btn-padding-lg text-lg rounded-xl'
    case 'xl':
      return 'btn-padding-xl text-xl rounded-2xl min-h-touch-48'
    default: // md
      return 'btn-padding-md text-base rounded-xl'
  }
})

// Icon size based on button size
const iconSizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-4 h-4'
    case 'lg':
      return 'w-6 h-6'
    case 'xl':
      return 'w-7 h-7'
    default: // md
      return 'w-5 h-5'
  }
})

// Variant-based classes with enhanced focus states
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return [
        'bg-white text-secondary border border-gray-300',
        'hover:bg-gray-50 hover:border-gray-400',
        'focus:ring-gray-500 focus-visible:ring-gray-500',
      ].join(' ')
    case 'outline':
      return [
        'bg-transparent text-primary border border-primary',
        'hover:bg-primary hover:text-white',
        'focus:ring-primary focus-visible:ring-primary',
      ].join(' ')
    case 'ghost':
      return [
        'bg-transparent text-primary border border-transparent',
        'hover:bg-red-50 hover:text-red-600',
        'focus:ring-primary focus-visible:ring-primary',
      ].join(' ')
    default: // primary
      return [
        'bg-primary text-white border border-primary',
        'hover:bg-red-600 hover:border-red-600',
        'focus:ring-primary focus-visible:ring-primary',
      ].join(' ')
  }
})

// Enhanced event handlers
const handleClick = (event: Event) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  if (props.preventDefault) {
    event.preventDefault()
  }

  if (props.stopPropagation) {
    event.stopPropagation()
  }

  emit('click', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  // Activate button on Enter or Space
  if (event.key === 'Enter' || event.key === ' ') {
    if (!props.disabled && !props.loading) {
      event.preventDefault()
      handleClick(event)
    }
  }
}

// Expose methods for parent component access
const getElement = () => {
  if (!rootEl.value) {
    return null
  }

  if (rootEl.value instanceof HTMLElement) {
    return rootEl.value
  }

  const element = (rootEl.value as ComponentPublicInstance).$el
  return element instanceof HTMLElement ? element : null
}

defineExpose({
  focus: () => {
    getElement()?.focus()
  },
  blur: () => {
    getElement()?.blur()
  },
})
</script>
