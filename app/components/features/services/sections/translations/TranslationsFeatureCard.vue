<template>
  <div
    class="service-info-card bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
  >
    <div class="flex items-center justify-center mb-3 sm:mb-4">
      <Icon :name="icon" class="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
    </div>
    <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2 text-center leading-tight">
      {{ title }}
    </h3>
    <p class="text-sm text-gray-600 text-center flex-grow leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ServiceCard } from '~/types/features/services'

defineProps<ServiceCard>()
</script>

<style scoped>
.service-info-card {
  min-height: 200px;
}

@media (max-width: 767px) {
  .service-info-card {
    min-height: 180px;
  }
}
</style>
