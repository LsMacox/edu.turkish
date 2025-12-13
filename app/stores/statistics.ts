import { defineStore } from 'pinia'
import type { ReviewStatistics } from '~~/lib/types'

export const useStatisticsStore = defineStore('statistics', () => {
  const statistics = ref<ReviewStatistics | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const universitiesCount = computed(() => {
    return statistics.value?.universitiesCount ?? 0
  })

  const citiesCount = computed(() => {
    return statistics.value?.citiesCovered ?? 0
  })

  const programsCount = computed(() => {
    return statistics.value?.specialtiesAvailable ?? 0
  })

  const studentsCount = computed(() => {
    return statistics.value?.totalStudents ?? 0
  })

  const formattedUniversities = computed(() => `${universitiesCount.value}`)
  const formattedCities = computed(() => `${citiesCount.value}`)
  const formattedPrograms = computed(() => `${programsCount.value}`)
  const formattedCostFrom = computed(() => '')

  const fetchStatistics = async () => {
    loading.value = true
    error.value = null

    try {
      statistics.value = await $fetch<ReviewStatistics>('/api/v1/statistics')
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch statistics'
      if (import.meta.client) console.error('[statistics] fetch error', err)
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    statistics.value = null
    loading.value = false
    error.value = null
  }

  return {
    statistics,
    loading,
    error,

    universitiesCount,
    citiesCount,
    programsCount,
    studentsCount,
    formattedUniversities,
    formattedCities,
    formattedPrograms,
    formattedCostFrom,

    fetchStatistics,
    reset,
  }
})
