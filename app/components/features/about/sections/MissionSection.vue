<template>
  <section class="py-20 bg-background">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-6">
            {{ t('about.mission.title') }}
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ t('about.mission.subtitle') }}
          </p>
        </div>

        <div class="grid lg:grid-cols-3 gap-8 mb-16">
          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div
              class="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Icon name="mdi:heart" class="text-blue-600 text-2xl" />
            </div>
            <h3 class="text-xl font-semibold text-secondary mb-4">
              {{ t('about.mission.no_pressure') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ t('about.mission.no_pressure_desc') }}
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div
              class="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Icon name="mdi:message-text" class="text-green-600 text-2xl" />
            </div>
            <h3 class="text-xl font-semibold text-secondary mb-4">
              {{ t('about.mission.your_language') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ t('about.mission.your_language_desc') }}
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div
              class="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Icon name="mdi:account-group" class="text-purple-600 text-2xl" />
            </div>
            <h3 class="text-xl font-semibold text-secondary mb-4">
              {{ t('about.mission.after_admission') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ t('about.mission.after_admission_desc') }}
            </p>
          </div>
        </div>

        <div
          class="bg-gradient-to-r from-primary to-red-600 rounded-2xl p-8 lg:p-12 text-white text-center"
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

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.hover-lift {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
</style>
