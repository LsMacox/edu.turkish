<template>
  <BaseCard
    padding="lg"
    shadow="none"
    rounded="lg"
    bordered
    hover="shadow"
    class="sub-service-card"
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="mb-component-sm">
        <h3 class="text-card-title mb-component-xs">
          {{ name }}
        </h3>
        <p class="text-body-sm whitespace-pre-line">
          {{ description }}
        </p>
      </div>

      <!-- Price and CTA -->
      <div class="mt-auto space-component-lg">
        <div class="flex items-baseline justify-between">
          <span class="text-body-sm text-meta">{{ t(ns('price')) }}</span>
          <ServicesPriceTag :price-usd="priceUsd" size="lg" />
        </div>

        <!-- Delivery timeframe -->
        <div v-if="deliveryTime" class="text-body-sm">
          <span class="font-medium">{{ t(ns('deliveryTime')) }}:</span>
          {{ deliveryTime }}
        </div>

        <BaseButton
          variant="primary"
          size="lg"
          full-width
          rounded="button"
          class="md:text-base"
          @click="handleApply"
        >
          {{ t(key('cta.apply')) }}
        </BaseButton>
      </div>
    </div>
  </BaseCard>
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
