<template>
  <div
    class="bg-white rounded-xl md:rounded-2xl shadow-custom p-4 md:p-6 text-center hover-lift"
  >
    <div
      class="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4"
      :class="iconBg"
    >
      <Icon :name="icon" class="text-xl md:text-2xl" :class="iconColor" />
    </div>
    <h3 class="text-card-title mb-1 md:mb-2">{{ title }}</h3>
    <p class="text-gray-600 text-sm md:text-base">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  iconBg: string
  iconColor: string
  title: string
  value: string
}>()
</script>
