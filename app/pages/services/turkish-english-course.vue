<template>
  <ServicePageLayout
    :title="t('services.turkish-english-course.title')"
    :subtitle="t('services.turkish-english-course.subtitle')"
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

    <template #level-progression>
      <LevelProgressionSection key-prefix="services.turkish-english-course.levelProgression" />
    </template>

    <template #format-schedule>
      <FormatScheduleSection key-prefix="services.turkish-english-course.formatSchedule" />
    </template>

    <template #teachers>
      <TeachersSection key-prefix="services.turkish-english-course.teachers" />
    </template>

    <template #expected-results>
      <ExpectedResultsSection key-prefix="services.turkish-english-course.expectedResults" />
    </template>

    <template #faq>
      <ServiceFAQSection key-prefix="services.turkish-english-course.faq" />
    </template>
  </ServicePageLayout>
</template>

<script setup lang="ts">
import type { Currency } from '~/types/currency'
import type { SubServiceId } from '~/types/services'
import { useApplicationModalStore } from '~/stores/applicationModal'

const { t, tm } = useI18n()
const modal = useApplicationModalStore()

const subServices = computed(() => {
  const raw = (tm('services.turkish-english-course.subServices') || {}) as Record<string, unknown>
  const ids = Object.keys(raw)

  return ids.map((id) => ({
    id: id as SubServiceId,
    name: t(`services.turkish-english-course.subServices.${id}.name`) as string,
    description: t(`services.turkish-english-course.subServices.${id}.description`) as string,
    pricing: {
      KZT: t(`services.turkish-english-course.subServices.${id}.pricing.KZT`) as string,
      TRY: t(`services.turkish-english-course.subServices.${id}.pricing.TRY`) as string,
      RUB: t(`services.turkish-english-course.subServices.${id}.pricing.RUB`) as string,
      USD: t(`services.turkish-english-course.subServices.${id}.pricing.USD`) as string,
    } as Record<Currency, string>,
  }))
})

const handleApply = ({ subServiceId, name }: { subServiceId: SubServiceId; name: string }) => {
  modal.openModalForSubService(subServiceId, name)
}

useHead({
  title: t('services.turkish-english-course.title'),
  meta: [
    {
      name: 'description',
      content: t('services.turkish-english-course.subtitle'),
    },
  ],
})
</script>
