<template>
  <div class="flex flex-col items-center text-center space-y-4">
    <!-- Icon Circle -->
    <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
      <Icon :name="factor.icon" class="text-primary text-3xl" />
    </div>

    <!-- Factor Content -->
    <div class="space-y-2">
      <h4 class="font-bold text-lg text-secondary">
        {{ factor.title }}
      </h4>
      <p class="text-gray-600 text-sm leading-relaxed max-w-xs">
        {{ factor.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TrustFactor } from '~/types/features/services'

defineProps<{ factor: TrustFactor }>()
</script>
