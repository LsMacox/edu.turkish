<template>
  <div class="container pt-6 md:pt-8 pb-8 md:pb-12">
    <!-- Hero Section -->
    <BaseSectionHeader
      :title="t('services.document-translations.title')"
      :subtitle="t('services.document-translations.subtitle')"
      title-tag="h1"
    >
      <template #action>
        <div class="flex flex-wrap justify-center gap-4 text-body-sm">
          <span class="flex items-center gap-1.5">
            <Icon name="mdi:shield-check" class="text-green-500" />
            {{ t('services.common.trustIndicators.workingSince') }}
          </span>
          <span class="flex items-center gap-1.5">
            <Icon name="mdi:file-document-check" class="text-primary" />
            {{ t('services.common.trustIndicators.documentsCount') }}
          </span>
        </div>
      </template>
    </BaseSectionHeader>

    <!-- Calculator Card -->
    <section class="max-w-lg mx-auto mb-12">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-secondary mb-4 text-center">
          {{ t('services.document-translations.calculator.title') }}
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              {{ t('services.document-translations.calculator.documentTypeLabel') }}
            </label>
            <BaseSelect v-model="selectedDocType">
              <option v-for="(dt, i) in calculatorDocumentTypes" :key="i" :value="String(i)">
                {{ dt.name }}
              </option>
            </BaseSelect>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              {{ t('services.document-translations.calculator.languagePairLabel') }}
            </label>
            <BaseSelect v-model="selectedLang">
              <option v-for="(lang, i) in calculatorLanguagePairs" :key="i" :value="String(i)">
                {{ lang }}
              </option>
            </BaseSelect>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              {{ t('services.document-translations.calculator.urgencyLabel') }}
            </label>
            <BaseSelect v-model="selectedUrg">
              <option v-for="(urg, i) in calculatorUrgency" :key="i" :value="String(i)">
                {{ urg.name }}
              </option>
            </BaseSelect>
          </div>

          <!-- Price display -->
          <div v-if="displayPrice" class="pt-2 pb-1 text-center">
            <div class="text-sm text-gray-500 mb-1">
              {{ t('services.document-translations.calculator.estimatedPrice') }}
            </div>
            <div class="text-2xl font-bold text-primary">
              {{ displayPrice }}
            </div>
          </div>

          <button
            type="button"
            class="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
            @click="handleCalculatorSubmit"
          >
            {{ t('services.document-translations.calculator.submitButton') }}
          </button>
        </div>
      </div>
    </section>

    <!-- How it works - compact -->
    <ServicesTranslationsProcessSection :steps="howItWorksSteps" class="mb-10" />

    <!-- Why choose us - 3 key factors -->
    <ServicesTranslationsBenefitsSection :factors="whyChooseUsFactors.slice(0, 3)" />
  </div>
</template>

<script setup lang="ts">
import { useExchangeRatesStore } from '~/stores/exchangeRates'
import { useServiceHead } from '~/composables/services/useServiceHead'

const { t, getListObjects } = useI18nHelpers()
const modal = useApplicationModal()
const exchangeRatesStore = useExchangeRatesStore()
const { currencyRef } = useCurrency()

onMounted(() => exchangeRatesStore.ensureFresh())

// Calculator state
const selectedDocType = ref('0')
const selectedLang = ref('0')
const selectedUrg = ref('0')

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

// Price calculation
const priceUsd = computed<number | null>(() => {
  const doc = calculatorDocumentTypes.value[Number(selectedDocType.value)]
  const urg = calculatorUrgency.value[Number(selectedUrg.value)]
  if (!doc || !urg || doc.priceUsd === null) return null
  return doc.priceUsd + urg.surcharge
})

const displayPrice = computed(() => {
  if (priceUsd.value === null) {
    return t('services.document-translations.calculator.byRequest')
  }
  const converted = exchangeRatesStore.convertPrice(priceUsd.value, currencyRef.value)
  if (converted === null) return `$${priceUsd.value}`
  const fromPrefix = t('common.from')
  return `${fromPrefix} ${Math.round(converted)} ${t(`currency.selector.${currencyRef.value}`)}`
})

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

const handleCalculatorSubmit = () => {
  const doc = calculatorDocumentTypes.value[Number(selectedDocType.value)]
  const urg = calculatorUrgency.value[Number(selectedUrg.value)]
  const serviceName = `${doc?.name} + ${urg?.name}`
  const priceDisplay = priceUsd.value === null ? 'by_request' : displayPrice.value

  modal.openModal({
    source: 'service_page',
    description: serviceName,
    serviceContext: {
      subServiceName: serviceName,
      source: 'service_page',
      sourceDescription: `${t('services.document-translations.title')}: ${doc?.name}`,
      price: priceDisplay,
    },
  })
}

useServiceHead({
  title: () => t('services.document-translations.title'),
  description: () => t('services.document-translations.subtitle'),
})
</script>
