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
              {{ t('programs.detail.backToPrograms') }}
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
    <section class="py-16">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="grid gap-12 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          <article class="rounded-3xl bg-white p-6 shadow-custom ring-1 ring-gray-100/60 lg:p-10">
            <BlogContentRenderer
              :content="program.content"
              variant="article"
              :fallback-alt="program.title"
              enable-widgets
            />
          </article>

          <!-- Sidebar -->
          <aside class="space-y-8">
            <!-- Table of Contents -->
            <div
              v-if="tableOfContents.length"
              class="hidden md:block rounded-3xl bg-white p-6 shadow-custom"
            >
              <h3 class="text-card-title mb-2">
                {{ t('programs.detail.tableOfContents') }}
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

            <!-- Quick Facts -->
            <div
              v-if="quickFacts.length"
              class="rounded-3xl bg-gradient-to-br from-primary to-secondary p-[1px] shadow-lg"
            >
              <div class="rounded-3xl bg-white p-6">
                <h3 class="text-card-title mb-2">
                  {{ t('programs.detail.quickFacts') }}
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

            <!-- Share -->
            <div class="rounded-3xl bg-background p-6">
              <h3 class="text-card-title mb-2">{{ t('programs.detail.share.title') }}</h3>
              <p class="mt-2 text-sm text-gray-600">
                {{ t('programs.detail.share.description') }}
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
                  {{ t('programs.detail.share.copyLink') }}
                </button>
              </div>
            </div>

            <!-- Tags -->
            <div v-if="tags.length" class="rounded-3xl bg-white p-6 shadow-custom">
              <h3 class="text-card-title mb-2">{{ t('programs.detail.tags') }}</h3>
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

            <!-- All Programs / Directions -->
            <div v-if="allPrograms.length" class="rounded-3xl bg-white p-6 shadow-custom">
              <h3 class="text-card-title mb-2">{{ t('programs.detail.directions.title') }}</h3>
              <nav class="mt-4 space-y-2">
                <NuxtLink
                  v-for="prog in allPrograms"
                  :key="prog.id"
                  :to="localePath('/programs')"
                  class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-600 transition hover:bg-background hover:text-primary"
                  :class="{ 'bg-primary/5 text-primary font-medium': prog.slug === program.slug }"
                >
                  <Icon name="mdi:school-outline" class="text-lg text-primary/70" />
                  <span>{{ prog.title }}</span>
                </NuxtLink>
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ProgramDetail, ProgramListItem } from '~~/server/types/api'
import { useDetailPage } from '~/components/features/blog/composables/useDetailPage'

const props = defineProps<{
  program: ProgramDetail
  allPrograms?: ProgramListItem[]
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
  i18nPrefix: 'programs.detail',
})

// All programs for sidebar navigation
const allPrograms = computed(() => props.allPrograms ?? [])
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
