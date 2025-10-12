<template>
  <ServicePageLayout
    :title="t('services.relocation-in-turkey.title')"
    :subtitle="t('services.relocation-in-turkey.subtitle')"
  >
    <template #sub-services>
      <SubServiceCard
        v-for="subService in subServices"
        :key="subService.id"
        :sub-service-id="subService.id"
        :name="subService.name"
        :description="subService.description"
        :pricing="subService.pricing"
        @apply="handleApply"
      />
    </template>
  </ServicePageLayout>
</template>

<script setup lang="ts">
import type { SubServiceId, Currency } from '~/types/services'

const { t, tm } = useI18n()
const modal = useApplicationModalStore()

const subServices = computed(() => {
  const raw = (tm('services.relocation-in-turkey.subServices') || {}) as Record<string, unknown>
  const ids = Object.keys(raw)

  return ids.map((id) => ({
    id: id as SubServiceId,
    name: t(`services.relocation-in-turkey.subServices.${id}.name`) as string,
    description: t(`services.relocation-in-turkey.subServices.${id}.description`) as string,
    pricing: {
      KZT: t(`services.relocation-in-turkey.subServices.${id}.pricing.KZT`) as string,
      TRY: t(`services.relocation-in-turkey.subServices.${id}.pricing.TRY`) as string,
      RUB: t(`services.relocation-in-turkey.subServices.${id}.pricing.RUB`) as string,
      USD: t(`services.relocation-in-turkey.subServices.${id}.pricing.USD`) as string,
    } as Record<Currency, string>,
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

useHead({
  title: t('services.relocation-in-turkey.title'),
  meta: [
    {
      name: 'description',
      content: t('services.relocation-in-turkey.subtitle'),
    },
  ],
})
</script>
