<template>
  <component
    :is="tag"
    ref="rootEl"
    :href="href"
    :to="to"
    :type="isButton ? type : undefined"
    :disabled="isButton ? disabled || loading : undefined"
    :aria-disabled="!isButton && (disabled || loading) ? 'true' : undefined"
    :aria-label="ariaLabel"
    :tabindex="tabIndex"
    :class="[
      'inline-flex items-center justify-center transition-all duration-200 [touch-action:manipulation]',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses,
      roundedClasses,
      variantClasses,
      loading ? 'cursor-wait' : '',
    ]"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- Loading spinner -->
    <Icon
      v-if="loading"
      name="mdi:loading"
      :class="['animate-spin', iconSizeClasses]"
      :aria-hidden="true"
    />

    <!-- Icon -->
    <Icon
      v-else
      :name="icon"
      :class="iconSizeClasses"
      aria-hidden="true"
    />

    <!-- Screen reader text -->
    <span class="sr-only">{{ ariaLabel || 'Action button' }}</span>
  </component>
</template>

<script setup lang="ts">
import type { BaseIconButtonProps, BaseIconButtonEvents } from '~/types/ui'
import { ICON_BUTTON_VARIANT_CLASSES, useIconButtonSizeClasses } from '~/composables/ui'

const props = withDefaults(defineProps<BaseIconButtonProps>(), {
  variant: 'primary',
  size: 'md',
  shape: 'square',
  loading: false,
  disabled: false,
  type: 'button',
  preventDefault: false,
  stopPropagation: false,
})

const emit = defineEmits<BaseIconButtonEvents>()

const rootEl = ref<HTMLElement | ComponentPublicInstance | null>(null)

const tag = computed(() => {
  if (props.href) return 'a'
  if (props.to) return resolveComponent('NuxtLink')
  return 'button'
})

const isButton = computed(() => tag.value === 'button')

const sizeClassesConfig = useIconButtonSizeClasses(() => props.size)
const sizeClasses = computed(() => sizeClassesConfig.value.container)
const iconSizeClasses = computed(() => sizeClassesConfig.value.icon)

const effectiveRounded = computed(() => {
  if (props.rounded) return props.rounded
  return props.shape === 'circle' ? 'full' : 'md'
})

const roundedClasses = useRoundedClasses(effectiveRounded, { context: 'icon' })

const variantClasses = computed(() => {
  return ICON_BUTTON_VARIANT_CLASSES[props.variant] ?? ICON_BUTTON_VARIANT_CLASSES.primary
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
