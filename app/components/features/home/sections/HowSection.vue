<template>
  <section id="how-it-works" class="py-16">
    <div class="container">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-4">
          {{ t('home.how.title') }}
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">{{ t('home.how.subtitle') }}</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="text-center space-y-4 group hover:scale-105 transition-transform duration-300">
          <div
            class="w-16 h-16 bg-blue-100 rounded-2xl grid place-items-center mx-auto group-hover:bg-blue-200 transition-colors"
          >
            <Icon name="mdi:magnify" class="text-blue-600 text-2xl" />
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-semibold text-secondary">{{ t('home.how.step1_title') }}</h3>
            <p class="text-gray-600">{{ t('home.how.step1_desc') }}</p>
          </div>
        </div>
        <div class="text-center space-y-4 group hover:scale-105 transition-transform duration-300">
          <div
            class="w-16 h-16 bg-green-100 rounded-2xl grid place-items-center mx-auto group-hover:bg-green-200 transition-colors"
          >
            <Icon name="mdi:pencil" class="text-green-600 text-2xl" />
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-semibold text-secondary">{{ t('home.how.step2_title') }}</h3>
            <p class="text-gray-600">{{ t('home.how.step2_desc') }}</p>
          </div>
        </div>
        <div class="text-center space-y-4 group hover:scale-105 transition-transform duration-300">
          <div
            class="w-16 h-16 bg-purple-100 rounded-2xl grid place-items-center mx-auto group-hover:bg-purple-200 transition-colors"
          >
            <Icon name="mdi:email" class="text-purple-600 text-2xl" />
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-semibold text-secondary">{{ t('home.how.step3_title') }}</h3>
            <p class="text-gray-600">{{ t('home.how.step3_desc') }}</p>
          </div>
        </div>
        <div class="text-center space-y-4 group hover:scale-105 transition-transform duration-300">
          <div
            class="w-16 h-16 bg-orange-100 rounded-2xl grid place-items-center mx-auto group-hover:bg-orange-200 transition-colors"
          >
            <Icon name="mdi:airplane" class="text-orange-600 text-2xl" />
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-semibold text-secondary">{{ t('home.how.step4_title') }}</h3>
            <p class="text-gray-600">{{ t('home.how.step4_desc') }}</p>
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
