<template>
  <BaseCard
    padding="md"
    shadow="md"
    rounded="md"
    hover="shadow"
    full-height
    class="service-info-card flex flex-col"
  >
    <div class="flex items-center justify-center mb-component-sm">
      <Icon :name="icon" class="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
    </div>
    <h3 class="text-card-title text-center mb-component-xs">
      {{ title }}
    </h3>
    <p class="text-body-sm text-center flex-grow">
      {{ description }}
    </p>
  </BaseCard>
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
