<template>
  <div class="bg-white">
    <BlogHeroSection v-model="searchInput" :hero="hero" :hero-image="heroImage" />

    <section class="section-py-sm bg-white border-b border-gray-100">
      <div class="container mx-auto container-padding-narrow">
        <div class="flex flex-wrap justify-center gap-3">
          <button
            v-for="category in filterCategories"
            :key="category.key"
            type="button"
            class="px-6 py-2 rounded-full border font-medium transition-all min-h-touch-44"
            :class="
              activeCategory === category.key
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'border-gray-300 text-secondary hover:border-primary hover:text-primary'
            "
            :aria-pressed="activeCategory === category.key"
            @click="setCategoryAndFetch(category.key)"
          >
            {{ category.label }}
          </button>
        </div>
      </div>
    </section>

    <section class="section-py bg-background">
      <div class="container mx-auto container-padding-narrow">
        <div class="grid lg:grid-cols-3 gap-section">
          <div class="lg:col-span-2">
            <LazyBlogArticleListSection
              :title="t('blog.articles.title')"
              :read-more-label="t('blog.articles.readMore')"
              :load-more-label="t('blog.articles.loadMore')"
              :loading-label="t('blog.articles.loading', 'Загрузка...')"
              :empty-label="t('blog.articles.empty', 'Нет статей для отображения')"
              :items="articles"
              :featured="featuredArticle"
              :show-featured="shouldShowFeatured"
              :has-more="hasMore"
              :is-loading-more="isLoadingMore"
              :error="error"
              :active-category="activeCategory"
              :loading="loading"
              @load-more="loadMoreArticles"
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
import { useBlogRouteSync } from '~/components/features/blog/composables/useBlogRouteSync'
import { useApplicationModalStore } from '~/stores/applicationModal'
import { useBlogStore } from '~/stores/blog'

const heroImage = '9ab6702d-df12-4b23-879a-e03b83151f1a.png'

definePageMeta({
  layout: 'default',
  name: 'BlogPage',
})

const { t, te } = useI18n()
const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()
const applicationModalStore = useApplicationModalStore()
const blogStore = useBlogStore()
const { parseRouteFilters, syncRoute, hasFiltersChanged, isUpdatingRoute } = useBlogRouteSync()

const {
  articles,
  featuredArticle,
  categories: apiCategories,
  hasMore,
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
let searchDebounce: ReturnType<typeof setTimeout> | null = null

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

const doSyncRoute = (overrides: { category?: string; search?: string; page?: number } = {}) => {
  syncRoute(overrides, {
    category: activeCategory.value,
    search: searchQuery.value,
    page: currentPage.value,
  })
}

const updateFromRoute = async () => {
  const filters = parseRouteFilters()
  const changed = hasFiltersChanged(
    filters,
    activeCategory.value,
    searchQuery.value,
    currentPage.value,
  )

  if (!changed) {
    if (searchInput.value !== filters.search) {
      searchInput.value = filters.search
    }
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
}

watch(
  () => route.query,
  async () => {
    if (isUpdatingRoute.value) {
      return
    }
    await updateFromRoute()
  },
)

watch(searchInput, (value) => {
  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }

  searchDebounce = setTimeout(async () => {
    if (value === searchQuery.value) {
      return
    }

    blogStore.setSearchQuery(value)
    blogStore.resetPagination()
    const response = await blogStore.fetchArticles({ page: 1, search: value })
    if (response) {
      doSyncRoute({ search: value, page: 1 })
    }
  }, 400)
})

onBeforeUnmount(() => {
  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }
})

type HeroContent = {
  title: string
  titleAccent: string
  description: string
  searchPlaceholder: string
  imageAlt: string
  highlight: { title: string; subtitle: string }
  stats: { icon: string; label: string }[]
}

type SidebarPopularItem = {
  id: number | string
  slug: string | null
  title: string
  date: string
}

type SidebarPopular = {
  title: string
  items: SidebarPopularItem[]
}

type QuickLinksContent = {
  title: string
  items: { id: string; label: string }[]
}

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
      { icon: t('blog.hero.stats[0].icon'), label: t('blog.hero.stats[0].label', { count: articleCount }) },
      { icon: t('blog.hero.stats[1].icon'), label: t('blog.hero.stats[1].label', { count: faqCount }) },
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

const sidebarPopular = computed<SidebarPopular>(() => ({
  title: t('blog.sidebar.popular.title'),
  items: popular.value.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    date: item.publishedAtLabel,
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
    doSyncRoute({ category: categoryKey, page: 1 })
  }
}

const loadMoreArticles = async () => {
  if (loading.value) {
    return
  }
  const response = await blogStore.loadMore()
  if (response && response.data.length > 0) {
    doSyncRoute({ page: currentPage.value })
  }
}

const changePage = async (page: number) => {
  if (page === currentPage.value || loading.value) {
    return
  }
  blogStore.setPage(page)
  const response = await blogStore.fetchArticles({ page })
  if (response) {
    doSyncRoute({ page })
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

const isLoadingMore = computed(() => loading.value && currentPage.value > 1)

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
      applicationModalStore.openModal()
      break
    default:
      console.warn('Unhandled quick link click:', linkId)
  }
}
</script>

<style scoped></style>
