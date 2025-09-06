import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import type { University, UniversityQueryParams, UniversityResponse, UniversityFilters as ApiUniversityFilters } from '../../server/types/api'

export const useUniversitiesStore = defineStore('universities', () => {
  // State
  const universities = ref<University[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalUniversities = ref(0)
  const availableFilters = ref<ApiUniversityFilters>({
    cities: [],
    types: [],
    levels: [],
    priceRange: [0, 20000]
  })
  
  // Default filter values
  const getDefaultFilters = (): UniversityFilters => ({
    q: '',
    city: 'Все города',
    langs: [],
    type: 'Все',
    level: 'Все',
    price: [0, 20000]
  })

  // Initialize filters from URL params
  const initializeFiltersFromURL = () => {
    const route = useRoute()
    const query = route.query
    
    // If no query parameters at all, return default filters
    if (Object.keys(query).length === 0) {
      return getDefaultFilters()
    }
    
    // Normalize city value coming from URL (handle "Все"/"All" variants)
    const rawCity = (query.city as string) || 'Все города'
    const normalizedCity = rawCity === 'Все'
      ? 'Все города'
      : (rawCity === 'All' ? 'All cities' : rawCity)

    return {
      q: (query.q as string) || '',
      city: normalizedCity,
      langs: query.langs ? (Array.isArray(query.langs) ? query.langs as string[] : [query.langs as string]) : [],
      type: (query.type as string) || 'Все',
      level: (query.level as string) || 'Все',
      price: query.price_min || query.price_max ? 
        [Number(query.price_min) || 0, Number(query.price_max) || 20000] as [number, number] :
        [0, 20000] as [number, number]
    }
  }

  // State for filters and sort
  const filters = ref<UniversityFilters>(getDefaultFilters())
  type SortOption = 'pop' | 'price_asc' | 'price_desc' | 'alpha' | 'lang_en'
  const sort = ref<SortOption>('pop')

  // i18n must be called at the top of setup
  const { locale } = useI18n()

  // Flag to prevent infinite loops during URL sync
  const isUpdatingFromURL = ref(false)
  // Track if update is from footer navigation
  const isFromFooter = ref(false)

  // Getters (computed properties)
  const filteredUniversities = computed(() => {
    // Since we're doing server-side filtering, just return the fetched universities
    return universities.value
  })

  const popularUniversities = computed(() => {
    return filteredUniversities.value.slice(0, 6)
  })

  const availableCities = computed(() => {
    return availableFilters.value.cities
  })

  // Actions
  type FetchOverrides = Partial<UniversityFilters> & { sort?: 'pop' | 'price_asc' | 'price_desc' | 'alpha' | 'lang_en' }
  const fetchUniversities = async (options?: { limit?: number; page?: number; overrides?: FetchOverrides }) => {
    if (process.client) console.debug('[universities] fetch start')
    loading.value = true
    error.value = null
    
    try {
      const effectiveFilters = { ...filters.value, ...(options?.overrides || {}) }

      const queryParams: UniversityQueryParams = {
        q: effectiveFilters.q || undefined,
        city: (effectiveFilters.city !== 'Все города' 
          && effectiveFilters.city !== 'All cities'
          && effectiveFilters.city !== 'Все'
          && effectiveFilters.city !== 'All') ? effectiveFilters.city : undefined,
        langs: (effectiveFilters.langs && effectiveFilters.langs.length > 0) ? effectiveFilters.langs : undefined,
        type: effectiveFilters.type !== 'Все' ? effectiveFilters.type : undefined,
        level: effectiveFilters.level !== 'Все' ? effectiveFilters.level : undefined,
        price_min: effectiveFilters.price?.[0] !== undefined && effectiveFilters.price?.[0] !== 0 ? effectiveFilters.price[0] : undefined,
        price_max: effectiveFilters.price?.[1] !== undefined && effectiveFilters.price?.[1] !== 20000 ? effectiveFilters.price[1] : undefined,
        sort: (options?.overrides?.sort || sort.value) !== 'pop' ? (options?.overrides?.sort || sort.value) : undefined,
        page: options?.page ?? 1,
        limit: options?.limit ?? 100, // Default large for client-side filtering; override on home
        lang: locale.value
      }
      
      if (process.client) console.debug('[universities] query', queryParams)
      const response = await $fetch<UniversityResponse>('/api/v1/universities', {
        query: queryParams
      })
      
      universities.value = response.data
      totalUniversities.value = response.meta.total
      availableFilters.value = response.filters
      if (process.client) console.debug('[universities] fetched', response.data?.length)
      
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch universities'
      if (process.client) console.error('[universities] fetch error', err)
    } finally {
      loading.value = false
      if (process.client) console.debug('[universities] fetch end')
    }
  }

  const updateURL = () => {
    if (isUpdatingFromURL.value) return
    
    const router = useRouter()
    const defaults = getDefaultFilters()
    type RouteQuery = Partial<{
      q: string
      city: string
      langs: string[]
      type: string
      level: string
      price_min: number
      price_max: number
      sort: SortOption
    }>
    const query: RouteQuery = {}
    
    if (filters.value.q) query.q = filters.value.q
    if (filters.value.city !== defaults.city) query.city = filters.value.city
    if (filters.value.langs.length > 0) query.langs = filters.value.langs
    if (filters.value.type !== defaults.type) query.type = filters.value.type
    if (filters.value.level !== defaults.level) query.level = filters.value.level
    if (filters.value.price[0] !== defaults.price[0]) query.price_min = filters.value.price[0]
    if (filters.value.price[1] !== defaults.price[1]) query.price_max = filters.value.price[1]
    if (sort.value !== 'pop') query.sort = sort.value

    // Control scroll behavior based on source
    if (isFromFooter.value) {
      // From footer: navigate with scroll to top (default behavior)
      router.push({ query })
      isFromFooter.value = false
    } else {
      // Regular filter updates: preserve scroll position
      const currentScrollY = typeof window !== 'undefined' ? window.scrollY : 0
      
      // Use router.replace but prevent auto-scroll by saving/restoring position
      router.replace({ query }).then(() => {
        if (typeof window !== 'undefined') {
          // Force scroll position after route update completes
          requestAnimationFrame(() => {
            window.scrollTo(0, currentScrollY)
          })
        }
      })
    }
    
    // Fetch new data after URL update
    nextTick(() => {
      fetchUniversities()
    })
  }

  function setFilter<K extends keyof UniversityFilters>(key: K, value: UniversityFilters[K]) {
    filters.value[key] = value
    updateURL()
  }

  const setCityFilter = (city: string) => {
    filters.value.city = city
    updateURL()
  }

  const setCityFilterFromFooter = (city: string) => {
    isFromFooter.value = true
    filters.value.city = city
    updateURL()
  }

  const setSort = (sortValue: SortOption) => {
    sort.value = sortValue
    updateURL()
  }

  const resetFilters = () => {
    filters.value = getDefaultFilters()
    sort.value = 'pop'
    updateURL()
  }

  const resetFiltersFromFooter = () => {
    isFromFooter.value = true
    filters.value = getDefaultFilters()
    sort.value = 'pop'
    updateURL()
  }

  const initializeFilters = () => {
    isUpdatingFromURL.value = true
    const route = useRoute()
    filters.value = initializeFiltersFromURL()
    const rq = route.query as Partial<Record<string, unknown>>
    const qSort = typeof rq.sort === 'string' ? (rq.sort as SortOption) : 'pop'
    sort.value = (['pop','price_asc','price_desc','alpha','lang_en'] as const).includes(qSort) ? qSort : 'pop'
    nextTick(() => {
      isUpdatingFromURL.value = false
      fetchUniversities()
    })
  }

  // Helper to initialize and fetch during SSR
  const initAndFetchSSR = async (options?: { limit?: number; page?: number; overrides?: FetchOverrides }) => {
    const route = useRoute()
    filters.value = initializeFiltersFromURL()
    const rq = route.query as Partial<Record<string, unknown>>
    const qSort = typeof rq.sort === 'string' ? (rq.sort as SortOption) : 'pop'
    sort.value = (['pop','price_asc','price_desc','alpha','lang_en'] as const).includes(qSort) ? qSort : 'pop'
    await fetchUniversities(options)
  }

  // Initialize on store creation
  const initialize = () => {
    const route = useRoute()
    if (Object.keys(route.query).length > 0) {
      initializeFilters()
    } else {
      fetchUniversities()
    }
  }

  return {
    // State
    universities,
    filters,
    sort,
    loading,
    error,
    totalUniversities,
    availableFilters,
    
    // Getters
    filteredUniversities,
    popularUniversities,
    availableCities,
    
    // Actions
    setFilter,
    setCityFilter,
    setCityFilterFromFooter,
    setSort,
    resetFilters,
    resetFiltersFromFooter,
    initializeFilters,
    updateURL,
    fetchUniversities,
    initialize,
    initAndFetchSSR
  }
})

// Type definitions
export interface UniversityFilters {
  q: string
  city: string
  langs: string[]
  type: string
  level: string
  price: [number, number]
}