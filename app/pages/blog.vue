<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="space-y-4">
              <h1 class="text-4xl lg:text-5xl font-bold text-secondary leading-tight">
                {{ hero.title }}
                <span class="text-primary">{{ hero.titleAccent }}</span>
              </h1>
              <p class="text-lg text-gray-600 leading-relaxed">
                {{ hero.description }}
              </p>
            </div>

            <!-- Stats -->
            <div class="flex flex-wrap gap-6 text-sm">
              <div
                v-for="(stat, index) in hero.stats"
                :key="index"
                class="flex items-center space-x-2 text-secondary"
              >
                <Icon :name="stat.icon" class="text-lg text-primary" />
                <span class="font-medium">{{ stat.label }}</span>
              </div>
            </div>

            <!-- Search Bar -->
            <div class="relative max-w-md">
              <Icon
                name="mdi:magnify"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                v-model="searchInput"
                type="text"
                :placeholder="hero.searchPlaceholder"
                class="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button
                v-if="searchInput"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 min-w-touch-44 min-h-touch-44 flex items-center justify-center"
                :aria-label="t('common.clear')"
                @click="searchInput = ''"
              >
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="relative">
            <div class="bg-white rounded-3xl shadow-custom p-8">
              <NuxtImg
                :src="heroImage"
                :alt="hero.imageAlt"
                class="w-full h-96 object-cover rounded-2xl"
                loading="lazy"
                decoding="async"
                format="webp"
              />
            </div>
            <div class="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 max-w-xs">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon name="mdi:lightbulb-on-outline" class="text-blue-600" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-secondary">{{ hero.highlight.title }}</p>
                  <p class="text-xs text-gray-500">{{ hero.highlight.subtitle }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Filters -->
    <section class="py-8 bg-white border-b border-gray-100">
      <div class="container mx-auto px-4 lg:px-6">
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

    <!-- Main Content -->
    <section class="py-16 bg-background">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Articles -->
          <div class="lg:col-span-2">
            <h2 class="text-2xl font-bold text-secondary mb-8">{{ t('blog.articles.title') }}</h2>

            <div class="grid md:grid-cols-2 gap-8 mb-12">
              <article
                v-if="featuredArticle && shouldShowFeatured"
                class="md:col-span-2 bg-white rounded-2xl shadow-custom overflow-hidden hover-lift"
              >
                <template v-if="featuredArticle.image">
                  <NuxtImg
                    :src="featuredArticle.image"
                    :alt="featuredArticle.imageAlt || featuredArticle.title"
                    class="w-full h-64 object-cover"
                    loading="lazy"
                    decoding="async"
                    format="webp"
                  />
                </template>
                <div
                  v-else
                  class="w-full h-64 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-6 text-center"
                >
                  <p class="text-secondary font-semibold text-lg">{{ featuredArticle.title }}</p>
                </div>
                <div class="p-8">
                  <div class="flex flex-wrap items-center gap-2 mb-4 text-sm text-gray-500">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      :class="categoryBadgeClass(featuredArticle.category?.key)"
                    >
                      {{ featuredArticle.category?.label }}
                    </span>
                    <span>{{ featuredArticle.publishedAtLabel }}</span>
                    <span v-if="featuredArticle.readingTimeLabel"
                      >• {{ featuredArticle.readingTimeLabel }}</span
                    >
                  </div>
                  <h3 class="text-2xl font-bold text-secondary mb-4">
                    {{ featuredArticle.title }}
                  </h3>
                  <p class="text-gray-600 leading-relaxed mb-6">{{ featuredArticle.excerpt }}</p>
                  <NuxtLink
                    :to="articleLink(featuredArticle.slug)"
                    class="text-primary font-semibold hover:underline"
                  >
                    {{ t('blog.articles.readMore') }}
                  </NuxtLink>
                </div>
              </article>

              <article
                v-for="article in articles"
                :key="article.id"
                class="bg-white rounded-2xl shadow-custom overflow-hidden hover-lift flex flex-col h-full"
              >
                <template v-if="article.image">
                  <NuxtImg
                    :src="article.image"
                    :alt="article.imageAlt || article.title"
                    class="w-full h-48 object-cover"
                    loading="lazy"
                    decoding="async"
                    format="webp"
                  />
                </template>
                <div
                  v-else
                  class="w-full h-48 bg-gray-100 flex items-center justify-center px-4 text-center"
                >
                  <span class="text-secondary text-sm font-semibold">{{ article.title }}</span>
                </div>
                <div class="p-6 flex flex-col flex-1">
                  <div class="flex flex-wrap items-center gap-2 mb-3 text-sm text-gray-500">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      :class="categoryBadgeClass(article.category?.key)"
                    >
                      {{ article.category?.label }}
                    </span>
                    <span>{{ article.publishedAtLabel }}</span>
                  </div>
                  <h3 class="text-xl font-semibold text-secondary mb-3">{{ article.title }}</h3>
                  <p class="text-gray-600 text-sm mb-4">{{ article.excerpt }}</p>

                  <div class="mt-auto pt-2 flex items-center justify-between text-sm text-gray-500">
                    <span v-if="article.readingTimeLabel">{{ article.readingTimeLabel }}</span>
                    <NuxtLink
                      :to="articleLink(article.slug)"
                      class="text-primary font-semibold hover:underline"
                    >
                      {{ t('blog.articles.readMore') }}
                    </NuxtLink>
                  </div>
                </div>
              </article>
            </div>

            <p
              v-if="!loading && !articles.length && !featuredArticle"
              class="text-center text-gray-500"
            >
              {{ t('blog.articles.empty', 'Нет статей для отображения') }}
            </p>

            <p
              v-if="error"
              class="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {{ error }}
            </p>

            <div v-if="hasMore" class="text-center">
              <button
                type="button"
                class="bg-white border-2 border-primary text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="isLoadingMore"
                @click="loadMoreArticles"
              >
                <span v-if="isLoadingMore" class="flex items-center justify-center gap-2">
                  <Icon name="mdi:loading" class="w-4 h-4 animate-spin" />
                  {{ t('blog.articles.loading', 'Загрузка...') }}
                </span>
                <span v-else>
                  {{ t('blog.articles.loadMore') }}
                </span>
              </button>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-8">
            <div class="bg-white rounded-2xl shadow-custom p-8">
              <div class="flex items-center mb-6">
                <Icon name="mdi:fire" class="text-orange-500 text-xl mr-3" />
                <h3 class="text-xl font-bold text-secondary">{{ sidebarPopular.title }}</h3>
              </div>
              <div class="space-y-6">
                <article
                  v-for="(item, index) in sidebarPopular.items"
                  :key="item.id"
                  class="pb-4"
                  :class="
                    index !== sidebarPopular.items.length - 1 ? 'border-b border-gray-100' : ''
                  "
                >
                  <NuxtLink
                    v-if="item.slug"
                    :to="articleLink(item.slug)"
                    class="block font-semibold text-secondary mb-2 text-sm leading-tight hover:text-primary transition-colors"
                  >
                    {{ item.title }}
                  </NuxtLink>
                  <p v-else class="font-semibold text-secondary mb-2 text-sm leading-tight">
                    {{ item.title }}
                  </p>
                  <div class="flex items-center text-xs text-gray-500 gap-2">
                    <span v-if="item.date">{{ item.date }}</span>
                    <template v-if="item.date && item.views">
                      <span>•</span>
                    </template>
                    <span v-if="item.views">{{ item.views }}</span>
                  </div>
                </article>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-custom p-8">
              <h3 class="text-xl font-bold text-secondary mb-6">{{ quickLinks.title }}</h3>
              <ClientOnly>
                <div class="space-y-4">
                  <button
                    v-for="link in quickLinks.items"
                    :key="link.id"
                    type="button"
                    class="flex items-center space-x-3 text-gray-600 hover:text-primary transition-colors w-full text-left"
                    @click="handleQuickLinkClick(link.id)"
                  >
                    <Icon :name="'' + quickLinkIcon(link.id)" class="w-5" />
                    <span class="text-sm font-medium">{{ link.label }}</span>
                  </button>
                </div>
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, watchEffect, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import blogHeroImage from '/images/blog-hero.png'
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

const categoryStyles: Record<string, string> = {
  visas: 'bg-blue-100 text-blue-800',
  exams: 'bg-green-100 text-green-800',
  scholarships: 'bg-yellow-100 text-yellow-800',
  cost: 'bg-orange-100 text-orange-800',
  life: 'bg-teal-100 text-teal-800',
  applications: 'bg-indigo-100 text-indigo-800',
  rankings: 'bg-purple-100 text-purple-800',
}

const quickLinkIcons: Record<string, string> = {
  universities: 'mdi:school-outline',
  checklist: 'mdi:file-document-check-outline',
  reviews: 'mdi:comment-quote-outline',
  consultation: 'mdi:headset',
}

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

const heroImage = blogHeroImage

const hero = computed<HeroContent>(() => {
  const value = tm('blog.hero') as Partial<HeroContent> | undefined
  const rawStats = Array.isArray(value?.stats) ? (value.stats as HeroStat[]) : []
  const highlight = value?.highlight as Partial<HeroHighlight> | undefined

  return {
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

const categoryBadgeClass = (key: string) => categoryStyles[key] ?? 'bg-gray-100 text-gray-600'

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

const quickLinkIcon = (id: string) => quickLinkIcons[id] ?? 'mdi:arrow-right'

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

const articleLink = (slug: string) => localePath({ name: 'articles-slug', params: { slug } })

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

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.hover-lift {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
</style>
