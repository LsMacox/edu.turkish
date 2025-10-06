<template>
  <div class="bg-white">
    <BlogHeroSection :hero="hero" :hero-image="heroImage" v-model="searchInput" />

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
            <BlogArticleListSection
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
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <BlogSidebarSection
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
import heroImage from '/images/blog-hero.png'
import { useApplicationModalStore } from '~/stores/applicationModal'
import { useBlogStore } from '~/stores/blog'


definePageMeta({
  layout: 'default',
  name: 'BlogPage',
})

const { t, tm, te } = useI18n()
const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()
const applicationModalStore = useApplicationModalStore()
const blogStore = useBlogStore()

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
  popular,
  totalArticles,
  totalFAQs,
} = storeToRefs(blogStore)

const searchInput = ref('')
const isUpdatingRoute = ref(false)
let searchDebounce: ReturnType<typeof setTimeout> | null = null

const resolveI18nValue = (input: unknown): string => {
  if (input == null) {
    return ''
  }

  if (typeof input === 'string') {
    return input
  }

  if (typeof input === 'number' || typeof input === 'boolean') {
    return String(input)
  }

  if (Array.isArray(input)) {
    return input.map((item) => resolveI18nValue(item)).join('')
  }

  if (typeof input === 'object') {
    const value = input as Record<string, unknown>

    if (typeof value.source === 'string') {
      return value.source
    }

    if (typeof value.static === 'string') {
      return value.static
    }

    if (typeof value.value === 'string') {
      return value.value
    }

    if (value.body && value.body !== input) {
      const resolvedBody = resolveI18nValue(value.body)
      if (resolvedBody) {
        return resolvedBody
      }
    }

    if (Array.isArray(value.items)) {
      const resolvedItems = value.items.map((item) => resolveI18nValue(item)).join('')
      if (resolvedItems) {
        return resolvedItems
      }
    }

    if (Array.isArray(value.children)) {
      const resolvedChildren = value.children.map((child) => resolveI18nValue(child)).join('')
      if (resolvedChildren) {
        return resolvedChildren
      }
    }
  }

  return ''
}

useHead(() => ({
  title: t('blog.meta.title'),
  meta: [
    { name: 'description', content: t('blog.meta.description') },
    { property: 'og:title', content: t('blog.meta.title') },
    { property: 'og:description', content: t('blog.meta.description') },
    { property: 'og:type', content: 'website' },
  ],
}))

const parseRouteFilters = () => {
  const category =
    typeof route.query.category === 'string' && route.query.category ? route.query.category : 'all'
  const search = typeof route.query.q === 'string' ? route.query.q : ''
  const rawPage = Array.isArray(route.query.page) ? route.query.page[0] : route.query.page
  const pageValue = rawPage ? Number(rawPage) : 1
  const page = Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1

  return {
    category,
    search,
    page,
  }
}

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

const syncRoute = (overrides: { category?: string; q?: string; page?: number } = {}) => {
  const category = overrides.category ?? activeCategory.value
  const q = overrides.q ?? searchQuery.value
  const page = overrides.page ?? currentPage.value

  const query: Record<string, string> = {}
  if (q) {
    query.q = q
  }
  if (category && category !== 'all') {
    query.category = category
  }
  if (page > 1) {
    query.page = String(page)
  }

  // Preserve scroll position during query updates to avoid jumping to top
  const currentScrollY = typeof window !== 'undefined' ? window.scrollY : 0

  isUpdatingRoute.value = true
  router
    .replace({ query })
    .then(() => {
      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => {
          window.scrollTo(0, currentScrollY)
        })
      }
    })
    .finally(() => {
      nextTick(() => {
        isUpdatingRoute.value = false
      })
    })
}

const updateFromRoute = async () => {
  const filters = parseRouteFilters()
  const changed =
    filters.category !== activeCategory.value ||
    filters.search !== searchQuery.value ||
    filters.page !== currentPage.value

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
      syncRoute({ q: value, page: 1 })
    }
  }, 400)
})

onBeforeUnmount(() => {
  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }
})

type HeroHighlight = { title: string; subtitle: string }
type HeroStat = { icon: string; label: string }
type HeroContent = {
  title: string
  titleAccent: string
  description: string
  searchPlaceholder: string
  imageAlt: string
  highlight: HeroHighlight
  stats: HeroStat[]
}

type SidebarPopularItem = {
  id: number | string
  slug: string | null
  title: string
  date: string
  views: string
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
  const value = tm('blog.hero') as Partial<HeroContent> | undefined
  const rawStats = Array.isArray(value?.stats) ? (value.stats as HeroStat[]) : []
  const highlight = value?.highlight as Partial<HeroHighlight> | undefined

  const base = {
    title: resolveI18nValue(value?.title),
    titleAccent: resolveI18nValue(value?.titleAccent),
    description: resolveI18nValue(value?.description),
    searchPlaceholder: resolveI18nValue(value?.searchPlaceholder),
    imageAlt: resolveI18nValue(value?.imageAlt),
    highlight: {
      title: resolveI18nValue(highlight?.title),
      subtitle: resolveI18nValue(highlight?.subtitle),
    },
    stats: rawStats.map((stat) => ({
      icon: resolveI18nValue(stat?.icon),
      label: resolveI18nValue(stat?.label),
    })),
  }

  // Dynamically update stats with real counts
  const articleCount = totalArticles.value >= 150 ? `${totalArticles.value}+` : totalArticles.value
  const faqCount = totalFAQs.value >= 100 ? `${totalFAQs.value}+` : totalFAQs.value

  if (base.stats.length >= 2) {
    base.stats[0]!.label = t('blog.hero.stats[0].label', { count: articleCount })
    base.stats[1]!.label = t('blog.hero.stats[1].label', { count: faqCount })
  }

  return base
})

const categoryTranslations = computed(() => {
  const raw = tm('blog.categories') as Record<string, { label?: unknown }> | undefined
  const map = new Map<string, string>()
  if (!raw) {
    return map
  }
  for (const [key, value] of Object.entries(raw)) {
    const labelValue = value?.label
    if (typeof labelValue === 'string') {
      map.set(key, labelValue)
      continue
    }

    const translationKey = `blog.categories.${key}.label`
    if (te(translationKey)) {
      const translated = t(translationKey)
      if (translated && translated !== translationKey) {
        map.set(key, translated)
        continue
      }
    }

    if (labelValue && typeof labelValue === 'object') {
      const staticValue = (labelValue as { static?: unknown }).static
      if (typeof staticValue === 'string') {
        map.set(key, staticValue)
      }
    }
  }
  return map
})

const filterCategories = computed(() => {
  const result: Array<{ key: string; label: string }> = []
  const labelMap = categoryTranslations.value
  result.push({ key: 'all', label: labelMap.get('all') ?? t('blog.categories.all.label') })
  const added = new Set<string>(['all'])

  apiCategories.value.forEach((category) => {
    if (added.has(category.key)) {
      return
    }
    added.add(category.key)
    result.push({
      key: category.key,
      label: category.label || labelMap.get(category.key) || category.key,
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

const sidebarPopular = computed<SidebarPopular>(() => {
  const translation = tm('blog.sidebar.popular') as
    | {
        title?: unknown
        items?: Array<{ title?: unknown; date?: unknown; views?: unknown; slug?: unknown }>
      }
    | undefined

  const title = resolveI18nValue(translation?.title)

  if (popular.value.length > 0) {
    return {
      title,
      items: popular.value.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        date: item.publishedAtLabel,
        views: item.viewCountLabel,
      })),
    }
  }

  const fallbackItems = Array.isArray(translation?.items) ? translation.items : []
  const normalizedFallback = fallbackItems
    .map((item, index) => ({
      id: typeof item.slug === 'string' ? item.slug : index,
      slug: typeof item.slug === 'string' ? item.slug : null,
      title: resolveI18nValue(item?.title),
      date: resolveI18nValue(item?.date),
      views: resolveI18nValue(item?.views),
    }))
    .filter((item) => item.title)

  return {
    title,
    items: normalizedFallback,
  }
})

const quickLinks = computed<QuickLinksContent>(() => {
  const value = tm('blog.sidebar.quickLinks') as QuickLinksContent | undefined
  return {
    title: resolveI18nValue(value?.title),
    items: Array.isArray(value?.items)
      ? value.items
          .map((item: any) => {
            const resolvedId = resolveI18nValue(item?.id)
            const fallbackId = typeof item?.id === 'string' ? item.id : ''
            const id = resolvedId || fallbackId

            return {
              id,
              label: resolveI18nValue(item?.label),
            }
          })
          .filter((item) => item.id && item.label)
      : [],
  }
})

const setCategoryAndFetch = async (categoryKey: string) => {
  if (activeCategory.value === categoryKey) {
    return
  }

  blogStore.setCategory(categoryKey)
  blogStore.resetPagination()
  const response = await blogStore.fetchArticles({ page: 1, category: categoryKey })
  if (response) {
    syncRoute({ category: categoryKey, page: 1 })
  }
}

const loadMoreArticles = async () => {
  if (loading.value) {
    return
  }
  const response = await blogStore.loadMore()
  if (response && response.data.length > 0) {
    syncRoute({ page: currentPage.value })
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
