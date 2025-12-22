<template>
  <div class="flex items-start gap-component-md">
    <div
      :class="[
        'step-badge-sm flex-shrink-0 mt-1',
        stepBadgeClasses,
      ]"
    >
      <Icon v-if="icon" :name="icon" class="text-icon-sm" />
      <template v-else>{{ step }}</template>
    </div>
    <div class="flex-1">
      <h3 v-if="title" class="text-card-title mb-component-xs">
        {{ title }}
      </h3>
      <p v-if="description" class="text-body-sm">
        {{ description }}
      </p>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SemanticColor } from '~/types/ui'
import { SEMANTIC_COLOR_TOKENS } from '~/composables/ui'

interface Props {
  step?: number | string
  icon?: string
  title?: string
  description?: string
  color?: SemanticColor
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
})

const stepBadgeClasses = computed(() => {
  const tokens = SEMANTIC_COLOR_TOKENS[props.color]
  return `${tokens.solid} text-white`
})
</script>
