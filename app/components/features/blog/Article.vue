<template>
  <div class="standard-article">
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
          <div v-if="resolvedHeroImage" class="relative">
            <div
              class="absolute -top-8 -right-6 hidden h-40 w-40 rounded-full bg-primary/10 blur-3xl lg:block"
            />
            <div class="relative overflow-hidden rounded-3xl shadow-custom h-80 lg:h-96">
              <NuxtImg
                :src="resolvedHeroImage"
                :alt="heroImageAlt"
                class="h-full w-full object-cover"
                format="webp"
                @error="onHeroImageError"
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
            <div class="space-y-6">
              <!-- eslint-disable vue/no-v-html -->
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
                  v-html="block.text"
                />

                <p
                  v-else-if="block.type === 'paragraph'"
                  class="leading-relaxed text-gray-600"
                  v-html="block.text"
                />

                <LazyBlogContentContentList
                  v-else-if="block.type === 'list'"
                  :items="block.items"
                  :ordered="block.ordered"
                  :list-style="block.style"
                />

                <LazyBlogContentContentFaq
                  v-else-if="block.type === 'faq'"
                  :items="block.items"
                />

                <figure v-else-if="block.type === 'image'" class="space-y-3">
                  <NuxtImg
                    :src="block.url"
                    :alt="block.alt || article.title"
                    class="object-cover"
                    :class="[
                      block.width === 'full'
                        ? '-mx-6 w-[calc(100%+3rem)] max-w-none rounded-none lg:-mx-10 lg:w-[calc(100%+5rem)]'
                        : 'w-full rounded-2xl',
                    ]"
                    format="webp"
                  />
                  <figcaption
                    v-if="block.caption"
                    class="text-sm text-gray-500"
                    :class="{ 'px-6 lg:px-10': block.width === 'full' }"
                    v-html="block.caption"
                  />
                </figure>

                <blockquote
                  v-else-if="block.type === 'quote'"
                  class="space-y-2 rounded-xl bg-gradient-to-br from-primary/5 via-white to-secondary/5 p-5 shadow-sm"
                >
                  <Icon name="mdi:format-quote-open" class="text-2xl text-primary" />
                  <p class="font-medium text-secondary" v-html="block.text"></p>
                  <cite v-if="block.author" class="block text-sm text-gray-500">{{
                    block.author
                  }}</cite>
                </blockquote>

                <div
                  v-else-if="block.type === 'spacer'"
                  :class="{
                    'h-4': block.size === 'sm',
                    'h-8': block.size === 'md',
                    'h-12': block.size === 'lg',
                    'h-16': block.size === 'xl',
                  }"
                />

                <hr v-else-if="block.type === 'divider'" class="border-gray-100 my-4" />
              </div>
              <!-- eslint-enable vue/no-v-html -->
            </div>
          </article>

          <aside class="space-y-8">
            <div
              v-if="tableOfContents.length"
              class="hidden md:block rounded-3xl bg-white p-6 shadow-custom"
            >
              <h3 class="text-card-title mb-2">
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
                    class="flex h-8 w-8 min-h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
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
                <h3 class="text-card-title mb-2">
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
            <div class="rounded-3xl bg-background p-6">
              <h3 class="text-card-title mb-2">{{ t('article.share.title') }}</h3>
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
              <h3 class="text-card-title mb-2">{{ t('article.tags.title') }}</h3>
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
            <h2 class="text-section-title">
              {{ t('article.related.title') }}
            </h2>
            <p class="text-section-subtitle max-w-2xl">
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
              <h3 class="text-card-title group-hover:text-primary">
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
  </div>
</template>

<script setup lang="ts">
import type {
  BlogArticleContentBlock,
  BlogArticleDetail,
  BlogArticleListItem,
  BlogArticleQuickFact,
} from '~~/server/types/api'

const props = defineProps<{
  article: BlogArticleDetail
  relatedArticles: BlogArticleListItem[]
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const { show: showToast } = useToast()
const requestUrl = useRequestURL()

type NormalizedBlock = 
  | Exclude<BlogArticleContentBlock, { type: 'heading' }>
  | (Extract<BlogArticleContentBlock, { type: 'heading' }> & { id: string })

// Utilities
const stripTags = (html: string): string => html.replace(/<[^>]*>/g, '')

const createHeadingId = (text: string, counts: Map<string, number>): string => {
  const sanitized =
    stripTags(text)
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

// Computed Properties
const normalizedContent = computed<NormalizedBlock[]>(() => {
  if (!props.article) {
    return []
  }

  const counts = new Map<string, number>()

  return props.article.content.map((block: BlogArticleContentBlock) => {
    if (block.type === 'heading') {
      return {
        ...block,
        id: createHeadingId(block.text, counts),
      }
    }
    return block
  })
})

type HeadingBlockWithId = Extract<NormalizedBlock, { type: 'heading' }>

const isHeadingBlock = (block: NormalizedBlock): block is HeadingBlockWithId =>
  block.type === 'heading'

const tableOfContents = computed(() => {
  const headings = normalizedContent.value
    .filter(isHeadingBlock)
    .filter((block) => block.level <= 3)

  return headings.map((block, index) => ({
    id: block.id,
    order: String(index + 1).padStart(2, '0'),
    title: stripTags(block.text),
  }))
})

const failedHero = ref(false)
const heroImage = computed(() => props.article.heroImage ?? null)
const resolvedHeroImage = computed(() => {
  if (failedHero.value) {
    return props.article.image ?? null
  }
  return heroImage.value ?? props.article.image ?? null
})

const heroImageAlt = computed(
  () => props.article.heroImageAlt ?? props.article.imageAlt ?? props.article.title ?? '',
)
const heroSubtitle = computed(() => props.article.heroSubtitle ?? props.article.excerpt ?? '')
const heroKicker = computed(() => props.article.heroKicker ?? props.article.category.label ?? '')

const heroMeta = computed(() => {
  const result: Array<{ icon: string; label: string }> = []

  if (props.article.publishedAtLabel) {
    result.push({ icon: 'mdi:calendar', label: props.article.publishedAtLabel })
  }

  if (props.article.readingTimeLabel) {
    result.push({ icon: 'mdi:clock-outline', label: props.article.readingTimeLabel })
  }

  if (props.article.heroLocation) {
    result.push({ icon: 'mdi:map-marker-radius-outline', label: props.article.heroLocation })
  }

  return result
})

const onHeroImageError = () => {
  failedHero.value = true
}

const quickFacts = computed<BlogArticleQuickFact[]>(() => {
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
    value: props.article.category.label,
    icon: 'mdi:tag-outline',
  })

  if (props.article.publishedAtLabel) {
    addFact({
      title: t('article.quickFacts.published'),
      value: props.article.publishedAtLabel,
      icon: 'mdi:calendar',
    })
  }

  if (props.article.readingTimeLabel) {
    addFact({
      title: t('article.quickFacts.readingTime'),
      value: props.article.readingTimeLabel,
      icon: 'mdi:clock-outline',
    })
  }

  for (const fact of props.article.quickFacts) {
    addFact(fact)
  }

  return result
})

const tags = computed(() => props.article.tags ?? [])

const articlePath = computed(() =>
  localePath({ name: 'articles-slug', params: { slug: props.article.slug } }),
)

const articleUrl = computed(() => {
  const path = articlePath.value || '/'
  if (import.meta.client) {
    return new URL(path, window.location.origin).toString()
  }
  return new URL(path, requestUrl.origin).toString()
})

const shareLinks = computed(() => {
  const url = articleUrl.value
  const title = props.article.title ?? ''

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
    if (import.meta.client && navigator?.clipboard) {
      await navigator.clipboard.writeText(articleUrl.value)
      showToast(t('article.share.copySuccess'), { type: 'success' })
    } else {
      throw new Error('Clipboard API unavailable')
    }
  } catch {
    showToast(t('article.share.copyError'), { type: 'error' })
  }
}

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
