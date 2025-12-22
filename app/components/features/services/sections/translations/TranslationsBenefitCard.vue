<template>
  <BaseFeatureCard
    :icon="factor.icon"
    :title="factor.title"
    :description="factor.description"
    icon-color="primary"
    icon-size="md"
    layout="vertical"
    centered
  />
</template>

<script setup lang="ts">
import type { TrustFactor } from '~/types/features/services'

defineProps<{ factor: TrustFactor }>()
</script>
