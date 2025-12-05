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
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Edu.turkish',
        url: 'https://edu-turkish.com',
        logo: 'https://edu-turkish.com/android-chrome-512x512.png',
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
  ],
}))

// Ensure universities are fetched on the home page reload (limit to 6)
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
