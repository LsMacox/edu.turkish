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
            <BlogContentRenderer
              :content="article.content"
              variant="article"
              :fallback-alt="article.title"
              enable-widgets
            />
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
import type { BlogArticleDetail, BlogArticleListItem } from '~~/server/types/api'
import { useDetailPage } from '~/components/features/blog/composables/useDetailPage'

const props = defineProps<{
  article: BlogArticleDetail
  relatedArticles: BlogArticleListItem[]
}>()

const { t } = useI18n()
const localePath = useLocalePath()

// Use shared detail page composable
const articleRef = computed(() => props.article)
const {
  tableOfContents,
  resolvedHeroImage,
  heroImageAlt,
  heroSubtitle,
  heroKicker,
  heroMeta,
  onHeroImageError,
  quickFacts,
  tags,
  shareLinks,
  copyShareLink,
} = useDetailPage(articleRef, {
  routeName: 'articles-slug',
  i18nPrefix: 'article.quickFacts',
  includeReadingTime: true,
  includePublishedDate: true,
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
