<template>
  <div class="bg-white">
    <section class="bg-gradient-to-b from-gray-50 to-white pt-6 md:pt-8 pb-4">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-component-lg mb-5">
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
          <BaseTextField
            :id="searchInputId"
            :name="searchInputId"
            :model-value="searchQuery"
            type="text"
            :placeholder="t(faqNs('searchPlaceholder'))"
            icon="mdi:magnify"
            icon-position="left"
            clearable
            @update:model-value="handleSearchInput"
            @clear="clearSearch"
          />

          <div
            v-if="showSearchSuggestions && searchHistory.length > 0"
            class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-button shadow-card-hover z-10"
          >
            <div class="p-4">
              <h4 class="text-sm font-medium text-body mb-2">{{ t(faqNs('recentSearches')) }}</h4>
              <div class="space-y-1">
                <BaseButton
                  v-for="suggestion in searchHistory.slice(0, 5)"
                  :key="suggestion"
                  variant="link"
                  full-width
                  class="!justify-start !px-3 !py-2 !text-sm !text-body-sm hover:!bg-gray-50 !rounded-lg"
                  @click="setSearchQuery(suggestion)"
                >
                  {{ suggestion }}
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isActiveSearch" class="mt-4 flex items-center justify-between">
          <p class="text-sm text-body-sm">
            <span v-if="isSearching">{{ t(faqNs('searching')) }}...</span>
            <span v-else-if="hasResults">
              {{ t(faqNs('searchResults'), { count: resultCount, query: searchQuery }) }}
            </span>
            <span v-else>{{ t(faqNs('noResults'), { query: searchQuery }) }}</span>
          </p>

          <BaseButton
            v-if="searchHistory.length > 0"
            variant="link"
            class="!text-xs !text-meta hover:!text-secondary"
            @click="clearSearchHistory"
          >
            {{ t(faqNs('clearHistory')) }}
          </BaseButton>
        </div>

        <div v-if="faqStatus === 'success'" class="flex flex-wrap gap-component-sm mt-5">
          <BaseButton
            v-for="category in ssrCategories"
            :key="category.key"
            variant="chip-pill"
            size="sm"
            :icon="category.icon"
            :data-active="activeCategory === category.key ? 'true' : undefined"
            :aria-pressed="activeCategory === category.key"
            @click="setActiveCategory(category.key)"
          >
            {{ getCategoryLabel(category.key, category.name) }}
          </BaseButton>
        </div>
      </div>
    </section>

    <section class="py-6 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="isActiveSearch && !hasResults && !isSearching" class="text-center section-py-lg">
          <Icon name="mdi:magnify-close" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-card-title mb-2">{{ t(faqNs('noResultsTitle')) }}</h3>
          <p class="text-meta mb-6">{{ t(faqNs('noResultsMessage'), { query: searchQuery }) }}</p>

          <div class="space-y-3">
            <p class="text-sm text-body-sm">{{ t(faqNs('tryThese')) }}:</p>
            <div class="flex flex-wrap justify-center gap-component-sm">
              <BaseButton
                v-for="suggestion in popularSearches"
                :key="suggestion"
                variant="suggestion"
                size="sm"
                @click="setSearchQuery(suggestion)"
              >
                {{ suggestion }}
              </BaseButton>
            </div>
            <BaseButton
              variant="link"
              class="text-primary hover:text-primary-dark font-medium text-sm"
              @click="resetFilters"
            >
              {{ t(faqNs('showAllQuestions')) }}
            </BaseButton>
          </div>
        </div>

        <!-- eslint-disable vue/no-v-html -->
        <DisplayFAQ
          v-else-if="filteredFAQItems.length > 0"
          v-model="openItems"
          :items="filteredFAQItems"
          bare
          item-key="id"
          html-content
        >
          <template #question="{ item }">
            <span
              class="text-base sm:text-lg font-medium text-secondary pr-4"
              v-html="highlightSearchTerms(item.question, searchQuery)"
            />
          </template>
          <template #answer="{ item }">
            <div
              class="faq-content"
              v-html="highlightSearchTerms(item.answer, searchQuery)"
            />
          </template>
          <template #extra="{ item: faqItem }">
            <div class="mt-4 pt-4 border-t border-gray-200">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                <Icon
                  :name="
                    categories.find((c) => c.key === (faqItem as any).category)?.icon || 'ph:question'
                  "
                  class="w-3 h-3 mr-1"
                />
                {{ getCategoryLabel((faqItem as any).category) }}
              </span>
            </div>
          </template>
        </DisplayFAQ>
        <!-- eslint-enable vue/no-v-html -->

        <div v-else-if="isSearching" class="text-center section-py-lg">
          <Icon name="mdi:loading" class="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p class="text-body-sm">{{ t(faqNs('searching')) }}...</p>
        </div>

        <div v-else class="text-center section-py-lg">
          <Icon
            name="mdi:frequently-asked-questions"
            class="w-16 h-16 text-gray-300 mx-auto mb-4"
          />
          <h3 class="text-card-title mb-2">{{ t(faqNs('startSearching')) }}</h3>
          <p class="text-meta">{{ t(faqNs('startSearchingMessage')) }}</p>
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
import { namespace } from '~~/lib/i18n'
import { FAQ_CATEGORY_ICONS, DEFAULT_FAQ_ICON } from '~~/lib/domain/faq'

definePageMeta({ layout: 'default' })

const faqNs = namespace('faq')
const metaNs = namespace('faq.meta')
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

const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl || 'https://edu-turkish.com'
const localePath = useLocalePath()

useSeoMeta({
  title: () => t(metaNs('title')),
  description: () => t(metaNs('description')),
  ogTitle: () => t(metaNs('title')),
  ogDescription: () => t(metaNs('description')),
  ogType: 'website',
})

useHead(() => {
  return {
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
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
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: t(faqNs('title')),
              item: `${siteUrl}${localePath('/faq')}`,
            },
          ],
        }),
      },
    ],
  }
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

const handleSearchInput = (val: string | number) => {
  const value = String(val)
  setSearchQuery(value)
  showSearchSuggestions.value = value.length === 0
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
