<template>
  <ServicePageLayout
    :title="t('services.tr-yos-courses.title')"
    :subtitle="t('services.tr-yos-courses.subtitle')"
  >
    <template #sub-services>
      <SubServiceCard
        v-for="subService in subServices"
        :key="subService.id"
        :sub-service-id="subService.id"
        :name="subService.name"
        :description="subService.description"
        :pricing="subService.pricing"
        @apply="handleApply"
      />
    </template>

    <template #course-goal>
      <CourseGoalSection key-prefix="services.tr-yos-courses.courseGoal" />
    </template>

    <template #program-content>
      <ProgramContentSection key-prefix="services.tr-yos-courses.programContent" />
    </template>

    <template #format-schedule>
      <FormatScheduleSection key-prefix="services.tr-yos-courses.formatSchedule" />
    </template>

    <template #student-results>
      <StudentResultsSection key-prefix="services.tr-yos-courses.studentResults" />
    </template>

    <template #faq>
      <ServiceFAQSection key-prefix="services.tr-yos-courses.faq" />
    </template>
  </ServicePageLayout>
</template>

<script setup lang="ts">
import type { Currency } from '~/types/currency'
import type { SubServiceId } from '~/types/services'

const { t, tm } = useI18n()
const modal = useApplicationModalStore()

const subServices = computed(() => {
  const raw = (tm('services.tr-yos-courses.subServices') || {}) as Record<string, unknown>
  const ids = Object.keys(raw)

  return ids.map((id) => ({
    id: id as SubServiceId,
    name: t(`services.tr-yos-courses.subServices.${id}.name`) as string,
    description: t(`services.tr-yos-courses.subServices.${id}.description`) as string,
    pricing: {
      KZT: t(`services.tr-yos-courses.subServices.${id}.pricing.KZT`) as string,
      TRY: t(`services.tr-yos-courses.subServices.${id}.pricing.TRY`) as string,
      RUB: t(`services.tr-yos-courses.subServices.${id}.pricing.RUB`) as string,
      USD: t(`services.tr-yos-courses.subServices.${id}.pricing.USD`) as string,
    } as Record<Currency, string>,
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
  title: t('services.tr-yos-courses.title'),
  meta: [
    {
      name: 'description',
      content: t('services.tr-yos-courses.subtitle'),
    },
  ],
})
</script>
