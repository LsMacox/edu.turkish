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
          <select
            v-model="selectedDocumentType"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option v-for="(docType, index) in documentTypes" :key="index" :value="index">
              {{ docType }}
            </option>
          </select>
        </div>

        <!-- Language Pair -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('services.common.languagePair') || 'Language Pair' }}
          </label>
          <select
            v-model="selectedLanguage"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option v-for="(lang, index) in languages" :key="index" :value="index">
              {{ lang }}
            </option>
          </select>
        </div>

        <!-- Urgency -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('services.common.urgency') || 'Urgency' }}
          </label>
          <select
            v-model="selectedUrgency"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option v-for="(urgency, index) in urgencyOptions" :key="index" :value="index">
              {{ urgency }}
            </option>
          </select>
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

const props = withDefaults(defineProps<PriceCalculatorSectionProps>(), {
  title: '',
})

const { t, tm } = useI18n()
const { currencyRef } = useCurrency()

// Computed title with i18n fallback
const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

// Load document types
const documentTypes = computed(() => {
  const raw = (tm(`${props.keyPrefix}.documentTypes`) || []) as unknown[]
  return raw.map((_, index) => t(`${props.keyPrefix}.documentTypes.${index}`) as string)
})

// Load languages
const languages = computed(() => {
  const raw = (tm(`${props.keyPrefix}.languages`) || []) as unknown[]
  return raw.map((_, index) => t(`${props.keyPrefix}.languages.${index}`) as string)
})

// Load urgency options
const urgencyOptions = computed(() => {
  const raw = (tm(`${props.keyPrefix}.urgency`) || []) as unknown[]
  return raw.map((_, index) => t(`${props.keyPrefix}.urgency.${index}`) as string)
})

// Load base prices
const basePrices = computed(() => {
  const standard = {
    KZT: t(`${props.keyPrefix}.basePrices.standard.KZT`) as string,
    TRY: t(`${props.keyPrefix}.basePrices.standard.TRY`) as string,
    RUB: t(`${props.keyPrefix}.basePrices.standard.RUB`) as string,
    USD: t(`${props.keyPrefix}.basePrices.standard.USD`) as string,
  }
  const express = {
    KZT: t(`${props.keyPrefix}.basePrices.express.KZT`) as string,
    TRY: t(`${props.keyPrefix}.basePrices.express.TRY`) as string,
    RUB: t(`${props.keyPrefix}.basePrices.express.RUB`) as string,
    USD: t(`${props.keyPrefix}.basePrices.express.USD`) as string,
  }
  const rush = {
    KZT: t(`${props.keyPrefix}.basePrices.rush.KZT`) as string,
    TRY: t(`${props.keyPrefix}.basePrices.rush.TRY`) as string,
    RUB: t(`${props.keyPrefix}.basePrices.rush.RUB`) as string,
    USD: t(`${props.keyPrefix}.basePrices.rush.USD`) as string,
  }
  return { standard, express, rush }
})

// Selection state
const selectedDocumentType = ref(0)
const selectedLanguage = ref(0)
const selectedUrgency = ref(0)

// Calculate price based on selections
const calculatedPrice = computed(() => {
  const urgencyKey =
    selectedUrgency.value === 0 ? 'standard' : selectedUrgency.value === 1 ? 'express' : 'rush'
  const prices = basePrices.value[urgencyKey]
  const currency = currencyRef.value
  const price = prices[currency as keyof typeof prices]

  if (!price) return ''

  return `${price} ${t(`currency.selector.${currency}`)}`
})
</script>
