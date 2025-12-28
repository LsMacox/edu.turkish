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
const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl || 'https://edu-turkish.com'

useHead({
  title: () => t(ns('title')),
  meta: [
    {
      name: 'description',
      content: () => t(ns('description')),
    },
    {
      name: 'keywords',
      content: () => t(ns('keywords')),
    },
    {
      property: 'og:title',
      content: () => t(ns('title')),
    },
    {
      property: 'og:description',
      content: () => t(ns('description')),
    },
    {
      name: 'twitter:title',
      content: () => t(ns('title')),
    },
    {
      name: 'twitter:description',
      content: () => t(ns('description')),
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Edu.turkish',
        url: siteUrl,
        logo: `${siteUrl}/android-chrome-512x512.png`,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            url: 'https://t.me/Hakim7292',
            availableLanguage: ['Russian', 'Turkish', 'English'],
          },
          {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: '+90-543-867-99-50',
            availableLanguage: ['Russian', 'Turkish', 'English'],
          },
        ],
        sameAs: [
          'https://www.instagram.com/edu.turkish/',
          'https://t.me/Hakim7292',
          'https://wa.me/905438679950',
        ],
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Edu.turkish',
        url: siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }),
    },
  ],
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
