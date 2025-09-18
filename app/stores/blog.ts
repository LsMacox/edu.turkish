import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  BlogArticleListItem,
  BlogArticlesResponse,
  BlogCategory,
  BlogPopularArticle,
  PaginationMeta
} from '../../server/types/api'

interface FetchOptions {
  page?: number
  append?: boolean
  category?: string
  search?: string
}

export const useBlogStore = defineStore('blog', () => {
  const articles = ref<BlogArticleListItem[]>([])
  const featuredArticle = ref<BlogArticleListItem | null>(null)
  const categories = ref<BlogCategory[]>([])
  const popular = ref<BlogPopularArticle[]>([])
  const pagination = ref<PaginationMeta | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const activeCategory = ref<string>('all')
  const searchQuery = ref<string>('')
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(6)

  const { locale } = useI18n()

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

  const buildQuery = (overrides?: FetchOptions) => {
    const categoryFilter = overrides?.category ?? activeCategory.value
    const search = overrides?.search ?? searchQuery.value
    const page = overrides?.page ?? currentPage.value

    return {
      page,
      limit: pageSize.value,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      q: search ? search : undefined,
      lang: locale.value
    }
  }

  const fetchArticles = async (options?: FetchOptions) => {
    const targetPage = options?.page ?? currentPage.value
    const append = Boolean(options?.append && targetPage > 1)

    loading.value = true
    error.value = null

    try {
      const query = buildQuery({
        page: targetPage,
        category: options?.category,
        search: options?.search
      })

      const response = await $fetch<BlogArticlesResponse>('/api/v1/blog/articles', {
        query
      })

      pagination.value = response.meta ?? null
      categories.value = response.categories ?? []
      popular.value = response.popular ?? []

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
      search: searchQuery.value
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
    init
  }
})

