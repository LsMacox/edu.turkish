<template>
  <div class="bg-white">
    <section class="bg-gradient-to-b from-gray-50 to-white pt-6 md:pt-8 pb-4">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h1 class="text-section-title">
              {{ t(faqNs('title')) }}
            </h1>
            <p class="text-section-subtitle mt-1">
              {{ t(faqNs('subtitle')) }}
            </p>
          </div>
        </div>
        <div class="relative">
          <input
            :id="searchInputId"
            :name="searchInputId"
            :value="searchQuery"
            type="text"
            :placeholder="t(faqNs('searchPlaceholder'))"
            class="w-full px-4 py-3 pl-10 pr-10 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all min-h-touch-44"
            @input="handleSearchInput"
          />
          <Icon
            name="mdi:magnify"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
          />

          <button
            v-if="searchQuery"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 min-w-touch-44 min-h-touch-44 flex items-center justify-center"
            :aria-label="t(key('common.clear'))"
            @click="clearSearch"
          >
            <Icon name="mdi:close" class="w-5 h-5" />
          </button>

          <div
            v-if="showSearchSuggestions && searchHistory.length > 0"
            class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10"
          >
            <div class="p-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">{{ t(faqNs('recentSearches')) }}</h4>
              <div class="space-y-1">
                <button
                  v-for="suggestion in searchHistory.slice(0, 5)"
                  :key="suggestion"
                  class="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  @click="setSearchQuery(suggestion)"
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isActiveSearch" class="mt-4 flex items-center justify-between">
          <p class="text-sm text-gray-600">
            <span v-if="isSearching">{{ t(faqNs('searching')) }}...</span>
            <span v-else-if="hasResults">
              {{ t(faqNs('searchResults'), { count: resultCount, query: searchQuery }) }}
            </span>
            <span v-else>{{ t(faqNs('noResults'), { query: searchQuery }) }}</span>
          </p>

          <button
            v-if="searchHistory.length > 0"
            class="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            @click="clearSearchHistory"
          >
            {{ t(faqNs('clearHistory')) }}
          </button>
        </div>

        <div v-if="faqStatus === 'success'" class="flex flex-wrap gap-2 mt-5">
          <button
            v-for="category in ssrCategories"
            :key="category.key"
            :class="[
              'px-3 py-1.5 text-sm rounded-full font-medium transition-all min-h-touch-44 flex items-center gap-1.5',
              activeCategory === category.key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200',
            ]"
            :aria-pressed="activeCategory === category.key"
            @click="setActiveCategory(category.key)"
          >
            <Icon :name="category.icon" class="w-4 h-4" />
            <span>{{ getCategoryLabel(category.key, category.name) }}</span>
          </button>
        </div>
      </div>
    </section>

    <section class="py-6 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="isActiveSearch && !hasResults && !isSearching" class="text-center py-12">
          <Icon name="mdi:magnify-close" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-card-title mb-2">{{ t(faqNs('noResultsTitle')) }}</h3>
          <p class="text-gray-500 mb-6">{{ t(faqNs('noResultsMessage'), { query: searchQuery }) }}</p>

          <div class="space-y-3">
            <p class="text-sm text-gray-600">{{ t(faqNs('tryThese')) }}:</p>
            <div class="flex flex-wrap justify-center gap-2">
              <button
                v-for="suggestion in popularSearches"
                :key="suggestion"
                class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                @click="setSearchQuery(suggestion)"
              >
                {{ suggestion }}
              </button>
            </div>
            <button
              class="text-primary hover:text-primary-dark font-medium text-sm"
              @click="resetFilters"
            >
              {{ t(faqNs('showAllQuestions')) }}
            </button>
          </div>
        </div>

        <!-- eslint-disable vue/no-v-html -->
        <div v-else-if="filteredFAQItems.length > 0" class="space-y-3 sm:space-y-6">
          <div
            v-for="item in filteredFAQItems"
            :key="item.id"
            class="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              class="w-full px-4 py-3 sm:px-6 sm:py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-xl sm:rounded-2xl min-h-touch-44"
              @click="toggleFAQ(item.id)"
            >
              <span
                class="text-base sm:text-lg font-medium text-secondary pr-4"
                v-html="highlightSearchTerms(item.question, searchQuery)"
              />
              <Icon
                name="mdi:chevron-down"
                :class="[
                  'text-gray-400 transition-transform w-5 h-5 flex-shrink-0',
                  openItems[item.id] ? 'rotate-180' : '',
                ]"
              />
            </button>

            <div v-if="openItems[item.id]" class="px-4 pb-4 sm:px-6 sm:pb-6">
              <div class="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div
                  class="faq-content prose prose-gray max-w-none"
                  v-html="highlightSearchTerms(item.answer, searchQuery)"
                />

                <div class="mt-4 pt-4 border-t border-gray-200">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <Icon
                      :name="
                        categories.find((c) => c.key === item.category)?.icon || 'ph:question'
                      "
                      class="w-3 h-3 mr-1"
                    />
                    {{ getCategoryLabel(item.category) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- eslint-enable vue/no-v-html -->

        <div v-else-if="isSearching" class="text-center py-12">
          <Icon name="mdi:loading" class="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p class="text-gray-600">{{ t(faqNs('searching')) }}...</p>
        </div>

        <div v-else class="text-center py-12">
          <Icon
            name="mdi:frequently-asked-questions"
            class="w-16 h-16 text-gray-300 mx-auto mb-4"
          />
          <h3 class="text-card-title mb-2">{{ t(faqNs('startSearching')) }}</h3>
          <p class="text-gray-500">{{ t(faqNs('startSearchingMessage')) }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { highlightSearchTerms } from '~~/lib/utils/text'
import { useFAQStore } from '~/stores/faq'
import { useFaqFilters } from '~/composables/useFaqFilters'
import { namespace, key } from '~~/lib/i18n'
import { FAQ_CATEGORY_ICONS, DEFAULT_FAQ_ICON } from '~~/lib/domain/faq'

definePageMeta({ layout: 'default' })

const faqNs = namespace('faq')
const { t, locale } = useI18n()
const searchInputId = useId()

const faqStore = useFAQStore()
const {
  query: searchQuery,
  category: activeCategory,
  loading: isSearching,
  history: searchHistory,
  categories,
  items: filteredFAQItems,
  resultCount,
  hasResults,
  isActiveSearch,
} = storeToRefs(faqStore)
const {
  search,
  setCategory,
  reset,
  fetch: fetchFAQ,
  loadHistory,
  clearHistory: clearSearchHistory,
} = faqStore

const { syncRoute, applyInitialFilters, watchRouteChanges } = useFaqFilters()

const currentState = () => ({
  search: searchQuery.value,
  category: activeCategory.value,
})

const setSearchQuery = (q: string) => {
  search(q)
  syncRoute(currentState())
}

const setActiveCategory = (c: string) => {
  setCategory(c)
  syncRoute(currentState())
}

const clearSearch = () => {
  search('')
  syncRoute(currentState())
}

const resetFilters = () => {
  reset()
  syncRoute(currentState())
}

applyInitialFilters({
  setSearch: (v: string) => (searchQuery.value = v),
  setCategory: (v: string) => (activeCategory.value = v),
})

const { status: faqStatus, data: faqData } = await useAsyncData(`faq-${locale.value}`, fetchFAQ, {
  watch: [locale],
})

// Use categories from async data to ensure SSR/client consistency
const ssrCategories = computed(() => {
  if (!faqData.value?.categories) return categories.value
  return [
    { key: 'all', name: '', count: 0, icon: FAQ_CATEGORY_ICONS.all! },
    ...faqData.value.categories.map((c: any) => ({
      ...c,
      icon: FAQ_CATEGORY_ICONS[c.key] ?? DEFAULT_FAQ_ICON,
    })),
  ]
})

watchRouteChanges((filters: { search: string; category: string }) => {
  searchQuery.value = filters.search
  activeCategory.value = filters.category
  fetchFAQ()
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: filteredFAQItems.value.map((item: any) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }),
      ),
    },
  ],
})

const openItems = ref<Record<number, boolean>>({})
const showSearchSuggestions = ref(false)

const getCategoryLabel = (key: string, fallbackName?: string) => {
  if (key === 'all') {
    return t(faqNs('categories.all.title'))
  }
  // Look up translated name from categories if no fallback provided
  if (!fallbackName) {
    const cat = ssrCategories.value.find((c) => c.key === key)
    if (cat?.name) return cat.name
  }
  return fallbackName || key
}

const popularSearches = computed(() => [
  t(faqNs('popularSearches.documents')),
  t(faqNs('popularSearches.scholarships')),
  t(faqNs('popularSearches.exams')),
  t(faqNs('popularSearches.language')),
])

const toggleFAQ = (itemId: number) => {
  openItems.value[itemId] = !openItems.value[itemId]
}

const handleSearchInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  setSearchQuery(val)
  showSearchSuggestions.value = val.length === 0
}

const onKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    document.querySelector<HTMLInputElement>('input[type="text"]')?.focus()
  }
  if (e.key === 'Escape' && searchQuery.value) clearSearch()
}

const onClickOutside = (e: Event) => {
  if (!(e.target as Element).closest('.relative')) showSearchSuggestions.value = false
}

onMounted(() => {
  loadHistory()
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onClickOutside)
})
</script>
