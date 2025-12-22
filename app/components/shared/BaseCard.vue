<template>
  <component
    :is="tag"
    ref="cardRef"
    :href="href"
    :to="to"
    :role="role"
    :tabindex="tabIndex"
    :aria-label="ariaLabel"
    :class="[
      'bg-white overflow-hidden',
      borderRadiusClasses,
      shadowClasses,
      paddingClasses,
      hoverClasses,
      fullHeight ? 'h-full flex flex-col' : '',
      selectedClasses,
      !selected && effectiveBordered ? 'border border-default' : '',
      isInteractive
        ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
        : '',
      isInteractive
        ? 'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
        : '',
    ]"
    @click="handleClick"
    @keydown="handleKeydown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Header slot -->
    <div v-if="$slots.header" :class="headerClasses">
      <slot name="header" />
    </div>

    <!-- Default content -->
    <div v-if="$slots.default" :class="[contentClasses, fullHeight ? 'flex flex-col flex-1' : '']">
      <slot />
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </component>
</template>

<script setup lang="ts">
import type { BaseCardProps, BaseCardEvents } from '~/types/ui'
import { CARD_HOVER_CLASSES } from '~/composables/ui/useHover'
import { useCardBase } from '~/composables/ui/useCard'
import { useShadowClasses } from '~/composables/ui/useShadow'

const props = withDefaults(defineProps<BaseCardProps>(), {
  variant: 'default',
  rounded: 'lg',
  hover: false,
  fullHeight: false,
  clickable: false,
  selected: false,
})

const emit = defineEmits<BaseCardEvents>()

const {
  effectiveBordered,
  effectiveShadow,
  paddingClasses,
  borderRadiusClasses,
  headerClasses,
  contentClasses,
  footerClasses,
} = useCardBase(props)

const isHovered = ref(false)
const isInteractive = computed(() => props.clickable || props.href || props.to)

const NuxtLink = resolveComponent('NuxtLink')

const tag = computed(() => {
  if (props.href) return 'a'
  if (props.to) return NuxtLink
  if (props.clickable) return 'button'
  return 'div'
})

const role = computed(() => {
  if (props.clickable && tag.value === 'div') return 'button'
  if (props.href || props.to) return 'link'
  return undefined
})

const tabIndex = computed(() => {
  if (props.tabIndex !== undefined) return props.tabIndex
  if (props.clickable) return 0
  return undefined
})

const shadowClasses = useShadowClasses(() => effectiveShadow.value, {
  interactive: !!isInteractive.value,
  isHovered: isHovered,
})

const selectedClasses = computed(() => {
  if (!props.selected) return ''
  return 'border-2 border-primary bg-primary-soft'
})

const hoverClasses = computed(() => {
  const baseTransition = 'transition-default ease-out'
  
  if (!props.hover) {
    return isInteractive.value ? baseTransition : ''
  }

  // Use centralized hover classes
  if (props.hover === true) {
    return CARD_HOVER_CLASSES.lift
  }

  return CARD_HOVER_CLASSES[props.hover] ?? baseTransition
})

const handleClick = (event: Event) => {
  if (isInteractive.value) {
    emit('click', event)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
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

const cardRef = useTemplateRef<HTMLElement>('cardRef')

defineExpose({
  focus: () => cardRef.value?.focus(),
  blur: () => cardRef.value?.blur(),
  rootElement: cardRef,
})
</script>
