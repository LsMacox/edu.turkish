<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          {{ t('services.sat-courses.title') }}
        </h1>
        <div class="bg-white rounded-lg shadow-md p-8 mt-8">
          <p class="text-xl text-gray-600">
            {{ t('services.sat-courses.temporarilyUnavailable') }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- 
  <ServicePageLayout
    :title="category?.title || t('services.sat-courses.title')"
    :subtitle="category?.subtitle || t('services.sat-courses.subtitle')"
  >
    <template #sub-services>
      <SubServiceCard
        v-for="subService in subServices"
        :key="subService.id"
        :sub-service-id="subService.id"
        :name="subService.name"
        :description="subService.description"
        :price-usd="subService.priceUsd"
        :delivery-time="subService.deliveryTime"
        @apply="handleApply"
      />
    </template>

    <template #course-goal>
      <CourseGoalSection
        key-prefix="services.sat-courses.courseGoal"
        :title="metadataPath('courseGoal.title')"
      />
    </template>

    <template #program-content>
      <ProgramContentSection
        key-prefix="services.sat-courses.programContent"
        :title="metadataPath('programContent.title')"
      />
    </template>

    <template #format-schedule>
      <FormatScheduleSection
        key-prefix="services.sat-courses.formatSchedule"
        :title="metadataPath('formatSchedule.title')"
      />
    </template>

    <template #student-results>
      <StudentResultsSection
        key-prefix="services.sat-courses.studentResults"
        :title="metadataPath('studentResults.title')"
      />
    </template>

    <template #faq>
      <ServiceFAQSection key-prefix="services.sat-courses.faq" :title="metadataPath('faq.title')" />
    </template>
  </ServicePageLayout>
  -->
</template>

<script setup lang="ts">
// import type { SubServiceId } from '~/types/services'
// import type { ServiceCategoryDetail } from '~~/server/types/api/services'
// import { useApplicationModalStore } from '~/stores/applicationModal'
// import { useExchangeRatesStore } from '~/stores/exchangeRates'
// import { useServices } from '~/composables/useServices'

const { t } = useI18n()
// const modal = useApplicationModalStore()
// const exchangeRatesStore = useExchangeRatesStore()
// const { fetchCategory } = useServices()

// const { data: category } = await useAsyncData<ServiceCategoryDetail>(
//   'sat-courses',
//   () => fetchCategory('sat-courses'),
//   {
//     lazy: false,
//   },
// )

// onMounted(async () => {
//   await exchangeRatesStore.ensureFresh()
// })

// const subServices = computed(() => {
//   if (!category.value?.subServices) return []
//   return category.value.subServices.map((subService) => ({
//     id: subService.slug as SubServiceId,
//     name: subService.name,
//     description: subService.description,
//     priceUsd: subService.priceUsd,
//     deliveryTime: subService.deliveryTimeDays
//       ? `${subService.deliveryTimeDays} ${t('services.common.days')}`
//       : undefined,
//   }))
// })

// const handleApply = ({ subServiceId, name }: { subServiceId: SubServiceId; name: string }) => {
//   modal.openModal({
//     source: 'service_page',
//     description: name,
//     serviceContext: {
//       subServiceId,
//       subServiceName: name,
//       source: 'service-page',
//       sourceDescription: name,
//     },
//   })
// }

// function metadataPath<T = any>(path: string): T | undefined {
//   const meta = category.value?.metadata as Record<string, unknown> | undefined | null
//   if (!meta) return undefined
//   const parts = path.split('.')
//   let node: any = meta
//   for (const part of parts) {
//     if (node && typeof node === 'object' && part in node) {
//       node = (node as any)[part]
//     } else {
//       return undefined
//     }
//   }
//   return node as T
// }

useHead({
  title: t('services.sat-courses.title'),
  // meta: [
  //   {
  //     name: 'description',
  //     content: category.value?.subtitle || t('services.sat-courses.subtitle'),
  //   },
  // ],
})
</script>
