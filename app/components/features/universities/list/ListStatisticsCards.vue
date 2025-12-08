<template>
  <div class="flex flex-wrap justify-center gap-6 md:gap-10">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
        <Icon name="mdi:domain" class="text-blue-600 w-4 h-4" />
      </div>
      <div>
        <p class="text-lg md:text-xl font-bold text-secondary leading-none">
          <ClientOnly>
            <span>{{ statisticsStore.formattedUniversities }}</span>
            <template #fallback>–</template>
          </ClientOnly>
        </p>
        <p class="text-xs text-gray-500">{{ t('universities_page.hero.stats.universities') }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
        <Icon name="mdi:map-marker" class="text-emerald-600 w-4 h-4" />
      </div>
      <div>
        <p class="text-lg md:text-xl font-bold text-secondary leading-none">
          <ClientOnly>
            <span>{{ statisticsStore.formattedCities }}</span>
            <template #fallback>–</template>
          </ClientOnly>
        </p>
        <p class="text-xs text-gray-500">{{ t('universities_page.hero.stats.cities') }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
        <Icon name="mdi:school" class="text-violet-600 w-4 h-4" />
      </div>
      <div>
        <p class="text-lg md:text-xl font-bold text-secondary leading-none">
          <ClientOnly>
            <span>{{ statisticsStore.formattedPrograms }}</span>
            <template #fallback>–</template>
          </ClientOnly>
        </p>
        <p class="text-xs text-gray-500">{{ t('universities_page.hero.stats.programs') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStatisticsStore } from '~/stores/statistics'

const { t } = useI18n()
const statisticsStore = useStatisticsStore()

await callOnce(async () => {
  if (!statisticsStore.statistics) {
    await statisticsStore.fetchStatistics()
  }
})
</script>
