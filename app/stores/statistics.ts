import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

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
  // State
  const statistics = ref<ReviewStatistics | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
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

  // Actions
  const fetchStatistics = async () => {
    if (process.client) console.debug('[statistics] fetch start')
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<ReviewStatistics>('/api/v1/statistics')
      statistics.value = response
      if (process.client) console.debug('[statistics] fetched', response)
      
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch statistics'
      if (process.client) console.error('[statistics] fetch error', err)
    } finally {
      loading.value = false
      if (process.client) console.debug('[statistics] fetch end')
    }
  }

  // Reset function
  const reset = () => {
    statistics.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    statistics,
    loading,
    error,
    
    // Getters
    universitiesCount,
    citiesCount,
    programsCount,
    studentsCount,
    formattedUniversities,
    formattedCities,
    formattedPrograms,
    formattedCostFrom,
    
    // Actions
    fetchStatistics,
    reset
  }
})
