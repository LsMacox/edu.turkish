<template>
  <BaseCard
    :to="localePath({ name: 'articles-slug', params: { slug: article.slug } })"
    padding="none"
    shadow="md"
    rounded="lg"
    hover="lift"
    full-height
    class="group flex flex-col"
  >
      <div class="relative overflow-hidden rounded-t-lg">
        <template v-if="article.image">
          <NuxtImg
            :src="article.image"
            :alt="article.imageAlt || article.title"
            :class="['h-28 md:h-card-image w-full object-cover', IMAGE_HOVER_CLASSES]"
            format="webp"
          />
        </template>
        <div
          v-else
          class="flex h-28 md:h-card-image w-full items-center justify-center gradient-placeholder card-padding-xs text-center"
        >
          <span class="text-secondary text-body-sm font-semibold">{{ article.title }}</span>
        </div>
      </div>
      <div class="flex flex-1 flex-col gap-component-sm md:gap-component-lg card-padding-sm md:card-padding">
        <BaseBadge
          color="primary"
          variant="soft"
          size="sm"
          class="w-fit"
        >
          {{ article.category.label }}
        </BaseBadge>
        <h3 :class="['text-card-title', TEXT_HOVER_CLASSES]">
          {{ article.title }}
        </h3>
        <p class="flex-1 text-body-sm line-clamp-3">{{ article.excerpt }}</p>
        <div class="flex items-center justify-between text-body-sm text-meta">
          <span>{{ formatDate(article.publishedAt) }}</span>
          <span v-if="formatReadingTime(article.readingTimeMinutes)">{{
            formatReadingTime(article.readingTimeMinutes)
          }}</span>
        </div>
      </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { BlogArticleListItem } from '~~/lib/types'
import { key } from '~~/lib/i18n'
import { TEXT_HOVER_CLASSES, IMAGE_HOVER_CLASSES } from '~/composables/ui/useHover'

const { formatDate, t } = useI18nHelpers()
const localePath = useLocalePath()

const formatReadingTime = (minutes?: number | null) =>
  minutes ? t(key('blog.articles.readingTime'), { minutes }) : null

defineProps<{
  article: BlogArticleListItem
}>()
</script>

