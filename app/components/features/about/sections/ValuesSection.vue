<template>
  <section class="section-py-lg bg-background">
    <div class="container mx-auto container-padding-narrow">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-section-title mb-6">
            {{ $t('about.values.title') }}
          </h2>
          <p class="text-section-subtitle max-w-3xl mx-auto">
            {{ $t('about.values.subtitle') }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <BaseFeatureCard
            icon="mdi:heart"
            icon-color="blue"
            :title="$t('about.values.honesty.title')"
            :description="$t('about.values.honesty.description')"
            hover="lift"
            centered
          />

          <BaseFeatureCard
            icon="mdi:star"
            icon-color="green"
            :title="$t('about.values.quality.title')"
            :description="$t('about.values.quality.description')"
            hover="lift"
            centered
          />

          <BaseFeatureCard
            icon="mdi:account-group"
            icon-color="purple"
            :title="$t('about.values.care.title')"
            :description="$t('about.values.care.description')"
            hover="lift"
            centered
          />

          <BaseFeatureCard
            icon="mdi:rocket"
            icon-color="orange"
            :title="$t('about.values.development.title')"
            :description="$t('about.values.development.description')"
            hover="lift"
            centered
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
