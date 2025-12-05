const HIGHLIGHT_OPEN = '<mark class="bg-yellow-200 font-medium">'
const HIGHLIGHT_CLOSE = '</mark>'
const DEBOUNCE_MS = 300
const MAX_HISTORY = 10

export const useFAQSearch = () => {
  const { locale } = useI18n()
  const router = useRouter()
  const route = useRoute()

  const searchQuery = useState('faqSearch:query', () => '')
  const activeCategory = useState('faqSearch:category', () => 'all')
  const isSearching = useState('faqSearch:isSearching', () => false)
  const searchHistory = useState<string[]>('faqSearch:history', () => [])
  const faqData = useState('faqSearch:data', () => ({
    data: [] as any[],
    categories: [] as any[],
    meta: { count: 0 },
  }))
  const categoriesLocale = useState('faqSearch:categoriesLocale', () => '')
  const isUpdatingFromURL = ref(false)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const fetchFAQData = async () => {
    try {
      isSearching.value = true
      const query: Record<string, string> = { lang: locale.value }

      if (searchQuery.value.trim()) query.q = searchQuery.value.trim()
      if (activeCategory.value !== 'all') query.category = activeCategory.value

      const response = await $fetch('/api/v1/content/faq', {
        query,
        headers: { 'Accept-Language': locale.value },
      })

      faqData.value = {
        ...faqData.value,
        data: response?.data || [],
        meta: response?.meta || { total: 0, filtered: 0 },
      }

      if (!faqData.value.categories.length || categoriesLocale.value !== locale.value) {
        faqData.value.categories = response?.categories || []
        categoriesLocale.value = locale.value
      }

      if (searchQuery.value.trim().length > 2) {
        addToSearchHistory(searchQuery.value.trim())
      }

      return faqData.value
    } catch (error) {
      console.error('Failed to fetch FAQ data:', error)
      return null
    } finally {
      isSearching.value = false
    }
  }

  const updateURL = () => {
    if (isUpdatingFromURL.value) return

    const query: Record<string, string> = {}
    if (searchQuery.value.trim()) query.q = searchQuery.value.trim()
    if (activeCategory.value !== 'all') query.category = activeCategory.value

    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0

    router.replace({ query: Object.keys(query).length ? query : undefined }).then(() => {
      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => window.scrollTo(0, scrollY))
      }
    })
  }

  const debouncedUpdateURL = () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(updateURL, DEBOUNCE_MS)
  }

  const addToSearchHistory = (query: string) => {
    const history = searchHistory.value.filter((h) => h !== query)
    history.unshift(query)
    searchHistory.value = history.slice(0, MAX_HISTORY)

    if (import.meta.client) {
      try {
        localStorage.setItem('faq-search-history', JSON.stringify(searchHistory.value))
      } catch {
        // ignore storage errors
      }
    }
  }

  const clearSearchHistory = () => {
    searchHistory.value = []
    if (import.meta.client) {
      try {
        localStorage.removeItem('faq-search-history')
      } catch {
        // ignore storage errors
      }
    }
  }

  const loadSearchHistory = () => {
    if (!import.meta.client) return
    try {
      const saved = localStorage.getItem('faq-search-history')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) searchHistory.value = parsed.slice(0, MAX_HISTORY)
      }
    } catch {
      // ignore storage errors
    }
  }

  const faqCategories = computed(() => faqData.value.categories)
  const filteredFAQItems = computed(() => faqData.value.data)
  const resultCount = computed(() => filteredFAQItems.value.length)
  const hasResults = computed(() => resultCount.value > 0)
  const isActiveSearch = computed(() => searchQuery.value.trim().length > 0)

  const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const highlightSearchTerms = (text: string, query: string): string => {
    if (!query.trim()) return text

    const normalized = query.toLowerCase().trim()
    const words = normalized.split(/\s+/).filter((w) => w.length > 1)

    let result = text.replace(
      new RegExp(`(${escapeRegex(normalized)})`, 'gi'),
      `${HIGHLIGHT_OPEN}$1${HIGHLIGHT_CLOSE}`,
    )

    words.forEach((word) => {
      result = result.replace(
        new RegExp(`(?!<mark[^>]*>)(${escapeRegex(word)})(?![^<]*</mark>)`, 'gi'),
        `${HIGHLIGHT_OPEN}$1${HIGHLIGHT_CLOSE}`,
      )
    })

    return result
  }

  const initializeFromURL = () => {
    isUpdatingFromURL.value = true
    if (route.query.q) searchQuery.value = route.query.q as string
    if (route.query.category) activeCategory.value = route.query.category as string

    nextTick(() => {
      isUpdatingFromURL.value = false
      fetchFAQData()
    })
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    debouncedUpdateURL()
  }

  const setActiveCategory = (category: string) => {
    activeCategory.value = category
    updateURL()
  }

  const clearSearch = () => {
    searchQuery.value = ''
    isSearching.value = false
    updateURL()
  }

  const resetFilters = () => {
    searchQuery.value = ''
    activeCategory.value = 'all'
    isSearching.value = false
    updateURL()
  }

  onMounted(loadSearchHistory)

  watch(() => locale.value, fetchFAQData)

  watch(
    () => route.query,
    (newQuery, oldQuery) => {
      if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) initializeFromURL()
    },
  )

  if (route.query.q !== undefined || route.query.category !== undefined) {
    if (route.query.q !== undefined) searchQuery.value = route.query.q as string
    if (route.query.category !== undefined) activeCategory.value = route.query.category as string
  } else if (import.meta.client && !useNuxtApp().isHydrating) {
    searchQuery.value = ''
    activeCategory.value = 'all'
  }

  return {
    searchQuery: readonly(searchQuery),
    activeCategory: readonly(activeCategory),
    isSearching: readonly(isSearching),
    searchHistory: readonly(searchHistory),
    faqCategories: readonly(faqCategories),
    filteredFAQItems: readonly(filteredFAQItems),
    resultCount: readonly(resultCount),
    hasResults: readonly(hasResults),
    isActiveSearch: readonly(isActiveSearch),
    setSearchQuery,
    setActiveCategory,
    clearSearch,
    resetFilters,
    highlightSearchTerms,
    clearSearchHistory,
    refresh: fetchFAQData,
  }
}
