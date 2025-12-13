import type { BlogArticlesResponse } from '~~/lib/types'

const PAGE_SIZE = 6

export interface BlogFilters {
  category: string
  search: string
  page: number
}

/**
 * Unified composable for blog page: handles URL sync, state, and data fetching.
 * Replaces complex useUrlFilters + store filter state pattern.
 */
export function useBlogPage() {
  const route = useRoute()
  const router = useRouter()
  const { locale } = useI18n()

  // --- State ---
  const articles = ref<BlogArticlesResponse['data']>([])
  const featured = ref<BlogArticlesResponse['featured']>(null)
  const categories = ref<BlogArticlesResponse['categories']>([])
  const popular = ref<BlogArticlesResponse['popular']>([])
  const pagination = ref<BlogArticlesResponse['meta']>()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalArticles = ref(0)
  const totalFAQs = ref(0)

  // Filter state (synced with URL)
  const category = ref('all')
  const search = ref('')
  const page = ref(1)

  // Local search input (for debouncing)
  const searchInput = ref('')

  // Debounce timer
  let searchTimer: ReturnType<typeof setTimeout> | null = null

  // Route update lock
  const isUpdatingRoute = ref(false)

  // --- URL Parsing ---
  const parseFiltersFromUrl = (): BlogFilters => {
    const q = route.query
    return {
      category: typeof q.category === 'string' ? q.category : 'all',
      search: typeof q.q === 'string' ? q.q : '',
      page: Math.max(1, parseInt(String(q.page), 10) || 1),
    }
  }

  // --- URL Sync ---
  const syncToUrl = (overrides: Partial<BlogFilters> = {}) => {
    if (isUpdatingRoute.value) return

    const state = { category: category.value, search: search.value, page: page.value, ...overrides }
    const query: Record<string, string> = {}

    if (state.category !== 'all') query.category = state.category
    if (state.search) query.q = state.search
    if (state.page > 1) query.page = String(state.page)

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

  // --- Data Fetching ---
  const fetchArticles = async (opts?: Partial<BlogFilters>) => {
    const targetCategory = opts?.category ?? category.value
    const targetSearch = opts?.search ?? search.value
    const targetPage = opts?.page ?? page.value

    const query = {
      page: targetPage,
      limit: PAGE_SIZE,
      category: targetCategory !== 'all' ? targetCategory : undefined,
      q: targetSearch || undefined,
      lang: locale.value,
    }

    loading.value = true
    error.value = null

    try {
      const res = await $fetch<BlogArticlesResponse>('/api/v1/blog/articles', { query })
      articles.value = res.data
      featured.value = res.featured ?? null
      categories.value = res.categories ?? []
      popular.value = res.popular ?? []
      pagination.value = res.meta
      totalArticles.value = res.totalArticles ?? 0
      totalFAQs.value = res.totalFAQs ?? 0
      page.value = targetPage
      return res
    } catch (err: unknown) {
      const e = err as { data?: { statusMessage?: string }; message?: string }
      error.value = e?.data?.statusMessage || e?.message || 'Failed to load articles'
      if (import.meta.client) console.error('[blog] Failed to fetch articles', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // --- Actions ---
  const setCategory = async (newCategory: string) => {
    if (category.value === newCategory) return
    category.value = newCategory
    page.value = 1
    const res = await fetchArticles({ category: newCategory, page: 1 })
    if (res) syncToUrl({ category: newCategory, page: 1 })
  }

  const setPage = async (newPage: number) => {
    if (page.value === newPage || loading.value) return
    page.value = newPage
    const res = await fetchArticles({ page: newPage })
    if (res) {
      syncToUrl({ page: newPage })
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  // Internal debounced search watcher
  const setupSearchWatcher = () => {
    watch(searchInput, (value) => {
      if (searchTimer) clearTimeout(searchTimer)
      searchTimer = setTimeout(async () => {
        if (value === search.value) return
        search.value = value
        page.value = 1
        const res = await fetchArticles({ search: value, page: 1 })
        if (res) syncToUrl({ search: value, page: 1 })
      }, 400)
    })
  }

  // --- Initialization ---
  const initialize = async () => {
    const filters = parseFiltersFromUrl()
    category.value = filters.category
    search.value = filters.search
    searchInput.value = filters.search
    page.value = filters.page
    await fetchArticles(filters)
  }

  // --- Route Change Watcher ---
  const watchRouteChanges = () => {
    watch(
      () => route.query,
      async () => {
        if (isUpdatingRoute.value) return
        const filters = parseFiltersFromUrl()
        const changed =
          filters.category !== category.value ||
          filters.search !== search.value ||
          filters.page !== page.value

        if (!changed) {
          if (searchInput.value !== filters.search) searchInput.value = filters.search
          return
        }

        category.value = filters.category
        search.value = filters.search
        searchInput.value = filters.search
        page.value = filters.page
        await fetchArticles(filters)
      },
    )
  }

  // Cleanup
  onBeforeUnmount(() => {
    if (searchTimer) clearTimeout(searchTimer)
  })

  return {
    // State
    articles,
    featured,
    categories,
    popular,
    pagination,
    loading,
    error,
    totalArticles,
    totalFAQs,
    category,
    search,
    page,
    searchInput,

    // Actions
    setCategory,
    setPage,
    initialize,
    watchRouteChanges,
    setupSearchWatcher,
    fetchArticles,
  }
}
