<template>
  <div class="bg-white">
    <BlogHeroSection v-model="searchInput" :hero="hero">
      <template #categories>
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="category in filterCategories"
            :key="category.key"
            type="button"
            class="px-3 py-1.5 text-sm rounded-full font-medium transition-all min-h-touch-44 flex items-center"
            :class="
              activeCategory === category.key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white/80 text-secondary border border-gray-200 hover:border-primary hover:text-primary'
            "
            :aria-pressed="activeCategory === category.key"
            @click="setCategoryAndFetch(category.key)"
          >
            {{ category.label }}
          </button>
        </div>
      </template>
    </BlogHeroSection>

    <section class="section-py bg-background">
      <div class="container mx-auto container-padding-narrow">
        <div class="grid lg:grid-cols-3 gap-section">
          <div class="lg:col-span-2">
            <LazyBlogArticleListSection
              :title="t('blog.articles.title')"
              :read-more-label="t('blog.articles.readMore')"
              :empty-label="t('blog.articles.empty', 'Нет статей для отображения')"
              :items="articles"
              :featured="featuredArticle"
              :show-featured="shouldShowFeatured"
              :error="error"
              :active-category="activeCategory"
              :loading="loading"
            />

            <div class="mt-8">
              <UiPagination
                :page="currentPage"
                :page-count="pagination?.totalPages || 1"
                :disabled="loading"
                :always-show="true"
                @update:page="changePage"
              />
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <LazyBlogSidebarSection
              :popular="sidebarPopular"
              :quick-links="quickLinks"
              @quick-link="handleQuickLinkClick"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { HeroContent, SidebarPopular, QuickLinksContent } from '~~/app/types/blog'
import { useBlogStore } from '~/stores/blog'
import { useBlogFilters } from '~/composables/blog/useBlogFilters'
definePageMeta({
  layout: 'default',
  name: 'BlogPage',
})

const { t, te } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const { openModal: openApplicationModal } = useApplicationModal()
const blogStore = useBlogStore()
const {
  parseRouteFilters,
  syncRoute,
  hasFiltersChanged,
  watchRouteChanges,
  createDebouncedSearch,
} = useBlogFilters()

const {
  articles,
  featuredArticle,
  categories: apiCategories,
  loading,
  activeCategory,
  searchQuery,
  currentPage,
  error,
  pagination,
  popular,
  totalArticles,
  totalFAQs,
} = storeToRefs(blogStore)

const searchInput = ref('')

useHead(() => ({
  title: t('blog.meta.title'),
  meta: [
    { name: 'description', content: t('blog.meta.description') },
    { property: 'og:title', content: t('blog.meta.title') },
    { property: 'og:description', content: t('blog.meta.description') },
    { property: 'og:type', content: 'website' },
  ],
}))

const applyRouteFilters = () => {
  const filters = parseRouteFilters()
  blogStore.setCategory(filters.category)
  blogStore.setSearchQuery(filters.search)
  blogStore.setPage(filters.page)
  searchInput.value = filters.search
  return filters
}

const currentState = () => ({
  category: activeCategory.value,
  search: searchQuery.value,
  page: currentPage.value,
})

const initialFilters = applyRouteFilters()

if (import.meta.server) {
  await blogStore.fetchArticles({
    page: initialFilters.page,
    category: initialFilters.category,
    search: initialFilters.search,
  })
}

onMounted(async () => {
  await blogStore.fetchArticles({
    page: currentPage.value,
    category: activeCategory.value,
    search: searchQuery.value,
  })
})

watchRouteChanges(async (filters: { category: string; search: string; page: number }) => {
  if (!hasFiltersChanged(filters, currentState())) {
    if (searchInput.value !== filters.search) searchInput.value = filters.search
    return
  }

  blogStore.setCategory(filters.category)
  blogStore.setSearchQuery(filters.search)
  blogStore.setPage(filters.page)
  searchInput.value = filters.search
  await blogStore.fetchArticles({
    page: filters.page,
    category: filters.category,
    search: filters.search,
  })
})

const performSearch = async (value: string) => {
  if (value === searchQuery.value) return
  blogStore.setSearchQuery(value)
  blogStore.resetPagination()
  const response = await blogStore.fetchArticles({ page: 1, search: value })
  if (response) syncRoute(currentState(), { search: value, page: 1 })
}

const debouncedSearch = createDebouncedSearch(performSearch)
watch(searchInput, debouncedSearch)

const hero = computed<HeroContent>(() => {
  const articleCount = totalArticles.value >= 150 ? `${totalArticles.value}+` : totalArticles.value
  const faqCount = totalFAQs.value >= 100 ? `${totalFAQs.value}+` : totalFAQs.value

  return {
    title: t('blog.hero.title'),
    titleAccent: t('blog.hero.titleAccent'),
    description: t('blog.hero.description'),
    searchPlaceholder: t('blog.hero.searchPlaceholder'),
    imageAlt: t('blog.hero.imageAlt'),
    highlight: {
      title: t('blog.hero.highlight.title'),
      subtitle: t('blog.hero.highlight.subtitle'),
    },
    stats: [
      {
        icon: t('blog.hero.stats[0].icon'),
        label: t('blog.hero.stats[0].label', { count: articleCount }),
      },
      {
        icon: t('blog.hero.stats[1].icon'),
        label: t('blog.hero.stats[1].label', { count: faqCount }),
      },
    ],
  }
})

const getCategoryLabel = (key: string, fallback?: string): string => {
  const translationKey = `blog.categories.${key}.label`
  if (te(translationKey)) {
    return t(translationKey)
  }
  return fallback || key
}

const filterCategories = computed(() => {
  const result: Array<{ key: string; label: string }> = [
    { key: 'all', label: getCategoryLabel('all') },
  ]
  const added = new Set<string>(['all'])

  apiCategories.value.forEach((category) => {
    if (added.has(category.key)) return
    added.add(category.key)
    result.push({
      key: category.key,
      label: category.label || getCategoryLabel(category.key),
    })
  })

  return result
})

watchEffect(() => {
  if (!filterCategories.value.some((category) => category.key === activeCategory.value)) {
    activeCategory.value = filterCategories.value[0]?.key ?? 'all'
  }
})

const shouldShowFeatured = computed(() => {
  if (!featuredArticle.value) {
    return false
  }
  if (activeCategory.value === 'all') {
    return true
  }
  return featuredArticle.value.category?.key === activeCategory.value
})

const { formatDate } = useI18nHelpers()

const sidebarPopular = computed<SidebarPopular>(() => ({
  title: t('blog.sidebar.popular.title'),
  items: popular.value.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    date: formatDate(item.publishedAt),
  })),
}))

const quickLinks = computed<QuickLinksContent>(() => ({
  title: t('blog.sidebar.quickLinks.title'),
  items: [
    { id: 'universities', label: t('blog.sidebar.quickLinks.items[0].label') },
    { id: 'checklist', label: t('blog.sidebar.quickLinks.items[1].label') },
    { id: 'reviews', label: t('blog.sidebar.quickLinks.items[2].label') },
    { id: 'consultation', label: t('blog.sidebar.quickLinks.items[3].label') },
  ],
}))

const setCategoryAndFetch = async (categoryKey: string) => {
  if (activeCategory.value === categoryKey) {
    return
  }

  blogStore.setCategory(categoryKey)
  blogStore.resetPagination()
  const response = await blogStore.fetchArticles({ page: 1, category: categoryKey })
  if (response) {
    syncRoute(currentState(), { category: categoryKey, page: 1 })
  }
}

const changePage = async (page: number) => {
  if (page === currentPage.value || loading.value) {
    return
  }
  blogStore.setPage(page)
  const response = await blogStore.fetchArticles({ page })
  if (response) {
    syncRoute(currentState(), { page })
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

const handleQuickLinkClick = async (linkId: string) => {
  switch (linkId) {
    case 'universities':
      await router.push(localePath('/universities'))
      break
    case 'checklist': {
      const target = localePath({ name: 'faq', query: { category: 'documents' } })
      await router.push(target)
      break
    }
    case 'reviews':
      await router.push(localePath('/reviews'))
      break
    case 'consultation':
      openApplicationModal()
      break
    default:
      console.warn('Unhandled quick link click:', linkId)
  }
}
</script>

<style scoped></style>
