<template>
  <div class="container pt-6 md:pt-8 pb-8 md:pb-12">
    <!-- Hero Section -->
    <BaseSectionHeader
      :title="t(svc('title'))"
      :subtitle="t(svc('subtitle'))"
      title-tag="h1"
    >
      <template #action>
        <div class="flex flex-wrap justify-center gap-component-lg text-body-sm">
          <span class="flex items-center gap-component-xs">
            <Icon name="mdi:shield-check" class="text-green-500" />
            {{ t(commonNs('workingSince')) }}
          </span>
          <span class="flex items-center gap-component-xs">
            <Icon name="mdi:file-document-check" class="text-primary" />
            {{ t(commonNs('documentsCount')) }}
          </span>
        </div>
      </template>
    </BaseSectionHeader>

    <!-- Calculator Card -->
    <section class="max-w-lg mx-auto mb-12">
      <ServicesTranslationsCalculatorSection
        :title="t(calcNs('title'))"
        :labels="calculatorLabels"
        :document-types-with-prices="calculatorDocumentTypes"
        :language-pairs="calculatorLanguagePairs"
        :urgency-options="calculatorUrgency"
        @submit="handleCalculatorSubmit"
      />
    </section>

    <!-- How it works - compact -->
    <ServicesTranslationsProcessSection :steps="howItWorksSteps" class="mb-10" />

    <!-- Why choose us - 3 key factors -->
    <ServicesTranslationsBenefitsSection :factors="whyChooseUsFactors.slice(0, 3)" />
  </div>
</template>

<script setup lang="ts">
import { useExchangeRatesStore } from '~/stores/exchangeRates'
import { useServiceHead } from '~/composables/useServiceHead'
import { namespace } from '~~/lib/i18n'
import type { CalculatorSubmitEvent } from '~/types/features/services'

const svc = namespace('services.document-translations')
const metaNs = namespace('services.document-translations.meta')
const calcNs = namespace('services.document-translations.calculator')
const calcDataNs = namespace('services.document-translations.calculatorData')
const howNs = namespace('services.document-translations.howItWorks.steps')
const whyNs = namespace('services.document-translations.whyChooseUs.factors')
const commonNs = namespace('services.common.trustIndicators')
const { t } = useI18nHelpers()
const modal = useApplicationModal()
const exchangeRatesStore = useExchangeRatesStore()

onMounted(() => exchangeRatesStore.ensureFresh())

const calculatorDocumentTypes = computed(() => [
  { name: t(calcDataNs('documentTypes.passport.name')), priceUsd: 20 },
  { name: t(calcDataNs('documentTypes.highSchool.name')), priceUsd: 30 },
  { name: t(calcDataNs('documentTypes.diploma.name')), priceUsd: 45 },
  { name: t(calcDataNs('documentTypes.powerOfAttorney.name')), priceUsd: 40 },
  { name: t(calcDataNs('documentTypes.financial.name')), priceUsd: 25 },
  { name: t(calcDataNs('documentTypes.other.name')), priceUsd: null },
])

const calculatorLanguagePairs = computed(() => [
  t(calcDataNs('languagePairs.ru_tr')),
  t(calcDataNs('languagePairs.tr_ru')),
])

const calculatorUrgency = computed(() => [
  { name: t(calcDataNs('urgency.standard.name')), surcharge: 0 },
  { name: t(calcDataNs('urgency.rush.name')), surcharge: 10 },
])

const calculatorLabels = computed(() => ({
  documentTypeLabel: t(calcNs('documentTypeLabel')),
  languagePairLabel: t(calcNs('languagePairLabel')),
  urgencyLabel: t(calcNs('urgencyLabel')),
  estimatedPrice: t(calcNs('estimatedPrice')),
  submitButton: t(calcNs('submitButton')),
  byRequest: t(calcNs('byRequest')),
}))

const handleCalculatorSubmit = (e: CalculatorSubmitEvent) => {
  const serviceName = `${e.selectedDocumentType.name} + ${e.selectedUrgency.name}`

  modal.openModal({
    source: 'service_page',
    description: serviceName,
  })
}

const howItWorksSteps = computed(() => [
  {
    title: t(howNs('upload.title')),
    description: t(howNs('upload.description')),
    icon: t(howNs('upload.icon')),
  },
  {
    title: t(howNs('clarify.title')),
    description: t(howNs('clarify.description')),
    icon: t(howNs('clarify.icon')),
  },
  {
    title: t(howNs('translate.title')),
    description: t(howNs('translate.description')),
    icon: t(howNs('translate.icon')),
  },
  {
    title: t(howNs('receive.title')),
    description: t(howNs('receive.description')),
    icon: t(howNs('receive.icon')),
  },
])

const whyChooseUsFactors = computed(() => [
  {
    title: t(whyNs('accredited.title')),
    description: t(whyNs('accredited.description')),
    icon: t(whyNs('accredited.icon')),
  },
  {
    title: t(whyNs('accepted.title')),
    description: t(whyNs('accepted.description')),
    icon: t(whyNs('accepted.icon')),
  },
  {
    title: t(whyNs('online.title')),
    description: t(whyNs('online.description')),
    icon: t(whyNs('online.icon')),
  },
  {
    title: t(whyNs('verification.title')),
    description: t(whyNs('verification.description')),
    icon: t(whyNs('verification.icon')),
  },
  {
    title: t(whyNs('rush.title')),
    description: t(whyNs('rush.description')),
    icon: t(whyNs('rush.icon')),
  },
])



useServiceHead({
  title: () => t(metaNs('title')),
  description: () => t(metaNs('description')),
})
</script>
