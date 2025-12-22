<template>
  <BaseSection id="services" bg="gray">
    <BaseSectionHeader
      :title="t(servicesNs('title'))"
      :subtitle="t(servicesNs('subtitle'))"
      align="center"
      margin-bottom="lg"
    />

    <div class="flex flex-wrap justify-center gap-component-lg max-w-6xl mx-auto">
        <NuxtLink
          v-for="card in cards"
          :key="card.slug"
          :to="localePath(`/services/${card.slug}`)"
          class="w-full sm:w-80 md:w-72 lg:w-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-button"
        >
          <ServicesServiceOverviewCard
            :icon="card.icon"
            :icon-color="card.color"
            :title="t(card.titleKey)"
            :description="t(card.descriptionKey)"
          >
            <template #footer>
              <div class="flex items-center text-primary font-medium">
                <span class="mr-1">{{ t(key('universities.list.card.details_button')) }}</span>
                <Icon name="mdi:arrow-right" class="text-icon-sm" />
              </div>
            </template>
          </ServicesServiceOverviewCard>
        </NuxtLink>
      </div>
  </BaseSection>
</template>

<script setup lang="ts">
import type { BaseIconBoxProps } from '~/types/ui'
import { namespace, key } from '~~/lib/i18n'

const servicesNs = namespace('home.services')
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
  color: BaseIconBoxProps['color']
  icon: string
}

// Map service categories to icons/colors and use i18n service titles/subtitles
const cards: ServiceCard[] = [
  {
    slug: 'relocation-in-turkey',
    titleKey: 'services.relocation-in-turkey.title',
    descriptionKey: 'services.relocation-in-turkey.subtitle',
    color: 'info',
    icon: 'mdi:map-marker-path',
  },
  {
    slug: 'tr-yos-courses',
    titleKey: 'services.tr-yos-courses.title',
    descriptionKey: 'services.tr-yos-courses.subtitle',
    color: 'success',
    icon: 'mdi:school',
  },
  {
    slug: 'sat-courses',
    titleKey: 'services.sat-courses.title',
    descriptionKey: 'services.sat-courses.subtitle',
    color: 'secondary',
    icon: 'mdi:book-open-variant',
  },
  {
    slug: 'turkish-english-course',
    titleKey: 'services.turkish-english-course.title',
    descriptionKey: 'services.turkish-english-course.subtitle',
    color: 'info',
    icon: 'mdi:translate',
  },
  {
    slug: 'document-translations',
    titleKey: 'services.document-translations.title',
    descriptionKey: 'services.document-translations.subtitle',
    color: 'warning',
    icon: 'mdi:file-document-check',
  },
]
</script>
