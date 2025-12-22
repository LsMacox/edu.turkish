<template>
  <BaseCard padding="md" shadow="md" rounded="xl" hover="lift" class="text-center">
    <BaseIconBox
      :icon="icon"
      :color="color"
      :size="iconSize"
      variant="soft"
      class="mx-auto mb-component-sm"
    />
    <h3 class="text-card-title mb-component-xs">{{ title }}</h3>
    <p class="text-body-sm">{{ value }}</p>
  </BaseCard>
</template>

<script setup lang="ts">
import type { SemanticColor, Size5 } from '~/types/ui'

withDefaults(defineProps<{
  icon: string
  color?: SemanticColor
  title: string
  value: string
  iconSize?: Size5
}>(), {
  color: 'primary',
  iconSize: 'md',
})
</script>
