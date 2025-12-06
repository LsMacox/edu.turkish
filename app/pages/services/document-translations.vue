<template>
  <ServicesPageLayout
    :title="category?.title || t('services.document-translations.title')"
    :subtitle="category?.subtitle || t('services.document-translations.subtitle')"
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
        :document-types-with-prices="metadataPath('calculator.documentTypes')"
        :language-pairs="metadataPath('calculator.languagePairs')"
        :urgency-options="metadataPath('calculator.urgency')"
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
import type { CalculatorSubmitEvent, ServiceCard } from '~/types/services'
import { useApplicationModalStore } from '~/stores/applicationModal'
import { useExchangeRatesStore } from '~/stores/exchangeRates'
import { useServiceCategory, useServiceHead, useI18nList } from '~/components/features/services/composables'

const { t } = useI18n()
const modal = useApplicationModalStore()
const exchangeRatesStore = useExchangeRatesStore()
const { category, metadataPath } = await useServiceCategory('document-translations')
const { getListObjects } = useI18nList()

onMounted(() => exchangeRatesStore.ensureFresh())

const serviceCards = computed(() => metadataPath<ServiceCard[]>('serviceCards') || [])

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
  title: () => category.value?.title || t('services.document-translations.title'),
  description: () => category.value?.subtitle || t('services.document-translations.subtitle'),
})
</script>
