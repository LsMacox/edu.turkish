<template>
  <div :class="classes.container">
    <Icon v-if="icon" :name="icon" :class="classes.icon" />
    <span v-else-if="text" :class="textClasses">{{ text }}</span>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import type { StatusColor, StatusSize } from '~/types/ui'
import { getStatusBadgeClasses, STATUS_TEXT_COLORS } from '~/composables/ui'

interface Props {
  /** Icon name (e.g., 'ph:check', 'mdi:close') */
  icon?: string
  /** Text content (e.g., step number) */
  text?: string
  /** Color scheme */
  color?: StatusColor
  /** Badge size */
  size?: StatusSize
  /** Visual variant: solid (colored bg) or soft (light bg) */
  variant?: 'solid' | 'soft'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'success',
  size: 'sm',
  variant: 'solid',
})

const classes = computed(() => getStatusBadgeClasses(props.color, props.size, props.variant))

const textClasses = computed(() => {
  const sizeMap = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
  }
  return [
    sizeMap[props.size],
    'font-bold',
    props.variant === 'solid' ? 'text-white' : STATUS_TEXT_COLORS[props.color],
  ]
})
</script>
