<template>
  <component
    :is="tag"
    ref="rootEl"
    :href="href"
    :rel="href ? rel : undefined"
    :target="href ? target : undefined"
    :to="to"
    :type="isButton ? type : undefined"
    :disabled="isButton ? disabled || loading : undefined"
    :aria-disabled="!isButton && (disabled || loading) ? 'true' : undefined"
    :aria-label="ariaLabel"
    :tabindex="tabIndex"
    :class="[
      'inline-flex items-center justify-center transition-all duration-200 [touch-action:manipulation]',
      'focus:outline-none',
      !noFocusRing && 'focus:ring-2 focus:ring-offset-2 focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses,
      roundedClasses,
      variantClasses,
      fullWidth ? 'w-full' : '',
      loading ? 'cursor-wait' : '',
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
import type { BaseButtonProps, BaseButtonEvents } from '~/types/ui'

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
  noFocusRing: false,
})

const emit = defineEmits<BaseButtonEvents>()

const slots = useSlots()

const rootEl = ref<HTMLElement | ComponentPublicInstance | null>(null)

const iconOnly = computed(() => {
  return Boolean(props.icon) && !slots.default
})

const tag = computed(() => {
  if (props.href) return 'a'
  if (props.to) return resolveComponent('NuxtLink')
  return 'button'
})

const isButton = computed(() => tag.value === 'button')

const sizeClasses = useFormSizeClasses(() => props.size)
const roundedClasses = useRoundedClasses(() => props.rounded, { context: 'form', defaultSize: 'md' })

// Variant classes now moved to useVariant.ts
const variantClasses = useButtonVariantClasses(() => props.variant)

const iconSizeClasses = computed(() => {
  // Special cases for specific variants
  switch (props.variant) {
    case 'lightbox-close':
    case 'lightbox-nav':
      return 'text-2xl'
    case 'toast-close':
    case 'input-clear':
      return 'w-5 h-5'
    case 'icon-close-lg':
      return 'text-2xl'
    case 'icon-close-md':
      return 'text-xl'
    case 'icon-close-sm':
      return 'w-5 h-5'
  }
  
  // Default responsive icon sizes
  switch (props.size) {
    case 'sm':
      return 'w-4 h-4'
    case 'lg':
      return 'w-5 h-5 md:w-6 md:h-6'
    case 'xl':
      return 'w-6 h-6 md:w-7 md:h-7'
    default: // md
      return 'w-4 h-4 md:w-5 md:h-5'
  }
})

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
  if (event.key === 'Enter' || event.key === ' ') {
    if (!props.disabled && !props.loading) {
      event.preventDefault()
      handleClick(event)
    }
  }
}

const getElement = () => {
  if (!rootEl.value) return null
  if (rootEl.value instanceof HTMLElement) return rootEl.value
  const element = (rootEl.value as ComponentPublicInstance).$el
  return element instanceof HTMLElement ? element : null
}

const tabIndex = computed(() => {
  if (props.tabIndex !== undefined) return props.tabIndex
  // Use undefined for default to avoid mismatch if server/client disagree on disabled state
  if (props.disabled || props.loading) return -1
  return undefined
})

defineExpose({
  focus: () => getElement()?.focus(),
  blur: () => getElement()?.blur(),
})
</script>
