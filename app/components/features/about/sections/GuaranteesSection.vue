<template>
  <section class="section-py-lg">
    <div class="container mx-auto container-padding-narrow">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-section-title mb-6">
            {{ t('about.guarantees.title') }}
          </h2>
          <p class="text-section-subtitle max-w-3xl mx-auto">
            {{ t('about.guarantees.subtitle') }}
          </p>
        </div>

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
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
