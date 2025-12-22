<template>
  <div>
    <BaseSectionHeader :title="title" align="left" margin-bottom="lg" />

    <div class="grid md:grid-cols-2 gap-component-lg mb-component-lg">
      <article v-if="featured && showFeatured" class="md:col-span-2 h-full">
        <BaseCard
          :to="articleLink(featured.slug)"
          padding="none"
          shadow="md"
          rounded="2xl"
          hover="lift"
          full-height
          class="group"
        >
          <template v-if="featured.image && !failedFeatured">
            <NuxtImg
              :src="featured.image"
              :alt="featured.imageAlt || featured.title"
              class="w-full h-card-image-lg object-cover rounded-t-2xl"
              loading="lazy"
              decoding="async"
              sizes="100vw"
              format="webp"
              @error="failedFeatured = true"
            />
          </template>
          <div
            v-else
            class="w-full h-card-image-lg gradient-placeholder-media flex items-center justify-center card-padding text-center"
          >
            <p class="text-card-title">{{ featured.title }}</p>
          </div>
          <div class="card-padding-lg">
            <div class="flex flex-wrap items-center gap-component-sm mb-component-sm text-body-sm text-meta">
              <span
                class="badge-category"
                :class="categoryBadgeClass(featured.category?.key)"
              >
                {{ featured.category?.label }}
              </span>
              <span>{{ formatDate(featured.publishedAt) }}</span>
              <span v-if="formatReadingTime(featured.readingTimeMinutes)"
                >• {{ formatReadingTime(featured.readingTimeMinutes) }}</span
              >
            </div>
            <h3 class="text-section-title mb-component-sm">{{ featured.title }}</h3>
            <p class="text-body-sm leading-relaxed mb-component-md">{{ featured.excerpt }}</p>
            <span class="text-primary font-semibold">
              {{ readMoreLabel }}
            </span>
          </div>
        </BaseCard>
      </article>

      <article v-for="article in items" :key="article.id" class="h-full">
        <BaseCard
          :to="articleLink(article.slug)"
          padding="none"
          shadow="md"
          rounded="2xl"
          hover="lift"
          full-height
          class="group flex flex-col"
        >
          <template v-if="article.image">
            <NuxtImg
              v-if="!failedCards[article.id]"
              :src="article.image"
              :alt="article.imageAlt || article.title"
              class="w-full h-card-image object-cover rounded-t-2xl"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 100vw, 50vw"
              format="webp"
              @error="failedCards[article.id] = true"
            />
          </template>
          <div
            v-else
            class="w-full h-card-image gradient-placeholder flex items-center justify-center card-padding-sm text-center"
          >
            <span class="text-secondary text-body-sm font-semibold">{{ article.title }}</span>
          </div>
          <div class="card-padding flex flex-col flex-1">
            <div class="flex flex-wrap items-center gap-component-sm mb-component-sm text-body-sm text-meta">
              <span
                class="badge-category"
                :class="categoryBadgeClass(article.category?.key)"
              >
                {{ article.category?.label }}
              </span>
              <span>{{ formatDate(article.publishedAt) }}</span>
            </div>
            <h3 class="text-card-title mb-component-sm">{{ article.title }}</h3>
            <p class="text-body-sm mb-component-sm">{{ article.excerpt }}</p>
            <div class="mt-auto pt-component-xs flex items-center justify-between text-body-sm text-meta">
              <span v-if="formatReadingTime(article.readingTimeMinutes)">{{
                formatReadingTime(article.readingTimeMinutes)
              }}</span>
              <span class="text-primary font-semibold">
                {{ readMoreLabel }}
              </span>
            </div>
          </div>
        </BaseCard>
      </article>
    </div>

    <p v-if="!loading && items.length === 0 && !featured" class="text-center text-meta">
      {{ emptyLabel }}
    </p>

    <p
      v-if="error"
      class="mt-component-md rounded-button border border-error-light bg-error-light btn-padding-sm text-body-sm text-error"
    >
      {{ error }}
    </p>

  </div>
</template>

<script setup lang="ts">
import type { BlogArticleListItem } from '~~/lib/types'
import { key } from '~~/lib/i18n'
import type { SemanticColor } from '~/types/ui'
import { SEMANTIC_BADGE_COLORS } from '~/composables/ui'

const { formatDate, t } = useI18nHelpers()

const formatReadingTime = (minutes?: number | null) =>
  minutes ? t(key('blog.articles.readingTime'), { minutes }) : null

defineProps<{
  title: string
  readMoreLabel: string
  emptyLabel: string
  items: BlogArticleListItem[]
  featured: BlogArticleListItem | null
  showFeatured: boolean
  error: string | null
  activeCategory: string
  loading: boolean
}>()


const localePath = useLocalePath()
const articleLink = (slug: string) => localePath({ name: 'articles-slug', params: { slug } })

const failedFeatured = ref(false)
const failedCards = ref<Record<number, boolean>>({})

const categoryColors: Record<string, SemanticColor> = {
  visas: 'info',
  exams: 'success',
  scholarships: 'warning',
  cost: 'warning',
  life: 'success',
  applications: 'info',
  rankings: 'primary',
}

const categoryBadgeClass = (key?: string) => {
  const color = key ? (categoryColors[key] ?? 'neutral') : 'neutral'
  return SEMANTIC_BADGE_COLORS[color].soft
}
</script>
