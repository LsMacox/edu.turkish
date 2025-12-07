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
import { useExchangeRatesStore } from '~/stores/exchangeRates'
import { useServiceHead } from '~/composables/services/useServiceHead'

const { t } = useI18n()
const modal = useApplicationModal()
const exchangeRatesStore = useExchangeRatesStore()

onMounted(() => exchangeRatesStore.ensureFresh())

// Static data with translated strings
const subServicesData = [
  { id: 'basic-package', priceUsd: 300 },
  { id: 'individual-package', priceUsd: 700 },
] as const

const subServices = computed(() =>
  subServicesData.map((sub, idx) => ({
    id: sub.id as SubServiceId,
    name: t(`services.tr-yos-courses.subServices[${idx}].name`),
    description: t(`services.tr-yos-courses.subServices[${idx}].description`),
    priceUsd: sub.priceUsd,
  })),
)

const handleApply = ({ subServiceId, name }: { subServiceId: SubServiceId; name: string }) => {
  modal.openModal({
    source: 'service_page',
    description: name,
    serviceContext: {
      subServiceId,
      subServiceName: name,
      source: 'service_page',
      sourceDescription: name,
    },
  })
}

useServiceHead({
  title: () => t('services.tr-yos-courses.title'),
  description: () => t('services.tr-yos-courses.subtitle'),
  schemaType: ['Course'],
})
</script>
