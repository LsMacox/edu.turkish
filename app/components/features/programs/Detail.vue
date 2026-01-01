<template>
  <div class="program-detail">
    <!-- Hero Section -->
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
        <div class="grid items-center gap-component-lg lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
          <div class="flex flex-col items-start gap-component-lg">
            <NuxtLink
              :to="localePath('/programs')"
              class="inline-flex items-center gap-component-sm text-body-sm text-meta hover:text-primary transition-color"
            >
              <Icon name="mdi:arrow-left" class="text-icon" />
              {{ t(ns('backToPrograms')) }}
            </NuxtLink>

            <BaseBadge
              v-if="heroKicker"
              color="primary"
              variant="soft"
            >
              {{ heroKicker }}
            </BaseBadge>
            <h1 class="text-hero">
              {{ program.title }}
            </h1>
            <p v-if="heroSubtitle" class="text-hero-subtitle">
              {{ heroSubtitle }}
            </p>
            <div class="flex flex-wrap gap-component-lg text-body-sm text-meta">
              <div
                v-for="metaItem in heroMeta"
                :key="metaItem.label"
                class="flex items-center gap-component-sm"
              >
                <Icon :name="metaItem.icon" class="text-primary" />
                {{ metaItem.label }}
              </div>
            </div>
          </div>
          <div v-if="resolvedHeroImage" class="relative hidden md:block">
            <div class="relative overflow-hidden rounded-card-lg shadow-elevated h-80 lg:h-96">
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

    <!-- Content Section -->
    <section class="section-py-lg">
      <div class="container mx-auto px-0 md:container-padding">
        <div class="grid gap-component-lg lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)]">
          <!-- Main content -->
          <div class="order-1 lg:order-1">
            <article
              class="prose-article rounded-none md:rounded-responsive-lg bg-white p-3 md:p-6 lg:p-10 xl:p-12 shadow-none md:shadow-card ring-0 md:ring-default"
            >
              <BlogContentRenderer
                :content="program.content"
                variant="article"
                :fallback-alt="program.title"
                enable-widgets
              />
            </article>
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
              :title="t(ns('quickFacts'))"
              :items="quickFacts"
              container-class=""
            />

            <SidebarShareLinks
              :title="t(ns('share.title'))"
              :description="t(ns('share.description'))"
              :links="shareLinks"
              :copy-link-text="t(ns('share.copyLink'))"
              @copy-link="copyShareLink"
            />

            <SidebarTags
              :title="t(ns('tags'))"
              :tags="tags"
              container-class=""
            />
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ProgramDetail } from '~~/lib/types'
import { useDetailPage } from '~/composables/useBlogDetailPage'
import { useTableOfContentsScrollspy } from '~/composables/useBlogScrollspy'
import { namespace, key } from '~~/lib/i18n'

const ns = namespace('programs.detail')

const props = defineProps<{
  program: ProgramDetail
}>()

const { t } = useI18n()
const localePath = useLocalePath()

// Use shared detail page composable
const programRef = computed(() => props.program)
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
} = useDetailPage(programRef, {
  routeName: 'program-slug',
  i18nKeys: {
    category: key('programs.detail.category'),
    published: key('programs.detail.published'),
    readingTime: key('programs.detail.readingTime'),
    copySuccess: key('programs.detail.share.copySuccess'),
    copyError: key('programs.detail.share.copyError'),
  },
})

// Scrollspy
const { activeSectionId, scrollToSection } = useTableOfContentsScrollspy(tableOfContents)
</script>

