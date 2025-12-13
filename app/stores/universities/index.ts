import { defineStore } from 'pinia'
import type {
    University,
    UniversityQueryParams,
    UniversityFilters as ApiFilters,
    PaginationMeta,
} from '~~/lib/types'
import { useUrlFilters, defineFilterField, filterParsers } from '~/composables/useUrlFilters'
import {
    CITY_ALL,
    TYPE_ALL,
    LEVEL_ALL,
    SORT_OPTIONS,
    DEFAULT_SORT,
    VALID_LEVELS,
    DEFAULT_PRICE_MIN,
    DEFAULT_PRICE_MAX,
} from './constants'
import type { SortOption, Filters, FetchOpts, UniversityUrlFilters } from './types'
import { normalizeLevel, createDefaultFilters, parseFiltersFromQuery } from './utils'

export {
    CITY_ALL,
    TYPE_ALL,
    LEVEL_ALL,
    SORT_OPTIONS,
    DEFAULT_SORT,
    VALID_LEVELS,
}
export type { SortOption, Filters, FetchOpts, UniversityUrlFilters }

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
        priceRange: [DEFAULT_PRICE_MIN, DEFAULT_PRICE_MAX],
    })

    const { locale } = useI18n({ useScope: 'global' })
    
    // Get route once at store level to avoid context issues
    const route = useRoute()

    // --- Helpers ---
    const defaultFilters = () => createDefaultFilters(available.value.priceRange as [number, number])

    const parseFiltersFromURL = (): Filters => {
        const { query } = route
        return parseFiltersFromQuery(query as Record<string, unknown>, available.value)
    }

    // --- Reactive state ---
    const filters = ref<Filters>(defaultFilters())
    const sort = ref<SortOption>(DEFAULT_SORT)

    // URL filters composable for sync logic
    const urlFilters = useUrlFilters<UniversityUrlFilters>({
        fields: {
            q: defineFilterField('q', '', filterParsers.string('')),
            city: defineFilterField('city', CITY_ALL, filterParsers.string(CITY_ALL)),
            langs: defineFilterField('langs', [] as string[], filterParsers.stringArray()),
            type: defineFilterField('type', TYPE_ALL, filterParsers.string(TYPE_ALL)),
            level: defineFilterField('level', LEVEL_ALL, filterParsers.string(LEVEL_ALL)),
            price_min: defineFilterField('price_min', DEFAULT_PRICE_MIN, filterParsers.number(DEFAULT_PRICE_MIN)),
            price_max: defineFilterField('price_max', DEFAULT_PRICE_MAX, filterParsers.number(DEFAULT_PRICE_MAX)),
            sort: defineFilterField('sort', DEFAULT_SORT, filterParsers.enum(SORT_OPTIONS, DEFAULT_SORT)),
        },
        preserveScroll: true,
    })

    // --- API ---
    const filtersLoaded = ref(false)

    const fetchFilters = async () => {
        if (filtersLoaded.value) return
        try {
            const res = await $fetch<ApiFilters>('/api/v1/universities/filters', {
                headers: { 'Accept-Language': locale.value },
            })
            available.value = res
            filtersLoaded.value = true

            const [min, max] = res.priceRange
            const { query } = route
            if (!query.price_min && !query.price_max) {
                filters.value.price = [min, max]
            } else {
                filters.value.price = [
                    Math.max(min, Math.min(filters.value.price[0], max)),
                    Math.min(max, Math.max(filters.value.price[1], min)),
                ]
            }
        } catch (e) {
            console.error('Failed to fetch filters:', e)
        }
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

            const res = await $fetch<{ data: University[]; meta: PaginationMeta }>('/api/v1/universities', { query: params })

            // Append on pagination, replace otherwise
            if (opts?.page && opts.page > 1) {
                const ids = new Set(universities.value.map((u) => u.id))
                universities.value = [...universities.value, ...res.data.filter((u) => !ids.has(u.id))]
            } else {
                universities.value = res.data
            }

            total.value = res.meta.total
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
            price_min: filters.value.price[0] !== def.price[0] ? filters.value.price[0] : DEFAULT_PRICE_MIN,
            price_max: filters.value.price[1] !== def.price[1] ? filters.value.price[1] : DEFAULT_PRICE_MAX,
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
        const { query } = route
        filters.value = parseFiltersFromURL()

        const qSort = typeof query.sort === 'string' ? query.sort : ''
        sort.value = (SORT_OPTIONS as readonly string[]).includes(qSort)
            ? (qSort as SortOption)
            : DEFAULT_SORT

        // Загружаем фильтры параллельно с университетами
        if (opts?.ssr) {
            await Promise.all([fetchFilters(), fetchUniversities(opts)])
        } else {
            urlFilters.skipNextSync.value = true
            nextTick(() => {
                urlFilters.skipNextSync.value = false
                Promise.all([fetchFilters(), fetchUniversities(opts)])
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
        fetchFilters,
        // Aliases for backwards compat
        totalUniversities: total,
        availableFilters: available,
    }
})
