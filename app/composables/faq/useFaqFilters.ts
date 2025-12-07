import { useUrlFilters, defineFilterField, filterParsers } from '../useUrlFilters'

export interface FaqFilters {
  search: string
  category: string
}

export interface UseFaqFiltersOptions {
  defaultCategory?: string
}

export function useFaqFilters(options: UseFaqFiltersOptions = {}) {
  const { defaultCategory = 'all' } = options

  const urlFilters = useUrlFilters<FaqFilters>({
    fields: {
      search: defineFilterField('q', '', filterParsers.string('')),
      category: defineFilterField(
        'category',
        defaultCategory,
        filterParsers.string(defaultCategory),
      ),
    },
    preserveScroll: true,
  })

  const parseRouteFilters = (): FaqFilters => urlFilters.parseFromRoute()

  const syncRoute = (currentState: { search: string; category: string }) => {
    urlFilters.syncToUrl(currentState as FaqFilters)
  }

  const watchRouteChanges = (callback: (filters: FaqFilters) => Promise<void> | void) => {
    urlFilters.watchRouteChanges(callback)
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
