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
        <p class="text-gray-600 text-sm leading-relaxed">
          {{ description }}
        </p>
      </div>

      <!-- Price and CTA -->
      <div class="mt-auto space-y-4">
        <div class="flex items-baseline justify-between">
          <span class="text-sm text-gray-500">Price</span>
          <CurrencyPrice :pricing="pricing" size="lg" />
        </div>

        <button
          type="button"
          class="w-full bg-primary text-white rounded-lg py-3 px-4 font-semibold hover:bg-red-600 active:bg-red-700 transition-colors"
          @click="handleApply"
        >
          {{ $t('cta.apply') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Currency, SubServiceId } from '~/types/services'

interface Props {
  subServiceId: SubServiceId
  name: string
  description: string
  pricing: Record<Currency, string>
}

interface Emits {
  (e: 'apply', payload: { subServiceId: SubServiceId; name: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleApply = () => {
  emit('apply', {
    subServiceId: props.subServiceId,
    name: props.name,
  })
}
</script>
