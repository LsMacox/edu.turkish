<template>
  <ServicePageLayout
    :title="category?.title || t('services.relocation-in-turkey.title')"
    :subtitle="category?.subtitle || t('services.relocation-in-turkey.subtitle')"
  >
    <template #sub-services>
      <SubServiceCard
        v-for="subService in subServices"
        :key="subService.id"
        :sub-service-id="subService.id"
        :name="subService.name"
        :description="subService.description"
        :price-usd="subService.priceUsd"
        :delivery-time="subService.deliveryTime"
        @apply="handleApply"
      />
    </template>

    <template #who-is-this-for>
      <WhoIsThisForSection
        key-prefix="services.relocation-in-turkey.whoIsThisFor"
        :title="metadataPath('whoIsThisFor.title')"
      />
    </template>

    <template #expected-results>
      <ExpectedResultsSection
        key-prefix="services.relocation-in-turkey.expectedResults"
        :title="metadataPath('expectedResults.title')"
      />
    </template>

    <template #timeline-plan>
      <TimelinePlanSection
        key-prefix="services.relocation-in-turkey.timelinePlan"
        :title="metadataPath('timelinePlan.title')"
      />
    </template>

    <template #responsibility-matrix>
      <ResponsibilityMatrixSection
        key-prefix="services.relocation-in-turkey.responsibilityMatrix"
        :title="metadataPath('responsibilityMatrix.title')"
      />
    </template>

    <template #risk-mitigation>
      <RiskMitigationSection
        key-prefix="services.relocation-in-turkey.riskMitigation"
        :title="metadataPath('riskMitigation.title')"
      />
    </template>

    <template #faq>
      <ServiceFAQSection
        key-prefix="services.relocation-in-turkey.faq"
        :title="metadataPath('faq.title')"
      />
    </template>
  </ServicePageLayout>
</template>

<script setup lang="ts">
import type { SubServiceId } from '~/types/services'
import type { ServiceCategoryDetail } from '~~/server/types/api/services'
import { useApplicationModalStore } from '~/stores/applicationModal'
import { useExchangeRatesStore } from '~/stores/exchangeRates'
import { useServices } from '~/composables/useServices'

const { t } = useI18n()
const modal = useApplicationModalStore()
const exchangeRatesStore = useExchangeRatesStore()
const { fetchCategory } = useServices()

// Fetch category data from database
const { data: category } = await useAsyncData<ServiceCategoryDetail>(
  'relocation-in-turkey',
  () => fetchCategory('relocation-in-turkey'),
  {
    lazy: false,
  },
)

// Ensure exchange rates are fresh
onMounted(async () => {
  await exchangeRatesStore.ensureFresh()
})

// Map database sub-services to component format
const subServices = computed(() => {
  if (!category.value?.subServices) return []

  return category.value.subServices.map((subService) => ({
    id: subService.slug as SubServiceId,
    name: subService.name,
    description: subService.description,
    priceUsd: subService.priceUsd,
    deliveryTime: subService.deliveryTimeDays
      ? `${subService.deliveryTimeDays} ${t('services.common.days')}`
      : undefined,
  }))
})

const handleApply = ({ subServiceId, name }: { subServiceId: SubServiceId; name: string }) => {
  modal.openModal({
    source: 'service_page',
    description: name,
    serviceContext: {
      subServiceId,
      subServiceName: name,
      source: 'service-page',
      sourceDescription: name,
    },
  })
}

// Helper to safely read structured metadata
function metadataPath<T = any>(path: string): T | undefined {
  const meta = category.value?.metadata as Record<string, unknown> | undefined | null
  if (!meta) return undefined
  const parts = path.split('.')
  let node: any = meta
  for (const part of parts) {
    if (node && typeof node === 'object' && part in node) {
      node = (node as any)[part]
    } else {
      return undefined
    }
  }
  return node as T
}

useHead({
  title: category.value?.title || t('services.relocation-in-turkey.title'),
  meta: [
    {
      name: 'description',
      content: category.value?.subtitle || t('services.relocation-in-turkey.subtitle'),
    },
  ],
})
</script>
