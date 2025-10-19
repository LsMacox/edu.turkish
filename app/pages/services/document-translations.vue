<template>
  <ServicePageLayout
    :title="category?.title || t('services.document-translations.title')"
    :subtitle="category?.subtitle || t('services.document-translations.subtitle')"
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

    <template #price-calculator>
      <PriceCalculatorSection
        key-prefix="services.document-translations.priceCalculator"
        :document-types="metadataPath('priceCalculator.documentTypes')"
        :languages="metadataPath('priceCalculator.languages')"
        :urgency="metadataPath('priceCalculator.urgency')"
        :standard-price-usd="category?.calculator?.standardUsd"
        :urgency-multipliers="category?.urgencyMultipliers"
        :adjustments="metadataPath('priceCalculator.adjustments')"
      />
    </template>

    <template #university-requirements>
      <UniversityRequirementsSection
        key-prefix="services.document-translations.universityRequirements"
        :formats="metadataPath('universityRequirements.formats')"
        :accepted-by="metadataPath('universityRequirements.acceptedBy')"
      />
    </template>

    <template #sample-documents>
      <SampleDocumentsSection
        key-prefix="services.document-translations.sampleDocuments"
        :samples="metadataPath('sampleDocuments.samples')"
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
import type { SubServiceId } from '~/types/services'
import type { ServiceCategoryDetail } from '~~/server/types/api/services'
import { useApplicationModalStore } from '~/stores/applicationModal'
import { useExchangeRatesStore } from '~/stores/exchangeRates'
import { useServices } from '~/composables/useServices'

const { t, tm } = useI18n()
const modal = useApplicationModalStore()
const exchangeRatesStore = useExchangeRatesStore()
const { fetchCategory } = useServices()

// Fetch category data from database
const { data: category } = await useAsyncData<ServiceCategoryDetail>(
  'document-translations',
  () => fetchCategory('document-translations'),
  {
    lazy: false,
  }
)

// Ensure exchange rates are fresh
onMounted(async () => {
  await exchangeRatesStore.ensureFresh()
})

// Map database sub-services to component format
const subServices = computed(() => {
  if (!category.value?.subServices) return []

  return category.value.subServices.map((subService) => ({
    id: subService.slug as SubServiceId,
    name: subService.name,
    description: subService.description,
    priceUsd: subService.priceUsd,
    deliveryTime: subService.deliveryTimeDays
      ? `${subService.deliveryTimeDays} ${t('services.common.days')}`
      : undefined,
  }))
})

const howItWorksSteps = computed(() => {
  const raw = tm('services.common.howItWorks.steps') as unknown
  if (!Array.isArray(raw)) return []
  return raw.map((_: unknown, index: number) => ({
    title: t(`services.common.howItWorks.steps.${index}.title`) as string,
    description: t(`services.common.howItWorks.steps.${index}.description`) as string,
    icon: t(`services.common.howItWorks.steps.${index}.icon`) as string,
  }))
})

const whyChooseUsFactors = computed(() => {
  const raw = tm('services.common.whyChooseUs.factors') as unknown
  if (!Array.isArray(raw)) return []
  return raw.map((_: unknown, index: number) => ({
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

// Helper to safely read structured metadata with path (e.g., 'priceCalculator.documentTypes')
function metadataPath<T = any>(path: string): T | undefined {
  const meta = category.value?.metadata as Record<string, unknown> | undefined | null
  if (!meta) return undefined
  const parts = path.split('.')
  let node: any = meta
  for (const part of parts) {
    if (node && typeof node === 'object' && part in node) {
      node = (node as any)[part]
    } else {
      return undefined
    }
  }
  return node as T
}

useHead({
  title: category.value?.title || t('services.document-translations.title'),
  meta: [
    {
      name: 'description',
      content: category.value?.subtitle || t('services.document-translations.subtitle'),
    },
  ],
})
</script>
