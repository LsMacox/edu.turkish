import {
  useUrlFilters,
  defineFilterField,
  filterParsers,
  createDebouncedCallback,
} from '../useUrlFilters'

export interface BlogFilters {
  category: string
  search: string
  page: number
}

export interface UseBlogFiltersOptions {
  defaultCategory?: string
  debounceMs?: number
}

export function useBlogFilters(options: UseBlogFiltersOptions = {}) {
  const { defaultCategory = 'all', debounceMs = 400 } = options

  const urlFilters = useUrlFilters<BlogFilters>({
    fields: {
      category: defineFilterField(
        'category',
        defaultCategory,
        filterParsers.string(defaultCategory),
      ),
      search: defineFilterField('q', '', filterParsers.string('')),
      page: defineFilterField('page', 1, filterParsers.positiveInt(1)),
    },
    preserveScroll: true,
  })

  const parseRouteFilters = (): BlogFilters => urlFilters.parseFromRoute()

  const syncRoute = (
    currentState: { category: string; search: string; page: number },
    overrides: Partial<BlogFilters> = {},
  ) => {
    urlFilters.syncToUrl(currentState as BlogFilters, overrides)
  }

  const hasFiltersChanged = (
    filters: BlogFilters,
    currentState: { category: string; search: string; page: number },
  ): boolean => {
    return urlFilters.hasChanged(filters, currentState as BlogFilters)
  }

  const watchRouteChanges = (callback: (filters: BlogFilters) => Promise<void> | void) => {
    urlFilters.watchRouteChanges(callback)
  }

  const { debounced: debouncedSearchFn, clear: clearDebounceTimer } = createDebouncedCallback(
    (value: string, callback: (v: string) => void | Promise<void>) => callback(value),
    debounceMs,
  )

  const createDebouncedSearch = (callback: (value: string) => Promise<void> | void) => {
    return (value: string) => debouncedSearchFn(value, callback)
  }

  onBeforeUnmount(clearDebounceTimer)

  return {
    isUpdatingRoute: urlFilters.isUpdatingRoute,
    parseRouteFilters,
    syncRoute,
    hasFiltersChanged,
    watchRouteChanges,
    createDebouncedSearch,
    clearDebounceTimer,
  }
}
