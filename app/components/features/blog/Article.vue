<template>
  <div class="standard-article">
    <section
      class="relative overflow-hidden gradient-hero-primary section-py"
    >
      <!-- Mobile blur background -->
      <div
        v-if="resolvedHeroImage"
        class="absolute inset-0 md:hidden"
      >
        <NuxtImg
          :src="resolvedHeroImage"
          :alt="''"
          class="h-full w-full object-cover blur-xl scale-110 opacity-30"
          format="webp"
          loading="eager"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/60" />
      </div>

      <div class="container mx-auto container-padding relative">
        <BaseBreadcrumbs :items="breadcrumbItems" class="mb-component-lg" />
        <div class="grid items-center gap-component-lg lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
          <div class="space-component-lg">
            <BaseBadge
              v-if="heroKicker"
              color="primary"
              variant="soft"
            >
              {{ heroKicker }}
            </BaseBadge>
            <h1 class="text-hero">
              {{ article.title }}
            </h1>
            <p v-if="heroSubtitle" class="text-hero-subtitle">
              {{ heroSubtitle }}
            </p>
            <div class="flex flex-wrap gap-component-lg text-body-sm text-meta">
              <BaseIconText
                v-for="metaItem in heroMeta"
                :key="metaItem.label"
                :icon="metaItem.icon"
                :text="metaItem.label"
                size="sm"
                color="neutral"
                icon-color="primary"
                spacing="sm"
              />
            </div>
          </div>
          <div v-if="resolvedHeroImage" class="relative hidden md:block">
            <div class="relative overflow-hidden rounded-card-lg shadow-elevated h-hero-image-lg">
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

    <section class="section-py-lg">
      <div class="container mx-auto px-0 md:container-padding">
        <div class="grid gap-component-lg lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)]">
          <!-- Main content -->
          <div class="order-1 lg:order-1">
            <article
              class="prose-article rounded-none md:rounded-responsive-lg bg-white p-3 md:p-6 lg:p-10 xl:p-12 shadow-none md:shadow-card ring-0 md:ring-default"
            >
              <BlogContentRenderer
                :content="article.content"
                variant="article"
                :fallback-alt="article.title"
                enable-widgets
              />
            </article>

            <BlogRelocationCtaWidget class="mt-component-lg" />
          </div>

          <!-- Sticky sidebar -->
          <aside class="order-3 lg:order-2 space-component-md lg:space-component-lg lg:sticky lg:top-24 lg:self-start">
            <SidebarTableOfContents
              :title="t(ns('tableOfContents'))"
              :items="tableOfContents"
              :active-id="activeSectionId"
              @scroll-to="scrollToSection"
            />

            <SidebarQuickFacts
              :title="t(ns('quickFacts.title'))"
              :items="quickFacts"
            />

            <SidebarShareLinks
              :title="t(ns('share.title'))"
              :description="t(ns('share.description'))"
              :links="shareLinks"
              :copy-link-text="t(ns('share.copyLink'))"
              container-class="order-2 lg:order-none"
              @copy-link="copyShareLink"
            />

            <SidebarTags
              :title="t(ns('tags.title'))"
              :tags="tags"
            />
          </aside>
        </div>
      </div>
    </section>

    <section v-if="relatedArticles.length" class="border-t border-default bg-background section-py-lg">
      <div class="container mx-auto container-padding">
        <div class="flex flex-col gap-component-lg lg:flex-row lg:items-center lg:justify-between">
          <BaseSectionHeader
            :title="t(ns('related.title'))"
            :subtitle="t(ns('related.description'))"
            align="left"
            max-width="full"
            margin-bottom="none"
          />
          <NuxtLink
            :to="localePath('/blog')"
            class="inline-flex items-center gap-component-sm rounded-badge bg-secondary badge-padding-lg text-body-sm font-semibold text-white shadow-card transition-default hover:bg-primary hover:shadow-primary/25"
          >
            {{ t(ns('related.allArticles')) }}
            <Icon
              name="mdi:arrow-right"
              class="text-icon-lg transition-scale group-hover:translate-x-1"
            />
          </NuxtLink>
        </div>

        <BaseGrid :md="2" :xl="3" gap="md" class="mt-component-md">
          <BlogRelatedArticleCard
            v-for="related in relatedArticles"
            :key="related.id"
            :article="related"
          />
        </BaseGrid>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { BlogArticleDetail, BlogArticleListItem } from '~~/lib/types'
import type { BreadcrumbItem } from '~/components/shared/BaseBreadcrumbs.vue'
import { useDetailPage } from '~/composables/useBlogDetailPage'
import { useTableOfContentsScrollspy } from '~/composables/useBlogScrollspy'
import { namespace, key } from '~~/lib/i18n'

const ns = namespace('blog.article')
const bcNs = namespace('breadcrumbs')

const props = defineProps<{
  article: BlogArticleDetail
  relatedArticles: BlogArticleListItem[]
}>()

const { t } = useI18n()
const localePath = useLocalePath()

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
  i18nKeys: {
    category: key('blog.article.quickFacts.category'),
    published: key('blog.article.quickFacts.published'),
    readingTime: key('blog.article.quickFacts.readingTime'),
    copySuccess: key('blog.article.share.copySuccess'),
    copyError: key('blog.article.share.copyError'),
  },
  includeReadingTime: true,
  includePublishedDate: true,
})

// Scrollspy
const { activeSectionId, scrollToSection } = useTableOfContentsScrollspy(tableOfContents)

// Breadcrumbs
const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: t(bcNs('blog')), path: '/blog' },
  { label: props.article.title },
])
</script>

