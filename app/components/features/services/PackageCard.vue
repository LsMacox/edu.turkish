<template>
  <div
    :class="[
      'package-card border rounded-lg p-6 transition-shadow bg-white',
      isVip ? 'border-primary shadow-md' : 'border-gray-200 hover:shadow-lg'
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="mb-4">
        <div class="flex items-start justify-between mb-2">
          <h3 class="text-xl font-bold text-secondary">
            {{ name }}
          </h3>
          <span
            v-if="isVip"
            class="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full"
          >
            VIP
          </span>
        </div>
      </div>

      <!-- Price -->
      <div class="mb-4">
        <CurrencyPrice :price-usd="price" size="lg" />
      </div>

      <!-- Services List -->
      <div class="flex-grow">
        <!-- Mobile: Accordion -->
        <div v-if="isMobileAccordion" class="md:hidden">
          <button
            type="button"
            class="w-full flex items-center justify-between text-left font-semibold text-gray-700 mb-2"
            @click="toggleExpanded"
          >
            <span>{{ $t('services.common.whatIncluded', 'What\'s Included') }}</span>
            <svg
              :class="['w-5 h-5 transition-transform', isExpanded ? 'rotate-180' : '']"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div v-show="isExpanded" class="space-y-3">
            <p v-if="includesText" class="text-sm font-medium text-gray-700 mb-2">
              {{ includesText }}
            </p>
            <ul class="space-y-2">
              <li
                v-for="(service, index) in displayServices"
                :key="index"
                class="flex items-start text-sm text-gray-600"
              >
                <svg
                  class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ service }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Desktop: Always Visible -->
        <div class="hidden md:block space-y-3">
          <p v-if="includesText" class="text-sm font-medium text-gray-700 mb-2">
            {{ includesText }}
          </p>
          <ul class="space-y-2">
            <li
              v-for="(service, index) in displayServices"
              :key="index"
              class="flex items-start text-sm text-gray-600"
            >
              <svg
                class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ service }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="mt-6">
        <button
          type="button"
          :class="[
            'w-full rounded-lg py-3 px-4 font-semibold transition-colors',
            isVip
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
              : 'bg-primary text-white hover:bg-red-600 active:bg-red-700'
          ]"
          @click="handleApply"
        >
          {{ ctaText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PackageId } from '~/types/services'

interface Props {
  packageId: PackageId
  name: string
  price: number
  services: string[]
  ctaText?: string
  includesText?: string
  isVip?: boolean
  isMobileAccordion?: boolean
  defaultExpanded?: boolean
}

interface Emits {
  (
    e: 'apply',
    payload: {
      packageId: PackageId
      name: string
      price: number
    }
  ): void
}

const props = withDefaults(defineProps<Props>(), {
  ctaText: 'Order',
  includesText: undefined,
  isVip: false,
  isMobileAccordion: false,
  defaultExpanded: true,
})

const emit = defineEmits<Emits>()

const isExpanded = ref(props.defaultExpanded)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

function extractText(item: any): string {
  if (typeof item === 'string') return item
  if (item && typeof item.source === 'string') return item.source
  if (item && Array.isArray(item.body)) {
    const parts = item.body
      .map((n: any) => (n && typeof n.source === 'string' ? n.source : ''))
      .filter(Boolean)
    if (parts.length) return parts.join('')
  }
  return String(item)
}

const displayServices = computed(() =>
  (props.services as unknown as any[]).map((item) => extractText(item)),
)

const handleApply = () => {
  emit('apply', {
    packageId: props.packageId,
    name: props.name,
    price: props.price,
  })
}
</script>
