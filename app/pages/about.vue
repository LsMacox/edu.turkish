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
import { namespace } from '~~/lib/i18n'

const ns = namespace('about.meta')

definePageMeta({
  title: 'О нас - Edu.turkish',
  description:
    'Edu.turkish — это команда, которая помогает студентам поступать в вузы Турции. Более 5 лет опыта, 500+ успешных поступлений.',
})

const { t } = useI18n()

useHead({
  title: () => t(ns('title')),
  meta: [
    { name: 'description', content: () => t(ns('description')) },
    { property: 'og:title', content: () => t(ns('title')) },
    { property: 'og:description', content: () => t(ns('description')) },
    { property: 'og:type', content: 'website' },
  ],
})
</script>
