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
  name: 'AboutPage',
})

const { t } = useI18n()
const localePath = useLocalePath()
const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl || 'https://edu-turkish.com'

useSeoMeta({
  title: () => t(ns('title')),
  description: () => t(ns('description')),
  ogTitle: () => t(ns('title')),
  ogDescription: () => t(ns('description')),
  ogType: 'website',
  twitterTitle: () => t(ns('title')),
  twitterDescription: () => t(ns('description')),
})

useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: t(ns('title')),
        description: t(ns('description')),
        url: `${siteUrl}${localePath('/about')}`,
        mainEntity: {
          '@type': 'Organization',
          name: 'Edu.turkish',
          url: siteUrl,
          logo: `${siteUrl}/android-chrome-512x512.png`,
          description: t(ns('description')),
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: '+90-543-867-99-50',
            availableLanguage: ['Russian', 'Turkish', 'English'],
          },
          sameAs: [
            'https://www.instagram.com/edu.turkish/',
            'https://t.me/Hakim7292',
            'https://wa.me/905438679950',
          ],
        },
      }),
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t(ns('title')),
            item: `${siteUrl}${localePath('/about')}`,
          },
        ],
      }),
    },
  ],
}))
</script>
