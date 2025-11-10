<template>
  <ServicesPageLayout
    :title="t('services.tr-yos-courses.title')"
    :subtitle="t('services.tr-yos-courses.subtitle')"
  >
    <template #sub-services>
      <ServicesSubServiceCard
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
      <ServicesCourseGoalSection key-prefix="services.tr-yos-courses.courseGoal" />
    </template>

    <template #program-content>
      <ServicesProgramContentSection key-prefix="services.tr-yos-courses.programContent" />
    </template>

    <template #format-schedule>
      <ServicesFormatScheduleSection key-prefix="services.tr-yos-courses.formatSchedule" />
    </template>

    <template #student-results>
      <ServicesStudentResultsSection key-prefix="services.tr-yos-courses.studentResults" />
    </template>

    <template #faq>
      <ServicesFAQSection key-prefix="services.tr-yos-courses.faq" />
    </template>
  </ServicesPageLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { SubServiceId } from '~/types/services'
import type { ServiceCategoryDetail } from '~~/server/types/api/services'
import { useApplicationModalStore } from '~/stores/applicationModal'
import { useExchangeRatesStore } from '~/stores/exchangeRates'
import { useServices } from '~/composables/useServices'

const { t } = useI18n()
const modal = useApplicationModalStore()
const exchangeRatesStore = useExchangeRatesStore()
const { fetchCategory } = useServices()

const { data: category } = await useAsyncData<ServiceCategoryDetail>(
  'tr-yos-courses',
  () => fetchCategory('tr-yos-courses'),
  { lazy: false },
)

onMounted(async () => {
  await exchangeRatesStore.ensureFresh()
})

const subServices = computed(() => {
  if (!category.value?.subServices) return []
  return category.value.subServices.map((sub) => ({
    id: sub.slug as SubServiceId,
    name: sub.name,
    description: sub.description,
    priceUsd: sub.priceUsd,
  }))
})

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

useHead({
  title: category.value?.title || t('services.tr-yos-courses.title'),
  meta: [
    {
      name: 'description',
      content: category.value?.subtitle || t('services.tr-yos-courses.subtitle'),
    },
  ],
})
</script>
