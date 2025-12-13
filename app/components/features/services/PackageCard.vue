<template>
  <div
    :class="[
      'package-card border rounded-lg p-6 transition-shadow bg-white',
      isVip ? 'border-primary shadow-md' : 'border-gray-200 hover:shadow-lg',
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="mb-4 flex items-start justify-between">
        <h3 class="text-xl font-bold text-secondary">{{ name }}</h3>
        <span
          v-if="isVip"
          class="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full"
        >
          VIP
        </span>
      </div>

      <!-- Price -->
      <div class="mb-4">
        <ServicesPriceTag :price-usd="price" size="lg" />
      </div>

      <!-- Services List -->
      <div class="flex-grow">
        <!-- Mobile accordion header -->
        <button
          v-if="isMobileAccordion"
          type="button"
          class="w-full flex items-center justify-between text-left font-semibold text-gray-700 mb-2 md:hidden"
          @click="isExpanded = !isExpanded"
        >
          <span>{{ t(key('services.common.whatIncluded')) }}</span>
          <Icon
            name="mdi:chevron-down"
            :class="['w-5 h-5 transition-transform', isExpanded ? 'rotate-180' : '']"
          />
        </button>

        <!-- Services list (collapsible on mobile if accordion enabled) -->
        <div :class="{ hidden: isMobileAccordion && !isExpanded, 'md:block': isMobileAccordion }">
          <p v-if="includesText" class="text-sm font-medium text-gray-700 mb-2">
            {{ includesText }}
          </p>
          <ul class="space-y-2">
            <li
              v-for="(service, index) in displayServices"
              :key="index"
              class="flex items-start text-sm text-gray-600"
            >
              <Icon
                name="mdi:check-circle"
                class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
              />
              <span>{{ service }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- CTA Button -->
      <button
        type="button"
        :class="[
          'mt-6 w-full rounded-lg py-3 px-4 font-semibold transition-colors',
          isVip
            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
            : 'bg-primary text-white hover:bg-red-600 active:bg-red-700',
        ]"
        @click="handleApply"
      >
        {{ ctaText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { key } from '~~/lib/i18n'

interface Props {
  packageName: string
  name: string
  price: number
  services: string[]
  ctaText?: string
  includesText?: string
  isVip?: boolean
  isMobileAccordion?: boolean
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  ctaText: 'Order',
  isVip: false,
  isMobileAccordion: false,
  defaultExpanded: true,
})

const { t } = useI18n()

const emit = defineEmits<{
  apply: [payload: { packageName: string; name: string; price: number }]
}>()

const isExpanded = ref(props.defaultExpanded)

// Normalize i18n message objects to strings
const displayServices = computed(() =>
  props.services.map((item) => {
    if (typeof item === 'string') return item
    const obj = item as Record<string, unknown>
    if (typeof obj.source === 'string') return obj.source
    return String(item)
  }),
)

const handleApply = () => {
  emit('apply', { packageName: props.packageName, name: props.name, price: props.price })
}
</script>
