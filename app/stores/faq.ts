import { defineStore, storeToRefs } from 'pinia'
import type { FAQItem, FAQCategory, FAQResponse } from '~~/server/types/api/faq'

const MAX_HISTORY = 10
const HISTORY_KEY = 'faq-search-history'

const CATEGORY_ICONS: Record<string, string> = {
  all: 'mdi:view-grid',
  documents: 'mdi:file-document',
  education: 'mdi:school-outline',
  technology: 'mdi:cellphone-cog',
  residence: 'mdi:home-city',
  relocation: 'mdi:truck-fast',
  insurance: 'mdi:shield-check',
  transport: 'mdi:bus',
  housing: 'mdi:home-outline',
  exams: 'mdi:school',
  admission: 'mdi:clock',
  scholarships: 'mdi:trophy',
  languages: 'mdi:earth',
}

export interface CategoryWithIcon extends FAQCategory {
  icon: string
}

export const useFAQStore = defineStore('faq', () => {
  const { locale } = useI18n()

  const query = ref('')
  const category = ref('all')
  const items = ref<FAQItem[]>([])
  const rawCategories = ref<FAQCategory[]>([])
  const loading = ref(false)
  const history = ref<string[]>([])

  const hasResults = computed(() => items.value.length > 0)
  const resultCount = computed(() => items.value.length)
  const isActiveSearch = computed(() => query.value.trim().length > 0)

  const categories = computed<CategoryWithIcon[]>(() => [
    { key: 'all', name: '', count: 0, icon: CATEGORY_ICONS.all! },
    ...rawCategories.value.map((c) => ({
      ...c,
      icon: CATEGORY_ICONS[c.key] ?? 'mdi:help-circle',
    })),
  ])

  const fetch = async () => {
    loading.value = true
    try {
      const params: Record<string, string> = { lang: locale.value }
      if (query.value.trim()) params.q = query.value.trim()
      if (category.value !== 'all') params.category = category.value

      const res = await $fetch<FAQResponse>('/api/v1/content/faq', {
        query: params,
        headers: { 'Accept-Language': locale.value },
      })

      items.value = res?.data ?? []
      if (res?.categories?.length) rawCategories.value = res.categories
      if (query.value.trim().length > 2) addToHistory(query.value.trim())

      return res
    } catch (e) {
      console.error('[faq] fetch failed', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const search = (q: string, cat?: string) => {
    query.value = q
    if (cat !== undefined) category.value = cat
    return fetch()
  }

  const setCategory = (cat: string) => {
    category.value = cat
    return fetch()
  }

  const reset = () => {
    query.value = ''
    category.value = 'all'
    return fetch()
  }

  // History
  const addToHistory = (q: string) => {
    history.value = [q, ...history.value.filter((h) => h !== q)].slice(0, MAX_HISTORY)
    if (import.meta.client) {
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value)) } catch {}
    }
  }

  const loadHistory = () => {
    if (!import.meta.client) return
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      if (saved) history.value = JSON.parse(saved).slice(0, MAX_HISTORY)
    } catch {}
  }

  const clearHistory = () => {
    history.value = []
    if (import.meta.client) {
      try { localStorage.removeItem(HISTORY_KEY) } catch {}
    }
  }

  return {
    // State
    query,
    category,
    items,
    categories,
    loading,
    history,
    // Computed
    hasResults,
    resultCount,
    isActiveSearch,
    // Actions
    fetch,
    search,
    setCategory,
    reset,
    loadHistory,
    clearHistory,
  }
})

export const useFAQ = () => {
  const store = useFAQStore()
  return {
    ...storeToRefs(store),
    search: store.search,
    setCategory: store.setCategory,
    reset: store.reset,
    fetch: store.fetch,
    loadHistory: store.loadHistory,
    clearHistory: store.clearHistory,
  }
}
