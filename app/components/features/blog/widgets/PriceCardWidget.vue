<template>
  <div
    class="my-8 p-5 md:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-500/20 rounded-2xl text-center max-w-md mx-auto"
  >
    <h3 class="text-lg font-semibold text-green-800 mb-3">
      {{ t('power_page.price.title') }}
    </h3>
    <div class="flex items-end justify-center gap-1 mb-3">
      <span class="text-3xl md:text-4xl font-bold text-green-600"> $2,500 </span>
      <span class="text-base font-medium text-green-700/80 mb-0.5">
        / {{ t('power_page.price.year') }}
      </span>
    </div>
    <p v-if="text" class="text-sm text-green-800/80 leading-relaxed">
      {{ text }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
}>()

const { t } = useI18n()
</script>
