<template>
  <div class="mt-16">
    <BaseSectionHeader :title="title" />

    <div class="mt-8 max-w-3xl mx-auto px-4 sm:px-6">
      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4 sm:space-y-6">
        <!-- Document Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ documentTypeLabel }}
          </label>
          <BaseSelect v-model="selectedDocumentTypeModel">
            <option
              v-for="(docType, index) in documentTypeOptions"
              :key="index"
              :value="String(index)"
            >
              {{ docType }}
            </option>
          </BaseSelect>
        </div>

        <!-- Language Pair -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ languagePairLabel }}
          </label>
          <BaseSelect v-model="selectedLanguageModel">
            <option
              v-for="(lang, index) in languagePairOptions"
              :key="index"
              :value="String(index)"
            >
              {{ lang }}
            </option>
          </BaseSelect>
        </div>

        <!-- Urgency -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ urgencyLabel }}
          </label>
          <BaseSelect v-model="selectedUrgencyModel">
            <option
              v-for="(urgency, index) in urgencyOptionsDisplay"
              :key="index"
              :value="String(index)"
            >
              {{ urgency }}
            </option>
          </BaseSelect>
        </div>

        <!-- Price Display -->
        <div v-if="calculatedPrice" class="mt-6 p-4 bg-primary/10 rounded-lg text-center">
          <div class="text-sm text-gray-600 mb-1">
            {{ estimatedPriceLabel }}
          </div>
          <div class="text-2xl sm:text-3xl font-bold text-primary break-words">
            {{ calculatedPrice }}
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-6">
          <button
            type="button"
            class="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors duration-200 shadow-md hover:shadow-lg"
            @click="handleSubmit"
          >
            {{ submitButtonLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  PriceCalculatorSectionProps,
  DocumentType,
  UrgencyOption,
  CalculatorSubmitEvent,
} from '@/types/services'
import { useExchangeRatesStore } from '~/stores/exchangeRates'

const props = withDefaults(defineProps<PriceCalculatorSectionProps>(), {
  title: '',
})

const emit = defineEmits<{
  submit: [event: CalculatorSubmitEvent]
}>()

const { t } = useI18n()
const { currencyRef } = useCurrency()

// Access Pinia store lazily with a safe fallback for test environments
const getExchangeRatesStore = () => {
  try {
    return useExchangeRatesStore()
  } catch {
    return { convertPrice: (v: number) => v } as unknown as ReturnType<typeof useExchangeRatesStore>
  }
}

// Detect which structure is being used
const isNewStructure = computed(() => {
  return !!props.documentTypesWithPrices && props.documentTypesWithPrices.length > 0
})

// Computed title with i18n fallback
const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

// Labels with i18n fallback
const documentTypeLabel = computed(
  () =>
    t(`${props.keyPrefix}.documentTypeLabel`) ||
    t('services.common.documentType') ||
    'Document Type',
)
const languagePairLabel = computed(
  () =>
    t(`${props.keyPrefix}.languagePairLabel`) ||
    t('services.common.languagePair') ||
    'Language Pair',
)
const urgencyLabel = computed(
  () => t(`${props.keyPrefix}.urgencyLabel`) || t('services.common.urgency') || 'Urgency',
)
const estimatedPriceLabel = computed(
  () =>
    t(`${props.keyPrefix}.estimatedPrice`) ||
    t('services.common.estimatedPrice') ||
    'Estimated Price',
)
const submitButtonLabel = computed(
  () => t(`${props.keyPrefix}.submitButton`) || 'Submit Application',
)
const byRequestLabel = computed(() => t(`${props.keyPrefix}.byRequest`) || 'Upon Request')

// Document types - support both structures
const documentTypeOptions = computed(() => {
  if (isNewStructure.value && props.documentTypesWithPrices) {
    return props.documentTypesWithPrices.map((dt) => dt.name)
  }
  return props.documentTypes ?? []
})

// Language pairs - shared between structures
const languagePairOptions = computed(() => {
  return props.languagePairs ?? props.languages ?? []
})

// Urgency options - support both structures
const urgencyOptionsDisplay = computed(() => {
  if (isNewStructure.value && props.urgencyOptions) {
    return props.urgencyOptions.map((uo) => uo.name)
  }
  return props.urgency ?? []
})

// Legacy multipliers
const urgencyMultipliers = computed(() => ({
  express: props.urgencyMultipliers?.express ?? 1.5,
  rush: props.urgencyMultipliers?.rush ?? 2.0,
}))

// Selection state
const selectedDocumentType = ref(0)
const selectedLanguage = ref(0)
const selectedUrgency = ref(0)

// Bridge numeric refs to BaseSelect's string modelValue
const selectedDocumentTypeModel = computed({
  get: () => String(selectedDocumentType.value),
  set: (v: string) => {
    selectedDocumentType.value = Number(v)
  },
})
const selectedLanguageModel = computed({
  get: () => String(selectedLanguage.value),
  set: (v: string) => {
    selectedLanguage.value = Number(v)
  },
})
const selectedUrgencyModel = computed({
  get: () => String(selectedUrgency.value),
  set: (v: string) => {
    selectedUrgency.value = Number(v)
  },
})

// Calculate price based on selections and structure
const calculatedPriceUsd = computed<number | null>(() => {
  if (isNewStructure.value && props.documentTypesWithPrices && props.urgencyOptions) {
    // New structure: basePrice + surcharge
    const docType = props.documentTypesWithPrices[selectedDocumentType.value]
    const urgencyOption = props.urgencyOptions[selectedUrgency.value]

    if (!docType || !urgencyOption) return null
    if (docType.priceUsd === null) return null // "Остальное" case

    return docType.priceUsd + urgencyOption.surcharge
  } else {
    // Legacy structure: basePrice * multipliers * adjustments
    const baseUsd = props.standardPriceUsd
    if (!baseUsd || !isFinite(baseUsd)) return null

    const urgencyKey =
      selectedUrgency.value === 0 ? 'standard' : selectedUrgency.value === 1 ? 'express' : 'rush'

    const m =
      urgencyKey === 'standard'
        ? 1
        : urgencyKey === 'express'
          ? urgencyMultipliers.value.express
          : urgencyMultipliers.value.rush

    const docAdj = props.adjustments?.byDocumentType?.[selectedDocumentType.value] ?? 1
    const langAdj = props.adjustments?.byLanguage?.[selectedLanguage.value] ?? 1

    return baseUsd * m * docAdj * langAdj
  }
})

// Format price for display
const calculatedPrice = computed(() => {
  const priceUsd = calculatedPriceUsd.value

  // Handle "by request" case (priceUsd is null)
  if (priceUsd === null) {
    return byRequestLabel.value
  }

  const currency = currencyRef.value
  const converted = getExchangeRatesStore().convertPrice(priceUsd, currency as any)
  const rounded = Math.round(converted)

  // Add "от" (from) prefix for Russian locale or similar
  const fromPrefix = t('common.from') || 'от'
  return `${fromPrefix} ${rounded} ${t(`currency.selector.${currency}`)}`
})

// Handle submit button click
const handleSubmit = () => {
  const priceUsd = calculatedPriceUsd.value

  // Get selected values with fallbacks
  const docType: DocumentType =
    isNewStructure.value && props.documentTypesWithPrices
      ? props.documentTypesWithPrices[selectedDocumentType.value] || { name: '', priceUsd: null }
      : { name: documentTypeOptions.value[selectedDocumentType.value] || '', priceUsd: priceUsd }

  const langPair = languagePairOptions.value[selectedLanguage.value] || ''

  const urgency: UrgencyOption =
    isNewStructure.value && props.urgencyOptions
      ? props.urgencyOptions[selectedUrgency.value] || { name: '', surcharge: 0 }
      : { name: urgencyOptionsDisplay.value[selectedUrgency.value] || '', surcharge: 0 }

  // Prepare event data
  const event: CalculatorSubmitEvent = {
    selectedDocumentType: docType,
    selectedLanguagePair: langPair,
    selectedUrgency: urgency,
    calculatedPriceUsd: priceUsd,
    calculatedPriceFormatted: calculatedPrice.value,
  }

  emit('submit', event)
}
</script>
