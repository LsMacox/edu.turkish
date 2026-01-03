<template>
  <div>
    <HomeHeroSection />
    <LazyReviewsMediaSection />
    <HomeFearsSection />
    <HomeServicesSection />
    <HomeHowSection />
    <HomeUniversitiesSection />
    <HomeFaqSection />
    <HomeFinalCtaSection :deadline="applicationDeadline" />
  </div>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'
import { useUniversitiesStore } from '~/stores/universities'

const ns = namespace('home.seo')

const applicationDeadline = '2026-11-01T23:59:59'

const { t } = useI18n()

useSeoMeta({
  title: () => t(ns('title')),
  description: () => t(ns('description')),
  keywords: () => t(ns('keywords')),
  ogTitle: () => t(ns('title')),
  ogDescription: () => t(ns('description')),
  twitterTitle: () => t(ns('title')),
  twitterDescription: () => t(ns('description')),
})

const universitiesStore = useUniversitiesStore()

if (import.meta.server) {
  await universitiesStore.initializeFilters({ limit: 6, ssr: true })
}

onMounted(async () => {
  if (!universitiesStore.universities.length) {
    await universitiesStore.fetchUniversities({ limit: 6 })
  }
})
</script>
