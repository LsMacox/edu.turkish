<template>
  <span :class="priceClasses" class="price font-semibold text-primary">
    {{ formattedPrice }}
  </span>
</template>

<script setup lang="ts">
import type { Currency } from '~/types/currency'
import { useCurrency } from '~/composables/useCurrency'
import { useExchangeRatesStore } from '~/stores/exchangeRates'

interface Props {
  pricing?: Record<Currency, string>
  priceUsd?: number
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const { formatPrice, currencyRef, getCurrencySymbol } = useCurrency()
const exchangeRatesStore = useExchangeRatesStore()

const formattedPrice = computed(() => {
  // Legacy mode: use pricing object
  if (props.pricing) {
    return formatPrice(props.pricing, currencyRef.value)
  }

  // New mode: convert USD price dynamically
  if (props.priceUsd !== undefined) {
    const convertedPrice = exchangeRatesStore.convertPrice(props.priceUsd, currencyRef.value)
    const symbol = getCurrencySymbol(currencyRef.value)

    // Format with thousands separator
    const formatted = Math.round(convertedPrice).toLocaleString('en-US')
    return `${symbol}${formatted}`
  }

  return '$0'
})

const priceClasses = computed(() => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return sizeClasses[props.size]
})
</script>
