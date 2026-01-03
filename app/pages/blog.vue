<template>
  <div class="bg-white">
    <BlogHeroSection v-model="searchInput" :hero="hero">
      <template #categories>
        <div class="flex flex-wrap justify-center gap-component-sm">
          <BaseButton
            v-for="category in filterCategories"
            :key="category.key"
            variant="chip-pill"
            size="sm"
            :data-active="activeCategory === category.key ? 'true' : undefined"
            :aria-pressed="activeCategory === category.key"
            @click="setCategoryAndFetch(category.key)"
          >
            {{ category.label }}
          </BaseButton>
        </div>
      </template>
    </BlogHeroSection>

    <section class="section-py bg-background">
      <div class="container mx-auto container-padding-narrow">
        <div class="grid lg:grid-cols-3 gap-section">
          <div class="lg:col-span-2">
            <LazyBlogArticleListSection
              :title="t(articlesNs('title'))"
              :read-more-label="t(articlesNs('readMore'))"
              :empty-label="t(articlesNs('empty'), 'Нет статей для отображения')"
              :items="articles"
              :featured="featuredArticle"
              :show-featured="shouldShowFeatured"
              :error="error"
              :active-category="activeCategory"
              :loading="loading"
            />

            <div class="mt-8">
              <BasePagination
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
import type { HeroContent, SidebarPopular, QuickLinksContent } from '~/types/features/blog'
import { useBlogPage } from '~/composables/useBlogPage'
import { namespace } from '~~/lib/i18n'

definePageMeta({
  layout: 'default',
  name: 'BlogPage',
})

const blogNs = namespace('blog')
const heroNs = namespace('blog.hero')
const articlesNs = namespace('blog.articles')
const sidebarNs = namespace('blog.sidebar')
const metaNs = namespace('blog.meta')
const localePath = useLocalePath()
const router = useRouter()
const { t } = useI18n()
const { openModal: openApplicationModal } = useApplicationModal()
const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl || 'https://edu-turkish.com'

const {
  articles,
  featured: featuredArticle,
  categories: apiCategories,
  loading,
  category: activeCategory,
  page: currentPage,
  error,
  pagination,
  popular,
  totalArticles,
  totalFAQs,
  searchInput,
  setCategory,
  setPage,
  initialize,
  watchRouteChanges,
  setupSearchWatcher,
} = useBlogPage()

useSeoMeta({
  title: () => t(metaNs('title')),
  description: () => t(metaNs('description')),
  ogTitle: () => t(metaNs('title')),
  ogDescription: () => t(metaNs('description')),
  twitterTitle: () => t(metaNs('title')),
  twitterDescription: () => t(metaNs('description')),
})

useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: t(metaNs('title')),
        description: t(metaNs('description')),
        url: `${siteUrl}${localePath('/blog')}`,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Edu.turkish',
          url: siteUrl,
        },
      }),
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t(metaNs('title')),
            item: `${siteUrl}${localePath('/blog')}`,
          },
        ],
      }),
    },
  ],
}))

const { data: _blogData } = await useAsyncData('blog-initial-data', () => initialize(), {
  server: true,
  lazy: false,
})

onMounted(() => {
  setupSearchWatcher()
  watchRouteChanges()
})

const hero = computed<HeroContent>(() => {
  const articleCount = totalArticles.value >= 150 ? `${totalArticles.value}+` : totalArticles.value
  const faqCount = totalFAQs.value >= 100 ? `${totalFAQs.value}+` : totalFAQs.value

  return {
    title: t(heroNs('title')),
    titleAccent: t(heroNs('titleAccent')),
    description: t(heroNs('description')),
    searchPlaceholder: t(heroNs('searchPlaceholder')),
    imageAlt: t(heroNs('imageAlt')),
    highlight: {
      title: t(heroNs('highlight.title')),
      subtitle: t(heroNs('highlight.subtitle')),
    },
    stats: [
      {
        icon: t(heroNs('stats.articles.icon')),
        label: t(heroNs('stats.articles.label'), { count: articleCount }),
      },
      {
        icon: t(heroNs('stats.faqs.icon')),
        label: t(heroNs('stats.faqs.label'), { count: faqCount }),
      },
    ],
  }
})

const getCategoryLabel = (key: string, fallback?: string): string => {
  if (key === 'all') {
    return t(blogNs('categories.all.label'))
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
  title: t(sidebarNs('popular.title')),
  items: popular.value.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    date: formatDate(item.publishedAt),
  })),
}))

const quickLinks = computed<QuickLinksContent>(() => ({
  title: t(sidebarNs('quickLinks.title')),
  items: [
    { id: 'universities', label: t(sidebarNs('quickLinks.universities')) },
    { id: 'checklist', label: t(sidebarNs('quickLinks.checklist')) },
    { id: 'reviews', label: t(sidebarNs('quickLinks.reviews')) },
    { id: 'consultation', label: t(sidebarNs('quickLinks.consultation')) },
  ],
}))

const setCategoryAndFetch = (categoryKey: string) => setCategory(categoryKey)
const changePage = (newPage: number) => setPage(newPage)

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
