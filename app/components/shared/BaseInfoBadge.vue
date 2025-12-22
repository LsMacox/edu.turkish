<template>
  <div :class="containerClasses">
    <Icon :name="icon" :class="iconClasses" />
  </div>
</template>

<script setup lang="ts">
import type { BaseInfoBadgeProps } from '~/types/ui'
import { SEMANTIC_COLOR_TOKENS } from '~/composables/ui'

const props = withDefaults(defineProps<BaseInfoBadgeProps>(), {
  color: 'primary',
  size: 'md',
})

const colorTokens = computed(() => SEMANTIC_COLOR_TOKENS[props.color])

const sizeMap = {
  sm: {
    container: 'toc-badge-sm',
    icon: 'text-icon-xs',
  },
  md: {
    container: 'toc-badge',
    icon: 'text-icon-sm',
  },
}

const containerClasses = computed(() => [
  sizeMap[props.size].container,
  colorTokens.value.bgSoft,
  'flex-shrink-0',
])

const iconClasses = computed(() => [
  sizeMap[props.size].icon,
  colorTokens.value.text,
])
</script>
