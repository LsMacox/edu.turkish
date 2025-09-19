<template>
  <div class="flex flex-wrap justify-center gap-4 md:gap-8">
    <div class="flex items-center space-x-2 bg-white rounded-xl p-3 md:p-4 shadow-sm">
      <div
        class="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center"
      >
        <Icon name="mdi:domain" class="text-blue-600" />
      </div>
      <div>
        <p class="text-lg md:text-2xl font-bold text-secondary">
          <ClientOnly>
            <span>{{ statisticsStore.formattedUniversities }}</span>
            <template #fallback>–</template>
          </ClientOnly>
        </p>
        <p class="text-xs md:text-sm text-gray-600">
          {{ $t('universities_page.hero.stats.universities') }}
        </p>
      </div>
    </div>

    <div class="flex items-center space-x-2 bg-white rounded-xl p-3 md:p-4 shadow-sm">
      <div
        class="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center"
      >
        <Icon name="mdi:map-marker" class="text-green-600" />
      </div>
      <div>
        <p class="text-lg md:text-2xl font-bold text-secondary">
          <ClientOnly>
            <span>{{ statisticsStore.formattedCities }}</span>
            <template #fallback>–</template>
          </ClientOnly>
        </p>
        <p class="text-xs md:text-sm text-gray-600">
          {{ $t('universities_page.hero.stats.cities') }}
        </p>
      </div>
    </div>

    <div class="flex items-center space-x-2 bg-white rounded-xl p-3 md:p-4 shadow-sm">
      <div
        class="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center"
      >
        <Icon name="mdi:school" class="text-purple-600" />
      </div>
      <div>
        <p class="text-lg md:text-2xl font-bold text-secondary">
          <ClientOnly>
            <span>{{ statisticsStore.formattedPrograms }}</span>
            <template #fallback>–</template>
          </ClientOnly>
        </p>
        <p class="text-xs md:text-sm text-gray-600">
          {{ $t('universities_page.hero.stats.programs') }}
        </p>
      </div>
    </div>

    <!-- Removed cost card to avoid displaying non-truthful placeholder values -->
  </div>
</template>

<script setup lang="ts">
import { useStatisticsStore } from '~/stores/statistics'

const statisticsStore = useStatisticsStore()

// Fetch on server as well to render SSR
await callOnce(async () => {
  if (!statisticsStore.statistics) {
    await statisticsStore.fetchStatistics()
  }
})
</script>
