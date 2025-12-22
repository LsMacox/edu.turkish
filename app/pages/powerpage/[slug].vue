<template>
  <div class="bg-white">
    <section v-if="pending" class="py-20">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="rounded-card-lg bg-white p-10 text-center shadow-custom">
          <p class="text-lg font-semibold text-secondary">{{ t(articleNs('loading')) }}</p>
        </div>
      </div>
    </section>

    <section v-else-if="errorMessage" class="py-20">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="space-y-6 rounded-card-lg bg-white p-10 text-center shadow-custom">
          <p class="text-2xl font-semibold text-secondary">{{ errorMessage }}</p>
          <NuxtLink
            :to="localePath('/')"
            class="inline-flex items-center gap-component-sm rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-card-hover transition hover:bg-secondary/90"
          >
            {{ t(key('back_to_home')) }}
            <Icon name="mdi:arrow-right" class="text-lg" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <template v-else-if="article">
      <LazyBlogPowerPage :article="article" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { BlogArticleDetail } from '~~/lib/types'
import { namespace, key } from '~~/lib/i18n'

const articleNs = namespace('blog.article')
const blogNs = namespace('blog')

definePageMeta({ layout: 'default' })

const route = useRoute()
const localePath = useLocalePath()
const { locale, t } = useI18n()
const setI18nParams = useSetI18nParams()

const slug = computed(() => String(route.params.slug ?? ''))

const {
  data: article,
  pending,
  error,
} = await useAsyncData(
  `powerpage-detail-${slug.value}-${locale.value}`,
  async () => {
    if (!slug.value) return null

    const response = await $fetch<{ data: BlogArticleDetail }>(
      `/api/v1/blog/articles/${slug.value}`,
      { query: { lang: locale.value } },
    )

    const articleData = response?.data
    // Ensure this is actually a powerpage
    if (!articleData || !articleData.isPowerPage) return null

    if (articleData.alternates) {
      setI18nParams(
        Object.fromEntries(
          Object.entries(articleData.alternates).map(([loc, s]) => [loc, { slug: s }]),
        ),
      )
    }

    return articleData
  },
  { watch: [slug, locale] },
)

const seoTitle = computed(() => article.value?.title ?? t(blogNs('meta.title')))
const seoDescription = computed(
  () => article.value?.seoDescription ?? article.value?.excerpt ?? t(blogNs('meta.description')),
)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  keywords: computed(() => article.value?.tags?.join(', ')),
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: computed(() => article.value?.heroImage ?? article.value?.image),
  twitterCard: 'summary_large_image',
})

const errorMessage = computed(() => {
  if (error.value) {
    const status = (error.value as any).statusCode ?? (error.value as any).status
    return status === 404 ? t(articleNs('notFound')) : t(articleNs('error'))
  }
  return !pending.value && !article.value ? t(articleNs('notFound')) : ''
})
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
