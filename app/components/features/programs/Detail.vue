<template>
  <div class="program-detail">
    <!-- Hero Section -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-20"
    >
      <div class="container mx-auto px-4 lg:px-6">
        <div class="grid items-center gap-12 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
          <div class="flex flex-col items-start gap-6">
            <NuxtLink
              :to="localePath('/programs')"
              class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
            >
              <Icon name="mdi:arrow-left" class="text-base" />
              {{ t(ns('backToPrograms')) }}
            </NuxtLink>

            <span
              v-if="heroKicker"
              class="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary"
            >
              {{ heroKicker }}
            </span>
            <h1 class="text-4xl font-bold leading-tight text-secondary lg:text-5xl">
              {{ program.title }}
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

    <!-- Content Section -->
    <section class="py-12 lg:py-20">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="grid gap-8 lg:gap-12 lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)]">
          <!-- Main content -->
          <div>
            <article
              class="prose-article rounded-3xl bg-white p-6 shadow-lg ring-1 ring-gray-100/50 lg:p-10 xl:p-12"
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
          <aside class="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <!-- Table of Contents -->
            <div
              v-if="tableOfContents.length"
              class="hidden md:block rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-100/50"
            >
              <h3
                class="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400"
              >
                <Icon name="mdi:format-list-bulleted" class="text-lg" />
                {{ t(ns('tableOfContents')) }}
              </h3>
              <nav class="mt-4 space-y-1">
                <button
                  v-for="section in tableOfContents"
                  :key="section.id"
                  type="button"
                  class="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left transition-all hover:bg-primary/5"
                  :class="{ 'bg-primary/10': activeSectionId === section.id }"
                  @click="scrollToSection(section.id)"
                >
                  <span
                    class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors"
                    :class="
                      activeSectionId === section.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-primary group-hover:text-white'
                    "
                  >
                    {{ section.order }}
                  </span>
                  <span
                    class="line-clamp-2 transition-colors"
                    :class="
                      activeSectionId === section.id
                        ? 'text-secondary font-medium'
                        : 'text-gray-600 group-hover:text-secondary'
                    "
                  >
                    {{ section.title }}
                  </span>
                </button>
              </nav>
            </div>

            <!-- Quick Facts / Краткая информация -->
            <div
              v-if="quickFacts.length"
              class="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-secondary p-[2px] shadow-lg"
            >
              <div class="rounded-[14px] bg-white p-5">
                <h3
                  class="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400"
                >
                  <Icon name="mdi:lightning-bolt" class="text-lg text-primary" />
                  {{ t(ns('quickFacts')) }}
                </h3>
                <ul class="mt-4 space-y-4">
                  <li v-for="fact in quickFacts" :key="fact.title" class="flex gap-3">
                    <span
                      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10"
                    >
                      <Icon
                        :name="fact.icon || 'mdi:information-outline'"
                        class="text-lg text-primary"
                      />
                    </span>
                    <div class="min-w-0">
                      <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
                        {{ fact.title }}
                      </p>
                      <p class="text-sm font-semibold text-secondary truncate">{{ fact.value }}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Share -->
            <div class="rounded-2xl bg-gray-50 p-5">
              <h3
                class="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400"
              >
                <Icon name="mdi:share-variant" class="text-lg" />
                {{ t(ns('share.title')) }}
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                {{ t(ns('share.description')) }}
              </p>
              <div class="mt-4 flex flex-wrap gap-2">
                <a
                  v-for="link in shareLinks"
                  :key="link.label"
                  :href="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow-md"
                >
                  <Icon :name="link.icon" class="text-base" />
                  {{ link.label }}
                </a>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow-md"
                  @click="copyShareLink"
                >
                  <Icon name="mdi:link-variant" class="text-base" />
                  {{ t(ns('share.copyLink')) }}
                </button>
              </div>
            </div>

            <!-- Tags -->
            <div
              v-if="tags.length"
              class="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-100/50"
            >
              <h3
                class="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400"
              >
                <Icon name="mdi:tag-multiple" class="text-lg" />
                {{ t(ns('tags')) }}
              </h3>
              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="tag in tags"
                  :key="tag"
                  class="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white cursor-pointer"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
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

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
