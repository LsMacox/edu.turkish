<template>
  <div>
    <AboutHeroSection />
    <AboutWhoWeAreSection />
    <AboutWhyChooseUsSection />
    <AboutStorySection />
    <AboutTeamSection />
    <AboutContactInfo />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'О нас - Edu.turkish',
  description:
    'Edu.turkish — это команда, которая помогает студентам поступать в вузы Турции. Более 5 лет опыта, 500+ успешных поступлений.',
})

const { t } = useI18n()

useHead({
  title: () => t('about.meta.title'),
  meta: [
    { name: 'description', content: () => t('about.meta.description') },
    { property: 'og:title', content: () => t('about.meta.title') },
    { property: 'og:description', content: () => t('about.meta.description') },
    { property: 'og:type', content: 'website' },
  ],
})
</script>
