<template>
  <span :class="priceClasses" class="price font-semibold text-primary">
    {{ formattedPrice }}
  </span>
</template>

<script setup lang="ts">
import type { Currency } from '~/types/currency'
import { useCurrency } from '~/composables/useCurrency'

interface Props {
  pricing: Record<Currency, string>
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const { formatPrice, currencyRef } = useCurrency()

const formattedPrice = computed(() => formatPrice(props.pricing, currencyRef.value))

const priceClasses = computed(() => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return sizeClasses[props.size]
})
</script>
