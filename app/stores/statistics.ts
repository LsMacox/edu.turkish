import { defineStore } from 'pinia'
import { useCachedFetch } from '~/composables/useCachedFetch'

interface ReviewStatistics {
  total_students: number
  average_rating: number
  success_rate: number
  universities_count: number
  scholarships_provided: number
  cities_covered: number
  languages_supported: number
  specialties_available: number
}

export const useStatisticsStore = defineStore('statistics', () => {
  const statistics = ref<ReviewStatistics | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const cachedFetch = useCachedFetch(
    () => $fetch<ReviewStatistics>('/api/v1/statistics'),
    { ttl: 300_000 }, // 5 min — stats change rarely
  )

  const universitiesCount = computed(() => {
    return statistics.value?.universities_count ?? 0
  })

  const citiesCount = computed(() => {
    return statistics.value?.cities_covered ?? 0
  })

  const programsCount = computed(() => {
    return statistics.value?.specialties_available ?? 0
  })

  const studentsCount = computed(() => {
    return statistics.value?.total_students ?? 0
  })

  const formattedUniversities = computed(() => `${universitiesCount.value}`)
  const formattedCities = computed(() => `${citiesCount.value}`)
  const formattedPrograms = computed(() => `${programsCount.value}`)
  const formattedCostFrom = computed(() => '')

  const fetchStatistics = async () => {
    loading.value = true
    error.value = null

    try {
      statistics.value = await cachedFetch.execute()
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
