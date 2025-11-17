<template>
  <section id="services" v-scroll-reveal class="section-py bg-gray-50">
    <div class="container">
      <BaseSectionHeader
        :title="t('home.services.title')"
        :subtitle="t('home.services.subtitle')"
        align="center"
        margin-bottom="lg"
      />

      <div class="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
        <NuxtLink
          v-for="(card, index) in cards"
          :key="card.slug"
          v-scroll-reveal="index * 80"
          :to="localePath(`/services/${card.slug}`)"
          class="w-full sm:w-80 md:w-72 lg:w-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-xl"
        >
          <BaseFeatureCard
            :icon="card.icon"
            :icon-color="card.color"
            :title="t(card.titleKey)"
            :description="t(card.descriptionKey)"
            hover="scale"
          >
            <template #footer>
              <div class="flex items-center text-primary font-medium">
                <span class="mr-1">{{ t('universities_page.card.details_button') }}</span>
                <Icon name="mdi:arrow-right" class="w-4 h-4" />
              </div>
            </template>
          </BaseFeatureCard>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { BaseIconBadgeProps } from '~/types/ui'

const { t } = useI18n()
const localePath = useLocalePath()

type ServiceCard = {
  slug:
    | 'relocation-in-turkey'
    | 'tr-yos-courses'
    | 'sat-courses'
    | 'turkish-english-course'
    | 'document-translations'
  titleKey: string
  descriptionKey: string
  color: BaseIconBadgeProps['color']
  icon: string
}

// Map service categories to icons/colors and use i18n service titles/subtitles
const cards: ServiceCard[] = [
  {
    slug: 'relocation-in-turkey',
    titleKey: 'services.relocation-in-turkey.title',
    descriptionKey: 'services.relocation-in-turkey.subtitle',
    color: 'blue',
    icon: 'mdi:map-marker-path',
  },
  {
    slug: 'tr-yos-courses',
    titleKey: 'services.tr-yos-courses.title',
    descriptionKey: 'services.tr-yos-courses.subtitle',
    color: 'green',
    icon: 'mdi:school',
  },
  {
    slug: 'sat-courses',
    titleKey: 'services.sat-courses.title',
    descriptionKey: 'services.sat-courses.subtitle',
    color: 'purple',
    icon: 'mdi:book-open-variant',
  },
  {
    slug: 'turkish-english-course',
    titleKey: 'services.turkish-english-course.title',
    descriptionKey: 'services.turkish-english-course.subtitle',
    color: 'teal',
    icon: 'mdi:translate',
  },
  {
    slug: 'document-translations',
    titleKey: 'services.document-translations.title',
    descriptionKey: 'services.document-translations.subtitle',
    color: 'yellow',
    icon: 'mdi:file-document-check',
  },
]
</script>
