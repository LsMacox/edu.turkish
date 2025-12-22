<template>
  <div class="grid grid-cols-3 gap-component-md max-w-xl mx-auto">
    <div class="stat-card">
      <div class="text-card-title !text-primary">
        <ClientOnly>
          <span>{{ statisticsStore.formattedUniversities }}</span>
          <template #fallback>–</template>
        </ClientOnly>
      </div>
      <p class="text-body-sm">{{ t(ns('universities')) }}</p>
    </div>

    <div class="stat-card">
      <div class="text-card-title !text-primary">
        <ClientOnly>
          <span>{{ statisticsStore.formattedCities }}</span>
          <template #fallback>–</template>
        </ClientOnly>
      </div>
      <p class="text-body-sm">{{ t(ns('cities')) }}</p>
    </div>

    <div class="stat-card">
      <div class="text-card-title !text-primary">
        <ClientOnly>
          <span>{{ statisticsStore.formattedPrograms }}</span>
          <template #fallback>–</template>
        </ClientOnly>
      </div>
      <p class="text-body-sm">{{ t(ns('programs')) }}</p>
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
