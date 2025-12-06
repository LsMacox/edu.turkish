<template>
  <ServicesPageLayout
    :title="t('services.document-translations.title')"
    :subtitle="t('services.document-translations.subtitle')"
  >
    <template #service-cards>
      <div
        v-if="serviceCards && serviceCards.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        <ServicesTranslationsFeatureCard
          v-for="(card, index) in serviceCards"
          :key="index"
          :title="card.title"
          :description="card.description"
          :icon="card.icon"
        />
      </div>
    </template>

    <template #price-calculator>
      <ServicesTranslationsCalculatorSection
        key-prefix="services.document-translations.calculator"
        :document-types-with-prices="calculatorDocumentTypes"
        :language-pairs="calculatorLanguagePairs"
        :urgency-options="calculatorUrgency"
        @submit="handleCalculatorSubmit"
      />
    </template>

    <template #how-it-works>
      <ServicesTranslationsProcessSection :steps="howItWorksSteps" />
    </template>

    <template #why-choose-us>
      <ServicesTranslationsBenefitsSection :factors="whyChooseUsFactors" />
    </template>

    <template #final-cta>
      <ServicesTranslationsCTASection
        :title="t('services.document-translations.finalCTA.title')"
        :button-text="t('services.document-translations.finalCTA.button')"
        :icon="t('services.document-translations.finalCTA.icon')"
        :service-name="t('services.document-translations.shortTitle')"
      />
    </template>
  </ServicesPageLayout>
</template>

<script setup lang="ts">
import type { CalculatorSubmitEvent } from '~/types/services'
import { useApplicationModalStore } from '~/stores/applicationModal'
import { useExchangeRatesStore } from '~/stores/exchangeRates'
import { useServiceHead, useI18nList } from '~/components/features/services/composables'

const { t } = useI18n()
const modal = useApplicationModalStore()
const exchangeRatesStore = useExchangeRatesStore()
const { getListObjects } = useI18nList()

onMounted(() => exchangeRatesStore.ensureFresh())

// Data from i18n
const serviceCards = computed(() =>
  getListObjects<{ title: string; description: string; icon: string }>(
    'services.document-translations.serviceCards',
    ['title', 'description', 'icon'],
  ),
)

// Calculator data - prices are static, names are translated
const documentTypePrices = [20, 30, 45, 40, 25, null] as const
const calculatorDocumentTypes = computed(() =>
  documentTypePrices.map((priceUsd, idx) => ({
    name: t(`services.document-translations.calculatorData.documentTypes[${idx}].name`),
    priceUsd,
  })),
)

const calculatorLanguagePairs = computed(() => [
  t('services.document-translations.calculatorData.languagePairs[0]'),
  t('services.document-translations.calculatorData.languagePairs[1]'),
])

const urgencySurcharges = [0, 10] as const
const calculatorUrgency = computed(() =>
  urgencySurcharges.map((surcharge, idx) => ({
    name: t(`services.document-translations.calculatorData.urgency[${idx}].name`),
    surcharge,
  })),
)

const howItWorksSteps = computed(() =>
  getListObjects<{ title: string; description: string; icon: string }>(
    'services.document-translations.howItWorks.steps',
    ['title', 'description', 'icon'],
  ),
)

const whyChooseUsFactors = computed(() =>
  getListObjects<{ title: string; description: string; icon: string }>(
    'services.document-translations.whyChooseUs.factors',
    ['title', 'description', 'icon'],
  ),
)

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

useServiceHead({
  title: () => t('services.document-translations.title'),
  description: () => t('services.document-translations.subtitle'),
})
</script>
