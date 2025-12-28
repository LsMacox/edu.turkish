<template>
  <ServicesPageLayout
    :title="t(svc('title'))"
    :subtitle="t(svc('subtitle'))"
    sub-services-cols="md:grid-cols-2 lg:grid-cols-3"
  >
    <template #sub-services>
      <ServicesPackageCard
        package-name="university-admission"
        :name="t(pkgAdmission('name'))"
        :price="admissionPrice"
        :services="admissionServices"
        :cta-text="t(pkgAdmission('ctaButton'))"
        :is-mobile-accordion="isMobile"
        @apply="handlePackageApply"
      />
      <ServicesPackageCard
        package-name="relocation-standard"
        :name="t(pkgStandard('name'))"
        :price="standardPrice"
        :services="standardServices"
        :cta-text="t(pkgStandard('ctaButton'))"
        :includes-text="t(pkgStandard('includes'))"
        :is-mobile-accordion="isMobile"
        @apply="handlePackageApply"
      />
      <ServicesPackageCard
        package-name="relocation-vip"
        :name="t(pkgVip('name'))"
        :price="vipPrice"
        :services="vipServices"
        :cta-text="t(pkgVip('ctaButton'))"
        :includes-text="t(pkgVip('includes'))"
        is-vip
        :is-mobile-accordion="isMobile"
        @apply="handlePackageApply"
      />
    </template>

    <template #why-choose-us>
      <div class="grid md:grid-cols-2 gap-component-lg">
        <BaseAlert
          :title="t(svc('benefits.title'))"
          variant="success"
          layout="horizontal"
        >
          {{ t(svc('benefits.content')) }}
        </BaseAlert>
        <BaseAlert
          :title="t(svc('risks.title'))"
          variant="warning"
          layout="horizontal"
        >
          {{ t(svc('risks.content')) }}
        </BaseAlert>
      </div>
    </template>

    <template #faq>
      <ServicesFAQ
        :title="faqData.title"
        :items="faqData.items"
      />
    </template>
  </ServicesPageLayout>
</template>

<script setup lang="ts">
import { useExchangeRatesStore } from '~/stores/exchangeRates'
import { useServiceHead } from '~/composables/useServiceHead'
import { namespace } from '~~/lib/i18n'

const svc = namespace('services.relocation-in-turkey')
const metaNs = namespace('services.relocation-in-turkey.meta')
const pkgAdmission = namespace('services.relocation-in-turkey.packages.admission')
const pkgStandard = namespace('services.relocation-in-turkey.packages.standard')
const pkgVip = namespace('services.relocation-in-turkey.packages.vip')
const faqNs = namespace('services.relocation-in-turkey.faq')
const faqItemsNs = namespace('services.relocation-in-turkey.faq.items')
const { t, getNumber } = useI18nHelpers()
const modal = useApplicationModal()
const exchangeRatesStore = useExchangeRatesStore()

const isMobile = ref(false)
onMounted(() => {
  const update = () => (isMobile.value = window.innerWidth < 768)
  update()
  window.addEventListener('resize', update)
  onBeforeUnmount(() => window.removeEventListener('resize', update))
})

onMounted(() => exchangeRatesStore.ensureFresh())

// Prices from i18n (stored as numbers in JSON)
const admissionPrice = computed(() =>
  getNumber(pkgAdmission('priceUsd'), 200),
)
const standardPrice = computed(() =>
  getNumber(pkgStandard('priceUsd'), 1500),
)
const vipPrice = computed(() =>
  getNumber(pkgVip('priceUsd'), 2500),
)

const admissionServices = computed(() => [
  t(pkgAdmission('services.consultation')),
  t(pkgAdmission('services.selection')),
  t(pkgAdmission('services.documents')),
  t(pkgAdmission('services.translation')),
  t(pkgAdmission('services.guarantee')),
  t(pkgAdmission('services.payment')),
])

const standardAdditionalServices = computed(() => [
  t(pkgStandard('additionalServices.transfer')),
  t(pkgStandard('additionalServices.registration')),
  t(pkgStandard('additionalServices.studentCard')),
  t(pkgStandard('additionalServices.dormitory')),
  t(pkgStandard('additionalServices.travelCard')),
  t(pkgStandard('additionalServices.taxNumber')),
  t(pkgStandard('additionalServices.residencePermit')),
  t(pkgStandard('additionalServices.denklik')),
  t(pkgStandard('additionalServices.accompaniment')),
  t(pkgStandard('additionalServices.simCard')),
])

const vipAdditionalServices = computed(() => [
  t(pkgVip('additionalServices.apartment')),
  t(pkgVip('additionalServices.utilities')),
  t(pkgVip('additionalServices.residence')),
  t(pkgVip('additionalServices.bankAccount')),
])

const standardServices = computed(() => [
  ...standardAdditionalServices.value,
])

const vipServices = computed(() => [
  ...vipAdditionalServices.value,
])

const faqData = computed(() => ({
  title: t(faqNs('title')),
  items: [
    {
      question: t(faqItemsNs('process_time.question')),
      answer: t(faqItemsNs('process_time.answer')),
    },
    {
      question: t(faqItemsNs('installments.question')),
      answer: t(faqItemsNs('installments.answer')),
    },
    {
      question: t(faqItemsNs('cities.question')),
      answer: t(faqItemsNs('cities.answer')),
    },
    {
      question: t(faqItemsNs('individual_services.question')),
      answer: t(faqItemsNs('individual_services.answer')),
    },
    {
      question: t(faqItemsNs('risks.question')),
      answer: t(faqItemsNs('risks.answer')),
    },
    {
      question: t(faqItemsNs('accommodation.question')),
      answer: t(faqItemsNs('accommodation.answer')),
    },
    {
      question: t(faqItemsNs('documents.question')),
      answer: t(faqItemsNs('documents.answer')),
    },
    {
      question: t(faqItemsNs('visa.question')),
      answer: t(faqItemsNs('visa.answer')),
    },
    {
      question: t(faqItemsNs('rejection.question')),
      answer: t(faqItemsNs('rejection.answer')),
    },
  ],
}))

const handlePackageApply = ({ name }: { packageName: string; name: string }) => {
  modal.openModal({
    source: 'service_page',
    description: name,
  })
}

useServiceHead({
  title: () => t(metaNs('title')),
  description: () => t(metaNs('description')),
})
</script>
