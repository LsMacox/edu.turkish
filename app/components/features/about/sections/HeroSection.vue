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
    <div class="absolute inset-0 gradient-hero-soft" />
    
    <div class="relative container mx-auto container-padding-narrow hero-py-sm">
      <div class="text-center max-w-2xl mx-auto mb-component-md">
        <h1 class="text-section-title mb-component-xs">
          {{ t(heroNs('title')) }}
        </h1>
        <p class="text-section-subtitle">
          {{ t(heroNs('subtitle')) }}
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-3 gap-component-md max-w-xl mx-auto">
        <div class="stat-card">
          <Icon name="mdi:account-group" class="text-icon md:text-icon-lg text-primary mb-1" />
          <p class="text-body-sm">{{ t(heroNs('experienced_team')) }}</p>
        </div>
        <div class="stat-card">
          <Icon name="mdi:check-circle" class="text-icon md:text-icon-lg text-success mb-1" />
          <p class="text-body-sm">{{ t(heroNs('students_enrolled')) }}</p>
        </div>
        <div class="stat-card">
          <Icon name="mdi:shield-check" class="text-icon md:text-icon-lg text-info mb-1" />
          <p class="text-body-sm">{{ t(heroNs('official_contracts')) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ASSETS } from '~~/lib/config/assets'
import { namespace } from '~~/lib/i18n'

const heroNs = namespace('about.hero')
const { t } = useI18n()
</script>
