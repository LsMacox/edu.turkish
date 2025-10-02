<template>
  <section class="section-py-lg bg-background">
    <div class="container mx-auto container-padding-narrow">
      <div class="max-w-6xl mx-auto">
        <BaseSectionHeader
          :title="t('about.guarantees.title')"
          :subtitle="t('about.guarantees.subtitle')"
          align="center"
          margin-bottom="lg"
        />

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <BaseFeatureCard
            icon="mdi:file-document"
            icon-color="blue"
            icon-size="md"
            :title="t('about.guarantees.contract_work')"
            :description="t('about.guarantees.contract_work_desc')"
            hover="lift"
            centered
          />

          <BaseFeatureCard
            icon="mdi:eye"
            icon-color="green"
            icon-size="md"
            :title="t('about.guarantees.transparent_terms')"
            :description="t('about.guarantees.transparent_terms_desc')"
            hover="lift"
            centered
          />

          <BaseFeatureCard
            icon="mdi:headset"
            icon-color="purple"
            icon-size="md"
            :title="t('about.guarantees.full_support')"
            :description="t('about.guarantees.full_support_desc')"
            hover="lift"
            centered
          />

          <BaseFeatureCard
            icon="mdi:clock"
            icon-color="orange"
            icon-size="md"
            :title="t('about.guarantees.fast_response')"
            :description="t('about.guarantees.fast_response_desc')"
            hover="lift"
            centered
          />
        </div>

        <div
          class="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl card-padding-lg lg:p-12 text-white"
        >
          <div class="text-center">
            <div
              class="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Icon name="mdi:shield-check" class="text-green-600 text-3xl" />
            </div>
            <h3 class="text-2xl lg:text-3xl font-bold mb-4">
              {{ t('about.guarantees.admission_guarantee') }}
            </h3>
            <p class="text-lg leading-relaxed max-w-3xl mx-auto mb-6">
              {{ t('about.guarantees.admission_guarantee_desc') }}
            </p>
            <div class="flex justify-center space-x-8 text-sm">
              <div class="flex items-center space-x-2">
                <Icon name="mdi:check-circle" />
                <span>{{ t('about.guarantees.success_rate') }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Icon name="mdi:cash-refund" />
                <span>{{ t('about.guarantees.money_back') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
