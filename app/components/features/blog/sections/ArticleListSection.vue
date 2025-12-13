<template>
  <div>
    <BaseSectionHeader :title="title" align="left" margin-bottom="lg" />

    <div class="grid md:grid-cols-2 gap-8 mb-12">
      <article v-if="featured && showFeatured" class="md:col-span-2 h-full">
        <NuxtLink
          :to="articleLink(featured.slug)"
          class="block bg-white rounded-2xl shadow-custom overflow-hidden hover-lift h-full"
        >
          <template v-if="featured.image && !failedFeatured">
            <NuxtImg
              :src="featured.image"
              :alt="featured.imageAlt || featured.title"
              class="w-full h-64 object-cover"
              loading="lazy"
              decoding="async"
              sizes="100vw"
              format="webp"
              @error="failedFeatured = true"
            />
          </template>
          <div
            v-else
            class="w-full h-64 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-6 text-center"
          >
            <p class="text-secondary font-semibold text-lg">{{ featured.title }}</p>
          </div>
          <div class="p-8">
            <div class="flex flex-wrap items-center gap-2 mb-4 text-sm text-gray-500">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                :class="categoryBadgeClass(featured.category?.key)"
              >
                {{ featured.category?.label }}
              </span>
              <span>{{ formatDate(featured.publishedAt) }}</span>
              <span v-if="formatReadingTime(featured.readingTimeMinutes)"
                >• {{ formatReadingTime(featured.readingTimeMinutes) }}</span
              >
            </div>
            <h3 class="text-section-title mb-4">{{ featured.title }}</h3>
            <p class="text-gray-600 leading-relaxed mb-6">{{ featured.excerpt }}</p>
            <span class="text-primary font-semibold hover:underline">
              {{ readMoreLabel }}
            </span>
          </div>
        </NuxtLink>
      </article>

      <article v-for="article in items" :key="article.id" class="h-full">
        <NuxtLink
          :to="articleLink(article.slug)"
          class="bg-white rounded-2xl shadow-custom overflow-hidden hover-lift flex flex-col h-full"
        >
          <template v-if="article.image">
            <NuxtImg
              v-if="!failedCards[article.id]"
              :src="article.image"
              :alt="article.imageAlt || article.title"
              class="w-full h-48 object-cover"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 100vw, 50vw"
              format="webp"
              @error="failedCards[article.id] = true"
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
              <span>{{ formatDate(article.publishedAt) }}</span>
            </div>
            <h3 class="text-card-title mb-3">{{ article.title }}</h3>
            <p class="text-gray-600 text-sm mb-4">{{ article.excerpt }}</p>
            <div class="mt-auto pt-2 flex items-center justify-between text-sm text-gray-500">
              <span v-if="formatReadingTime(article.readingTimeMinutes)">{{
                formatReadingTime(article.readingTimeMinutes)
              }}</span>
              <span class="text-primary font-semibold hover:underline">
                {{ readMoreLabel }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </article>
    </div>

    <p v-if="!loading && items.length === 0 && !featured" class="text-center text-gray-500">
      {{ emptyLabel }}
    </p>

    <p
      v-if="error"
      class="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
    >
      {{ error }}
    </p>

  </div>
</template>

<script setup lang="ts">
import type { BlogArticleListItem } from '~~/lib/types'
import { key } from '~~/lib/i18n'

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

const categoryStyles: Record<string, string> = {
  visas: 'bg-blue-100 text-blue-800',
  exams: 'bg-green-100 text-green-800',
  scholarships: 'bg-yellow-100 text-yellow-800',
  cost: 'bg-orange-100 text-orange-800',
  life: 'bg-teal-100 text-teal-800',
  applications: 'bg-indigo-100 text-indigo-800',
  rankings: 'bg-purple-100 text-purple-800',
}

const categoryBadgeClass = (key?: string) =>
  key ? (categoryStyles[key] ?? 'bg-gray-100 text-gray-600') : 'bg-gray-100 text-gray-600'
</script>
