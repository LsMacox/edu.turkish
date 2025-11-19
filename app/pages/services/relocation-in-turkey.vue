<template>
  <ServicesPageLayout
    :title="category?.title || t('services.relocation-in-turkey.title')"
    :subtitle="category?.subtitle || t('services.relocation-in-turkey.subtitle')"
    sub-services-cols="md:grid-cols-2 lg:grid-cols-2"
  >
    <template #sub-services>
      <!-- Standard Package -->
      <ServicesPackageCard
        v-if="standardPackage"
        package-id="relocation-standard"
        :name="standardPackage.name"
        :price="standardPackage.priceUsd"
        :services="standardServices"
        :cta-text="t('services.relocation-in-turkey.packages.standard.ctaButton')"
        :is-mobile-accordion="isMobile"
        @apply="handlePackageApply"
      />

      <!-- VIP Package -->
      <ServicesPackageCard
        v-if="vipPackage"
        package-id="relocation-vip"
        :name="vipPackage.name"
        :price="vipPackage.priceUsd"
        :services="vipServices"
        :cta-text="t('services.relocation-in-turkey.packages.vip.ctaButton')"
        :includes-text="t('services.relocation-in-turkey.packages.vip.includes')"
        is-vip
        :is-mobile-accordion="isMobile"
        @apply="handlePackageApply"
      />
    </template>

    <template #why-choose-us>
      <ServicesSettlementBenefitsSection key-prefix="services.relocation-in-turkey.benefits" />
    </template>

    <template #faq>
      <ServicesSettlementRisksSection key-prefix="services.relocation-in-turkey.risks" />

      <ServicesFAQSection key-prefix="services.relocation-in-turkey.faq" />
    </template>
  </ServicesPageLayout>
</template>

<script setup lang="ts">
import type { PackageId } from '~/types/services'
import type { ServiceCategoryDetail } from '~~/server/types/api/services'
import { useApplicationModalStore } from '~/stores/applicationModal'
import { useExchangeRatesStore } from '~/stores/exchangeRates'
import { useServices } from '~/composables/useServices'

const { t, tm } = useI18n()
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

// Get services from i18n as plain strings using index-based t(key[index])
const getListStrings = (key: string): string[] => {
  const raw = tm(key) as any
  if (!Array.isArray(raw)) return []
  return raw.map((_, idx) => t(`${key}[${idx}]`))
}

const standardServices = computed<string[]>(() =>
  getListStrings('services.relocation-in-turkey.packages.standard.services'),
)

const vipServices = computed<string[]>(() => {
  const standard = getListStrings('services.relocation-in-turkey.packages.standard.services')
  const additional = getListStrings('services.relocation-in-turkey.packages.vip.additionalServices')
  return [...standard, ...additional]
})

// Find packages from database
const standardPackage = computed(() =>
  category.value?.subServices?.find((s) => s.slug === 'relocation-standard'),
)

const vipPackage = computed(() =>
  category.value?.subServices?.find((s) => s.slug === 'relocation-vip'),
)

// Mobile detection for accordion
const isMobile = ref(false)
onMounted(() => {
  isMobile.value = window.innerWidth < 768
  const handleResize = () => {
    isMobile.value = window.innerWidth < 768
  }
  window.addEventListener('resize', handleResize)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
  })
})

// Handle package application
const handlePackageApply = ({
  packageId,
  name,
}: {
  packageId: PackageId
  name: string
  price: number
}) => {
  modal.openModal({
    source: 'service_page',
    description: name,
    serviceContext: {
      subServiceId: packageId as any,
      subServiceName: name,
      source: 'service-page',
      sourceDescription: name,
    },
  })
}

useHead(() => ({
  title: category.value?.title || t('services.relocation-in-turkey.title'),
  meta: [
    {
      name: 'description',
      content: category.value?.subtitle || t('services.relocation-in-turkey.subtitle'),
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': ['Product', 'Service'],
        name: category.value?.title || t('services.relocation-in-turkey.title'),
        description: category.value?.subtitle || t('services.relocation-in-turkey.subtitle'),
        provider: {
          '@type': 'Organization',
          name: 'Edu.turkish',
          sameAs: 'https://edu-turkish.com',
        },
      }),
    },
  ],
}))
</script>
