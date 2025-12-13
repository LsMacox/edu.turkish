<template>
  <NuxtLink
    :to="localePath({ name: 'articles-slug', params: { slug: article.slug } })"
    class="group block"
  >
    <article
      class="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-custom transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div class="relative overflow-hidden">
        <template v-if="article.image">
          <NuxtImg
            :src="article.image"
            :alt="article.imageAlt || article.title"
            class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            format="webp"
          />
        </template>
        <div
          v-else
          class="flex h-48 w-full items-center justify-center bg-gray-100 px-4 text-center"
        >
          <span class="text-secondary text-sm font-semibold">{{ article.title }}</span>
        </div>
      </div>
      <div class="flex flex-1 flex-col gap-4 p-6">
        <span
          class="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
        >
          {{ article.category.label }}
        </span>
        <h3 class="text-card-title transition-colors group-hover:text-primary">
          {{ article.title }}
        </h3>
        <p class="flex-1 text-sm text-gray-600 line-clamp-3">{{ article.excerpt }}</p>
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span>{{ formatDate(article.publishedAt) }}</span>
          <span v-if="formatReadingTime(article.readingTimeMinutes)">{{
            formatReadingTime(article.readingTimeMinutes)
          }}</span>
        </div>
      </div>
    </article>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { BlogArticleListItem } from '~~/lib/types'
import { key } from '~~/lib/i18n'

const { formatDate, t } = useI18nHelpers()
const localePath = useLocalePath()

const formatReadingTime = (minutes?: number | null) =>
  minutes ? t(key('blog.articles.readingTime'), { minutes }) : null

defineProps<{
  article: BlogArticleListItem
}>()
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
