<template>
  <span :class="sizeClass" class="price font-semibold text-primary">
    {{ formattedPrice }}
  </span>
</template>

<script setup lang="ts">
import { useExchangeRatesStore } from '~/stores/exchangeRates'

interface Props {
  priceUsd: number
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const { currencyRef, getCurrencySymbol } = useCurrency()
const exchangeRatesStore = useExchangeRatesStore()

const formattedPrice = computed(() => {
  const converted = exchangeRatesStore.convertPrice(props.priceUsd, currencyRef.value)
  if (converted === null) return `$${props.priceUsd.toLocaleString('en-US')}`
  const symbol = getCurrencySymbol(currencyRef.value)
  return `${symbol}${Math.round(converted).toLocaleString('en-US')}`
})

const sizeClass = computed(() => ({ sm: 'text-sm', md: 'text-base', lg: 'text-lg' })[props.size])
</script>
