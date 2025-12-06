<template>
  <div class="my-12 p-8 md:p-10 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500/20 rounded-3xl text-center transform transition-all hover:scale-[1.02] shadow-lg">
    <h3 class="text-2xl md:text-3xl font-bold text-green-800 mb-6">
      {{ t('power_page.price.title') }}
    </h3>
    <div class="flex items-end justify-center gap-2 mb-6">
      <span class="text-5xl md:text-6xl font-extrabold text-green-600 tracking-tight">
        $2,500
      </span>
      <span class="text-xl md:text-2xl font-medium text-green-700/80 mb-2">
        / {{ t('power_page.price.year') }}
      </span>
    </div>
    <p v-if="text" class="text-lg text-green-800/80 max-w-xl mx-auto leading-relaxed">
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
