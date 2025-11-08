<template>
  <ServicePageLayout
    :title="category?.title || t('services.document-translations.title')"
    :subtitle="category?.subtitle || t('services.document-translations.subtitle')"
  >
    <template #service-cards>
      <div
        v-if="serviceCards && serviceCards.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        <ServiceInfoCard
          v-for="(card, index) in serviceCards"
          :key="index"
          :title="card.title"
          :description="card.description"
          :icon="card.icon"
        />
      </div>
    </template>

    <template #price-calculator>
      <PriceCalculatorSection
        key-prefix="services.document-translations.calculator"
        :document-types-with-prices="metadataPath('calculator.documentTypes')"
        :language-pairs="metadataPath('calculator.languagePairs')"
        :urgency-options="metadataPath('calculator.urgency')"
        @submit="handleCalculatorSubmit"
      />
    </template>

    <template #how-it-works>
      <HowItWorksSection :steps="howItWorksSteps" />
    </template>

    <template #why-choose-us>
      <ServicesWhyChooseUsSection :factors="whyChooseUsFactors" />
    </template>

    <template #final-cta>
      <FinalCTASection
        :title="t('services.document-translations.finalCTA.title')"
        :button-text="t('services.document-translations.finalCTA.button')"
        :icon="t('services.document-translations.finalCTA.icon')"
        :service-name="t('services.document-translations.shortTitle')"
      />
    </template>
  </ServicePageLayout>
</template>

<script setup lang="ts">
import type { CalculatorSubmitEvent, ServiceCard } from '~/types/services'
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
  },
)

// Ensure exchange rates are fresh
onMounted(async () => {
  await exchangeRatesStore.ensureFresh()
})

// Service cards from metadata
const serviceCards = computed(() => {
  return metadataPath<ServiceCard[]>('serviceCards') || []
})

const howItWorksSteps = computed(() => {
  const raw = tm('services.document-translations.howItWorks.steps') as unknown
  if (!Array.isArray(raw)) return []
  return raw.map((_: unknown, index: number) => ({
    title: t(`services.document-translations.howItWorks.steps.${index}.title`) as string,
    description: t(
      `services.document-translations.howItWorks.steps.${index}.description`,
    ) as string,
    icon: t(`services.document-translations.howItWorks.steps.${index}.icon`) as string,
  }))
})

const whyChooseUsFactors = computed(() => {
  const raw = tm('services.document-translations.whyChooseUs.factors') as unknown
  if (!Array.isArray(raw)) return []
  return raw.map((_: unknown, index: number) => ({
    title: t(`services.document-translations.whyChooseUs.factors.${index}.title`) as string,
    description: t(
      `services.document-translations.whyChooseUs.factors.${index}.description`,
    ) as string,
    icon: t(`services.document-translations.whyChooseUs.factors.${index}.icon`) as string,
  }))
})

const handleCalculatorSubmit = (event: CalculatorSubmitEvent) => {
  const serviceName = `${event.selectedDocumentType.name} + ${event.selectedUrgency.name}`
  const priceDisplay =
    event.calculatedPriceUsd === null ? 'by_request' : event.calculatedPriceFormatted

  modal.openModal({
    source: 'service_page',
    description: serviceName,
    serviceContext: {
      subServiceName: serviceName,
      source: 'service-page',
      sourceDescription: `${t('services.document-translations.title')}: ${event.selectedDocumentType.name}`,
      price: priceDisplay,
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
