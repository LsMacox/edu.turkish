<template>
  <BaseFeatureCard
    :icon="step.icon"
    :title="step.title"
    :description="step.description"
    :step="step.stepNumber"
    :step-badge="{ icon: step.icon }"
    icon-color="primary"
    icon-size="lg"
    layout="vertical"
    centered
    :aria-label="`Step ${step.stepNumber}`"
  />
</template>

<script setup lang="ts">
import type { ProcessStep } from '~/types/features/services'

defineProps<{ step: ProcessStep }>()
</script>
