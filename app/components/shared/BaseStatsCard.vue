<template>
  <BaseCard :padding="padding" :shadow="shadow" :rounded="rounded">
    <div :class="['grid text-center', gridClasses]">
      <div v-for="stat in stats" :key="stat.label" class="space-y-1">
        <p :class="['text-card-title', valueColorClass]">
          {{ stat.value }}
        </p>
        <p class="text-body-sm">{{ stat.label }}</p>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { BaseStatsCardProps } from '~/types/ui'
import { SEMANTIC_TEXT_COLORS } from '~/composables/ui'

const props = withDefaults(defineProps<BaseStatsCardProps>(), {
  columns: 3,
  padding: 'md',
  shadow: 'md',
  rounded: 'lg',
  valueColor: 'primary',
})

const gridClasses = computed(() => {
  const cols = {
    2: 'grid-cols-2 gap-component-md',
    3: 'grid-cols-3 gap-component-lg',
    4: 'grid-cols-4 gap-component-lg',
  }
  return cols[props.columns]
})

const valueColorClass = computed(() => {
  return SEMANTIC_TEXT_COLORS[props.valueColor] || SEMANTIC_TEXT_COLORS.primary
})
</script>
