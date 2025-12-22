<template>
  <div :class="['flex items-center', alignClasses, spacingClasses]">
    <!-- Icon -->
    <Icon :name="icon" :class="[iconColorClasses, sizeClasses.icon, 'flex-shrink-0']" />

    <!-- Text content -->
    <span :class="textClasses">
      <slot>{{ text }}</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { BaseIconTextProps } from '~/types/ui'
import { SEMANTIC_TEXT_COLORS } from '~/composables/ui'
import { LABEL_LINE_HEIGHT } from '~/composables/ui/useSize/index'

const props = withDefaults(defineProps<BaseIconTextProps>(), {
  size: 'md',
  color: 'secondary',
  iconColor: 'primary',
  align: 'center',
  spacing: 'md',
  truncate: false,
  weight: 'normal',
})

const alignClasses = useAlignClasses(() => props.align, { context: 'items', defaultAlign: 'center' })

const spacingClassMap: Record<string, string> = {
  xs: 'space-x-0.5',
  sm: 'space-x-1',
  md: 'space-x-2',
  lg: 'space-x-3',
}

const spacingClasses = computed(() => spacingClassMap[props.spacing] || spacingClassMap.md)

const sizeClasses = useIconTextSizeClasses(() => props.size)

// Icon color classes - using shared utility
const iconColorClasses = computed(() => {
  if (props.iconColor === 'inherit') return ''
  return SEMANTIC_TEXT_COLORS[props.iconColor] || SEMANTIC_TEXT_COLORS.primary
})

// Text classes - using shared utility for colors
const textClasses = computed(() => {
  const weightMap = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  return [
    sizeClasses.value.text,
    SEMANTIC_TEXT_COLORS[props.color] || SEMANTIC_TEXT_COLORS.secondary,
    weightMap[props.weight] || weightMap.normal,
    props.truncate ? 'truncate' : LABEL_LINE_HEIGHT,
  ].join(' ')
})
</script>
