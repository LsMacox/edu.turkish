import { defineStore } from 'pinia'
import type { BlogArticlesResponse } from '~~/server/types/api'

const CACHE_TTL = 60_000
const CACHE_MAX = 50
const PAGE_SIZE = 6

export const useBlogStore = defineStore('blog', () => {
  const articles = ref<BlogArticlesResponse['data']>([])
  const featured = ref<BlogArticlesResponse['featured']>(null)
  const categories = ref<BlogArticlesResponse['categories']>([])
  const popular = ref<BlogArticlesResponse['popular']>([])
  const pagination = ref<BlogArticlesResponse['meta']>()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalArticles = ref(0)
  const totalFAQs = ref(0)

  const category = ref('all')
  const search = ref('')
  const page = ref(1)

  const { locale } = useI18n()

  const cache = new Map<string, { ts: number; data: BlogArticlesResponse }>()
  const inflight = new Map<string, Promise<BlogArticlesResponse>>()

  const hasMore = computed(() => !!pagination.value && page.value < pagination.value.totalPages)

  const setCategory = (v: string) => (category.value = v)
  const setSearchQuery = (v: string) => (search.value = v)
  const setPage = (v: number) => (page.value = Math.max(1, v))
  const resetPagination = () => (page.value = 1)

  const fetchArticles = async (options?: {
    page?: number
    append?: boolean
    category?: string
    search?: string
  }) => {
    const targetPage = options?.page ?? page.value
    const append = Boolean(options?.append && targetPage > 1)

    const categoryFilter = options?.category ?? category.value
    const searchFilter = options?.search ?? search.value

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
        const cached = cache.get(cacheKey)
        if (cached && Date.now() - cached.ts < CACHE_TTL) {
          applyResponse(cached.data, targetPage, append)
          return cached.data
        }
      }

      let promise = inflight.get(cacheKey)
      if (!promise) {
        promise = $fetch<BlogArticlesResponse>('/api/v1/blog/articles', { query })
        inflight.set(cacheKey, promise)
      }

      const response = await promise
      inflight.delete(cacheKey)

      if (!append) {
        cache.set(cacheKey, { ts: Date.now(), data: response })
        if (cache.size > CACHE_MAX) {
          const sorted = [...cache.entries()].sort((a, b) => a[1].ts - b[1].ts)
          sorted.slice(0, Math.ceil(sorted.length / 2)).forEach(([k]) => cache.delete(k))
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

  const applyResponse = (res: BlogArticlesResponse, p: number, append: boolean) => {
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
    page.value = p

    if (p === 1 || !featured.value) {
      featured.value = res.featured ?? null
    }
  }

  const loadMore = async () => {
    if (!hasMore.value) return null
    return fetchArticles({ page: page.value + 1, append: true })
  }

  return {
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
    hasMore,
    setCategory,
    setSearchQuery,
    setPage,
    resetPagination,
    fetchArticles,
    loadMore,
    // Aliases for backwards compat
    featuredArticle: featured,
    activeCategory: category,
    searchQuery: search,
    currentPage: page,
  }
})
