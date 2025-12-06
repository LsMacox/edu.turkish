<template>
  <ServicesPageLayout
    :title="category?.title || t('services.relocation-in-turkey.title')"
    :subtitle="category?.subtitle || t('services.relocation-in-turkey.subtitle')"
    sub-services-cols="md:grid-cols-2 lg:grid-cols-3"
  >
    <template #sub-services>
      <ServicesPackageCard
        v-if="admissionPackage"
        package-id="university-admission"
        :name="admissionPackage.name"
        :price="admissionPackage.priceUsd"
        :services="admissionServices"
        :cta-text="t('services.relocation-in-turkey.packages.admission.ctaButton')"
        :is-mobile-accordion="isMobile"
        @apply="handlePackageApply"
      />
      <ServicesPackageCard
        v-if="standardPackage"
        package-id="relocation-standard"
        :name="standardPackage.name"
        :price="standardPackage.priceUsd"
        :services="standardServices"
        :cta-text="t('services.relocation-in-turkey.packages.standard.ctaButton')"
        :includes-text="t('services.relocation-in-turkey.packages.standard.includes')"
        :is-mobile-accordion="isMobile"
        @apply="handlePackageApply"
      />
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
import { useServiceCategory, useServiceHead, useI18nList } from '~/components/features/services/composables'

const { t } = useI18n()
const modal = useApplicationModalStore()
const exchangeRatesStore = useExchangeRatesStore()
const { category } = await useServiceCategory('relocation-in-turkey')
const { getListStrings } = useI18nList()

const isMobile = ref(false)
onMounted(() => {
  const update = () => (isMobile.value = window.innerWidth < 768)
  update()
  window.addEventListener('resize', update)
  onBeforeUnmount(() => window.removeEventListener('resize', update))
})

onMounted(() => exchangeRatesStore.ensureFresh())

const findPackage = (slug: string) =>
  computed(() => category.value?.subServices?.find((s) => s.slug === slug))

const admissionPackage = findPackage('university-admission')
const standardPackage = findPackage('relocation-standard')
const vipPackage = findPackage('relocation-vip')

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
  title: () => category.value?.title || t('services.relocation-in-turkey.title'),
  description: () => category.value?.subtitle || t('services.relocation-in-turkey.subtitle'),
})
</script>
