<template>
  <ServicePageLayout
    :title="t('services.document-translations.title')"
    :subtitle="t('services.document-translations.subtitle')"
  >
    <template #sub-services>
      <SubServiceCard
        v-for="subService in subServices"
        :key="subService.id"
        :sub-service-id="subService.id"
        :name="subService.name"
        :description="subService.description"
        :pricing="subService.pricing"
        :delivery-time="subService.deliveryTime"
        @apply="handleApply"
      />
    </template>

    <template #how-it-works>
      <HowItWorksSection :steps="howItWorksSteps" />
    </template>

    <template #why-choose-us>
      <ServicesWhyChooseUsSection :factors="whyChooseUsFactors" />
    </template>

    <template #trust-indicators>
      <TrustIndicatorBadge
        v-for="(indicator, index) in trustIndicators"
        :key="index"
        :indicator="indicator"
      />
    </template>
  </ServicePageLayout>
</template>

<script setup lang="ts">
import type { SubServiceId, Currency } from '~/types/services'

const { t, tm } = useI18n()
const modal = useApplicationModalStore()

const subServices = computed(() => {
  const raw = (tm('services.document-translations.subServices') || {}) as Record<string, unknown>
  const ids = Object.keys(raw)

  return ids.map((id) => ({
    id: id as SubServiceId,
    name: t(`services.document-translations.subServices.${id}.name`) as string,
    description: t(`services.document-translations.subServices.${id}.description`) as string,
    deliveryTime: t(`services.document-translations.subServices.${id}.deliveryTime`) as string,
    pricing: {
      KZT: t(`services.document-translations.subServices.${id}.pricing.KZT`) as string,
      TRY: t(`services.document-translations.subServices.${id}.pricing.TRY`) as string,
      RUB: t(`services.document-translations.subServices.${id}.pricing.RUB`) as string,
      USD: t(`services.document-translations.subServices.${id}.pricing.USD`) as string,
    } as Record<Currency, string>,
  }))
})

const howItWorksSteps = computed(() => {
  const raw = (tm('services.common.howItWorks.steps') || []) as unknown[]
  return raw.map((_, index) => ({
    title: t(`services.common.howItWorks.steps.${index}.title`) as string,
    description: t(`services.common.howItWorks.steps.${index}.description`) as string,
    icon: t(`services.common.howItWorks.steps.${index}.icon`) as string,
  }))
})

const whyChooseUsFactors = computed(() => {
  const raw = (tm('services.common.whyChooseUs.factors') || []) as unknown[]
  return raw.map((_, index) => ({
    title: t(`services.common.whyChooseUs.factors.${index}.title`) as string,
    description: t(`services.common.whyChooseUs.factors.${index}.description`) as string,
    icon: t(`services.common.whyChooseUs.factors.${index}.icon`) as string,
  }))
})

const trustIndicators = computed(() => {
  return [
    {
      text: t('services.common.trustIndicators.workingSince'),
      icon: 'mdi:calendar-check',
    },
    {
      text: t('services.common.trustIndicators.documentsCount'),
      icon: 'mdi:file-document-multiple',
    },
  ]
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
  title: t('services.document-translations.title'),
  meta: [
    {
      name: 'description',
      content: t('services.document-translations.subtitle'),
    },
  ],
})
</script>
