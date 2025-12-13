<template>
  <div class="mt-16">
    <BaseSectionHeader :title="title" />

    <div class="mt-8 max-w-3xl mx-auto px-4 sm:px-6">
      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ labels.documentTypeLabel }}
          </label>
          <BaseSelect v-model="selectedDocType">
            <option v-for="(dt, i) in documentTypesWithPrices" :key="i" :value="String(i)">
              {{ dt.name }}
            </option>
          </BaseSelect>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ labels.languagePairLabel }}
          </label>
          <BaseSelect v-model="selectedLang">
            <option v-for="(lang, i) in languagePairs" :key="i" :value="String(i)">
              {{ lang }}
            </option>
          </BaseSelect>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ labels.urgencyLabel }}
          </label>
          <BaseSelect v-model="selectedUrg">
            <option v-for="(urg, i) in urgencyOptions" :key="i" :value="String(i)">
              {{ urg.name }}
            </option>
          </BaseSelect>
        </div>

        <div v-if="displayPrice" class="mt-6 p-4 bg-primary/10 rounded-lg text-center">
          <div class="text-sm text-gray-600 mb-1">
            {{ labels.estimatedPrice }}
          </div>
          <div class="text-2xl sm:text-3xl font-bold text-primary break-words">
            {{ displayPrice }}
          </div>
        </div>

        <button
          type="button"
          class="w-full mt-6 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
          @click="handleSubmit"
        >
          {{ labels.submitButton }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DocumentType, UrgencyOption, CalculatorSubmitEvent } from '~/types/features/services'
import { useExchangeRatesStore } from '~/stores/exchangeRates'
import { namespace, key } from '~~/lib/i18n'

const currencyNs = namespace('currency.selector')

interface CalculatorLabels {
  documentTypeLabel: string
  languagePairLabel: string
  urgencyLabel: string
  estimatedPrice: string
  submitButton: string
  byRequest: string
}

interface Props {
  title: string
  labels: CalculatorLabels
  documentTypesWithPrices?: DocumentType[]
  languagePairs?: string[]
  urgencyOptions?: UrgencyOption[]
}

const props = withDefaults(defineProps<Props>(), {
  documentTypesWithPrices: () => [],
  languagePairs: () => [],
  urgencyOptions: () => [],
})

const emit = defineEmits<{
  submit: [event: CalculatorSubmitEvent]
}>()

const { t } = useI18n()
const { currencyRef } = useCurrency()
const exchangeRatesStore = useExchangeRatesStore()

const selectedDocType = ref('0')
const selectedLang = ref('0')
const selectedUrg = ref('0')

const priceUsd = computed<number | null>(() => {
  const doc = props.documentTypesWithPrices?.[Number(selectedDocType.value)]
  const urg = props.urgencyOptions?.[Number(selectedUrg.value)]
  if (!doc || !urg || doc.priceUsd === null) return null
  return doc.priceUsd + urg.surcharge
})

const getCurrencyLabel = (currency: string): string => {
  const labels: Record<string, string> = {
    KZT: t(currencyNs('KZT')),
    TRY: t(currencyNs('TRY')),
    RUB: t(currencyNs('RUB')),
    USD: t(currencyNs('USD')),
  }
  return labels[currency] ?? currency
}

const displayPrice = computed(() => {
  if (priceUsd.value === null) {
    return props.labels.byRequest
  }
  const converted = exchangeRatesStore.convertPrice(priceUsd.value, currencyRef.value)
  if (converted === null) return `$${priceUsd.value}`
  const fromPrefix = t(key('common.from')) || 'от'
  return `${fromPrefix} ${Math.round(converted)} ${getCurrencyLabel(currencyRef.value)}`
})

const handleSubmit = () => {
  const doc = props.documentTypesWithPrices?.[Number(selectedDocType.value)] || {
    name: '',
    priceUsd: null,
  }
  const lang = props.languagePairs?.[Number(selectedLang.value)] || ''
  const urg = props.urgencyOptions?.[Number(selectedUrg.value)] || { name: '', surcharge: 0 }

  emit('submit', {
    selectedDocumentType: doc,
    selectedLanguagePair: lang,
    selectedUrgency: urg,
    calculatedPriceUsd: priceUsd.value,
    calculatedPriceFormatted: displayPrice.value,
  })
}
</script>
