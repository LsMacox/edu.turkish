<template>
  <div class="bg-white">
    <section v-if="pending" class="py-20">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="rounded-3xl bg-white p-10 text-center shadow-custom">
          <p class="text-lg font-semibold text-secondary">{{ t('article.loading') }}</p>
        </div>
      </div>
    </section>

    <section v-else-if="errorMessage" class="py-20">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="space-y-6 rounded-3xl bg-white p-10 text-center shadow-custom">
          <p class="text-2xl font-semibold text-secondary">{{ errorMessage }}</p>
          <NuxtLink
            :to="localePath('/blog')"
            class="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-secondary/90"
          >
            {{ t('article.related.allArticles') }}
            <Icon name="mdi:arrow-right" class="text-lg" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <template v-else-if="article">
      <LazyBlogPowerPage
        v-if="article.isPowerPage"
        :article="article"
      />
      <BlogStandardArticle
        v-else
        :article="article"
        :related-articles="relatedArticles"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type {
  BlogArticleDetail,
  BlogArticleListItem,
  BlogArticlesResponse,
  BlogArticleQueryParams,
} from '~~/server/types/api'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const localePath = useLocalePath()
const { locale, t } = useI18n()
const setI18nParams = useSetI18nParams()

const slug = computed(() => String(route.params.slug ?? ''))

const { data, pending, error } = await useAsyncData<{
  data: BlogArticleDetail
  related: BlogArticleListItem[]
} | null>(
  `article-detail-${slug.value}-${locale.value}`,
  async () => {
    if (!slug.value) {
      return null
    }

    const [articleResponse] = await Promise.all([
      $fetch<{ data: BlogArticleDetail }>(`/api/v1/blog/articles/${slug.value}` as const, {
        query: { lang: locale.value },
      }),
    ])

    const articleData = articleResponse?.data
    if (!articleData) {
      return null
    }
    
    // Set i18n params for alternate routes
    if (articleData.alternates) {
      const params: Record<string, { slug: string }> = {}
      for (const [altLocale, altSlug] of Object.entries(articleData.alternates)) {
        params[altLocale] = { slug: altSlug }
      }
      setI18nParams(params)
    }

    // Helper to fetch related - only needed for standard articles
    let related: BlogArticleListItem[] = []
    
    if (!articleData.isPowerPage) {
      const fetchRelated = (query: BlogArticleQueryParams = {}) => {
        const baseQuery = {
          page: 1,
          limit: 4,
          lang: locale.value,
          ...query,
        }
        const sanitizedQuery = Object.fromEntries(
          Object.entries(baseQuery).filter(([, value]) => value !== undefined && value !== null),
        )
        return $fetch<BlogArticlesResponse>('/api/v1/blog/articles', {
          query: sanitizedQuery,
        })
      }

      try {
        const categoryKey = articleData.category?.key
        const primaryResponse = await fetchRelated({ category: categoryKey })

        let candidates = primaryResponse.data
          .filter((item) => item.slug !== articleData.slug)
          .slice(0, 3)

        if (candidates.length === 0) {
          const fallbackResponse = await fetchRelated()
          candidates = fallbackResponse.data
            .filter((item) => item.slug !== articleData.slug)
            .slice(0, 3)
        }
        related = candidates
      } catch (e) {
        console.error('Failed to fetch related articles', e)
      }
    }

    return {
      data: articleData,
      related,
    }
  },
  {
    watch: [slug, () => locale.value],
  },
)

const article = computed<BlogArticleDetail | null>(() => data.value?.data ?? null)
const relatedArticles = computed<BlogArticleListItem[]>(() => data.value?.related ?? [])

const defaultTitle = computed(() => t('blog.meta.title'))
const defaultDescription = computed(() => t('blog.meta.description'))

useSeoMeta({
  title: computed(() => article.value?.title ?? defaultTitle.value),
  description: computed(
    () => article.value?.seoDescription ?? article.value?.excerpt ?? defaultDescription.value,
  ),
  keywords: computed(() => {
    const tags = article.value?.tags ?? []
    if (!tags.length) {
      return undefined
    }
    return tags.join(', ')
  }),
  ogTitle: computed(() => article.value?.title ?? defaultTitle.value),
  ogDescription: computed(
    () => article.value?.seoDescription ?? article.value?.excerpt ?? defaultDescription.value,
  ),
  ogImage: computed(() => article.value?.heroImage ?? article.value?.image ?? undefined),
  twitterCard: 'summary_large_image',
})

type ApiErrorLike = { status?: number; statusCode?: number; data?: { statusMessage?: string } }

const fetchError = computed(() => error.value as ApiErrorLike | null)

const errorMessage = computed(() => {
  const err = fetchError.value
  if (err) {
    const status = (err as any).statusCode ?? err.status

    if (status === 404) {
      return t('article.notFound')
    }

    return err?.data?.statusMessage || t('article.error')
  }

  if (!pending.value && !article.value) {
    return t('article.notFound')
  }

  return ''
})
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
