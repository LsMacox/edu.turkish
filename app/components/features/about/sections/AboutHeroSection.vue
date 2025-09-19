<template>
  <section class="relative bg-gradient-to-br from-blue-50 to-purple-50 py-20 h-[500px]">
    <div
      class="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-30"
      style="background-image: url('/images/about-us-bg.png')"
      aria-hidden="true"
    />
    <div class="relative container mx-auto px-4 lg:px-6 h-full flex items-center">
      <div class="max-w-4xl">
        <div class="space-y-6">
          <h1 class="text-4xl lg:text-6xl font-bold text-secondary leading-tight">
            {{ t('about.hero.title') }}
          </h1>
          <p class="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-3xl">
            {{ t('about.hero.subtitle') }}
          </p>
          <div class="flex flex-wrap gap-6 text-sm">
            <div class="flex items-center space-x-2">
              <Icon name="mdi:account-group" class="text-primary" />
              <span class="text-secondary font-medium">{{ t('about.hero.experienced_team') }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <Icon name="mdi:check-circle" class="text-green-500" />
              <span class="text-secondary font-medium">{{
                t('about.hero.students_enrolled')
              }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <Icon name="mdi:shield-check" class="text-blue-500" />
              <span class="text-secondary font-medium">{{
                t('about.hero.official_contracts')
              }}</span>
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
