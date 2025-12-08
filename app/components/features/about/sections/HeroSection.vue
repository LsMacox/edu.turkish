<template>
  <section class="relative overflow-hidden">
    <!-- Background Image -->
    <NuxtImg
      :src="ASSETS.about.heroBackground"
      alt=""
      class="absolute inset-0 w-full h-full object-cover object-center opacity-30"
      format="webp"
      loading="eager"
      aria-hidden="true"
    />
    <div class="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-blue-50/60 to-violet-50/50" />
    
    <div class="relative container mx-auto container-padding-narrow pt-6 md:pt-8 pb-4">
      <div class="text-center max-w-2xl mx-auto mb-6">
        <h1 class="text-section-title mb-2">
          {{ t('about.hero.title') }}
        </h1>
        <p class="text-section-subtitle">
          {{ t('about.hero.subtitle') }}
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-3 gap-3 md:gap-4 max-w-xl mx-auto">
        <div class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-3 text-center">
          <Icon name="mdi:account-group" class="text-xl md:text-2xl text-primary mb-1" />
          <p class="text-xs text-gray-600">{{ t('about.hero.experienced_team') }}</p>
        </div>
        <div class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-3 text-center">
          <Icon name="mdi:check-circle" class="text-xl md:text-2xl text-green-500 mb-1" />
          <p class="text-xs text-gray-600">{{ t('about.hero.students_enrolled') }}</p>
        </div>
        <div class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-3 text-center">
          <Icon name="mdi:shield-check" class="text-xl md:text-2xl text-blue-500 mb-1" />
          <p class="text-xs text-gray-600">{{ t('about.hero.official_contracts') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ASSETS } from '~~/lib/assets'

const { t } = useI18n()
</script>
