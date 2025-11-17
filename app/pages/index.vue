<template>
  <div>
    <HomeHeroSection />
    <LazyReviewsMediaReviewsSection />
    <HomeFearsSection />
    <HomeServicesSection />
    <HomeHowSection />
    <HomeUniversitiesSection />
    <HomeFaqSection />
    <HomeFinalCtaSection :deadline="applicationDeadline" />
  </div>
</template>

<script setup lang="ts">
// Настраиваемая дата дедлайна для обратного счетчика
// Можно изменить эту дату в зависимости от текущих дедлайнов университетов
const applicationDeadline = '2026-11-01T23:59:59'

const { t } = useI18n()

useHead(() => ({
  title: t('home.seo.title'),
  meta: [
    {
      name: 'description',
      content: t('home.seo.description'),
    },
    {
      property: 'og:description',
      content: t('home.seo.description'),
    },
    {
      name: 'twitter:description',
      content: t('home.seo.description'),
    },
  ],
}))

// Ensure universities are fetched on the home page reload (limit to 6)
const universitiesStore = useUniversitiesStore()

if (import.meta.server) {
  await universitiesStore.initAndFetchSSR({ limit: 6 })
}

onMounted(async () => {
  if (!universitiesStore.universities.length) {
    await universitiesStore.fetchUniversities({ limit: 6 })
  }
})
</script>
