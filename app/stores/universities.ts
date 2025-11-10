import { defineStore } from 'pinia'
import type { DegreeType } from '@prisma/client'
import type {
  University,
  UniversityQueryParams,
  UniversityResponse,
  UniversityFilters as ApiUniversityFilters,
} from '~~/server/types/api'

export const CITY_ALL_VALUE = '__all_cities__'
export const TYPE_ALL_VALUE = '__all_types__'
export const LEVEL_ALL_VALUE = 'all'

export const SORT_OPTIONS = ['pop', 'price_asc', 'price_desc', 'alpha', 'lang_en'] as const
export type SortOption = (typeof SORT_OPTIONS)[number]
const DEFAULT_SORT: SortOption = 'pop'

const LEVEL_TRANSLATION_KEYS: Record<DegreeType | typeof LEVEL_ALL_VALUE, string> = {
  [LEVEL_ALL_VALUE]: 'universities_page.filters.all_levels',
  bachelor: 'universities_page.filters.levels.bachelor',
  master: 'universities_page.filters.levels.master',
  phd: 'universities_page.filters.levels.doctorate',
}

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
    languages: [],
    priceRange: [0, 20000],
  })

  const { locale, t } = useI18n({ useScope: 'global' })

  const levelCanonicalMap = computed(() => {
    const map = new Map<string, DegreeType | typeof LEVEL_ALL_VALUE>()

    const addSynonym = (
      value: string | undefined,
      canonical: DegreeType | typeof LEVEL_ALL_VALUE,
    ) => {
      if (!value) return
      const trimmed = value.trim()
      if (!trimmed) return
      map.set(trimmed, canonical)
      map.set(trimmed.toLowerCase(), canonical)
    }

    ;(Object.keys(LEVEL_TRANSLATION_KEYS) as Array<keyof typeof LEVEL_TRANSLATION_KEYS>).forEach(
      (canonical) => {
        addSynonym(canonical, canonical)
        const translation = t(LEVEL_TRANSLATION_KEYS[canonical])
        if (typeof translation === 'string') {
          addSynonym(translation, canonical)
        }
      },
    )

    addSynonym('doctorate', 'phd')
    addSynonym('doctoral', 'phd')

    return map
  })

  const defaultCityLabel = computed(() => t('universities_page.filters.all_cities') as string)
  const defaultTypeLabel = computed(() => t('universities_page.filters.all_types') as string)

  const normalizeCity = (city: string | null | undefined): string => {
    if (!city) return CITY_ALL_VALUE

    const trimmed = city.trim()
    if (!trimmed) return CITY_ALL_VALUE
    const lower = trimmed.toLowerCase()
    if (trimmed === CITY_ALL_VALUE || trimmed === defaultCityLabel.value || lower === 'all') {
      return CITY_ALL_VALUE
    }

    return trimmed
  }

  const normalizeType = (type: string | null | undefined): string => {
    if (!type) return TYPE_ALL_VALUE

    const trimmed = type.trim()
    if (!trimmed) return TYPE_ALL_VALUE
    const lower = trimmed.toLowerCase()
    if (trimmed === TYPE_ALL_VALUE || trimmed === defaultTypeLabel.value || lower === 'all') {
      return TYPE_ALL_VALUE
    }

    return trimmed
  }

  const normalizeLevel = (level: string | null | undefined): string => {
    const normalized = level?.trim()
    if (!normalized) return LEVEL_ALL_VALUE

    const canonical =
      levelCanonicalMap.value.get(normalized) ||
      levelCanonicalMap.value.get(normalized.toLowerCase())

    return canonical || LEVEL_ALL_VALUE
  }

  // Default filter values
  const getDefaultFilters = (): UniversityFilters => ({
    q: '',
    city: CITY_ALL_VALUE,
    langs: [],
    type: TYPE_ALL_VALUE,
    level: LEVEL_ALL_VALUE,
    price: [availableFilters.value.priceRange[0], availableFilters.value.priceRange[1]] as [
      number,
      number,
    ],
  })

  // Initialize filters from URL params
  const initializeFiltersFromURL = () => {
    const route = useRoute()
    const query = route.query

    // If no query parameters at all, return default filters
    if (Object.keys(query).length === 0) {
      return getDefaultFilters()
    }

    // Normalize city value coming from URL
    const rawCity = Array.isArray(query.city)
      ? (query.city[0] as string | undefined)
      : typeof query.city === 'string'
        ? query.city
        : null
    const normalizedCity = normalizeCity(rawCity)

    return {
      q: (query.q as string) || '',
      city: normalizedCity,
      langs: query.langs
        ? Array.isArray(query.langs)
          ? (query.langs as string[])
          : [query.langs as string]
        : [],
      type: normalizeType(
        Array.isArray(query.type)
          ? (query.type[0] as string | undefined)
          : typeof query.type === 'string'
            ? query.type
            : null,
      ),
      level: normalizeLevel((query.level as string) || LEVEL_ALL_VALUE),
      price:
        query.price_min || query.price_max
          ? ([
              Number(query.price_min) || availableFilters.value.priceRange[0],
              Number(query.price_max) || availableFilters.value.priceRange[1],
            ] as [number, number])
          : ([availableFilters.value.priceRange[0], availableFilters.value.priceRange[1]] as [
              number,
              number,
            ]),
    }
  }

  // State for filters and sort
  const filters = ref<UniversityFilters>(getDefaultFilters())
  const sort = ref<SortOption>(DEFAULT_SORT)

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
  type FetchOverrides = Partial<UniversityFilters> & {
    sort?: 'pop' | 'price_asc' | 'price_desc' | 'alpha' | 'lang_en'
  }
  const fetchUniversities = async (options?: {
    limit?: number
    page?: number
    overrides?: FetchOverrides
  }) => {
    loading.value = true
    error.value = null

    try {
      const effectiveFilters = { ...filters.value, ...(options?.overrides || {}) }
      const defaults = getDefaultFilters()

      const queryParams: UniversityQueryParams = {
        q: effectiveFilters.q || undefined,
        city:
          effectiveFilters.city && effectiveFilters.city !== CITY_ALL_VALUE
            ? effectiveFilters.city
            : undefined,
        langs:
          effectiveFilters.langs && effectiveFilters.langs.length > 0
            ? effectiveFilters.langs
            : undefined,
        type:
          effectiveFilters.type && effectiveFilters.type !== TYPE_ALL_VALUE
            ? effectiveFilters.type
            : undefined,
        level: effectiveFilters.level !== LEVEL_ALL_VALUE ? effectiveFilters.level : undefined,
        price_min:
          effectiveFilters.price?.[0] !== undefined &&
          effectiveFilters.price?.[0] !== defaults.price[0]
            ? effectiveFilters.price[0]
            : undefined,
        price_max:
          effectiveFilters.price?.[1] !== undefined &&
          effectiveFilters.price?.[1] !== defaults.price[1]
            ? effectiveFilters.price[1]
            : undefined,
        sort:
          (options?.overrides?.sort || sort.value) !== DEFAULT_SORT
            ? options?.overrides?.sort || sort.value
            : undefined,
        page: options?.page ?? 1,
        limit: options?.limit ?? 6, // Default 6 universities per page
        lang: locale.value,
      }

      const response = await $fetch<UniversityResponse>('/api/v1/universities', {
        query: queryParams,
      })

      // If this is page 1, replace universities. If page > 1, append new universities
      if (options?.page && options.page > 1) {
        // Avoid duplicates when loading more
        const existingIds = new Set(universities.value.map((u) => u.id))
        const newUniversities = response.data.filter((u) => !existingIds.has(u.id))
        universities.value = [...universities.value, ...newUniversities]
      } else {
        universities.value = response.data
      }

      totalUniversities.value = response.meta.total
      availableFilters.value = response.filters

      const [minPrice, maxPrice] = response.filters.priceRange
      const route = useRoute()
      const hasPriceQuery =
        route.query.price_min !== undefined || route.query.price_max !== undefined

      if (!hasPriceQuery) {
        filters.value.price = [minPrice, maxPrice] as [number, number]
      } else {
        const [currentMin, currentMax] = filters.value.price
        const boundedMin = Math.min(Math.max(currentMin ?? minPrice, minPrice), maxPrice)
        const boundedMax = Math.max(Math.min(currentMax ?? maxPrice, maxPrice), minPrice)

        if (boundedMin > boundedMax) {
          filters.value.price = [minPrice, maxPrice] as [number, number]
        } else if (boundedMin !== currentMin || boundedMax !== currentMax) {
          filters.value.price = [boundedMin, boundedMax] as [number, number]
        }
      }

      // Return response for loadMore logic
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch universities'
      return null
    } finally {
      loading.value = false
    }
  }

  const updateURL = () => {
    if (isUpdatingFromURL.value) {
      isUpdatingFromURL.value = false
      return
    }

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
    if (filters.value.city !== defaults.city && filters.value.city !== CITY_ALL_VALUE)
      query.city = filters.value.city
    if (filters.value.langs.length > 0) query.langs = filters.value.langs
    if (filters.value.type !== defaults.type && filters.value.type !== TYPE_ALL_VALUE)
      query.type = filters.value.type
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

    // Don't fetch if only page parameter changed (this is handled by loadMore)
    const route = useRoute()
    const { page: _page, ...currentFilters } = route.query as Record<string, unknown>
    const { page: _newPage, ...newFilters } = query as Record<string, unknown>

    // Only fetch if filters actually changed, not just page
    const filtersChanged = JSON.stringify(currentFilters) !== JSON.stringify(newFilters)

    if (filtersChanged) {
      nextTick(() => {
        fetchUniversities()
      })
    }
  }

  function applyFilters(newFilters: Partial<UniversityFilters>, options?: { sort?: SortOption }) {
    ;(
      Object.entries(newFilters) as [
        keyof UniversityFilters,
        UniversityFilters[keyof UniversityFilters],
      ][]
    ).forEach(([key, value]) => {
      if (key === 'level' && typeof value === 'string') {
        filters.value.level = normalizeLevel(value)
      } else if (key === 'city' && typeof value === 'string') {
        filters.value.city = normalizeCity(value)
      } else if (key === 'type' && typeof value === 'string') {
        filters.value.type = normalizeType(value)
      } else {
        // Assign with explicit casting to maintain type safety across union types
        ;(filters.value as any)[key] = value as any
      }
    })

    if (options && 'sort' in options && options.sort !== undefined) {
      sort.value = options.sort
    }

    updateURL()
  }

  function setFilter<K extends keyof UniversityFilters>(key: K, value: UniversityFilters[K]) {
    applyFilters({ [key]: value } as Partial<UniversityFilters>)
  }

  const setCityFilter = (city: string) => {
    filters.value.city = normalizeCity(city)
    updateURL()
  }

  const setCityFilterFromFooter = (city: string) => {
    isFromFooter.value = true
    filters.value.city = normalizeCity(city)
    updateURL()
  }

  const setSort = (sortValue: SortOption) => {
    sort.value = sortValue
    updateURL()
  }

  const resetFilters = () => {
    filters.value = getDefaultFilters()
    sort.value = DEFAULT_SORT
    updateURL()
  }

  const resetFiltersFromFooter = () => {
    isFromFooter.value = true
    filters.value = getDefaultFilters()
    sort.value = DEFAULT_SORT
    updateURL()
  }

  const initializeFilters = () => {
    isUpdatingFromURL.value = true
    const route = useRoute()
    filters.value = initializeFiltersFromURL()
    const rq = route.query as Partial<Record<string, unknown>>
    const qSort = typeof rq.sort === 'string' ? (rq.sort as SortOption) : DEFAULT_SORT
    sort.value = (SORT_OPTIONS as readonly string[]).includes(qSort) ? qSort : DEFAULT_SORT
    nextTick(() => {
      isUpdatingFromURL.value = false
      fetchUniversities()
    })
  }

  // Helper to initialize and fetch during SSR
  const initAndFetchSSR = async (options?: {
    limit?: number
    page?: number
    overrides?: FetchOverrides
  }) => {
    const route = useRoute()
    filters.value = initializeFiltersFromURL()
    const rq = route.query as Partial<Record<string, unknown>>
    const qSort = typeof rq.sort === 'string' ? (rq.sort as SortOption) : DEFAULT_SORT
    sort.value = (SORT_OPTIONS as readonly string[]).includes(qSort) ? qSort : DEFAULT_SORT
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
    isUpdatingFromURL,

    // Getters
    filteredUniversities,
    popularUniversities,
    availableCities,

    // Actions
    setFilter,
    applyFilters,
    setCityFilter,
    setCityFilterFromFooter,
    setSort,
    resetFilters,
    resetFiltersFromFooter,
    initializeFilters,
    updateURL,
    fetchUniversities,
    initialize,
    initAndFetchSSR,
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
