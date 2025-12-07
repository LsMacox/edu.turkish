import { defineStore } from 'pinia'
import type {
  University,
  UniversityQueryParams,
  UniversityResponse,
  UniversityFilters as ApiFilters,
} from '~~/server/types/api'
import { useUrlFilters, defineFilterField, filterParsers } from '~/composables/useUrlFilters'

// "All" sentinel values for select filters
export const CITY_ALL = '__all__'
export const TYPE_ALL = '__all__'
export const LEVEL_ALL = 'all'

export const SORT_OPTIONS = ['pop', 'price_asc', 'price_desc', 'alpha', 'lang_en'] as const
export type SortOption = (typeof SORT_OPTIONS)[number]

/** Local filter state (mirrors URL query) */
export interface Filters {
  q: string
  city: string
  langs: string[]
  type: string
  level: string
  price: [number, number]
}

const VALID_LEVELS = ['bachelor', 'master', 'phd'] as const
const DEFAULT_SORT: SortOption = 'pop'

export const useUniversitiesStore = defineStore('universities', () => {
  // --- State ---
  const universities = ref<University[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const available = ref<ApiFilters>({
    cities: [],
    types: [],
    levels: [],
    languages: [],
    priceRange: [0, 20000],
  })

  const { locale } = useI18n({ useScope: 'global' })

  // --- Helpers ---
  const defaultFilters = (): Filters => ({
    q: '',
    city: CITY_ALL,
    langs: [],
    type: TYPE_ALL,
    level: LEVEL_ALL,
    price: [...available.value.priceRange] as [number, number],
  })

  const normalizeLevel = (v?: string | null): string => {
    const l = v?.trim().toLowerCase()
    return l && (VALID_LEVELS as readonly string[]).includes(l) ? l : LEVEL_ALL
  }

  const parseFiltersFromURL = (): Filters => {
    const { query } = useRoute()
    if (!Object.keys(query).length) return defaultFilters()

    const str = (v: unknown) => (Array.isArray(v) ? v[0] : v) as string | undefined
    const arr = (v: unknown): string[] => (v ? (Array.isArray(v) ? v : [v]) : []) as string[]
    const [minDef, maxDef] = available.value.priceRange

    return {
      q: str(query.q) || '',
      city: str(query.city) || CITY_ALL,
      langs: arr(query.langs),
      type: str(query.type) || TYPE_ALL,
      level: normalizeLevel(str(query.level)),
      price:
        query.price_min || query.price_max
          ? [Number(query.price_min) || minDef, Number(query.price_max) || maxDef]
          : [minDef, maxDef],
    }
  }

  // --- Reactive state ---
  const filters = ref<Filters>(defaultFilters())
  const sort = ref<SortOption>(DEFAULT_SORT)

  // URL filters composable for sync logic
  interface UniversityUrlFilters {
    q: string
    city: string
    langs: string[]
    type: string
    level: string
    price_min: number
    price_max: number
    sort: SortOption
  }

  const urlFilters = useUrlFilters<UniversityUrlFilters>({
    fields: {
      q: defineFilterField('q', '', filterParsers.string('')),
      city: defineFilterField('city', CITY_ALL, filterParsers.string(CITY_ALL)),
      langs: defineFilterField('langs', [] as string[], filterParsers.stringArray()),
      type: defineFilterField('type', TYPE_ALL, filterParsers.string(TYPE_ALL)),
      level: defineFilterField('level', LEVEL_ALL, filterParsers.string(LEVEL_ALL)),
      price_min: defineFilterField('price_min', 0, filterParsers.number(0)),
      price_max: defineFilterField('price_max', 20000, filterParsers.number(20000)),
      sort: defineFilterField('sort', DEFAULT_SORT, filterParsers.enum(SORT_OPTIONS, DEFAULT_SORT)),
    },
    preserveScroll: true,
  })

  // --- API ---
  type FetchOpts = {
    limit?: number
    page?: number
    overrides?: Partial<Filters> & { sort?: SortOption }
  }

  const fetchUniversities = async (opts?: FetchOpts) => {
    loading.value = true
    error.value = null

    try {
      const f = { ...filters.value, ...opts?.overrides }
      const def = defaultFilters()

      const params: UniversityQueryParams = {
        q: f.q || undefined,
        city: f.city !== CITY_ALL ? f.city : undefined,
        langs: f.langs.length ? f.langs : undefined,
        type: f.type !== TYPE_ALL ? f.type : undefined,
        level: f.level !== LEVEL_ALL ? f.level : undefined,
        price_min: f.price?.[0] !== def.price[0] ? f.price?.[0] : undefined,
        price_max: f.price?.[1] !== def.price[1] ? f.price?.[1] : undefined,
        sort:
          (opts?.overrides?.sort ?? sort.value) !== DEFAULT_SORT
            ? (opts?.overrides?.sort ?? sort.value)
            : undefined,
        page: opts?.page ?? 1,
        limit: opts?.limit ?? 6,
        lang: locale.value,
      }

      const res = await $fetch<UniversityResponse>('/api/v1/universities', { query: params })

      // Append on pagination, replace otherwise
      if (opts?.page && opts.page > 1) {
        const ids = new Set(universities.value.map((u) => u.id))
        universities.value = [...universities.value, ...res.data.filter((u) => !ids.has(u.id))]
      } else {
        universities.value = res.data
      }

      total.value = res.meta.total
      available.value = res.filters

      const [min, max] = res.filters.priceRange
      const { query } = useRoute()
      if (!query.price_min && !query.price_max) {
        filters.value.price = [min, max]
      } else {
        filters.value.price = [
          Math.max(min, Math.min(filters.value.price[0], max)),
          Math.min(max, Math.max(filters.value.price[1], min)),
        ]
      }

      return res
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch universities'
      return null
    } finally {
      loading.value = false
    }
  }

  // --- URL sync ---
  const filtersToUrlState = (): UniversityUrlFilters => {
    const def = defaultFilters()
    return {
      q: filters.value.q,
      city: filters.value.city,
      langs: filters.value.langs,
      type: filters.value.type,
      level: filters.value.level,
      price_min: filters.value.price[0] !== def.price[0] ? filters.value.price[0] : 0,
      price_max: filters.value.price[1] !== def.price[1] ? filters.value.price[1] : 20000,
      sort: sort.value,
    }
  }

  const syncURL = (opts?: { push?: boolean }) => {
    urlFilters.syncToUrlWithSkip(filtersToUrlState(), {}, opts)
    nextTick(() => fetchUniversities())
  }

  // --- Actions ---
  const applyFilters = (patch: Partial<Filters>, opts?: { sort?: SortOption }) => {
    Object.assign(filters.value, patch)
    if (patch.level !== undefined) filters.value.level = normalizeLevel(patch.level)
    if (opts?.sort) sort.value = opts.sort
    syncURL()
  }

  const setCityFilter = (city: string, opts?: { scrollToTop?: boolean }) => {
    filters.value.city = city || CITY_ALL
    syncURL({ push: opts?.scrollToTop })
  }

  const setSort = (v: SortOption) => {
    sort.value = v
    syncURL()
  }

  const resetFilters = (opts?: { scrollToTop?: boolean }) => {
    filters.value = defaultFilters()
    sort.value = DEFAULT_SORT
    syncURL({ push: opts?.scrollToTop })
  }

  const initializeFilters = async (opts?: { limit?: number; page?: number; ssr?: boolean }) => {
    const { query } = useRoute()
    filters.value = parseFiltersFromURL()

    const qSort = typeof query.sort === 'string' ? query.sort : ''
    sort.value = (SORT_OPTIONS as readonly string[]).includes(qSort)
      ? (qSort as SortOption)
      : DEFAULT_SORT

    if (opts?.ssr) {
      await fetchUniversities(opts)
    } else {
      urlFilters.skipNextSync.value = true
      nextTick(() => {
        urlFilters.skipNextSync.value = false
        fetchUniversities(opts)
      })
    }
  }

  return {
    universities,
    filters,
    sort,
    loading,
    error,
    total,
    available,
    applyFilters,
    setCityFilter,
    setSort,
    resetFilters,
    initializeFilters,
    fetchUniversities,
    // Aliases for backwards compat
    totalUniversities: total,
    availableFilters: available,
  }
})
