<template>
  <section id="how-it-works" class="section-py">
    <div class="container">
      <BaseSectionHeader
        :title="t('home.how.title')"
        :subtitle="t('home.how.subtitle')"
        align="center"
        margin-bottom="lg"
      />
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="text-center space-y-4 group hover:scale-105 transition-transform duration-300">
          <div
            class="w-16 h-16 bg-blue-100 rounded-2xl grid place-items-center mx-auto group-hover:bg-blue-200 transition-colors"
          >
            <Icon name="mdi:magnify" class="text-blue-600 text-2xl" />
          </div>
          <div class="space-y-2">
            <h3 class="text-card-title">{{ t('home.how.step1_title') }}</h3>
            <p class="text-card-body">{{ t('home.how.step1_desc') }}</p>
          </div>
        </div>
        <div class="text-center space-y-4 group hover:scale-105 transition-transform duration-300">
          <div
            class="w-16 h-16 bg-green-100 rounded-2xl grid place-items-center mx-auto group-hover:bg-green-200 transition-colors"
          >
            <Icon name="mdi:pencil" class="text-green-600 text-2xl" />
          </div>
          <div class="space-y-2">
            <h3 class="text-card-title">{{ t('home.how.step2_title') }}</h3>
            <p class="text-card-body">{{ t('home.how.step2_desc') }}</p>
          </div>
        </div>
        <div class="text-center space-y-4 group hover:scale-105 transition-transform duration-300">
          <div
            class="w-16 h-16 bg-purple-100 rounded-2xl grid place-items-center mx-auto group-hover:bg-purple-200 transition-colors"
          >
            <Icon name="mdi:email" class="text-purple-600 text-2xl" />
          </div>
          <div class="space-y-2">
            <h3 class="text-card-title">{{ t('home.how.step3_title') }}</h3>
            <p class="text-card-body">{{ t('home.how.step3_desc') }}</p>
          </div>
        </div>
        <div class="text-center space-y-4 group hover:scale-105 transition-transform duration-300">
          <div
            class="w-16 h-16 bg-orange-100 rounded-2xl grid place-items-center mx-auto group-hover:bg-orange-200 transition-colors"
          >
            <Icon name="mdi:airplane" class="text-orange-600 text-2xl" />
          </div>
          <div class="space-y-2">
            <h3 class="text-card-title">{{ t('home.how.step4_title') }}</h3>
            <p class="text-card-body">{{ t('home.how.step4_desc') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// How it works steps
const { t } = useI18n()
</script>
