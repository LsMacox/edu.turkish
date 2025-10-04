import { defineStore } from 'pinia'
import type {
  BlogArticleListItem,
  BlogArticlesResponse,
  BlogCategory,
  BlogPopularArticle,
  PaginationMeta,
} from '~~/server/types/api'

interface FetchOptions {
  page?: number
  append?: boolean
  category?: string
  search?: string
}

type ArticlesQuery = {
  page: number
  limit: number
  category?: string
  q?: string
  lang: string
}

export const useBlogStore = defineStore('blog', () => {
  const articles = ref<BlogArticleListItem[]>([])
  const featuredArticle = ref<BlogArticleListItem | null>(null)
  const categories = ref<BlogCategory[]>([])
  const popular = ref<BlogPopularArticle[]>([])
  const pagination = ref<PaginationMeta | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalArticles = ref(0)
  const totalFAQs = ref(0)

  const activeCategory = ref<string>('all')
  const searchQuery = ref<string>('')
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(6)

  const { locale } = useI18n()

  // Simple in-memory request cache to avoid duplicate network calls for the same query.
  // Keeps recent responses for a short time window to improve UX when navigating back/forward.
  const CACHE_TTL_MS = 60_000
  const MAX_CACHE_SIZE = 50
  const requestCache = new Map<string, { timestamp: number; response: BlogArticlesResponse }>()
  const inflightRequests = new Map<string, Promise<BlogArticlesResponse>>()

  const isCacheEntryFresh = (entry: { timestamp: number }): boolean => {
    return Date.now() - entry.timestamp < CACHE_TTL_MS
  }

  const buildCacheKey = (query: ArticlesQuery): string => {
    // Stable order to ensure deterministic keys
    const normalized = {
      lang: query.lang,
      page: query.page,
      limit: query.limit,
      category: query.category ?? '',
      q: query.q ?? '',
    }
    return JSON.stringify(normalized)
  }

  const pruneCache = () => {
    if (requestCache.size <= MAX_CACHE_SIZE) {
      return
    }
    // Drop the oldest half of the entries
    const entries = Array.from(requestCache.entries()).sort(
      (a, b) => a[1].timestamp - b[1].timestamp,
    )
    const toRemove = Math.ceil(entries.length / 2)
    for (let i = 0; i < toRemove; i++) {
      requestCache.delete(entries[i]![0])
    }
  }

  /**
   * Apply API response to store state with respect to pagination and "append" mode.
   */
  const applyArticlesResponse = (
    response: BlogArticlesResponse,
    targetPage: number,
    append: boolean,
  ): void => {
    pagination.value = response.meta ?? null
    categories.value = response.categories ?? []
    popular.value = response.popular ?? []
    totalArticles.value = response.totalArticles ?? 0
    totalFAQs.value = response.totalFAQs ?? 0

    if (!append) {
      articles.value = response.data
      currentPage.value = targetPage
    } else {
      const existingIds = new Set(articles.value.map((article) => article.id))
      const freshArticles = response.data.filter((article) => !existingIds.has(article.id))
      articles.value = [...articles.value, ...freshArticles]
      currentPage.value = targetPage
    }

    if (targetPage === 1) {
      featuredArticle.value = response.featured ?? null
    } else if (!featuredArticle.value) {
      featuredArticle.value = response.featured ?? null
    }
  }

  const hasMore = computed(() => {
    if (!pagination.value) {
      return false
    }
    return currentPage.value < pagination.value.totalPages
  })

  const setCategory = (categoryKey: string) => {
    activeCategory.value = categoryKey
  }

  const setSearchQuery = (value: string) => {
    searchQuery.value = value
  }

  const setPage = (page: number) => {
    currentPage.value = Math.max(1, page)
  }

  const resetPagination = () => {
    currentPage.value = 1
  }

  /**
   * Build typed query object for blog articles endpoint.
   */
  const buildQuery = (overrides?: FetchOptions): ArticlesQuery => {
    const categoryFilter = overrides?.category ?? activeCategory.value
    const search = overrides?.search ?? searchQuery.value
    const page = overrides?.page ?? currentPage.value

    return {
      page,
      limit: pageSize.value,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      q: search ? search : undefined,
      lang: locale.value,
    }
  }

  /**
   * Fetch articles with minimal request de-duplication and short-lived cache.
   * Cache is used only for non-append requests (page loads) to avoid confusing merges.
   */
  const fetchArticles = async (options?: FetchOptions) => {
    const targetPage = options?.page ?? currentPage.value
    const append = Boolean(options?.append && targetPage > 1)

    loading.value = true
    error.value = null

    try {
      const query: ArticlesQuery = buildQuery({
        page: targetPage,
        category: options?.category,
        search: options?.search,
      })

      const cacheKey = buildCacheKey(query)

      if (!append) {
        const cached = requestCache.get(cacheKey)
        if (cached && isCacheEntryFresh(cached)) {
          applyArticlesResponse(cached.response, targetPage, append)
          return cached.response
        }
      }

      let responsePromise = inflightRequests.get(cacheKey)
      if (!responsePromise) {
        responsePromise = $fetch<BlogArticlesResponse>('/api/v1/blog/articles', { query })
        inflightRequests.set(cacheKey, responsePromise)
      }

      const response = await responsePromise
      inflightRequests.delete(cacheKey)

      if (!append) {
        requestCache.set(cacheKey, { timestamp: Date.now(), response })
        pruneCache()
      }

      applyArticlesResponse(response, targetPage, append)
      return response
    } catch (err: any) {
      const statusMessage = err?.data?.statusMessage || err?.message
      error.value = statusMessage || 'Failed to load articles'
      if (process.client) {
        console.error('[blog] Failed to fetch articles', err)
      }
      return null
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    resetPagination()
    return fetchArticles({ page: 1 })
  }

  const loadMore = async () => {
    if (!hasMore.value) {
      return null
    }

    const nextPage = currentPage.value + 1
    return fetchArticles({ page: nextPage, append: true })
  }

  const init = async (options?: { page?: number; category?: string; search?: string }) => {
    if (options?.category) {
      activeCategory.value = options.category
    }
    if (typeof options?.search === 'string') {
      searchQuery.value = options.search
    }
    if (options?.page) {
      currentPage.value = Math.max(1, options.page)
    }

    return fetchArticles({
      page: currentPage.value,
      category: activeCategory.value,
      search: searchQuery.value,
    })
  }

  return {
    articles,
    featuredArticle,
    categories,
    popular,
    pagination,
    loading,
    error,
    totalArticles,
    totalFAQs,
    activeCategory,
    searchQuery,
    currentPage,
    pageSize,
    hasMore,
    setCategory,
    setSearchQuery,
    setPage,
    resetPagination,
    fetchArticles,
    refresh,
    loadMore,
    init,
  }
})
