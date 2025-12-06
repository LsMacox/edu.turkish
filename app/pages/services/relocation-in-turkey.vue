<template>
  <ServicesPageLayout
    :title="t('services.relocation-in-turkey.title')"
    :subtitle="t('services.relocation-in-turkey.subtitle')"
    sub-services-cols="md:grid-cols-2 lg:grid-cols-3"
  >
    <template #sub-services>
      <ServicesPackageCard
        package-id="university-admission"
        :name="t('services.relocation-in-turkey.packages.admission.name')"
        :price="admissionPrice"
        :services="admissionServices"
        :cta-text="t('services.relocation-in-turkey.packages.admission.ctaButton')"
        :is-mobile-accordion="isMobile"
        @apply="handlePackageApply"
      />
      <ServicesPackageCard
        package-id="relocation-standard"
        :name="t('services.relocation-in-turkey.packages.standard.name')"
        :price="standardPrice"
        :services="standardServices"
        :cta-text="t('services.relocation-in-turkey.packages.standard.ctaButton')"
        :includes-text="t('services.relocation-in-turkey.packages.standard.includes')"
        :is-mobile-accordion="isMobile"
        @apply="handlePackageApply"
      />
      <ServicesPackageCard
        package-id="relocation-vip"
        :name="t('services.relocation-in-turkey.packages.vip.name')"
        :price="vipPrice"
        :services="vipServices"
        :cta-text="t('services.relocation-in-turkey.packages.vip.ctaButton')"
        :includes-text="t('services.relocation-in-turkey.packages.vip.includes')"
        is-vip
        :is-mobile-accordion="isMobile"
        @apply="handlePackageApply"
      />
    </template>

    <template #why-choose-us>
      <ServicesAlertCard key-prefix="services.relocation-in-turkey.benefits" variant="success" />
    </template>

    <template #faq>
      <ServicesAlertCard key-prefix="services.relocation-in-turkey.risks" variant="warning" />

      <ServicesFAQ key-prefix="services.relocation-in-turkey.faq" />
    </template>
  </ServicesPageLayout>
</template>

<script setup lang="ts">
import type { PackageId } from '~/types/services'
import { useApplicationModalStore } from '~/stores/applicationModal'
import { useExchangeRatesStore } from '~/stores/exchangeRates'
import { useServiceHead, useI18nList } from '~/components/features/services/composables'

const { t, tm } = useI18n()
const modal = useApplicationModalStore()
const exchangeRatesStore = useExchangeRatesStore()
const { getListStrings } = useI18nList()

const isMobile = ref(false)
onMounted(() => {
  const update = () => (isMobile.value = window.innerWidth < 768)
  update()
  window.addEventListener('resize', update)
  onBeforeUnmount(() => window.removeEventListener('resize', update))
})

onMounted(() => exchangeRatesStore.ensureFresh())

// Prices from i18n (stored as numbers in JSON)
const admissionPrice = computed(() => {
  const val = tm('services.relocation-in-turkey.packages.admission.priceUsd') as unknown
  return typeof val === 'number' ? val : 200
})
const standardPrice = computed(() => {
  const val = tm('services.relocation-in-turkey.packages.standard.priceUsd') as unknown
  return typeof val === 'number' ? val : 1500
})
const vipPrice = computed(() => {
  const val = tm('services.relocation-in-turkey.packages.vip.priceUsd') as unknown
  return typeof val === 'number' ? val : 2500
})

const admissionServices = computed(() =>
  getListStrings('services.relocation-in-turkey.packages.admission.services'),
)
const standardServices = computed(() => [
  ...admissionServices.value,
  ...getListStrings('services.relocation-in-turkey.packages.standard.additionalServices'),
])
const vipServices = computed(() => [
  ...standardServices.value,
  ...getListStrings('services.relocation-in-turkey.packages.vip.additionalServices'),
])

const handlePackageApply = ({ packageId, name }: { packageId: PackageId; name: string }) => {
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

useServiceHead({
  title: () => t('services.relocation-in-turkey.title'),
  description: () => t('services.relocation-in-turkey.subtitle'),
})
</script>
