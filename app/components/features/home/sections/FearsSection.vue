<template>
  <section id="breaking-fears" class="section-py bg-gray-50">
    <div class="container mx-auto container-padding-narrow">
      <BaseSectionHeader
        :title="t('home.fears.title')"
        :subtitle="t('home.fears.subtitle')"
        align="center"
        margin-bottom="lg"
      />

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="card-surface">
          <BaseIconBadge icon="mdi:alert-circle" color="red" size="md" class="mb-6" />
          <h3 class="text-card-title mb-4">
            {{ t('home.fears.fear1_title') }}
          </h3>
          <div class="space-y-3">
            <p class="text-gray-600">{{ t('home.fears.fear_label') }}</p>
            <p class="text-sm text-gray-500 italic">{{ t('home.fears.fear1_quote') }}</p>
            <div class="border-t pt-3">
              <p class="text-green-600 font-medium">{{ t('home.fears.fear1_solution1') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear1_solution2') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear1_solution3') }}</p>
            </div>
          </div>
        </div>

        <div class="card-surface">
          <BaseIconBadge icon="mdi:translate" color="blue" size="md" class="mb-6" />
          <h3 class="text-card-title mb-4">
            {{ t('home.fears.fear2_title') }}
          </h3>
          <div class="space-y-3">
            <p class="text-gray-600">{{ t('home.fears.fear_label') }}</p>
            <p class="text-sm text-gray-500 italic">{{ t('home.fears.fear2_quote') }}</p>
            <div class="border-t pt-3">
              <p class="text-green-600 font-medium">{{ t('home.fears.fear2_solution1') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear2_solution2') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear2_solution3') }}</p>
            </div>
          </div>
        </div>

        <div class="card-surface">
          <BaseIconBadge icon="mdi:clock-alert" color="orange" size="md" class="mb-6" />
          <h3 class="text-card-title mb-4">
            {{ t('home.fears.fear3_title') }}
          </h3>
          <div class="space-y-3">
            <p class="text-gray-600">{{ t('home.fears.fear_label') }}</p>
            <p class="text-sm text-gray-500 italic">{{ t('home.fears.fear3_quote') }}</p>
            <div class="border-t pt-3">
              <p class="text-green-600 font-medium">{{ t('home.fears.fear3_solution1') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear3_solution2') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear3_solution3') }}</p>
            </div>
          </div>
        </div>

        <div class="card-surface">
          <BaseIconBadge icon="mdi:currency-usd" color="purple" size="md" class="mb-6" />
          <h3 class="text-card-title mb-4">
            {{ t('home.fears.fear4_title') }}
          </h3>
          <div class="space-y-3">
            <p class="text-gray-600">{{ t('home.fears.fear_label') }}</p>
            <p class="text-sm text-gray-500 italic">{{ t('home.fears.fear4_quote') }}</p>
            <div class="border-t pt-3">
              <p class="text-green-600 font-medium">{{ t('home.fears.fear4_solution1') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear4_solution2') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear4_solution3') }}</p>
            </div>
          </div>
        </div>

        <div class="card-surface">
          <BaseIconBadge icon="mdi:close-circle" color="green" size="md" class="mb-6" />
          <h3 class="text-card-title mb-4">
            {{ t('home.fears.fear5_title') }}
          </h3>
          <div class="space-y-3">
            <p class="text-gray-600">{{ t('home.fears.fear_label') }}</p>
            <p class="text-sm text-gray-500 italic">{{ t('home.fears.fear5_quote') }}</p>
            <div class="border-t pt-3">
              <p class="text-green-600 font-medium">{{ t('home.fears.fear5_solution1') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear5_solution2') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear5_solution3') }}</p>
            </div>
          </div>
        </div>

        <div class="card-surface">
          <BaseIconBadge icon="mdi:home" color="yellow" size="md" class="mb-6" />
          <h3 class="text-card-title mb-4">
            {{ t('home.fears.fear6_title') }}
          </h3>
          <div class="space-y-3">
            <p class="text-gray-600">{{ t('home.fears.fear_label') }}</p>
            <p class="text-sm text-gray-500 italic">{{ t('home.fears.fear6_quote') }}</p>
            <div class="border-t pt-3">
              <p class="text-green-600 font-medium">{{ t('home.fears.fear6_solution1') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear6_solution2') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear6_solution3') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Breaking fears section
const { t } = useI18n()
</script>
