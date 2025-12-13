<template>
  <div class="grid grid-cols-3 gap-3 md:gap-4 max-w-xl mx-auto">
    <div class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-3 text-center">
      <div class="text-xl md:text-2xl font-bold text-primary">
        <ClientOnly>
          <span>{{ statisticsStore.formattedUniversities }}</span>
          <template #fallback>–</template>
        </ClientOnly>
      </div>
      <p class="text-xs text-gray-600">{{ t(ns('universities')) }}</p>
    </div>

    <div class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-3 text-center">
      <div class="text-xl md:text-2xl font-bold text-primary">
        <ClientOnly>
          <span>{{ statisticsStore.formattedCities }}</span>
          <template #fallback>–</template>
        </ClientOnly>
      </div>
      <p class="text-xs text-gray-600">{{ t(ns('cities')) }}</p>
    </div>

    <div class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-3 text-center">
      <div class="text-xl md:text-2xl font-bold text-primary">
        <ClientOnly>
          <span>{{ statisticsStore.formattedPrograms }}</span>
          <template #fallback>–</template>
        </ClientOnly>
      </div>
      <p class="text-xs text-gray-600">{{ t(ns('programs')) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStatisticsStore } from '~/stores/statistics'
import { namespace } from '~~/lib/i18n'

const ns = namespace('universities.list.hero.stats')

const { t } = useI18n()
const statisticsStore = useStatisticsStore()

await callOnce(async () => {
  if (!statisticsStore.statistics) {
    await statisticsStore.fetchStatistics()
  }
})
</script>
