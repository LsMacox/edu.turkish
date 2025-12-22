<template>
  <component :is="tag" :class="gridClasses">
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { BaseGridProps } from '~/types/ui'

const props = withDefaults(defineProps<BaseGridProps>(), {
  cols: 1,
  gap: 'md',
  align: 'stretch',
  tag: 'div',
})

const gridClasses = useGridClasses({
  cols: () => props.cols,
  md: () => props.md,
  lg: () => props.lg,
  xl: () => props.xl,
  gap: () => props.gap,
  align: () => props.align,
})
</script>
