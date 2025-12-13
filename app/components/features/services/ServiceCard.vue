<template>
  <div
    class="sub-service-card border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="mb-4">
        <h3 class="text-xl font-bold text-secondary mb-2">
          {{ name }}
        </h3>
        <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
          {{ description }}
        </p>
      </div>

      <!-- Price and CTA -->
      <div class="mt-auto space-y-4">
        <div class="flex items-baseline justify-between">
          <span class="text-sm text-gray-500">{{ t(ns('price')) }}</span>
          <ServicesPriceTag :price-usd="priceUsd" size="lg" />
        </div>

        <!-- Delivery timeframe -->
        <div v-if="deliveryTime" class="text-sm text-gray-600">
          <span class="font-medium">{{ t(ns('deliveryTime')) }}:</span>
          {{ deliveryTime }}
        </div>

        <button
          type="button"
          class="w-full bg-primary text-white rounded-lg py-3 px-4 font-semibold hover:bg-red-600 active:bg-red-700 transition-colors"
          @click="handleApply"
        >
          {{ t(key('cta.apply')) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { namespace, key } from '~~/lib/i18n'

const ns = namespace('services.common')

interface Props {
  serviceName: string
  name: string
  description: string
  priceUsd: number
  deliveryTime?: string
}

interface Emits {
  (e: 'apply', payload: { serviceName: string; name: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const handleApply = () => {
  emit('apply', {
    serviceName: props.serviceName,
    name: props.name,
  })
}
</script>
