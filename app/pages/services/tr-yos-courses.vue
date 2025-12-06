<template>
  <ServicesPageLayout
    :title="t('services.tr-yos-courses.title')"
    :subtitle="t('services.tr-yos-courses.subtitle')"
  >
    <template #sub-services>
      <ServicesServiceCard
        v-for="sub in subServices"
        :key="sub.id"
        :sub-service-id="sub.id"
        :name="sub.name"
        :description="sub.description"
        :price-usd="sub.priceUsd"
        @apply="handleApply"
      />
    </template>

    <template #course-goal>
      <ServicesCoursesGoalSection key-prefix="services.tr-yos-courses.courseGoal" />
    </template>

    <template #program-content>
      <ServicesCoursesContentSection key-prefix="services.tr-yos-courses.programContent" />
    </template>

    <template #format-schedule>
      <ServicesCoursesFormatSection key-prefix="services.tr-yos-courses.formatSchedule" />
    </template>

    <template #student-results>
      <ServicesCoursesResultsSection key-prefix="services.tr-yos-courses.studentResults" />
    </template>

    <template #faq>
      <ServicesFAQ key-prefix="services.tr-yos-courses.faq" />
    </template>
  </ServicesPageLayout>
</template>

<script setup lang="ts">
import type { SubServiceId } from '~/types/services'
import { useApplicationModalStore } from '~/stores/applicationModal'
import { useExchangeRatesStore } from '~/stores/exchangeRates'
import { useServiceCategory, useServiceHead } from '~/components/features/services/composables'

const { t } = useI18n()
const modal = useApplicationModalStore()
const exchangeRatesStore = useExchangeRatesStore()
const { category } = await useServiceCategory('tr-yos-courses')

onMounted(() => exchangeRatesStore.ensureFresh())

const subServices = computed(() =>
  category.value?.subServices?.map((sub) => ({
    id: sub.slug as SubServiceId,
    name: sub.name,
    description: sub.description,
    priceUsd: sub.priceUsd,
  })) ?? [],
)

const handleApply = ({ subServiceId, name }: { subServiceId: SubServiceId; name: string }) => {
  modal.openModal({
    source: 'service_page',
    description: name,
    serviceContext: {
      subServiceId,
      subServiceName: name,
      source: 'service-page',
      sourceDescription: name,
    },
  })
}

useServiceHead({
  title: () => category.value?.title || t('services.tr-yos-courses.title'),
  description: () => category.value?.subtitle || t('services.tr-yos-courses.subtitle'),
  schemaType: ['Course'],
})
</script>
