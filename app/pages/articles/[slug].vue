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
      <section
        class="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-20"
      >
        <div class="container mx-auto px-4 lg:px-6">
          <div class="grid items-center gap-12 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
            <div class="space-y-6">
              <span
                v-if="heroKicker"
                class="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary"
              >
                {{ heroKicker }}
              </span>
              <h1 class="text-4xl font-bold leading-tight text-secondary lg:text-5xl">
                {{ article.title }}
              </h1>
              <p v-if="heroSubtitle" class="text-lg text-gray-600 lg:text-xl">
                {{ heroSubtitle }}
              </p>
              <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                <div
                  v-for="metaItem in heroMeta"
                  :key="metaItem.label"
                  class="flex items-center gap-2"
                >
                  <Icon :name="metaItem.icon" class="text-primary" />
                  {{ metaItem.label }}
                </div>
              </div>
            </div>
            <div v-if="heroImage" class="relative">
              <div
                class="absolute -top-8 -right-6 hidden h-40 w-40 rounded-full bg-primary/10 blur-3xl lg:block"
              />
              <div class="relative overflow-hidden rounded-3xl shadow-custom">
                <NuxtImg
                  :src="heroImage"
                  :alt="heroImageAlt"
                  class="h-full w-full object-cover"
                  format="webp"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-16">
        <div class="container mx-auto px-4 lg:px-6">
          <div class="grid gap-12 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
            <article class="rounded-3xl bg-white p-6 shadow-custom ring-1 ring-gray-100/60 lg:p-10">
              <div class="space-y-10">
                <div
                  v-for="(block, index) in normalizedContent"
                  :key="`${block.type}-${index}`"
                  class="space-y-4"
                >
                  <component
                    :is="headingTag(block.level)"
                    v-if="block.type === 'heading'"
                    :id="block.id"
                    class="scroll-mt-24 text-2xl font-semibold text-secondary lg:text-3xl"
                  >
                    {{ block.text }}
                  </component>

                  <p v-else-if="block.type === 'paragraph'" class="leading-relaxed text-gray-600">
                    {{ block.text }}
                  </p>

                  <component
                    :is="block.ordered ? 'ol' : 'ul'"
                    v-else-if="block.type === 'list'"
                    class="list-inside space-y-2 text-gray-600"
                    :class="block.ordered ? 'list-decimal' : 'list-disc'"
                  >
                    <li v-for="(item, itemIndex) in block.items" :key="`item-${itemIndex}`">
                      {{ String(item) }}
                    </li>
                  </component>

                  <figure v-else-if="block.type === 'image'" class="space-y-3">
                    <NuxtImg
                      :src="block.url"
                      :alt="block.alt || article.title"
                      class="w-full rounded-2xl object-cover"
                      format="webp"
                    />
                    <figcaption v-if="block.caption" class="text-sm text-gray-500">
                      {{ block.caption }}
                    </figcaption>
                  </figure>

                  <blockquote
                    v-else-if="block.type === 'quote'"
                    class="space-y-3 rounded-2xl bg-gradient-to-br from-primary/5 via-white to-secondary/5 p-6 shadow-inner"
                  >
                    <Icon name="mdi:format-quote-open" class="text-3xl text-primary" />
                    <p class="text-lg font-medium text-secondary">{{ block.text }}</p>
                    <cite v-if="block.author" class="block text-sm text-gray-500">{{
                      block.author
                    }}</cite>
                  </blockquote>
                </div>
              </div>
            </article>

            <aside class="space-y-8">
              <div v-if="tableOfContents.length" class="rounded-3xl bg-white p-6 shadow-custom">
                <h3 class="text-lg font-semibold text-secondary">
                  {{ t('article.tableOfContents') }}
                </h3>
                <nav class="mt-4 space-y-2 text-sm text-gray-600">
                  <a
                    v-for="section in tableOfContents"
                    :key="section.id"
                    :href="`#${section.id}`"
                    class="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-background hover:text-secondary"
                  >
                    <span
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary"
                    >
                      {{ section.order }}
                    </span>
                    <span>{{ section.title }}</span>
                  </a>
                </nav>
              </div>

              <div
                v-if="quickFacts.length"
                class="rounded-3xl bg-gradient-to-br from-primary to-secondary p-[1px] shadow-lg"
              >
                <div class="rounded-3xl bg-white p-6">
                  <h3 class="text-lg font-semibold text-secondary">
                    {{ t('article.quickFacts.title') }}
                  </h3>
                  <ul class="mt-4 space-y-3 text-sm text-gray-600">
                    <li v-for="fact in quickFacts" :key="fact.title" class="flex gap-3">
                      <Icon
                        :name="fact.icon || 'mdi:information-outline'"
                        class="mt-0.5 text-primary"
                      />
                      <div>
                        <p class="font-medium text-secondary">{{ fact.title }}</p>
                        <p>{{ fact.value }}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div v-if="highlights.length" class="rounded-3xl bg-white p-6 shadow-custom">
                <h3 class="text-lg font-semibold text-secondary">
                  {{ t('article.highlights.title') }}
                </h3>
                <ul class="mt-4 space-y-3 text-sm text-gray-600">
                  <li v-for="highlight in highlights" :key="highlight" class="flex gap-3">
                    <Icon name="mdi:star-circle" class="mt-0.5 text-primary" />
                    <span>{{ highlight }}</span>
                  </li>
                </ul>
              </div>

              <div class="rounded-3xl bg-background p-6">
                <h3 class="text-lg font-semibold text-secondary">{{ t('article.share.title') }}</h3>
                <p class="mt-2 text-sm text-gray-600">
                  {{ t('article.share.description') }}
                </p>
                <div class="mt-4 flex flex-wrap gap-3">
                  <a
                    v-for="link in shareLinks"
                    :key="link.label"
                    :href="link.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-secondary transition hover:border-primary hover:text-primary"
                  >
                    <Icon :name="link.icon" class="text-lg" />
                    {{ link.label }}
                  </a>
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-secondary transition hover:border-primary hover:text-primary"
                    @click="copyShareLink"
                  >
                    <Icon name="mdi:link-variant" class="text-lg" />
                    {{ t('article.share.copyLink') }}
                  </button>
                </div>
              </div>

              <div v-if="tags.length" class="rounded-3xl bg-white p-6 shadow-custom">
                <h3 class="text-lg font-semibold text-secondary">{{ t('article.tags.title') }}</h3>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span
                    v-for="tag in tags"
                    :key="tag"
                    class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section v-if="relatedArticles.length" class="border-t border-gray-100 bg-background py-16">
        <div class="container mx-auto px-4 lg:px-6">
          <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 class="text-2xl font-semibold text-secondary lg:text-3xl">
                {{ t('article.related.title') }}
              </h2>
              <p class="mt-2 max-w-2xl text-gray-600">
                {{ t('article.related.description') }}
              </p>
            </div>
            <NuxtLink
              :to="localePath('/blog')"
              class="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-secondary/90"
            >
              {{ t('article.related.allArticles') }}
              <Icon name="mdi:arrow-right" class="text-lg" />
            </NuxtLink>
          </div>

          <div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="related in relatedArticles"
              :key="related.id"
              class="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-custom transition hover:-translate-y-1"
            >
              <template v-if="related.image">
                <NuxtImg
                  :src="related.image"
                  :alt="related.imageAlt || related.title"
                  class="h-48 w-full object-cover"
                  format="webp"
                />
              </template>
              <div
                v-else
                class="flex h-48 w-full items-center justify-center bg-gray-100 px-4 text-center"
              >
                <span class="text-secondary text-sm font-semibold">{{ related.title }}</span>
              </div>
              <div class="flex flex-1 flex-col gap-4 p-6">
                <span
                  class="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                >
                  {{ related.category.label }}
                </span>
                <h3 class="text-lg font-semibold text-secondary group-hover:text-primary">
                  <NuxtLink
                    :to="localePath({ name: 'articles-slug', params: { slug: related.slug } })"
                  >
                    {{ related.title }}
                  </NuxtLink>
                </h3>
                <p class="flex-1 text-sm text-gray-600">{{ related.excerpt }}</p>
                <div class="flex items-center justify-between text-xs text-gray-500">
                  <span>{{ related.publishedAtLabel }}</span>
                  <span v-if="related.readingTimeLabel">{{ related.readingTimeLabel }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { FetchError } from 'ofetch'
import type {
  BlogArticleContentBlock,
  BlogArticleDetail,
  BlogArticleListItem,
  BlogArticlesResponse,
  BlogArticleQuickFact,
  BlogArticleQueryParams,
} from '../../../server/types/api'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const localePath = useLocalePath()
const requestUrl = useRequestURL()
const { locale, t } = useI18n()
const { show: showToast } = useToast()

const slug = computed(() => String(route.params.slug ?? ''))

const { data, pending, error } = await useAsyncData<{ data: BlogArticleDetail } | null>(
  'article-detail',
  async () => {
    if (!slug.value) {
      return null
    }

    return $fetch<{ data: BlogArticleDetail }>(`/api/v1/blog/articles/${slug.value}` as const, {
      query: { lang: locale.value },
    })
  },
  {
    watch: [slug, () => locale.value],
  },
)

const article = computed<BlogArticleDetail | null>(() => data.value?.data ?? null)

const defaultTitle = computed(() => t('blog.meta.title'))
const defaultDescription = computed(() => t('blog.meta.description'))

useSeoMeta({
  title: computed(() => article.value?.title ?? defaultTitle.value),
  description: computed(
    () => article.value?.seoDescription ?? article.value?.excerpt ?? defaultDescription.value,
  ),
  ogTitle: computed(() => article.value?.title ?? defaultTitle.value),
  ogDescription: computed(
    () => article.value?.seoDescription ?? article.value?.excerpt ?? defaultDescription.value,
  ),
  ogImage: computed(() => article.value?.heroImage ?? article.value?.image ?? undefined),
  twitterCard: 'summary_large_image',
})

type HeadingBlock = Extract<BlogArticleContentBlock, { type: 'heading' }>
type ParagraphBlock = Extract<BlogArticleContentBlock, { type: 'paragraph' }>
type ListBlock = Extract<BlogArticleContentBlock, { type: 'list' }>
type QuoteBlock = Extract<BlogArticleContentBlock, { type: 'quote' }>
type ImageBlock = Extract<BlogArticleContentBlock, { type: 'image' }>

type HeadingBlockWithId = HeadingBlock & { id: string }
type NormalizedBlock = HeadingBlockWithId | ParagraphBlock | ListBlock | QuoteBlock | ImageBlock

const createHeadingId = (text: string, counts: Map<string, number>): string => {
  const sanitized =
    text
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s-]+/gu, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'section'

  const count = counts.get(sanitized) ?? 0
  counts.set(sanitized, count + 1)
  return count === 0 ? sanitized : `${sanitized}-${count}`
}

const normalizedContent = computed<NormalizedBlock[]>(() => {
  if (!article.value) {
    return []
  }

  const counts = new Map<string, number>()

  return article.value.content.map((block: BlogArticleContentBlock) => {
    if (block.type === 'heading') {
      return {
        ...block,
        id: createHeadingId(block.text, counts),
      }
    }
    return block
  })
})

const isHeadingBlock = (block: NormalizedBlock): block is HeadingBlockWithId =>
  block.type === 'heading'

const tableOfContents = computed(() => {
  const headings = normalizedContent.value
    .filter(isHeadingBlock)
    .filter((block) => block.level <= 3)

  return headings.map((block, index) => ({
    id: block.id,
    order: String(index + 1).padStart(2, '0'),
    title: block.text,
  }))
})

const heroImage = computed(() => article.value?.heroImage ?? article.value?.image ?? null)
const heroImageAlt = computed(
  () => article.value?.heroImageAlt ?? article.value?.imageAlt ?? article.value?.title ?? '',
)
const heroSubtitle = computed(() => article.value?.heroSubtitle ?? article.value?.excerpt ?? '')
const heroKicker = computed(() => article.value?.heroKicker ?? article.value?.category.label ?? '')
const heroMeta = computed(() => {
  if (!article.value) {
    return [] as Array<{ icon: string; label: string }>
  }

  const result: Array<{ icon: string; label: string }> = []

  if (article.value.publishedAtLabel) {
    result.push({ icon: 'mdi:calendar', label: article.value.publishedAtLabel })
  }

  if (article.value.readingTimeLabel) {
    result.push({ icon: 'mdi:clock-outline', label: article.value.readingTimeLabel })
  }

  if (article.value.heroLocation) {
    result.push({ icon: 'mdi:map-marker-radius-outline', label: article.value.heroLocation })
  }

  return result
})

const quickFacts = computed<BlogArticleQuickFact[]>(() => {
  if (!article.value) {
    return []
  }

  const result: BlogArticleQuickFact[] = []
  const seen = new Set<string>()

  const addFact = (fact: BlogArticleQuickFact) => {
    const title = fact.title?.trim()
    const value = fact.value?.trim()

    if (!title || !value) {
      return
    }

    const key = title.toLowerCase()
    if (seen.has(key)) {
      return
    }

    seen.add(key)
    result.push({ title, value, icon: fact.icon })
  }

  addFact({
    title: t('article.quickFacts.category'),
    value: article.value.category.label,
    icon: 'mdi:tag-outline',
  })

  if (article.value.publishedAtLabel) {
    addFact({
      title: t('article.quickFacts.published'),
      value: article.value.publishedAtLabel,
      icon: 'mdi:calendar',
    })
  }

  if (article.value.readingTimeLabel) {
    addFact({
      title: t('article.quickFacts.readingTime'),
      value: article.value.readingTimeLabel,
      icon: 'mdi:clock-outline',
    })
  }

  for (const fact of article.value.quickFacts) {
    addFact(fact)
  }

  return result
})

const highlights = computed(() => article.value?.highlights ?? [])
const tags = computed(() => article.value?.tags ?? [])

const articlePath = computed(() =>
  localePath({ name: 'articles-slug', params: { slug: slug.value } }),
)

const articleUrl = computed(() => {
  const path = articlePath.value || '/'
  if (process.client) {
    return new URL(path, window.location.origin).toString()
  }
  return new URL(path, requestUrl.origin).toString()
})

const shareLinks = computed(() => {
  const url = articleUrl.value
  const title = article.value?.title ?? ''

  return [
    {
      label: 'Telegram',
      icon: 'mdi:telegram',
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      label: 'WhatsApp',
      icon: 'mdi:whatsapp',
      href: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
    },
  ]
})

const copyShareLink = async () => {
  try {
    if (process.client && navigator?.clipboard) {
      await navigator.clipboard.writeText(articleUrl.value)
      showToast(t('article.share.copySuccess'), { type: 'success' })
    } else {
      throw new Error('Clipboard API unavailable')
    }
  } catch {
    showToast(t('article.share.copyError'), { type: 'error' })
  }
}

const relatedArticles = ref<BlogArticleListItem[]>([])

const fetchArticles = (query: BlogArticleQueryParams = {}) => {
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

const loadRelatedArticles = async () => {
  if (!article.value) {
    relatedArticles.value = []
    return
  }

  try {
    const categoryKey = article.value.category?.key
    const primaryResponse = await fetchArticles({ category: categoryKey })

    let candidates = primaryResponse.data
      .filter((item) => item.slug !== article.value?.slug)
      .slice(0, 3)

    if (candidates.length === 0) {
      const fallbackResponse = await fetchArticles()
      candidates = fallbackResponse.data
        .filter((item) => item.slug !== article.value?.slug)
        .slice(0, 3)
    }

    relatedArticles.value = candidates
  } catch (err) {
    if (process.client) {
      console.error('[article] Failed to load related articles', err)
    }
    relatedArticles.value = []
  }
}

watch(
  () => [article.value?.id, locale.value],
  async () => {
    if (!article.value) {
      relatedArticles.value = []
      return
    }

    await loadRelatedArticles()
  },
  { immediate: true },
)

const headingTag = (level: number) => {
  if (level <= 2) {
    return 'h2'
  }
  if (level === 3) {
    return 'h3'
  }
  if (level === 4) {
    return 'h4'
  }
  return 'h5'
}

const fetchError = computed(() => error.value as FetchError | null)

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

.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem);
}

.hover\:-translate-y-1 {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
</style>
