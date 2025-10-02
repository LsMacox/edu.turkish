<template>
  <section class="section-py-lg bg-background">
    <div class="container mx-auto container-padding-narrow">
      <div class="max-w-6xl mx-auto">
        <BaseSectionHeader
          :title="t('about.mission.title')"
          :subtitle="t('about.mission.subtitle')"
          align="center"
          margin-bottom="lg"
        />

        <div class="grid lg:grid-cols-3 gap-8 mb-16">
          <BaseFeatureCard
            icon="mdi:heart"
            icon-color="blue"
            icon-size="lg"
            :title="t('about.mission.no_pressure')"
            :description="t('about.mission.no_pressure_desc')"
            hover="lift"
            centered
          />

          <BaseFeatureCard
            icon="mdi:message-text"
            icon-color="green"
            icon-size="lg"
            :title="t('about.mission.your_language')"
            :description="t('about.mission.your_language_desc')"
            hover="lift"
            centered
          />

          <BaseFeatureCard
            icon="mdi:account-group"
            icon-color="purple"
            icon-size="lg"
            :title="t('about.mission.after_admission')"
            :description="t('about.mission.after_admission_desc')"
            hover="lift"
            centered
          />
        </div>

        <div
          class="bg-gradient-to-r from-primary to-red-600 rounded-2xl card-padding-lg lg:p-12 text-white text-center"
        >
          <h3 class="text-2xl lg:text-3xl font-bold mb-4">
            {{ t('about.mission.philosophy_title') }}
          </h3>
          <p class="text-lg lg:text-xl leading-relaxed max-w-4xl mx-auto">
            {{ t('about.mission.philosophy_quote') }}
          </p>
          <div class="mt-6 flex justify-center">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Icon name="mdi:format-quote-open" class="text-primary text-lg" />
              </div>
              <div class="text-left">
                <p class="font-semibold">{{ t('about.mission.ceo_name') }}</p>
                <p class="text-sm opacity-90">{{ t('about.mission.ceo_title') }}</p>
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
