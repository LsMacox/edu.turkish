import { defineStore } from 'pinia'
import type { FaqApiItem, FaqCategory, FaqResponse } from '~~/lib/types'
import { FAQ_CATEGORY_ICONS, DEFAULT_FAQ_ICON } from '~~/lib/domain/faq'

const MAX_HISTORY = 10
const HISTORY_KEY = 'faq-search-history'

export interface CategoryWithIcon extends FaqCategory {
  icon: string
}

export const useFAQStore = defineStore('faq', () => {
  const { locale } = useI18n()

  const query = ref('')
  const category = ref('all')
  const items = ref<FaqApiItem[]>([])
  const rawCategories = ref<FaqCategory[]>([])
  const loading = ref(false)
  const history = ref<string[]>([])

  const hasResults = computed(() => items.value.length > 0)
  const resultCount = computed(() => items.value.length)
  const isActiveSearch = computed(() => query.value.trim().length > 0)

  const categories = computed<CategoryWithIcon[]>(() => [
    { key: 'all', name: '', count: 0, icon: FAQ_CATEGORY_ICONS.all! },
    ...rawCategories.value.map((c) => ({
      ...c,
      icon: FAQ_CATEGORY_ICONS[c.key] ?? DEFAULT_FAQ_ICON,
    })),
  ])

  const fetch = async () => {
    const params: Record<string, string> = { lang: locale.value }
    if (query.value.trim()) params.q = query.value.trim()
    if (category.value !== 'all') params.category = category.value

    loading.value = true
    try {
      const res = await $fetch<FaqResponse>('/api/v1/content/faq', {
        query: params,
        headers: { 'Accept-Language': params.lang! },
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
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
      } catch {
        /* ignore storage errors */
      }
    }
  }

  const loadHistory = () => {
    if (!import.meta.client) return
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      if (saved) history.value = JSON.parse(saved).slice(0, MAX_HISTORY)
    } catch {
      /* ignore parse errors */
    }
  }

  const clearHistory = () => {
    history.value = []
    if (import.meta.client) {
      try {
        localStorage.removeItem(HISTORY_KEY)
      } catch {
        /* ignore storage errors */
      }
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
