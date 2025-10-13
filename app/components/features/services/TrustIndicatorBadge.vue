<template>
  <div
    class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700"
  >
    <Icon v-if="indicator.icon" :name="indicator.icon" class="text-primary" />
    <span>{{ indicator.text }}</span>
  </div>
</template>

<script setup lang="ts">
import type { TrustIndicator } from '~/types/services'

interface Props {
  indicator: TrustIndicator
}

defineProps<Props>()
</script>
