import { defineStore } from 'pinia'
import type {
  University,
  UniversityQueryParams,
  UniversityResponse,
  UniversityFilters as ApiUniversityFilters,
} from '~~/server/types/api'

// Exported constants (used by FilterPanel)
export const CITY_ALL_VALUE = '__all_cities__'
export const TYPE_ALL_VALUE = '__all_types__'
export const LEVEL_ALL_VALUE = 'all'
export const SORT_OPTIONS = ['pop', 'price_asc', 'price_desc', 'alpha', 'lang_en'] as const

export type SortOption = (typeof SORT_OPTIONS)[number]
export interface UniversityFilters {
  q: string
  city: string
  langs: string[]
  type: string
  level: string
  price: [number, number]
}

export const useUniversitiesStore = defineStore('universities', () => {
  const DEFAULT_SORT: SortOption = 'pop'
  const VALID_LEVELS: readonly string[] = ['bachelor', 'master', 'phd']

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

  const normalizeFilterValue = (
    value: string | null | undefined,
    allValue: string,
    allLabelKey?: string,
  ): string => {
    if (!value) return allValue
    const trimmed = value.trim()
    if (!trimmed || trimmed === allValue || trimmed.toLowerCase() === 'all') return allValue
    if (allLabelKey && trimmed === t(allLabelKey)) return allValue
    return trimmed
  }

  const normalizeCity = (city: string | null | undefined) =>
    normalizeFilterValue(city, CITY_ALL_VALUE, 'universities_page.filters.all_cities')

  const normalizeType = (type: string | null | undefined) =>
    normalizeFilterValue(type, TYPE_ALL_VALUE, 'universities_page.filters.all_types')

  const normalizeLevel = (level: string | null | undefined): string => {
    const trimmed = level?.trim().toLowerCase()
    if (!trimmed || trimmed === 'all') return LEVEL_ALL_VALUE
    return VALID_LEVELS.includes(trimmed) ? trimmed : LEVEL_ALL_VALUE
  }

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

  const getQueryString = (val: unknown): string | null =>
    Array.isArray(val) ? (val[0] as string) ?? null : typeof val === 'string' ? val : null

  const getQueryArray = (val: unknown): string[] =>
    val ? (Array.isArray(val) ? (val as string[]) : [val as string]) : []

  const initializeFiltersFromURL = (): UniversityFilters => {
    const { query } = useRoute()
    if (Object.keys(query).length === 0) return getDefaultFilters()

    const [defaultMin, defaultMax] = availableFilters.value.priceRange
    return {
      q: (query.q as string) || '',
      city: normalizeCity(getQueryString(query.city)),
      langs: getQueryArray(query.langs),
      type: normalizeType(getQueryString(query.type)),
      level: normalizeLevel(getQueryString(query.level)),
      price: query.price_min || query.price_max
        ? [Number(query.price_min) || defaultMin, Number(query.price_max) || defaultMax]
        : [defaultMin, defaultMax],
    }
  }

  const filters = ref<UniversityFilters>(getDefaultFilters())
  const sort = ref<SortOption>(DEFAULT_SORT)
  const isUpdatingFromURL = ref(false)
  const isFromFooter = ref(false)

  type FetchOverrides = Partial<UniversityFilters> & { sort?: SortOption }
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

      // Sync price filter with server range
      const [minPrice, maxPrice] = response.filters.priceRange
      const { query } = useRoute()
      if (!query.price_min && !query.price_max) {
        filters.value.price = [minPrice, maxPrice]
      } else {
        const [curMin, curMax] = filters.value.price
        filters.value.price = [
          Math.max(minPrice, Math.min(curMin, maxPrice)),
          Math.min(maxPrice, Math.max(curMax, minPrice)),
        ]
      }

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
    const query: Record<string, string | string[] | number | undefined> = {}

    if (filters.value.q) query.q = filters.value.q
    if (filters.value.city !== CITY_ALL_VALUE) query.city = filters.value.city
    if (filters.value.langs.length) query.langs = filters.value.langs
    if (filters.value.type !== TYPE_ALL_VALUE) query.type = filters.value.type
    if (filters.value.level !== LEVEL_ALL_VALUE) query.level = filters.value.level
    if (filters.value.price[0] !== defaults.price[0]) query.price_min = filters.value.price[0]
    if (filters.value.price[1] !== defaults.price[1]) query.price_max = filters.value.price[1]
    if (sort.value !== DEFAULT_SORT) query.sort = sort.value

    if (isFromFooter.value) {
      router.push({ query })
      isFromFooter.value = false
    } else {
      const scrollY = typeof window !== 'undefined' ? window.scrollY : 0
      router.replace({ query }).then(() => {
        if (typeof window !== 'undefined') {
          requestAnimationFrame(() => window.scrollTo(0, scrollY))
        }
      })
    }

    nextTick(() => fetchUniversities())
  }

  function applyFilters(newFilters: Partial<UniversityFilters>, options?: { sort?: SortOption }) {
    const { city, type, level, ...rest } = newFilters
    Object.assign(filters.value, rest)
    if (city !== undefined) filters.value.city = normalizeCity(city)
    if (type !== undefined) filters.value.type = normalizeType(type)
    if (level !== undefined) filters.value.level = normalizeLevel(level)
    if (options?.sort) sort.value = options.sort
    updateURL()
  }

  const setCityFilter = (city: string, options?: { scrollToTop?: boolean }) => {
    if (options?.scrollToTop) isFromFooter.value = true
    filters.value.city = normalizeCity(city)
    updateURL()
  }

  const setSort = (sortValue: SortOption) => {
    sort.value = sortValue
    updateURL()
  }

  const resetFilters = (options?: { scrollToTop?: boolean }) => {
    if (options?.scrollToTop) isFromFooter.value = true
    filters.value = getDefaultFilters()
    sort.value = DEFAULT_SORT
    updateURL()
  }

  const initializeFilters = async (options?: {
    limit?: number
    page?: number
    overrides?: FetchOverrides
    ssr?: boolean
  }) => {
    const route = useRoute()
    filters.value = initializeFiltersFromURL()
    const rq = route.query as Partial<Record<string, unknown>>
    const qSort = typeof rq.sort === 'string' ? (rq.sort as SortOption) : DEFAULT_SORT
    sort.value = (SORT_OPTIONS as readonly string[]).includes(qSort) ? qSort : DEFAULT_SORT

    if (options?.ssr) {
      await fetchUniversities(options)
    } else {
      isUpdatingFromURL.value = true
      nextTick(() => {
        isUpdatingFromURL.value = false
        fetchUniversities(options)
      })
    }
  }

  return {
    universities,
    filters,
    sort,
    loading,
    error,
    totalUniversities,
    availableFilters,
    applyFilters,
    setCityFilter,
    setSort,
    resetFilters,
    initializeFilters,
    fetchUniversities,
  }
})
