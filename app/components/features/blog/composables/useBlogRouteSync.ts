import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface BlogFilters {
  category: string
  search: string
  page: number
}

/**
 * Composable for syncing blog filters with URL query parameters
 */
export function useBlogRouteSync() {
  const router = useRouter()
  const route = useRoute()
  const isUpdatingRoute = ref(false)

  /**
   * Parse filters from current route query
   */
  function parseRouteFilters(currentRoute?: RouteLocationNormalizedLoaded): BlogFilters {
    const r = currentRoute ?? route
    const category =
      typeof r.query.category === 'string' && r.query.category ? r.query.category : 'all'
    const search = typeof r.query.q === 'string' ? r.query.q : ''
    const rawPage = Array.isArray(r.query.page) ? r.query.page[0] : r.query.page
    const pageValue = rawPage ? Number(rawPage) : 1
    const page = Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1

    return { category, search, page }
  }

  /**
   * Sync filters to URL query, preserving scroll position
   */
  function syncRoute(filters: Partial<BlogFilters>, currentFilters: BlogFilters) {
    const category = filters.category ?? currentFilters.category
    const q = filters.search ?? currentFilters.search
    const page = filters.page ?? currentFilters.page

    const query: Record<string, string> = {}
    if (q) {
      query.q = q
    }
    if (category && category !== 'all') {
      query.category = category
    }
    if (page > 1) {
      query.page = String(page)
    }

    const currentScrollY = typeof window !== 'undefined' ? window.scrollY : 0

    isUpdatingRoute.value = true
    router
      .replace({ query })
      .then(() => {
        if (typeof window !== 'undefined') {
          requestAnimationFrame(() => {
            window.scrollTo(0, currentScrollY)
          })
        }
      })
      .finally(() => {
        nextTick(() => {
          isUpdatingRoute.value = false
        })
      })
  }

  /**
   * Check if filters have changed compared to current state
   */
  function hasFiltersChanged(
    newFilters: BlogFilters,
    currentCategory: string,
    currentSearch: string,
    currentPage: number,
  ): boolean {
    return (
      newFilters.category !== currentCategory ||
      newFilters.search !== currentSearch ||
      newFilters.page !== currentPage
    )
  }

  return {
    parseRouteFilters,
    syncRoute,
    hasFiltersChanged,
    isUpdatingRoute: readonly(isUpdatingRoute),
  }
}
