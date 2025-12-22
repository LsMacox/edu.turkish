<template>
  <div :class="badgeClasses">
    <slot>{{ step }}</slot>
  </div>
</template>

<script setup lang="ts">
import type { SemanticColor, FormSize } from '~/types/ui'
import { SEMANTIC_COLOR_TOKENS } from '~/composables/ui'

export interface BaseStepBadgeProps {
  step?: number | string
  color?: SemanticColor
  size?: Exclude<FormSize, 'lg'>
}

const props = withDefaults(defineProps<BaseStepBadgeProps>(), {
  color: 'primary',
  size: 'md',
})

const sizeClasses = computed(() => {
  return props.size === 'sm' ? 'step-badge-sm' : 'step-badge'
})

const colorClasses = computed(() => {
  const colors = SEMANTIC_COLOR_TOKENS[props.color]
  return `${colors.bg} ${colors.text}`
})

const badgeClasses = computed(() => [sizeClasses.value, colorClasses.value])
</script>
