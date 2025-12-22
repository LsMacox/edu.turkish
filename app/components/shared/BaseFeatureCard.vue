<template>
  <div :class="containerClasses" :aria-label="ariaLabel">
    <!-- Icon/Step Container -->
    <div :class="iconWrapperClasses">
      <div v-if="step && !stepBadge" :class="stepContainerClasses">
        {{ step }}
      </div>
      <BaseIconBox
        v-else
        :icon="icon"
        variant="bordered"
        :color="iconColor"
        :size="iconSize"
      />
      <!-- Step badge overlay -->
      <div
        v-if="stepBadge"
        class="absolute -bottom-2 -right-2 step-badge"
        :class="stepBadgeColorClasses"
      >
        <Icon v-if="stepBadge.icon" :name="stepBadge.icon" class="text-white text-icon" />
        <span v-else-if="stepBadge.text" class="text-white text-sm font-bold">{{ stepBadge.text }}</span>
      </div>
    </div>

    <!-- Content -->
    <div :class="contentClasses">
      <p v-if="label" class="text-body-sm text-meta mb-1">{{ label }}</p>
      <h4 class="text-card-title">{{ title }}</h4>
      <p v-if="description" class="text-body-sm" :class="descriptionClasses">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BaseFeatureCardProps } from '~/types/ui'
import { SEMANTIC_COLOR_TOKENS } from '~/composables/ui'

const props = withDefaults(defineProps<BaseFeatureCardProps>(), {
  iconColor: 'primary',
  iconSize: 'md',
  layout: 'vertical',
  centered: true,
})

const alignClasses = useAlignClasses(() => props.centered ? 'center' : 'left', { context: 'text', defaultAlign: 'center' })
const itemsAlignClasses = useAlignClasses(() => props.centered ? 'center' : 'left', { context: 'items', defaultAlign: 'center' })

const containerClasses = computed(() => {
  const base = 'flex'
  
  if (props.layout === 'horizontal') {
    return `${base} items-start gap-component-md`
  }
  
  return [
    base,
    'flex-col',
    itemsAlignClasses.value,
    alignClasses.value,
    'space-component-md',
  ].join(' ')
})

const iconWrapperClasses = computed(() => props.stepBadge ? 'relative' : '')

const colorTokens = computed(() => SEMANTIC_COLOR_TOKENS[props.iconColor])

const iconContainerSizeClasses = useIconContainerSizeClasses(() => props.iconSize)

const stepContainerClasses = computed(() => {
  return [
    iconContainerSizeClasses.value.container,
    iconContainerSizeClasses.value.text,
    colorTokens.value.bg,
    colorTokens.value.text,
    'font-bold',
  ].join(' ')
})

const stepBadgeColorClasses = computed(() => colorTokens.value.solid)

const contentClasses = computed(() => {
  if (props.layout === 'horizontal') {
    return 'flex-1 space-component-sm'
  }
  return 'space-component-sm'
})

const descriptionClasses = computed(() => {
  if (props.centered && props.layout === 'vertical') {
    return 'max-w-xs'
  }
  return ''
})
</script>
