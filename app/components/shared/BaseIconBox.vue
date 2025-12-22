<template>
  <div :class="containerClasses">
    <Icon :name="icon" :class="iconClasses" />
  </div>
</template>

<script setup lang="ts">
import type { BaseIconBoxProps } from '~/types/ui'
import { SEMANTIC_COLOR_TOKENS } from '~/composables/ui'

const props = withDefaults(defineProps<BaseIconBoxProps>(), {
  variant: 'soft',
  color: 'primary',
  size: 'md',
  rounded: 'xl',
})

const roundedClasses = useRoundedClasses(() => props.rounded, { context: 'icon' })
const sizeClasses = useIconBadgeSizeClasses(() => props.size)

const colorTokens = computed(() => SEMANTIC_COLOR_TOKENS[props.color])

const containerClasses = computed(() => {
  const base = ['flex items-center justify-center', sizeClasses.value.container, roundedClasses.value]
  base.push(colorTokens.value.bg)

  if (props.variant === 'bordered') {
    base.push('border', colorTokens.value.border)
  }

  return base
})

const iconClasses = computed(() => {
  return [sizeClasses.value.icon, colorTokens.value.text]
})
</script>
