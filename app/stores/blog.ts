import { defineStore } from 'pinia'
import type { BlogArticlesResponse } from '~~/server/types/api'

const CACHE_TTL_MS = 60_000
const MAX_CACHE_SIZE = 50
const PAGE_SIZE = 6

export const useBlogStore = defineStore('blog', () => {
  const articles = ref<BlogArticlesResponse['data']>([])
  const featuredArticle = ref<BlogArticlesResponse['featured']>(null)
  const categories = ref<BlogArticlesResponse['categories']>([])
  const popular = ref<BlogArticlesResponse['popular']>([])
  const pagination = ref<BlogArticlesResponse['meta']>()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalArticles = ref(0)
  const totalFAQs = ref(0)

  const activeCategory = ref('all')
  const searchQuery = ref('')
  const currentPage = ref(1)

  const { locale } = useI18n()

  const requestCache = new Map<string, { timestamp: number; response: BlogArticlesResponse }>()
  const inflightRequests = new Map<string, Promise<BlogArticlesResponse>>()

  const hasMore = computed(
    () => !!pagination.value && currentPage.value < pagination.value.totalPages,
  )

  const setCategory = (v: string) => (activeCategory.value = v)
  const setSearchQuery = (v: string) => (searchQuery.value = v)
  const setPage = (v: number) => (currentPage.value = Math.max(1, v))
  const resetPagination = () => (currentPage.value = 1)

  const fetchArticles = async (options?: {
    page?: number
    append?: boolean
    category?: string
    search?: string
  }) => {
    const targetPage = options?.page ?? currentPage.value
    const append = Boolean(options?.append && targetPage > 1)

    const categoryFilter = options?.category ?? activeCategory.value
    const searchFilter = options?.search ?? searchQuery.value

    const query = {
      page: targetPage,
      limit: PAGE_SIZE,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      q: searchFilter || undefined,
      lang: locale.value,
    }
    const cacheKey = JSON.stringify(query)

    loading.value = true
    error.value = null

    try {
      if (!append) {
        const cached = requestCache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
          applyResponse(cached.response, targetPage, append)
          return cached.response
        }
      }

      let promise = inflightRequests.get(cacheKey)
      if (!promise) {
        promise = $fetch<BlogArticlesResponse>('/api/v1/blog/articles', { query })
        inflightRequests.set(cacheKey, promise)
      }

      const response = await promise
      inflightRequests.delete(cacheKey)

      if (!append) {
        requestCache.set(cacheKey, { timestamp: Date.now(), response })
        if (requestCache.size > MAX_CACHE_SIZE) {
          const sorted = [...requestCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)
          sorted.slice(0, Math.ceil(sorted.length / 2)).forEach(([k]) => requestCache.delete(k))
        }
      }

      applyResponse(response, targetPage, append)
      return response
    } catch (err: unknown) {
      const e = err as { data?: { statusMessage?: string }; message?: string }
      error.value = e?.data?.statusMessage || e?.message || 'Failed to load articles'
      if (import.meta.client) console.error('[blog] Failed to fetch articles', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const applyResponse = (res: BlogArticlesResponse, page: number, append: boolean) => {
    pagination.value = res.meta
    categories.value = res.categories ?? []
    popular.value = res.popular ?? []
    totalArticles.value = res.totalArticles ?? 0
    totalFAQs.value = res.totalFAQs ?? 0

    if (append) {
      const ids = new Set(articles.value.map((a) => a.id))
      articles.value = [...articles.value, ...res.data.filter((a) => !ids.has(a.id))]
    } else {
      articles.value = res.data
    }
    currentPage.value = page

    if (page === 1 || !featuredArticle.value) {
      featuredArticle.value = res.featured ?? null
    }
  }

  const loadMore = async () => {
    if (!hasMore.value) return null
    return fetchArticles({ page: currentPage.value + 1, append: true })
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
    hasMore,
    setCategory,
    setSearchQuery,
    setPage,
    resetPagination,
    fetchArticles,
    loadMore,
  }
})
