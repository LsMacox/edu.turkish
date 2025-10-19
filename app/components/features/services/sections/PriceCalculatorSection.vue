<template>
  <div class="mt-16">
    <BaseSectionHeader :title="title" />

    <div class="mt-8 max-w-3xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6 space-y-6">
        <!-- Document Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('services.common.documentType') || 'Document Type' }}
          </label>
          <BaseSelect v-model="selectedDocumentTypeModel">
            <option v-for="(docType, index) in documentTypes" :key="index" :value="String(index)">
              {{ docType }}
            </option>
          </BaseSelect>
        </div>

        <!-- Language Pair -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('services.common.languagePair') || 'Language Pair' }}
          </label>
          <BaseSelect v-model="selectedLanguageModel">
            <option v-for="(lang, index) in languages" :key="index" :value="String(index)">
              {{ lang }}
            </option>
          </BaseSelect>
        </div>

        <!-- Urgency -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('services.common.urgency') || 'Urgency' }}
          </label>
          <BaseSelect v-model="selectedUrgencyModel">
            <option v-for="(urgency, index) in urgencyOptions" :key="index" :value="String(index)">
              {{ urgency }}
            </option>
          </BaseSelect>
        </div>

        <!-- Price Display -->
        <div v-if="calculatedPrice" class="mt-6 p-4 bg-primary/10 rounded-lg text-center">
          <div class="text-sm text-gray-600 mb-1">
            {{ t('services.common.estimatedPrice') || 'Estimated Price' }}
          </div>
          <div class="text-3xl font-bold text-primary">
            {{ calculatedPrice }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PriceCalculatorSectionProps } from '@/types/services'
import { useExchangeRatesStore } from '~/stores/exchangeRates'

const props = withDefaults(defineProps<PriceCalculatorSectionProps>(), {
  title: '',
})

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

// Computed title with i18n fallback
const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

// Document types from props only
const documentTypes = computed(() => props.documentTypes ?? [])

// Languages from props only
const languages = computed(() => props.languages ?? [])

// Urgency options from props only
const urgencyOptions = computed(() => props.urgency ?? [])

// No i18n or basePrices fallback; prices are computed from standardPriceUsd and multipliers

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

// Calculate price based on selections
const calculatedPrice = computed(() => {
  const urgencyKey =
    selectedUrgency.value === 0 ? 'standard' : selectedUrgency.value === 1 ? 'express' : 'rush'
  const currency = currencyRef.value

  const baseUsd = props.standardPriceUsd
  if (!baseUsd || !isFinite(baseUsd)) return ''

  const m =
    urgencyKey === 'standard'
      ? 1
      : urgencyKey === 'express'
        ? urgencyMultipliers.value.express
        : urgencyMultipliers.value.rush

  const docAdj = props.adjustments?.byDocumentType?.[selectedDocumentType.value] ?? 1
  const langAdj = props.adjustments?.byLanguage?.[selectedLanguage.value] ?? 1
  const usdPrice = baseUsd * m * docAdj * langAdj

  const converted = getExchangeRatesStore().convertPrice(usdPrice, currency as any)
  const rounded = Math.round(converted)
  return `${rounded} ${t(`currency.selector.${currency}`)}`
})
</script>
