export interface FaqFilters {
  search: string
  category: string
}

export interface UseFaqFiltersOptions {
  defaultCategory?: string
}

export function useFaqFilters(options: UseFaqFiltersOptions = {}) {
  const { defaultCategory = 'all' } = options
  const route = useRoute()
  const router = useRouter()
  const isUpdatingRoute = ref(false)

  const parseRouteFilters = (): FaqFilters => {
    const q = route.query
    return {
      search: typeof q.q === 'string' ? q.q : '',
      category: typeof q.category === 'string' ? q.category : defaultCategory,
    }
  }

  const syncRoute = (state: { search: string; category: string }) => {
    if (isUpdatingRoute.value) return

    const query: Record<string, string> = {}
    if (state.search) query.q = state.search
    if (state.category !== defaultCategory) query.category = state.category

    isUpdatingRoute.value = true
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0

    router.replace({ query }).finally(() => {
      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => window.scrollTo(0, scrollY))
      }
      nextTick(() => {
        isUpdatingRoute.value = false
      })
    })
  }

  const watchRouteChanges = (callback: (filters: FaqFilters) => Promise<void> | void) => {
    watch(
      () => route.query,
      async () => {
        if (isUpdatingRoute.value) return
        await callback(parseRouteFilters())
      },
    )
  }

  const applyInitialFilters = (setters: {
    setSearch: (value: string) => void
    setCategory: (value: string) => void
  }): FaqFilters => {
    const filters = parseRouteFilters()
    if (filters.search) setters.setSearch(filters.search)
    if (filters.category !== defaultCategory) setters.setCategory(filters.category)
    return filters
  }

  return {
    parseRouteFilters,
    syncRoute,
    watchRouteChanges,
    applyInitialFilters,
  }
}
