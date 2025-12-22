<template>
  <BaseCard
    padding="lg"
    :shadow="isVip ? 'md' : 'none'"
    rounded="lg"
    bordered
    full-height
    :hover="isVip ? false : 'shadow'"
    :class="['package-card', isVip ? 'border-primary' : '']"
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="mb-component-md flex items-start justify-between">
        <h3 class="text-card-title">{{ name }}</h3>
        <BaseBadge
          v-if="isVip"
          color="primary"
          variant="gradient"
          size="sm"
          rounded="full"
        >
          VIP
        </BaseBadge>
      </div>

      <!-- Price -->
      <div class="mb-component-md">
        <ServicesPriceTag :price-usd="price" size="lg" />
      </div>

      <!-- Services List -->
      <div class="flex-grow">
        <!-- Mobile accordion header -->
        <button
          v-if="isMobileAccordion"
          type="button"
          class="w-full flex items-center justify-between text-left font-semibold text-body mb-component-xs md:hidden"
          @click="isExpanded = !isExpanded"
        >
          <span>{{ t(key('services.common.whatIncluded')) }}</span>
          <Icon
            name="mdi:chevron-down"
            :class="['text-icon transition-transform', isExpanded ? 'rotate-180' : '']"
          />
        </button>

        <!-- Services list (collapsible on mobile if accordion enabled) -->
        <div :class="{ hidden: isMobileAccordion && !isExpanded, 'md:block': isMobileAccordion }">
          <p v-if="includesText" class="text-body-sm font-medium mb-component-xs">
            {{ includesText }}
          </p>
          <ul class="space-component-sm">
            <li
              v-for="(service, index) in displayServices"
              :key="index"
              class="flex items-start text-body-sm"
            >
              <Icon
                name="mdi:check-circle"
                class="text-icon-sm text-success mr-2 flex-shrink-0 mt-0.5"
              />
              <span>{{ service }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- CTA Button -->
      <BaseButton
        :variant="isVip ? 'gradient' : 'primary'"
        size="lg"
        full-width
        rounded="button"
        class="mt-component-lg md:text-base"
        @click="handleApply"
      >
        {{ ctaText }}
      </BaseButton>
    </div>
  </BaseCard>
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
