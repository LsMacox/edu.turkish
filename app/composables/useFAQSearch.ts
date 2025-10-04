import type { SearchOptions } from '~/types/preferences'

/**
 * FAQ Search Composable - Simplified version
 * Provides search functionality for FAQ items with debouncing, filtering, and URL synchronization
 * Now uses API endpoints instead of complex answer processing
 */
export const useFAQSearch = (options: SearchOptions = {}) => {
  const { locale } = useI18n()
  const router = useRouter()
  const route = useRoute()

  const {
    debounceMs = 300,
    maxHistory = 10,
    highlightTags = { open: '<mark class="bg-yellow-200 font-medium">', close: '</mark>' },
  } = options

  // Reactive state using Nuxt's useState for SSR compatibility
  const searchQuery = useState<string>('faqSearch:query', () => '')
  const activeCategory = useState<string>('faqSearch:category', () => 'all')
  const isSearching = useState<boolean>('faqSearch:isSearching', () => false)
  const searchHistory = useState<string[]>('faqSearch:history', () => [])
  const faqData = useState<any>('faqSearch:data', () => ({
    data: [],
    categories: [],
    meta: { total: 0, filtered: 0 },
  }))
  const categoriesLocale = useState<string>('faqSearch:categoriesLocale', () => '')

  // Flag to prevent infinite loops during URL sync
  const isUpdatingFromURL = ref(false)

  // Fetch FAQ data from API
  const fetchFAQData = async () => {
    try {
      isSearching.value = true
      const query: Record<string, any> = {}

      if (searchQuery.value.trim()) {
        query.q = searchQuery.value.trim()
      }

      if (activeCategory.value !== 'all') {
        query.category = activeCategory.value
      }
      // Pass current locale explicitly for API localization
      query.lang = locale.value

      const response = await $fetch('/api/v1/content/faq', {
        query,
        headers: { 'Accept-Language': locale.value },
      })
      // Always update items/meta
      faqData.value = {
        ...faqData.value,
        data: response?.data || [],
        meta: response?.meta || { total: 0, filtered: 0 },
      }
      // Update categories only on first load or when locale actually changed
      if (
        !Array.isArray(faqData.value.categories) ||
        faqData.value.categories.length === 0 ||
        categoriesLocale.value !== locale.value
      ) {
        faqData.value.categories = response?.categories || []
        categoriesLocale.value = locale.value
      }

      // Update search history
      if (searchQuery.value.trim() && searchQuery.value.length > 2) {
        addToSearchHistory(searchQuery.value.trim())
      }
    } catch (error) {
      console.error('Failed to fetch FAQ data:', error)
    } finally {
      isSearching.value = false
    }
  }

  // Debounced search function
  let debounceTimer: NodeJS.Timeout | null = null
  let urlUpdateTimer: NodeJS.Timeout | null = null

  const debouncedSearch = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    // Source of truth is the URL watcher; only update URL here
    debounceTimer = setTimeout(() => {
      debouncedUpdateURL()
    }, debounceMs)
  }

  // Debounced URL update to prevent scroll on every keystroke
  const debouncedUpdateURL = () => {
    if (urlUpdateTimer) {
      clearTimeout(urlUpdateTimer)
    }

    urlUpdateTimer = setTimeout(() => {
      updateURL()
    }, 500) // Update URL after user stops typing for 500ms
  }

  // Search history management
  const addToSearchHistory = (query: string) => {
    const history = [...searchHistory.value]
    const existingIndex = history.indexOf(query)

    if (existingIndex > -1) {
      history.splice(existingIndex, 1)
    }

    history.unshift(query)
    if (history.length > maxHistory) {
      history.splice(maxHistory)
    }

    searchHistory.value = history

    if (process.client) {
      try {
        localStorage.setItem('faq-search-history', JSON.stringify(history))
      } catch (e) {
        console.warn('Failed to save search history to localStorage:', e)
      }
    }
  }

  const clearSearchHistory = () => {
    searchHistory.value = []
    if (process.client) {
      try {
        localStorage.removeItem('faq-search-history')
      } catch (e) {
        console.warn('Failed to clear search history from localStorage:', e)
      }
    }
  }

  // Load search history from localStorage on client side
  const loadSearchHistory = () => {
    if (process.client) {
      try {
        const saved = localStorage.getItem('faq-search-history')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            searchHistory.value = parsed.slice(0, maxHistory)
          }
        }
      } catch (e) {
        console.warn('Failed to load search history from localStorage:', e)
      }
    }
  }

  // Computed properties for results
  const faqCategories = computed(() => faqData.value.categories)
  const filteredFAQItems = computed(() => faqData.value.data)
  const resultCount = computed(() => filteredFAQItems.value.length)
  const hasResults = computed(() => resultCount.value > 0)
  const isActiveSearch = computed(() => searchQuery.value.trim().length > 0)

  // Search term highlighting
  const highlightSearchTerms = (text: string, query: string): string => {
    if (!query.trim()) return text

    const normalizedQuery = query.toLowerCase().trim()
    const queryWords = normalizedQuery.split(/\s+/).filter((word) => word.length > 1)

    let highlightedText = text

    // First try exact phrase match
    const exactRegex = new RegExp(
      `(${normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi',
    )
    highlightedText = highlightedText.replace(
      exactRegex,
      `${highlightTags.open}$1${highlightTags.close}`,
    )

    // Then highlight individual words (if not already highlighted)
    queryWords.forEach((word) => {
      const wordRegex = new RegExp(
        `(?!<mark[^>]*>)(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?![^<]*</mark>)`,
        'gi',
      )
      highlightedText = highlightedText.replace(
        wordRegex,
        `${highlightTags.open}$1${highlightTags.close}`,
      )
    })

    return highlightedText
  }

  // URL synchronization with scroll position preservation
  const updateURL = (_immediate: boolean = false) => {
    if (isUpdatingFromURL.value) return

    const query: Record<string, string> = {}

    if (searchQuery.value.trim()) {
      query.q = searchQuery.value.trim()
    }

    if (activeCategory.value !== 'all') {
      query.category = activeCategory.value
    }

    // Save current scroll position to restore after URL update
    const currentScrollY = typeof window !== 'undefined' ? window.scrollY : 0

    // Use replace to avoid creating history entries for each search
    router
      .replace({
        query: Object.keys(query).length > 0 ? query : undefined,
      })
      .then(() => {
        if (typeof window !== 'undefined') {
          // Restore scroll position after route update completes
          requestAnimationFrame(() => {
            window.scrollTo(0, currentScrollY)
          })
        }
      })
  }

  const initializeFromURL = () => {
    isUpdatingFromURL.value = true
    const urlQuery = route.query.q as string
    const urlCategory = route.query.category as string

    if (urlQuery) {
      searchQuery.value = urlQuery
    }

    if (urlCategory) {
      activeCategory.value = urlCategory
    }

    nextTick(() => {
      isUpdatingFromURL.value = false
      fetchFAQData()
    })
  }

  // Public interface methods
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    debouncedSearch()
  }

  const setActiveCategory = (category: string) => {
    activeCategory.value = category
    updateURL() // Let route watcher trigger a single fetch
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

  // Initialize on mount
  onMounted(() => {
    loadSearchHistory()
    initializeFromURL()
  })

  // When locale changes, refresh categories/items for the new language
  watch(
    () => locale.value,
    () => {
      // Force refresh; categories will be replaced because categoriesLocale differs
      fetchFAQData()
    },
  )

  // Watch for external URL changes
  watch(
    () => route.query,
    () => {
      initializeFromURL()
    },
  )

  return {
    // State
    searchQuery: readonly(searchQuery),
    activeCategory: readonly(activeCategory),
    isSearching: readonly(isSearching),
    searchHistory: readonly(searchHistory),

    // Computed
    faqCategories: readonly(faqCategories),
    filteredFAQItems: readonly(filteredFAQItems),
    resultCount: readonly(resultCount),
    hasResults: readonly(hasResults),
    isActiveSearch: readonly(isActiveSearch),

    // Methods
    setSearchQuery,
    setActiveCategory,
    clearSearch,
    resetFilters,
    highlightSearchTerms,
    clearSearchHistory,
  }
}
