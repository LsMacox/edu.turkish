<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <section class="bg-gradient-to-b from-gray-50 to-white pt-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-hero mb-6">
            {{ t('faq.title') }}
          </h1>
          <p class="text-hero-subtitle mb-8 max-w-3xl mx-auto">
            {{ t('faq.subtitle') }}
          </p>
          <div class="flex justify-center">
            <NuxtImg
              class="w-64 h-64 object-contain"
              src="/images/faq-hero.png"
              :alt="t('faq.heroImageAlt')"
              sizes="256px"
              loading="lazy"
              decoding="async"
              :placeholder="true"
              :quality="78"
              format="webp"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Search Section -->
    <section class="section-py-sm bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative">
          <input
            :id="searchInputId"
            :name="searchInputId"
            :value="searchQuery"
            type="text"
            :placeholder="t('faq.searchPlaceholder')"
            class="w-full px-6 py-4 pl-12 pr-12 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all min-h-touch-44"
            @input="handleSearchInput"
          />
          <Icon
            name="mdi:magnify"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
          />

          <!-- Clear search button -->
          <button
            v-if="searchQuery"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 min-w-touch-44 min-h-touch-44 flex items-center justify-center"
            :aria-label="t('common.clear')"
            @click="clearSearch"
          >
            <Icon name="mdi:close" class="w-5 h-5" />
          </button>

          <!-- Search suggestions -->
          <div
            v-if="showSearchSuggestions && searchHistory.length > 0"
            class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10"
          >
            <div class="p-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">{{ t('faq.recentSearches') }}</h4>
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

        <!-- Search status -->
        <div v-if="isActiveSearch" class="mt-4 flex items-center justify-between">
          <p class="text-sm text-gray-600">
            <span v-if="isSearching">{{ t('faq.searching') }}...</span>
            <span v-else-if="hasResults">
              {{ t('faq.searchResults', { count: resultCount, query: searchQuery }) }}
            </span>
            <span v-else>{{ t('faq.noResults', { query: searchQuery }) }}</span>
          </p>

          <button
            v-if="searchHistory.length > 0"
            class="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            @click="clearSearchHistory"
          >
            {{ t('faq.clearHistory') }}
          </button>
        </div>
      </div>
    </section>

    <!-- FAQ Categories -->
    <section class="section-py-sm bg-gray-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap justify-center gap-3 sm:gap-4">
          <button
            v-for="category in categories"
            :key="category.key"
            :class="[
              'px-4 py-2 text-sm rounded-full font-medium transition-all min-h-touch-44 flex items-center space-x-1.5',
              'sm:px-6 sm:py-3 sm:text-base sm:space-x-2',
              activeCategory === category.key
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200',
            ]"
            :aria-pressed="activeCategory === category.key"
            @click="setActiveCategory(category.key)"
          >
            <Icon :name="category.icon" class="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{{ translateCategoryLabel(category.key, category.name) }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Main FAQ Section -->
    <section class="section-py bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- No results state -->
        <div v-if="isActiveSearch && !hasResults && !isSearching" class="text-center py-12">
          <Icon name="mdi:magnify-close" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-card-title mb-2">{{ t('faq.noResultsTitle') }}</h3>
          <p class="text-gray-500 mb-6">{{ t('faq.noResultsMessage', { query: searchQuery }) }}</p>

          <div class="space-y-3">
            <p class="text-sm text-gray-600">{{ t('faq.tryThese') }}:</p>
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
              {{ t('faq.showAllQuestions') }}
            </button>
          </div>
        </div>

        <!-- FAQ Results -->
        <div v-else-if="filteredFAQItems.length > 0" class="space-y-6">
          <!-- eslint-disable vue/no-v-html -->
          <div
            v-for="item in filteredFAQItems"
            :key="item.id"
            class="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              class="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-2xl min-h-touch-44"
              @click="toggleFAQ(item.id)"
            >
              <span
                class="text-lg font-medium text-secondary pr-4"
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

            <div v-if="openItems[item.id]" class="px-6 pb-6">
              <div class="bg-gray-50 rounded-xl p-6">
                <div
                  class="faq-content prose prose-gray max-w-none"
                  v-html="highlightSearchTerms(item.answer, searchQuery)"
                />

                <!-- Category badge -->
                <div class="mt-4 pt-4 border-t border-gray-200">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <Icon :name="getCategoryIcon(item.category)" class="w-3 h-3 mr-1" />
                    {{ labelForCategory(item.category) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- eslint-enable vue/no-v-html -->
        </div>

        <!-- Loading state -->
        <div v-else-if="isSearching" class="text-center py-12">
          <Icon name="mdi:loading" class="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p class="text-gray-600">{{ t('faq.searching') }}...</p>
        </div>

        <!-- Default state when no search -->
        <div v-else class="text-center py-12">
          <Icon
            name="mdi:frequently-asked-questions"
            class="w-16 h-16 text-gray-300 mx-auto mb-4"
          />
          <h3 class="text-card-title mb-2">{{ t('faq.startSearching') }}</h3>
          <p class="text-gray-500">{{ t('faq.startSearchingMessage') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const { t, te } = useI18n()

const searchInputId = useId()

// Initialize FAQ search composable
const {
  searchQuery,
  activeCategory,
  isSearching,
  searchHistory,
  faqCategories,
  filteredFAQItems,
  resultCount,
  hasResults,
  isActiveSearch,
  setSearchQuery,
  setActiveCategory,
  clearSearch,
  resetFilters,
  highlightSearchTerms,
  clearSearchHistory,
} = useFAQSearch()

// Local state for UI interactions
const openItems = ref<Record<string, boolean>>({})
const showSearchSuggestions = ref(false)

// Categories with icons - dynamically from API with fallback
const categories = computed(() => {
  const apiCategories = faqCategories.value || []
  const unique = new Map<string, { key: string; label: string; icon: string; name?: string }>()
  for (const cat of apiCategories) {
    if (!cat?.key) continue
    if (!unique.has(cat.key)) {
      unique.set(cat.key, {
        key: cat.key,
        label: `faq.categories.${cat.key}.title`,
        icon: getCategoryIcon(cat.key),
        name: cat.name,
      })
    }
  }
  return [
    {
      key: 'all',
      label: 'faq.categories.all',
      icon: 'mdi:view-grid',
      name: t('faq.categories.all'),
    },
    ...Array.from(unique.values()),
  ]
})

const translateCategoryLabel = (key: string, fallbackName?: string) => {
  const i18nKey = `faq.categories.${key}.title`
  return te(i18nKey) ? t(i18nKey) : fallbackName || key
}

// Label for badge inside item card, with API fallback like the chips above
const labelForCategory = (key: string) => {
  const i18nKey = `faq.categories.${key}.title`
  return te(i18nKey) ? t(i18nKey) : faqCategories.value.find((c: any) => c.key === key)?.name || key
}

// Popular search suggestions
const popularSearches = computed(() => [
  t('faq.popularSearches.documents'),
  t('faq.popularSearches.scholarships'),
  t('faq.popularSearches.exams'),
  t('faq.popularSearches.language'),
])

// Helper functions
const toggleFAQ = (itemId: string) => {
  openItems.value[itemId] = !openItems.value[itemId]
}

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  setSearchQuery(target.value)
  showSearchSuggestions.value = target.value.length === 0
}

const getCategoryIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
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
  return iconMap[category] || 'mdi:help-circle'
}

// Keyboard shortcuts
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    // Ctrl/Cmd + K to focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault()
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
      }
    }

    // Escape to clear search
    if (event.key === 'Escape' && searchQuery.value) {
      clearSearch()
    }
  }

  document.addEventListener('keydown', handleKeydown)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})

// Close suggestions when clicking outside
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (!target.closest('.relative')) {
      showSearchSuggestions.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
